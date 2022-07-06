import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AppRoute } from '../../config/route-config';
import { LOCAL_STORAGE_KEY } from '../../constants/constants';
import { PastDueCustomerResponse } from '../../domain/PastDueList/PastDueCustomerList';
import { CustomerLocationState, RouteOption } from '../../types/types';

export interface PastDueListCustomerState {
  isCustomerSelected: boolean;
  loading: boolean;
  reloadPastDueList: boolean;
  customerName: string;
  pastDue: PastDueCustomerResponse[] | undefined;
  selectedCustomerIds: string[];
  filter: string;
  hasMore: boolean;
}

export interface PastDueListCustomerDispatchState {
  onCustomerSelectChanged: (value: boolean) => void;
  setPastDueListLoading: (loading: boolean) => void;
  setSelectCustomerName: (name: string) => void;
  onClearSelectedOptions: () => void;
  setReloadPastDueList: (value: boolean) => void;
  setFilteredPastDueList: (
    filteredPastDue: PastDueCustomerResponse[],
    resetPastDueList: boolean
  ) => void;
  setSelectedCustomerIds: (selectedCustomerIds: string[]) => void;
  setSeletedFilter: (seeleectedFilter: string) => void;
  onRouteChanged: (
    route: RouteOption | undefined,
    customerId: string | number
  ) => void;
  clearPastDueList: () => void;
}

export const PastDueListCustomerStateContext =
  createContext<PastDueListCustomerState>({} as PastDueListCustomerState);

export const usePastDueListCustomer = () =>
  useContext(PastDueListCustomerStateContext);

export const PastDueListCustomerDispatchStateContext =
  createContext<PastDueListCustomerDispatchState>(
    {} as PastDueListCustomerDispatchState
  );

export const usePastDueListCustomerDispatch = () =>
  useContext(PastDueListCustomerDispatchStateContext);

const saveToLocalStorage = (filteredPastDue: PastDueCustomerResponse[]) => {
  const trimmedPastDueList = filteredPastDue.map((pastDueCustomer) => {
    const {
      customerId,
      customerFirstName,
      customerLastName,
      route,
      daysPastDue,
      pastDueDate,
    } = pastDueCustomer;
    return {
      customerId,
      customerFirstName,
      customerLastName,
      route,
      daysPastDue,
      pastDueDate,
    };
  });
  localStorage.setItem(
    LOCAL_STORAGE_KEY.PAST_DUE_LIST,
    JSON.stringify(trimmedPastDueList)
  );
};

const PastDueListCustomerProvider = (props: { children: ReactNode }) => {
  const [isCustomerSelected, setIsCustomerSelected] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadPastDueList, setReloadPastDueList] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [pastDue, setPastDue] = useState<PastDueCustomerResponse[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);

  const history = useHistory();
  const location = useLocation<CustomerLocationState>();

  const clearPastDueList = () => {
    setPastDue([]);
    saveToLocalStorage([]);
  };
  const onClearSelectedOptions = () => {
    onCustomerSelectChanged(false);
  };

  const setSelectCustomerName = (name: string) => {
    setCustomerName(name);
  };
  const onCustomerSelectChanged = (selected: boolean) => {
    setIsCustomerSelected(selected);
  };

  const setPastDueListLoading = (loading: boolean) => setLoading(loading);

  const setSeletedFilter = (selectedFilter: string) =>
    setFilter(selectedFilter);

  const setFilteredPastDueList = (
    filteredPastDue: PastDueCustomerResponse[],
    resetPastDueList?: boolean
  ) => {
    let listToSave;
    if (resetPastDueList) {
      listToSave = filteredPastDue;
    } else {
      listToSave = [...pastDue, ...filteredPastDue];
    }
    if (listToSave?.length) {
      setPastDue(listToSave);
    }
    saveToLocalStorage(listToSave);
    setHasMore(!!filteredPastDue.length);
  };
  const updateHistoryWithNewRoute = (
    currentCustomerId: string | number,
    route: RouteOption
  ) => {
    if (!location?.state?.customer) return;
    const { customer, customerIndex } = location.state;
    if (currentCustomerId !== customer.customerId) return;
    customer.route = {
      code: route.routeCode || route.value,
      description: route.routeDescription,
    };

    history.push(AppRoute.Customer + '/' + currentCustomerId, {
      customer: customer,
      customerIndex: customerIndex,
    });
  };

  const updateLocalstorageWithNewRoute = (
    currentCustomerId: string | number,
    route: RouteOption
  ) => {
    const trimmedPastDueListAsJSON = localStorage.getItem(
      LOCAL_STORAGE_KEY.PAST_DUE_LIST
    );
    if (!trimmedPastDueListAsJSON) return;
    const trimmedPastDueList = JSON.parse(trimmedPastDueListAsJSON);
    const pastDueItem = trimmedPastDueList.find(
      (item: PastDueCustomerResponse) => item.customerId === currentCustomerId
    );
    if (!pastDueItem) return;

    pastDueItem.route = route;
    localStorage.setItem(
      LOCAL_STORAGE_KEY.PAST_DUE_LIST,
      JSON.stringify(trimmedPastDueList)
    );
  };
  const onRouteChanged = (
    route: RouteOption | undefined,
    currentCustomerId: string | number
  ) => {
    if (!route || !currentCustomerId) return;

    updateHistoryWithNewRoute(currentCustomerId, route);
    updateLocalstorageWithNewRoute(currentCustomerId, route);
  };

  useEffect(() => {
    onClearSelectedOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedCustomerIds.length) {
      setIsCustomerSelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomerIds]);

  return (
    <PastDueListCustomerStateContext.Provider
      value={{
        isCustomerSelected,
        reloadPastDueList,
        customerName,
        pastDue,
        selectedCustomerIds,
        filter,
        loading,
        hasMore,
      }}
    >
      <PastDueListCustomerDispatchStateContext.Provider
        value={{
          onClearSelectedOptions,
          onCustomerSelectChanged,
          setReloadPastDueList,
          setSelectCustomerName,
          setFilteredPastDueList,
          setSelectedCustomerIds,
          onRouteChanged,
          setSeletedFilter,
          setPastDueListLoading,
          clearPastDueList,
        }}
      >
        {props.children}
      </PastDueListCustomerDispatchStateContext.Provider>
    </PastDueListCustomerStateContext.Provider>
  );
};

export default PastDueListCustomerProvider;
