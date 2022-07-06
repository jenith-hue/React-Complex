/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import { CurrentPaymentHistory } from '../CurrentPaymentHistory';
import * as Utils from '../../../../utils/utils';

interface PropWithChildren {
  children: JSX.Element;
}

interface MockRACTableProps {
  renderTableHead: () => JSX.Element;
  renderTableContent: () => JSX.Element;
}

jest.mock(
  'react-infinite-scroll-component',
  () =>
    ({ children, ...rest }: PropWithChildren) =>
      (
        <div data-testid="InfiniteScroll" {...rest}>
          {children}
        </div>
      )
);

jest.mock('@rentacenter/racstrap', () => ({
  ...jest.requireActual('@rentacenter/racstrap'),
  RACButton: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACButton" {...rest}>
      {children}
    </div>
  ),
  Typography: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Typography" {...rest}>
      {children}
    </div>
  ),
  RACTableCell: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACTableCell" {...rest}>
      {children}
    </div>
  ),
  RACTableRow: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACTableRow" {...rest}>
      {children}
    </div>
  ),
  RACCOLOR: {
    INDEPENDENCE: 'INDEPENDENCE',
  },
  RACTable: ({ renderTableHead, renderTableContent }: MockRACTableProps) => (
    <div data-testid="RACTable">
      <div id="table-head">{renderTableHead()}</div>
      <div id="table-content">{renderTableContent()}</div>
    </div>
  ),
  makeStyles: () => () => ({
    tableContentColor: 'tableContentColor',
    tableRoot: 'tableRoot',
    tableBody: 'tableBody',
    tableHead: 'tableHead',
    contentHeight: 'contentHeight',
  }),
}));

jest.mock('../../../../context/PaymentHistory/PaymentHistoryProvider', () => ({
  usePaymentHistoryActions: () => ({
    fetchPaymentHistory: jest.fn(),
    resetPaymentData: jest.fn(),
  }),
  usePaymentHistory: () => ({
    total: 20,
    numberOfLoadedPayments: 20,
    hasApiError: false,
    loading: false,
    payments: [
      {
        storeNumber: jest.fn(),
        paymentDate: '2021-05-08',
        receiptDate: '2021-05-08T12:54:27',
        receiptId: '9999646083762',
        receiptTransactionType: {
          code: 'P',
          description: 'Payment',
        },
        paymentAmount: '116.98',
        nextDueDate: '2021-06-08',
        agreementId: '1234567',
        agreementNumber: '08976767956',
        daysExtension: '0',
        daysLate: '0',
        paymentOrigin: {
          code: 'A',
          description: 'AutoPay',
        },
        paymentMethodType: ['CC', 'CASH'],
        netRentalRevenue: '92.77',
        clubPayment: '6.00',
      },
    ],
  }),
}));

// Notice that the below is required, even if there is an another
// jest.spyOn in the test.
// Otherwise, we'll get the following: TypeError: Cannot redefine property: useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '',
  }),
}));
describe('CurrentPaymentHistory', () => {
  it('renders correctly', () => {
    jest
      .spyOn(Utils, 'formatDateString')
      .mockImplementation(() => '12/12/2021');
    jest
      .spyOn(Utils, 'formatStringDateHoursAndMinutes')
      .mockImplementation(() => '10:00 AM');

    const tree = renderer.create(<CurrentPaymentHistory />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
