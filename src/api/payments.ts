import { CancelToken } from 'axios';
import { PaymentHistoryResponse } from '../types/types';
import { CustomerPaymentSummaryResponse } from '../types/types';
import { client } from './client';

export const getPaymentHistory = (
  customerId: string | number,
  pageNumber: number,
  pageSize: number,
  cancelToken?: CancelToken
): Promise<PaymentHistoryResponse> =>
  client('customer/get-payment-history', {
    method: 'POST',
    body: {
      pageNumber: pageNumber.toString(),
      customerId: customerId,
      pageSize: pageSize.toString(),
    },
    cancelToken,
  });

export const getCustomerPaymentSummary = (
  customerId: string,
  storeNumber: string,
  cancelToken?: CancelToken
): Promise<CustomerPaymentSummaryResponse> =>
  client(
    `customer/get-payment-summary/${customerId}?storeNumber=${storeNumber}`,
    {
      method: 'GET',
      cancelToken,
    }
  );
