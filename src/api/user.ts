import { client } from './client';
import { appConfig } from '../config/app-config';
import { ProductPermissions } from '../constants/constants';
import { User } from '../types/types';

export const getCurrentUser = (): Promise<User> =>
  client(
    'users/current',
    { method: 'GET' },
    appConfig.apiUrls.container,
    false
  );

export const getUserPermissions = (
  productType: string
): Promise<ProductPermissions[]> =>
  client(
    `users/current/permissions/${productType}`,
    { method: 'GET' },
    appConfig.apiUrls.container,
    false
  );

export const getUserStores = () =>
  client(
    'users/current/stores?q=permissions[:includes]=RACPAD_DAP',
    { method: 'GET' },
    appConfig.apiUrls.container,
    false
  );
