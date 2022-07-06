/* eslint-disable react/display-name */

import React from 'react';
import { render } from '@testing-library/react';

import { App, appTestId } from '../App';
import { createBrowserHistory } from 'history';

interface PropWithChildren {
  children: JSX.Element;
}

jest.mock('@rentacenter/racstrap', () => ({
  ...jest.requireActual('@rentacenter/racstrap'),
  RACThemeProvider: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACThemeProvider" {...rest}>
      {children}
    </div>
  ),
  makeStyles: () => () => ({}),
}));
describe('App', () => {
  it('should render without crashing', async () => {
    const defaultHistory = createBrowserHistory();

    const { findByTestId } = render(<App history={defaultHistory} />);

    const result = await findByTestId(appTestId);

    expect(result).toBeInTheDocument();
  });
});
