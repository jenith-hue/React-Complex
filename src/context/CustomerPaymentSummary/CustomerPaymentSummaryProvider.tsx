import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getCustomerPaymentSummary } from '../../api/payments';
import {
  CustomerLocationState,
  CustomerPaymentSummaryResponse,
} from '../../types/types';
import { useLocation } from 'react-router-dom';
import { getSelectedStore } from '../../utils/utils';

export interface CustomerPaymentSummaryState {
  customerPaymentSummary: CustomerPaymentSummaryResponse | undefined;
  loading: boolean;
  hasApiError: boolean;
}

export interface CustomerPaymentSummaryDispatchState {
  fetchCustomerPaymentSummary: (
    customerId: string,
    storeNumber: string
  ) => Promise<void | CustomerPaymentSummaryResponse>;
}

export const CustomerPaymentSummaryStateContext =
  createContext<CustomerPaymentSummaryState>({} as CustomerPaymentSummaryState);

export const CustomerPaymentSummaryDispatchContext =
  createContext<CustomerPaymentSummaryDispatchState>(
    {} as CustomerPaymentSummaryDispatchState
  );

export const CustomerPaymentSummaryProvider = (props: {
  children: ReactNode;
}) => {
  const [customerPaymentSummary, setCustomerPaymentSummary] =
    React.useState<CustomerPaymentSummaryResponse>();
  const [hasApiError, setHasApiError] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation<CustomerLocationState>();

  const customerId =
    location?.state?.customer?.customerId || location?.pathname?.split('/')[3];

  const onLoad = async (customerId: string) => {
    const storeNumber = getSelectedStore();

    await fetchCustomerPaymentSummary(
      customerId,
      storeNumber == null ? '' : storeNumber
    );
  };

  useEffect(() => {
    onLoad(customerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCustomerPaymentSummary = async (
    customerId: string,
    storeNumber: string
  ) => {
    setHasApiError(false);
    setLoading(true);
    getCustomerPaymentSummary(customerId, storeNumber)
      .then((response) => {
        setCustomerPaymentSummary(response);
      })
      .catch(() => setHasApiError(true))
      .finally(() => setLoading(false));
  };

  return (
    <CustomerPaymentSummaryStateContext.Provider
      value={{
        customerPaymentSummary,
        loading,
        hasApiError,
      }}
    >
      <CustomerPaymentSummaryDispatchContext.Provider
        value={{
          fetchCustomerPaymentSummary,
        }}
      >
        {props.children}
      </CustomerPaymentSummaryDispatchContext.Provider>
    </CustomerPaymentSummaryStateContext.Provider>
  );
};

export const useCustomerPaymentSummary = () =>
  useContext(CustomerPaymentSummaryStateContext);

export const useCustomerPaymentSummaryActions = () =>
  useContext(CustomerPaymentSummaryDispatchContext);
