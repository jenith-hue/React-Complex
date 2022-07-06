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
import { getPaymentHistory } from '../../api/payments';
import { ITEMS_PER_PAGE_20 } from '../../constants/constants';
import {
  CustomerLocationState,
  PaymentHistory,
  PaymentHistoryResponse,
} from '../../types/types';

export interface PaymentHistoryState {
  payments: Partial<PaymentHistory>[];
  total: number;
  numberOfLoadedPayments: number;
  hasApiError: boolean;
  loading: boolean;
  init: boolean;
}

export interface PaymentHistoryDispatchState {
  fetchPaymentHistory: (
    initflag?: boolean
  ) => Promise<void | PaymentHistoryResponse>;
  resetPaymentData: () => void;
}

export const PaymentHistoryStateContext = createContext<PaymentHistoryState>(
  {} as PaymentHistoryState
);

export const PaymentHistoryDispatchContext =
  createContext<PaymentHistoryDispatchState>({} as PaymentHistoryDispatchState);

export const PaymentHistoryProvider = (props: { children: ReactNode }) => {
  const [payments, setPayments] = React.useState<PaymentHistory[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [numberOfLoadedPayments, setNumberOfLoadedPayments] =
    React.useState<number>(0);
  const [hasApiError, setHasApiError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [init, setInit] = React.useState(true);
  const location = useLocation<CustomerLocationState>();

  const initialCallToken = useRef<CancelTokenSource>();

  useEffect(() => {
    return () => {
      if (initialCallToken?.current) {
        initialCallToken.current?.cancel();
      }
    };
  }, []);
  const fetchPaymentHistory = async (initFlag?: boolean) => {
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
    getPaymentHistory(
      customerId,
      payments.length / ITEMS_PER_PAGE_20 + 1,
      ITEMS_PER_PAGE_20,
      initialCallToken.current?.token
    )
      .then((response: any) => {
        setLoading(false);
        if (initFlag) {
          setInit(false);
        }
        const {
          pageInfo: { totalCount },
          payments: paymentsForCurrentPage,
        } = response;
        setTotal(totalCount);
        setNumberOfLoadedPayments(
          payments.length + paymentsForCurrentPage.length
        );
        setPayments([...payments, ...paymentsForCurrentPage]);
      })
      .catch((err: any) => {
        if (!err.__CANCEL__) {
          setLoading(false);
          setHasApiError(true);
        }
      });
  };

  const resetPaymentData = () => {
    setPayments([]);
    setTotal(0);
  };

  return (
    <PaymentHistoryStateContext.Provider
      value={{
        payments,
        total,
        numberOfLoadedPayments,
        hasApiError,
        loading,
        init,
      }}
    >
      <PaymentHistoryDispatchContext.Provider
        value={{
          fetchPaymentHistory,
          resetPaymentData,
        }}
      >
        {props.children}
      </PaymentHistoryDispatchContext.Provider>
    </PaymentHistoryStateContext.Provider>
  );
};

export const usePaymentHistory = () => useContext(PaymentHistoryStateContext);

export const usePaymentHistoryActions = () =>
  useContext(PaymentHistoryDispatchContext);
