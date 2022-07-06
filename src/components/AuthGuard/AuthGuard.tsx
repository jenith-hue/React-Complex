import React, { useMemo } from 'react';

import { useAuthContext } from '../../context/auth/auth-context';
import { Routes } from '../../app/Routes';
import { Unauthenticated } from '../Unauthenticated/Unauthenticated';

export const tryingToFetchTheUserTestId = 'tryingToFetchTheUserTestId';
export const noUserTestId = 'noUserTestId';

export const AuthGuard = () => {
  const { userTokenData, triedToFetchTheUser } = useAuthContext();
  const { isRenderedByContainer } = window;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fallback = isRenderedByContainer ? (
    <div data-testid={noUserTestId} />
  ) : (
    <Unauthenticated />
  );

  return useMemo(() => {
    if (triedToFetchTheUser) {
      return <>{userTokenData ? <Routes /> : fallback}</>;
    }

    return <div data-testid={tryingToFetchTheUserTestId} />;
  }, [userTokenData, triedToFetchTheUser, fallback]);
};
