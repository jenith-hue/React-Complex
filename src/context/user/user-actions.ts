import { User, Action } from '../../types/types';

export enum UserActionType {
  GET_USER = 'GET_USER',
  GET_USER_SUCCESS = 'GET_USER_SUCCESS',
  GET_USER_ERROR = 'GET_USER_ERROR',
  GET_PERMISSIONS_ERROR = 'GET_PERMISSIONS_ERROR',
}

export interface GetUserAction extends Action {
  type: UserActionType.GET_USER;
}

export const getUserAction = (): GetUserAction => ({
  type: UserActionType.GET_USER,
});

export interface GetUserSuccessAction extends Action {
  type: UserActionType.GET_USER_SUCCESS;
  payload: {
    user: User;
  };
}

export const getUserSuccessAction = (user: User): GetUserSuccessAction => ({
  type: UserActionType.GET_USER_SUCCESS,
  payload: { user },
});

export interface GetUserErrorAction extends Action {
  type: UserActionType.GET_USER_ERROR;
  payload?: Record<string, any>;
}

export const getUserErrorAction = (
  error?: Record<string, any>
): GetUserErrorAction => ({
  type: UserActionType.GET_USER_ERROR,
  payload: error,
});

export interface GetPermissionsErrorAction extends Action {
  type: UserActionType.GET_PERMISSIONS_ERROR;
  payload?: Record<string, any>;
}

export const getPermissionsErrorAction = (
  error?: Record<string, any>
): GetPermissionsErrorAction => ({
  type: UserActionType.GET_PERMISSIONS_ERROR,
  payload: error,
});

export type UserAction =
  | GetUserAction
  | GetUserSuccessAction
  | GetUserErrorAction
  | GetPermissionsErrorAction;
