import { User } from '../../types/types';
import { UserAction, UserActionType } from './user-actions';

export interface UserState {
  user?: User;
  isPending: boolean;
  error?: Record<string, any>;
  permissionsError?: Record<string, any>;
}

export const initialState: UserState = {
  isPending: false,
};

export const userReducer = (
  state: UserState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case UserActionType.GET_USER:
      return {
        user: undefined,
        isPending: true,
        error: undefined,
      };

    case UserActionType.GET_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isPending: false,
        error: undefined,
      };

    case UserActionType.GET_USER_ERROR:
      return {
        user: undefined,
        isPending: false,
        error: action.payload,
      };

    case UserActionType.GET_PERMISSIONS_ERROR:
      return {
        ...state,
        permissionsError: action.payload,
      };

    default:
      return state;
  }
};
