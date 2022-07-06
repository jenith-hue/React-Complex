import { Dispatch } from 'react';

import {
  getPermissionsErrorAction,
  getUserAction,
  getUserSuccessAction,
  getUserErrorAction,
  UserAction,
} from './user-actions';
import { getCurrentUser, getUserPermissions } from '../../api/user';
import { ProductPermissions, ProductType } from '../../constants/constants';
export interface UserThunks {
  getCurrentUser(): Promise<void>;
}

const fetchPermissions = async (
  dispatch: Dispatch<UserAction>
): Promise<ProductPermissions[]> => {
  try {
    return await getUserPermissions(ProductType);
  } catch (error) {
    dispatch(getPermissionsErrorAction(error));
    return [];
  }
};

export const getCurrentUserThunk =
  (dispatch: Dispatch<UserAction>) => async () => {
    try {
      dispatch(getUserAction());

      const userData = {
        ...(await getCurrentUser()),
        permissions: await fetchPermissions(dispatch),
      };

      dispatch(getUserSuccessAction(userData));
    } catch (error) {
      dispatch(getUserErrorAction(error));
    }
  };
