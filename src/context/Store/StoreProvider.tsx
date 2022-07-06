import { CancelTokenSource } from 'axios';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getCancelTokenSource } from '../../api/client';
import { getStoreConfigs, getStoreDetailByNumber } from '../../api/store';
import { StoreConfigsResponse, StoreDetail } from '../../types/types';
import { getSelectedStore } from '../../utils/utils';

export interface StoreState {
  store?: StoreDetail;
  loading: boolean;
  hasApiError: boolean;
  isAddressDoctorEnabled: boolean;
}

export interface StoreDispatchState {
  fetchStoreDetailsByNumber: (
    storeNumber: string,
    cancelToken: CancelTokenSource
  ) => Promise<void | StoreDetail[]>;
}

export const checkIfAddressDoctorEnabled = (
  response: StoreConfigsResponse[]
): boolean => {
  const addressDoctor = response?.[0]?.configDetails?.find((config) => {
    return (
      config.paramGroupName === 'AddressDoctorEnabledIndicator' &&
      config.paramCategoryName === 'AddressDoctorEnabled' &&
      config.paramKeyName === 'AddressDoctorEnabled'
    );
  });
  if (addressDoctor && addressDoctor.paramValue === '1') {
    return true;
  }
  return false;
};

export const StoreStateContext = createContext<StoreState>({} as StoreState);
export const StoreDispatchContext = createContext<StoreDispatchState>(
  {} as StoreDispatchState
);

export const StoreProvider = (props: { children: ReactNode }) => {
  const [store, setStore] = useState<StoreDetail>();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasApiError, setHasApiError] = useState(false);
  const [isAddressDoctorEnabled, setIsAddressDoctorEnabled] = useState(false);

  const fetchAddressDoctorConfig = (
    selectedStore: string,
    cancelToken: CancelTokenSource
  ) => {
    const paramKeyName = 'AddressDoctorEnabled';
    getStoreConfigs(
      {
        storeNumbers: [selectedStore],
        paramKeyNames: [paramKeyName],
      },
      cancelToken.token
    )
      .then((response) =>
        setIsAddressDoctorEnabled(checkIfAddressDoctorEnabled(response))
      )
      .catch(() => {
        //noop
      });
  };

  useEffect(() => {
    const cancelToken: CancelTokenSource = getCancelTokenSource();
    const selectedStore = getSelectedStore();
    fetchStoreDetailsByNumber(selectedStore, cancelToken);
    fetchAddressDoctorConfig(selectedStore, cancelToken);
    return () => {
      cancelToken.cancel();
    };
  }, []);

  const fetchStoreDetailsByNumber = async (
    storeNumber: string,
    cancelToken: CancelTokenSource
  ) => {
    setHasApiError(false);
    setLoading(true);
    getStoreDetailByNumber(storeNumber, cancelToken.token)
      .then(
        (response) =>
          response?.response?.length && setStore(response.response[0])
      )
      .catch(() => setHasApiError(true))
      .finally(() => setLoading(false));
  };

  return (
    <StoreStateContext.Provider
      value={{
        store,
        loading,
        hasApiError,
        isAddressDoctorEnabled,
      }}
    >
      <StoreDispatchContext.Provider
        value={{
          fetchStoreDetailsByNumber,
        }}
      >
        {props.children}
      </StoreDispatchContext.Provider>
    </StoreStateContext.Provider>
  );
};

export const useStoreDetails = () => useContext(StoreStateContext);

export const useStoreActions = () => useContext(StoreDispatchContext);
