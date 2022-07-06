import { CancelToken } from 'axios';
import {
  StoreDetailResponse,
  StoreConfigsPayload,
  StoreConfigsResponse,
} from '../types/types';
import { client } from './client';

export const getStoreDetailByNumber = (
  storeNumber: string,
  cancelToken?: CancelToken
): Promise<StoreDetailResponse> => {
  return client(`stores/${storeNumber}/details`, {
    method: 'GET',
    cancelToken,
  });
};

export const getStoreConfigs = (
  payload: StoreConfigsPayload,
  cancelToken?: CancelToken
): Promise<StoreConfigsResponse[]> => {
  return client(`/config/get-store-profile`, {
    method: 'POST',
    body: { ...payload },
    cancelToken,
  });
};
