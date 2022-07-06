import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Auth } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { CognitoIdToken, CognitoUserSession } from 'amazon-cognito-identity-js';

import { AuthContext } from './auth-context';
import { appConfig } from '../../config/app-config';
import { SignOut } from '../../components/SignOut/SignOut';

export interface GenericObject {
  [key: string]: any;
}
export const StandaloneAuthProvider = ({
  children,
}: PropsWithChildren<Record<string, unknown>>) => {
  const [userTokenData, setUserTokenData] = useState<GenericObject | undefined>(
    undefined
  );
  const [triedToFetchTheUser, setTriedToFetchTheUser] =
    useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const login = () => {
    Auth.federatedSignIn({ customProvider: 'Okta' }).catch((error: string) => {
      setError(error);
    });
  };

  const logout = () => {
    Auth.signOut().catch((error: string) => {
      setError(error);
    });
  };

  const logoutBeforeTokenExpires = useCallback((jwtExp: number) => {
    const exp = jwtExp * 1000;
    const currentDate = new Date().getTime();
    const before30Seconds = 30000;

    setTimeout(() => {
      logout();
    }, exp - currentDate - before30Seconds);
  }, []);

  const shouldForceLogin = (): boolean => {
    const queryString = window.location.search.replace('?', '').split('=');

    return (
      queryString &&
      queryString.length > 1 &&
      queryString[0] === 'authenticatedThrough' &&
      queryString[1] === 'Okta'
    );
  };

  const getUserData = useCallback(async (): Promise<
    GenericObject | undefined
  > => {
    try {
      const currentSession: CognitoUserSession = await Auth.currentSession();
      const userData: CognitoIdToken = currentSession.getIdToken();

      logoutBeforeTokenExpires(userData.payload.exp);

      return userData.payload;
    } catch {
      return undefined;
    } finally {
      setTriedToFetchTheUser(true);
    }
  }, [logoutBeforeTokenExpires]);

  const onLoad = useCallback(async () => {
    try {
      Hub.listen('auth', async (data: any) => {
        if (data.payload.event === 'configured') {
          setUserTokenData(await getUserData());
        }

        if (data.payload.event === 'signIn') {
          setUserTokenData(await getUserData());
        }
      });

      let authConfig = appConfig.auth;
      if (window.location.host.includes('dev')) {
        authConfig = {
          ...authConfig,
          userPoolId: appConfig.appConfigDev.auth.userPoolId,
          userPoolWebClientId: appConfig.appConfigDev.auth.userPoolWebClientId,
          oauth: {
            ...authConfig.oauth,
            domain: appConfig.appConfigDev.auth.oauth.domain,
          },
        };
      }
      Auth.configure(authConfig);

      if (shouldForceLogin()) {
        await login();
      }

      Hub.remove('auth', () => {
        //noop
      });
    } catch (error) {
      setError(error);
    }
  }, [getUserData]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <AuthContext.Provider
      value={{ userTokenData, triedToFetchTheUser, error, login, logout }}
    >
      {process.env.NODE_ENV !== 'production' && <SignOut logout={logout} />}
      {children}
    </AuthContext.Provider>
  );
};
