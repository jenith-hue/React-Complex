/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import { History } from '../History';

interface PropWithChildren {
  children: JSX.Element;
}

jest.mock('@rentacenter/racstrap', () => ({
  RACCard: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACCard" {...rest}>
      {children}
    </div>
  ),
  RACTabs: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACTabs" {...rest}>
      {children}
    </div>
  ),
  makeStyles: () => () => ({}),
}));

jest.mock('../WorkedHistory', () => ({
  WorkedHistory: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="WorkedHistory" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../AgreementInfo', () => ({
  AgreementInfo: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="AgreementInfo" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../CurrentPaymentHistory', () => ({
  CurrentPaymentHistory: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="CurrentPaymentHistory" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../../../../context/AgreementInfo/AgreementInfoProvider', () => ({
  AgreementInfoProvider: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="AgreementInfoProvider" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../../../../context/PaymentHistory/PaymentHistoryProvider', () => ({
  PaymentHistoryProvider: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="PaymentHistoryProvider" {...rest}>
      {children}
    </div>
  ),
}));

describe('History', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<History />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
