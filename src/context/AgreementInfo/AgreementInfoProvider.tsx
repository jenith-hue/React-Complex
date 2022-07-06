import { CancelTokenSource } from 'axios';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import { getCancelTokenSource } from '../../api/client';
import { getAgreementInfo } from '../../api/Customer';
import {
  AgreementInfoResponse,
  AgreementInfoStore,
  CustomerLocationState,
} from '../../types/types';

export interface AgreementInfoState {
  stores: Partial<AgreementInfoStore>[];
  total: number;
  numberOfLoadedAgreements: number;
  hasApiError: boolean;
  loading: boolean;
}

export interface AgreementInfoDispatchState {
  fetchAgreementInfo: () => Promise<void | AgreementInfoResponse>;
}

export const AgreementInfoStateContext = createContext<AgreementInfoState>(
  {} as AgreementInfoState
);

export const AgreementInfoDispatchContext =
  createContext<AgreementInfoDispatchState>({} as AgreementInfoDispatchState);

export const AgreementInfoProvider = (props: { children: ReactNode }) => {
  const [stores, setStores] = React.useState<AgreementInfoStore[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [numberOfLoadedAgreements, setNumberOfLoadedAgreements] =
    React.useState<number>(0);
  const [hasApiError, setHasApiError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const location = useLocation<CustomerLocationState>();
  const initialCallToken = useRef<CancelTokenSource>();

  useEffect(() => {
    return () => {
      if (initialCallToken?.current) {
        initialCallToken.current?.cancel();
      }
    };
  }, []);

  const fetchAgreementInfo = async () => {
    if (initialCallToken?.current) {
      initialCallToken.current?.cancel();
    }
    initialCallToken.current = getCancelTokenSource();

    const customerId =
      location?.state?.customer?.customerId ||
      location?.pathname?.split('/')[3];

    if (!customerId) return;
    setLoading(true);
    setHasApiError(false);
    getAgreementInfo(customerId, initialCallToken.current?.token)
      .then((response: any) => {
        const { total, stores: storesFromApi } = response;
        const numberOfLoadedAgreementsUntilNow = storesFromApi.reduce(
          (partialSum: any, storeObj: any) => {
            return (storeObj?.agreements?.length || 0) + partialSum;
          },
          numberOfLoadedAgreements
        );
        setTotal(total);
        setNumberOfLoadedAgreements(numberOfLoadedAgreementsUntilNow);
        setStores([...stores, ...storesFromApi]);
      })
      .catch(() => {
        setHasApiError(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <AgreementInfoStateContext.Provider
      value={{
        stores,
        total,
        numberOfLoadedAgreements,
        hasApiError,
        loading,
      }}
    >
      <AgreementInfoDispatchContext.Provider
        value={{
          fetchAgreementInfo,
        }}
      >
        {props.children}
      </AgreementInfoDispatchContext.Provider>
    </AgreementInfoStateContext.Provider>
  );
};

export const useAgreementInfo = () => useContext(AgreementInfoStateContext);

export const useAgreementInfoActions = () =>
  useContext(AgreementInfoDispatchContext);
