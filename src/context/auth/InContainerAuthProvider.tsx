import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Auth } from '@aws-amplify/auth';
import { CognitoIdToken, CognitoUserSession } from 'amazon-cognito-identity-js';

import { AuthContext } from './auth-context';
import { appConfig } from '../../config/app-config';

export const InContainerAuthProvider = ({
  children,
}: PropsWithChildren<Record<string, unknown>>) => {
  const [userTokenData, setUserTokenData] = useState<
    Record<string, any> | undefined
  >(undefined);
  const [triedToFetchTheUser, setTriedToFetchTheUser] =
    useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const getUserData = useCallback(async (): Promise<
    Record<string, any> | undefined
  > => {
    try {
      const currentSession: CognitoUserSession = await Auth.currentSession();
      const userData: CognitoIdToken = currentSession.getIdToken();

      return userData.payload;
    } catch {
      return undefined;
    } finally {
      setTriedToFetchTheUser(true);
    }
  }, []);

  const onLoad = useCallback(async () => {
    try {
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

      setUserTokenData(await getUserData());
    } catch (error) {
      setError(error);
    }
  }, [getUserData]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <AuthContext.Provider value={{ userTokenData, triedToFetchTheUser, error }}>
      {children}
    </AuthContext.Provider>
  );
};
