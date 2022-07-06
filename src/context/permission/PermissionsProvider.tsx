import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { ProductPermissions, TextPermissions } from '../../constants/constants';

import { useUserStateContext } from '../user/user-contexts';
import { getSelectedStore } from '../../utils/utils';
import { getStoreConfigs } from '../../api/store';
import { StoreConfigsResponse } from '../../types/types';

export interface PermissionsState {
  canChangeCustomerRoute: boolean;
  hasAccessToTextConversation: boolean;
  hasAccessToTextTemplate: boolean;
  hasAccessToFreeFormText: boolean;
}

export const defaultState = {
  canChangeCustomerRoute: false,
  hasAccessToTextConversation: false,
  hasAccessToTextTemplate: false,
  hasAccessToFreeFormText: false,
};

enum ActionType {
  MAP_PERMISSIONS = 'MAP_PERMISSIONS',
  TEXT_CONVERSATION_PERMISSION = 'TEXT_CONVERSATION_PERMISSION',
}

interface PermissionsAction {
  type: ActionType.MAP_PERMISSIONS | ActionType.TEXT_CONVERSATION_PERMISSION;
  payload: ProductPermissions[] | string[];
}

export function permissionsReducer(
  state: PermissionsState,
  { type, payload }: PermissionsAction
): PermissionsState {
  if (type === ActionType.MAP_PERMISSIONS) {
    return {
      ...state,
      canChangeCustomerRoute: (payload as ProductPermissions[]).includes(
        ProductPermissions.CHANGE_CUSTOMER_ROUTE
      ),
    };
  } else if (type === ActionType.TEXT_CONVERSATION_PERMISSION) {
    return {
      ...state,
      hasAccessToTextConversation: (payload as TextPermissions[]).includes(
        TextPermissions.TEXT_MESSAGE_ALLOWED
      ),
      hasAccessToTextTemplate: (payload as TextPermissions[]).includes(
        TextPermissions.TEMPLATE_MESSAGE_ALLOWED
      ),
      hasAccessToFreeFormText: (payload as TextPermissions[]).includes(
        TextPermissions.FREE_FORM_MESSAGE_ALLOWED
      ),
    };
  } else {
    return state;
  }
}

export const PermissionsContext = createContext<PermissionsState>(defaultState);

export const checkIfTextMessagingAllowed = (
  response: StoreConfigsResponse[]
): string[] => {
  const textConversationPermissions: string[] = [];
  let messagingPermissions = false;
  let textTemplatePermissions = false;
  let freeFormTextPermissions = false;
  if (
    response &&
    response.length > 0 &&
    response[0].configDetails &&
    response[0].configDetails.length > 0
  ) {
    messagingPermissions = response[0].configDetails.some(
      (config) =>
        config.paramGroupName === 'TwoWayTexting' && config.paramValue == '1'
    );
    if (messagingPermissions) {
      textConversationPermissions.push('TWO_WAY_TEXTING');
      textTemplatePermissions = response[0].configDetails.some(
        (config) =>
          config.paramGroupName === 'ShowTextTemplate' &&
          config.paramValue == '1'
      );
      freeFormTextPermissions = response[0].configDetails.some(
        (config) =>
          config.paramGroupName === 'ShowFreeFormText' &&
          config.paramValue == '1'
      );
    }
    if (textTemplatePermissions)
      textConversationPermissions.push('SHOW_TEXT_TEMPLATE');
    if (freeFormTextPermissions)
      textConversationPermissions.push('SHOW_FREE_FORM_TEXT');
  }
  return textConversationPermissions;
};

export const useUserPermissions = () => useContext(PermissionsContext);

export const PermissionsProvider = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(permissionsReducer, defaultState);

  const { user } = useUserStateContext();
  useEffect(() => {
    if (!user) return;

    dispatch({
      type: ActionType.MAP_PERMISSIONS,
      payload: user.permissions,
    });

    const selectedStore = getSelectedStore();
    const paramKeyName = 'EnableAccess';
    getStoreConfigs({
      storeNumbers: [selectedStore],
      paramKeyNames: [paramKeyName],
    })
      .then((response) => {
        dispatch({
          type: ActionType.TEXT_CONVERSATION_PERMISSION,
          payload: checkIfTextMessagingAllowed(response),
        });
      })
      .catch(() => {
        //noop
      });
  }, [user]);

  return (
    <PermissionsContext.Provider value={state}>
      {props.children}
    </PermissionsContext.Provider>
  );
};
