import { CancelToken } from 'axios';
import {
  AllAlerts,
  CustomerAlertPayload,
  CustomerAlertResponse,
} from '../types/types';
import { client } from './client';

export const saveAlerts = (
  payload: CustomerAlertPayload,
  cancelToken?: CancelToken
) =>
  client('customer/update-alerts', {
    method: 'POST',
    body: { ...payload },
    cancelToken,
  });

export const getCustomerAlerts = (
  customerId: string,
  cancelToken?: CancelToken
): Promise<CustomerAlertResponse> =>
  client(`customer/get-alert/${customerId}`, { method: 'GET', cancelToken });

export const getAlerts = (): Promise<AllAlerts> =>
  client(`get-alerts`, { method: 'GET' });
