import { makeStyles, RACThemeProvider } from '@rentacenter/racstrap';
import clsx from 'clsx';
import { History } from 'history';
import React from 'react';
import { Router } from 'react-router';
import { AuthGuard } from '../components/AuthGuard/AuthGuard';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import { InContainerAuthProvider } from '../context/auth/InContainerAuthProvider';
import { StandaloneAuthProvider } from '../context/auth/StandaloneAuthProvider';

interface Props {
  history: History;
}

export const appTestId = 'appTestId';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    paddingLeft: '0.75rem',
    paddingRight: '0.75rem',
  },
}));

export const App = ({ history }: Props) => {
  const { isRenderedByContainer } = window;
  const classes = useStyles();

  return (
    <div data-testid={appTestId}>
      <RACThemeProvider>
        <div className={clsx(classes.container)}>
          <ErrorBoundary>
            <Router history={history}>
              {isRenderedByContainer ? (
                <InContainerAuthProvider>
                  <AuthGuard />
                </InContainerAuthProvider>
              ) : (
                <StandaloneAuthProvider>
                  <AuthGuard />
                </StandaloneAuthProvider>
              )}
            </Router>
          </ErrorBoundary>
        </div>
      </RACThemeProvider>
    </div>
  );
};
