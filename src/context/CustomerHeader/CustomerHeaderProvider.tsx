import { CancelTokenSource } from 'axios';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getCancelTokenSource } from '../../api/client';
import { assignRoute } from '../../api/Customer';
import { ALL_OPTION } from '../../constants/constants';
import { AssignRoutePayload, RouteOption } from '../../types/types';
import { getSelectedStore } from '../../utils/utils';
import { useCustomerDetails } from '../CustomerDetails/CustomerDetailsProvider';
import { PastDueListCustomerDispatchStateContext } from '../PastDueListCustomer/PastDueListCustomerProvider';
import { useFilters } from '../PastDueListSearchCriteria/PastDueListSearchCriteriaProvider';
import { useUserPermissions } from '../permission/PermissionsProvider';

export interface CustomerHeaderState {
  routeOptions: RouteOption[];
  selectedRouteOption?: string;
  hasRouteApiError: boolean;
  hasAssignRouteApiError: boolean;
  isRouteSelectionDisabled: boolean;
  isLoading: boolean;
}

export interface CustomerHeaderDispatchState {
  onChangeRoute: (value: string) => void;
  onCloseAssignRouteErrorModal: () => void;
}

export const CustomerHeaderStateContext = createContext<CustomerHeaderState>(
  {} as CustomerHeaderState
);
export const CustomerHeaderDispatchContext =
  createContext<CustomerHeaderDispatchState>({} as CustomerHeaderDispatchState);

export const CustomerHeaderProvider = (props: { children: ReactNode }) => {
  const { customerDetails } = useCustomerDetails();

  const { customerRoutes, customerId } = customerDetails || {};
  const { routeCode } = customerRoutes?.[0] || {};
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRouteOption, setSelectedRouteOption] = useState<string>(
    routeCode || ''
  );
  const [hasAssignRouteApiError, setHasAssignRouteApiError] =
    useState<boolean>(false);
  const [isRouteSelectionDisabled, setIsRouteSelectionDisabled] =
    useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { canChangeCustomerRoute } = useUserPermissions();

  const { onRouteChanged } = useContext(
    PastDueListCustomerDispatchStateContext
  );

  const {
    isFetchRoutesLoading,
    routeOptions: routeOptionsFromFilters,
    hasRouteApiError,
  } = useFilters();

  useEffect(() => {
    setIsLoading(isFetchRoutesLoading);
  }, [isFetchRoutesLoading]);

  useEffect(() => {
    setRouteOptions(
      routeOptionsFromFilters.filter((option) => option.value !== ALL_OPTION)
    );
  }, [routeOptionsFromFilters]);

  useEffect(() => {
    setIsRouteSelectionDisabled(!canChangeCustomerRoute);

    const cancelToken: CancelTokenSource = getCancelTokenSource();
    return () => {
      cancelToken.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsRouteSelectionDisabled(!canChangeCustomerRoute);
  }, [canChangeCustomerRoute]);

  const onChangeRoute = async (routeCode: string) => {
    try {
      if (customerId) {
        const payload = {
          storeNumber: getSelectedStore(),
          routeRefCode: routeCode,
          customerId: Number(customerId),
        } as AssignRoutePayload;

        setHasAssignRouteApiError(false);
        setIsLoading(true);

        await assignRoute(payload);
        const route = routeOptions.find(
          (route) => route.routeCode === routeCode
        );
        setSelectedRouteOption(route?.value || route?.routeCode || '');

        onRouteChanged(route, customerId || '');
      }
    } catch {
      setHasAssignRouteApiError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseAssignRouteErrorModal = () => {
    setHasAssignRouteApiError(false);
  };
  return (
    <CustomerHeaderStateContext.Provider
      value={{
        routeOptions,
        selectedRouteOption,
        hasRouteApiError,
        hasAssignRouteApiError,
        isRouteSelectionDisabled,
        isLoading,
      }}
    >
      <CustomerHeaderDispatchContext.Provider
        value={{
          onChangeRoute,
          onCloseAssignRouteErrorModal,
        }}
      >
        {props.children}
      </CustomerHeaderDispatchContext.Provider>
    </CustomerHeaderStateContext.Provider>
  );
};

export const useCustomerHeader = () => useContext(CustomerHeaderStateContext);

export const useCustomerHeaderActions = () =>
  useContext(CustomerHeaderDispatchContext);
