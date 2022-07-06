import { createContext, useContext } from 'react';

import { UserState, initialState } from './user-reducer';
import { UserThunks } from './user-thunks';

export const UserStateContext = createContext<UserState>(initialState);

export const UserThunksContext = createContext<UserThunks>({} as UserThunks);

export const useUserStateContext = (): UserState =>
  useContext(UserStateContext);

export const useUserThunksContext = (): UserThunks =>
  useContext(UserThunksContext);
