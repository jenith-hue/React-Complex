import { CancelTokenSource } from 'axios';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { getAlerts, getCustomerAlerts, saveAlerts } from '../../api/alert';
import { getCancelTokenSource } from '../../api/client';
import { OTHER_ALERT_TYPE_ID } from '../../components/Customer/CustomerInformation/AssignAlertModal';
import { useUserStateContext } from '../../context/user/user-contexts';
import {
  Alert,
  AlertPayload,
  CustomerAlert,
  CustomerAlertResponse,
  CustomerLocationState,
} from '../../types/types';
import { moveItemToTheEnd } from '../../utils/utils';

export interface CustomerAlertsState {
  customerAlerts: CustomerAlert[];
  loading?: boolean;
  hasApiError: boolean;
  hasDeleteApiError: boolean;
  hasGetApiError: boolean;
  // all alerts
  allAlerts: Partial<CustomerAlert>[];
  isFetchAllAlertsLoading: boolean;
  hasFetchAllAlertsError: boolean;
}

export interface CustomerAlertsDispatchState {
  fetchCustomerAlerts: (
    customerId: string,
    cancelToken: CancelTokenSource
  ) => Promise<void | CustomerAlertResponse>;
  removeCustomerAlert: (
    customerAlert: CustomerAlert,
    cancelToken?: CancelTokenSource
  ) => Promise<void>;
  saveCustomerAlerts: (
    customerAlerts: AlertPayload[],
    cancelToken: CancelTokenSource
  ) => Promise<void>;
}

export const CustomerAlertsStateContext = createContext<CustomerAlertsState>(
  {} as CustomerAlertsState
);
export const CustomerAlertsDispatchContext =
  createContext<CustomerAlertsDispatchState>({} as CustomerAlertsDispatchState);

export const mapCustomerAlertResponse = (
  alerts: CustomerAlert[] | null | undefined
) => {
  if (!alerts?.length) return [];

  return alerts?.map((alert) => ({
    ...alert,
    alertTypeDescEn:
      alert.alertTypeId === OTHER_ALERT_TYPE_ID
        ? alert.alertText
        : alert.alertTypeDescEn,
  }));
};

export const CustomerAlertsProvider = (props: { children: ReactNode }) => {
  const { user } = useUserStateContext();
  const [customerAlerts, setCustomerAlerts] = useState<CustomerAlert[]>([]);
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);

  const location = useLocation<CustomerLocationState>();
  const [loading, setLoading] = useState<boolean>();
  const [hasApiError, setHasApiError] = useState(false);
  const [hasGetApiError, setHasGetApiError] = useState(false);
  const [hasDeleteApiError, setHasDeleteApiError] = useState(false);

  const [isFetchAllAlertsLoading, setIsFetchAllAlertsLoading] = useState(false);
  const [hasFetchAllAlertsError, setHasFetchAllAlertsError] = useState(false);

  const customerId =
    location?.state?.customer?.customerId || location?.pathname?.split('/')[3];

  const fetchAllAlerts = () => {
    setIsFetchAllAlertsLoading(true);
    setHasFetchAllAlertsError(false);
    getAlerts()
      .then((response) => {
        if (response?.alert?.length) {
          setAllAlerts(
            moveItemToTheEnd(response.alert, 'alertTypeDescEn', 'Other')
          );
        }
      })
      .catch(() => setHasFetchAllAlertsError(true))
      .finally(() => setIsFetchAllAlertsLoading(false));
  };

  useEffect(fetchAllAlerts, []);

  useEffect(() => {
    const cancelToken: CancelTokenSource = getCancelTokenSource();
    fetchCustomerAlerts(customerId, cancelToken);
    return () => {
      cancelToken.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.customer]);

  const fetchCustomerAlerts = async (
    customerId: string,
    cancelToken: CancelTokenSource
  ) => {
    setHasGetApiError(false);
    setLoading(true);
    getCustomerAlerts(customerId, cancelToken.token)
      .then((response) => {
        setCustomerAlerts(mapCustomerAlertResponse(response.customeralert));
      })
      .catch(() => setHasGetApiError(true))
      .finally(() => setLoading(false));
  };

  const saveCustomerAlerts = async (
    customerAlerts: AlertPayload[],
    cancelToken: CancelTokenSource
  ) => {
    setHasApiError(false);
    setLoading(true);
    const payload = {
      alertTypes: customerAlerts,
      customerId: Number(location?.state?.customer?.customerId),
      userId: user?.employeeId || '',
    };

    return saveAlerts(payload, cancelToken.token)
      .then(() => fetchCustomerAlerts(customerId, cancelToken))
      .catch(() => setHasApiError(true))
      .finally(() => setLoading(false));
  };

  const removeCustomerAlert = async (
    customerAlert: CustomerAlert,
    cancelToken?: CancelTokenSource
  ) => {
    setHasDeleteApiError(false);
    const alertTypePayload: AlertPayload = {
      alertClear: 1,
      alertTypeId: Number(customerAlert.alertTypeId),
      customerAlertId: Number(customerAlert.customerAlertId),
      alertText: customerAlert.alertText || '',
    };

    const payload = {
      alertTypes: [alertTypePayload],
      customerId: Number(location?.state?.customer?.customerId),
      userId: user?.employeeId || '',
    };

    saveAlerts(payload, cancelToken?.token)
      .then(() => {
        // const updatedCustomerAlerts = [...customerAlerts];
        const updatedCustomerAlerts = customerAlerts.map((alert) => {
          if (alert.customerAlertId === customerAlert.customerAlertId) {
            return {
              ...alert,
              alertCleared: 1,
            };
          }
          return alert;
        });
        setCustomerAlerts(updatedCustomerAlerts);
      })
      .catch(() => setHasDeleteApiError(true));
  };

  return (
    <CustomerAlertsStateContext.Provider
      value={{
        customerAlerts,
        loading,
        hasApiError,
        hasDeleteApiError,
        hasGetApiError,
        //all alerts
        allAlerts,
        isFetchAllAlertsLoading,
        hasFetchAllAlertsError,
      }}
    >
      <CustomerAlertsDispatchContext.Provider
        value={{
          fetchCustomerAlerts,
          removeCustomerAlert,
          saveCustomerAlerts,
        }}
      >
        {props.children}
      </CustomerAlertsDispatchContext.Provider>
    </CustomerAlertsStateContext.Provider>
  );
};

export const useCustomerAlerts = () => useContext(CustomerAlertsStateContext);

export const useCustomerAlertsActions = () =>
  useContext(CustomerAlertsDispatchContext);
