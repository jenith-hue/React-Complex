import { PropsWithChildren } from 'react';
import * as React from 'react';

import { AuthContext, AuthContextValue } from '../context/auth/auth-context';

export const AuthContextProviderMock = (
  props: PropsWithChildren<{ value: AuthContextValue }>
) => {
  const { children, value } = props;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
