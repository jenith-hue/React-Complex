import React, { useCallback, useMemo } from 'react';

import { useAuthContext } from '../../context/auth/auth-context';
import { appConfig } from '../../config/app-config';
import { makeStyles } from '@rentacenter/racstrap';

export const unauthenticatedTestId = 'unauthenticatedTestId';

// Note: we are using the old styles
// shall be redesigned
const useStyles = makeStyles((theme: any) => ({
  centered: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    justifyContent: 'center',
    width: '100%',
    '& h1': {
      fontSize: theme.typography.pxToRem(32),
      fontWeight: 700,
      margin: '2rem',
    },
  },

  note: {
    margin: '1rem 0 5rem 0',
    textAlign: 'center',
    width: '200px',
  },

  signin: {
    color: 'cornflowerblue',
    padding: '0.75rem 3rem',
  },
}));

export const Unauthenticated = () => {
  const { login, error } = useAuthContext();
  const classes = useStyles();

  const handleClick = useCallback(() => {
    if (login) {
      login();
    }
  }, [login]);

  return useMemo(
    () => (
      <div className={classes.centered} data-testid={unauthenticatedTestId}>
        <h1>{appConfig.appName}</h1>
        <div className={classes.note}>
          {!error ? (
            <span>Use your Rent-A-Center credentials to sign in</span>
          ) : (
            <span>{`The following error occured: ${error}`}</span>
          )}
        </div>
        <button
          className={classes.signin}
          onClick={handleClick}
          data-testid="signin"
        >
          Sign in with Single Sign-On
        </button>
      </div>
    ),
    [error, handleClick, classes.centered, classes.note, classes.signin]
  );
};
