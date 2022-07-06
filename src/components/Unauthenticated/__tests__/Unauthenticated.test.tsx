import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';

import { AuthContextValue } from '../../../context/auth/auth-context';
import { Unauthenticated, unauthenticatedTestId } from '../Unauthenticated';
import { AuthContextProviderMock } from '../../../mocks/AuthContextProviderMock';

jest.mock('@rentacenter/racstrap', () => ({
  ...jest.requireActual('@rentacenter/racstrap'),
  makeStyles: () => () => ({}),
}));
describe('Unauthenticated', () => {
  it('should render', () => {
    const value: AuthContextValue = {
      triedToFetchTheUser: true,
    };

    const { queryByTestId } = render(
      <AuthContextProviderMock value={value}>
        <Unauthenticated />
      </AuthContextProviderMock>
    );

    const component = queryByTestId(unauthenticatedTestId);

    expect(component).toBeInTheDocument();
  });

  it('should render with error', () => {
    const value: AuthContextValue = {
      triedToFetchTheUser: true,
      error: 'error',
    };

    const { queryByTestId, queryByText } = render(
      <AuthContextProviderMock value={value}>
        <Unauthenticated />
      </AuthContextProviderMock>
    );

    const component = queryByTestId(unauthenticatedTestId);
    const errorLabelComponent = queryByText(
      `The following error occured: ${value.error}`,
      { exact: false }
    );

    expect(component).toBeInTheDocument();
    expect(errorLabelComponent).toBeInTheDocument();
  });

  it('should trigger login', () => {
    const value: AuthContextValue = {
      triedToFetchTheUser: true,
      login: jest.fn(),
    };

    const { queryByText } = render(
      <AuthContextProviderMock value={value}>
        <Unauthenticated />
      </AuthContextProviderMock>
    );

    const loginButton = queryByText('Sign in with Single Sign-On', {
      exact: false,
    }) as HTMLButtonElement;

    act(() => {
      if (loginButton) {
        fireEvent.click(loginButton);
      }
    });

    expect(value.login).toBeCalled();
  });
});
