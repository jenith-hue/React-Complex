import { createContext, useContext } from 'react';

export interface AuthContextValue {
  userTokenData?: Record<string, any>;
  triedToFetchTheUser: boolean;
  error?: string;
  login?: () => void;
  logout?: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  triedToFetchTheUser: false,
});

export const useAuthContext = (): AuthContextValue => useContext(AuthContext);
