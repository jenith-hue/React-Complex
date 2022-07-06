import {
  ActivityLogFilterPayload,
  StoreCoworkersResponse,
  StoreRouteResponse,
} from '../types/types';
import { CancelToken } from 'axios';
import { ActivityLogResponse } from '../domain/ActivityLog/ActivityLogResult';
import { client } from './client';

export const getStoreCoworkers = (
  storeNumber: string
): Promise<StoreCoworkersResponse> =>
  client(`stores/${storeNumber}/employees`, {
    method: 'GET',
  });

export const getStoreRoutes = (
  storeNumber: string
): Promise<StoreRouteResponse> =>
  client(`store-routes/${storeNumber}`, {
    method: 'GET',
  });

export const getActivityLogs = (
  payload: ActivityLogFilterPayload,
  offset: number,
  limit: number,
  customerId?: string,
  coCustomerId?: string,
  cancelToken?: CancelToken
): Promise<ActivityLogResponse> => {
  return client(`activity-logs?limit=${limit}&offset=${offset}`, {
    method: 'POST',
    body: {
      ...payload,
      customer: customerId
        ? coCustomerId
          ? [customerId, coCustomerId]
          : [customerId]
        : [],
    },
    cancelToken,
  });
};
