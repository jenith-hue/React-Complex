/* eslint-disable react/display-name */

import React from 'react';
import renderer from 'react-test-renderer';
import { CustomerHeader } from '../CustomerHeader';
import * as workedHistory from '../../../../context/WorkedHistory/WorkedHistoryProvider';

interface PropWithChildren {
  children: JSX.Element;
}

jest.mock('@rentacenter/racstrap', () => ({
  Typography: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Typography" {...rest}>
      {children}
    </div>
  ),
  RACButton: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACButton" {...rest}>
      {children}
    </div>
  ),
  RACSelect: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACCard" {...rest}>
      {children}
    </div>
  ),
  RACCOLOR: {
    WHITE: 'WHITE',
  },
  makeStyles: () => () => ({}),
}));

jest.mock('../../../../context/CustomerHeader/CustomerHeaderProvider', () => ({
  useCustomerHeaderActions: () => ({
    onChangeRoute: jest.fn(),
    onCloseAssignRouteErrorModal: jest.fn(),
  }),
  useCustomerHeader: () => ({
    routeOptions: [],
    selectedRouteOption: '',
    isLoading: false,
    hasRouteApiError: false,
    hasAssignRouteApiError: false,
    isRouteSelectionDisabled: false,
  }),
}));

jest.mock('../../../../context/CustomerAlert/CustomerAlertsProvider', () => ({
  useCustomerAlerts: () => ({
    customerAlerts: [],
    loading: false,
    hasApiError: false,
    hasDeleteApiError: false,
    hasGetApiError: false,
  }),
  useCustomerAlertsActions: () => ({
    fetchCustomerAlerts: jest.fn(),
    removeCustomerAlert: jest.fn(),
    saveCustomerAlerts: jest.fn(),
  }),
}));
// Notice that the below is required, even if there is an another
// jest.spyOn in the test.
// Otherwise, we'll get the following: TypeError: Cannot redefine property: useLocation
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: () => ({
    pathname: '',
    state: {
      customer: {
        customerFirstName: 'John',
        customerLastName: 'Doe',
        firstPaymentDefault: 'Y',
        secondPaymentDefault: 'N',
      },
    },
  }),
}));
describe('CustomerHeader', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<CustomerHeader />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders correctly, when worked history label is present', () => {
    jest
      .spyOn(workedHistory, 'useWorkedHistory')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      .mockImplementationOnce(() => ({
        workedHistoryLabel: {
          text: 'Text',
          background: 'BLACK',
        },
      }));
    const tree = renderer.create(<CustomerHeader />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
