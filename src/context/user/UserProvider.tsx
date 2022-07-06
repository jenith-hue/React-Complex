import React, { useReducer, ReactNode, useMemo } from 'react';

import { userReducer, initialState } from './user-reducer';
import { UserStateContext, UserThunksContext } from './user-contexts';
import { getCurrentUserThunk, UserThunks } from './user-thunks';

export const UserProvider = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const thunks: UserThunks = useMemo(
    () => ({
      getCurrentUser: getCurrentUserThunk(dispatch),
    }),
    []
  );

  return (
    <UserStateContext.Provider value={state}>
      <UserThunksContext.Provider value={thunks}>
        {props.children}
      </UserThunksContext.Provider>
    </UserStateContext.Provider>
  );
};
