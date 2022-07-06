/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import RouteData from 'react-router-dom';

import { WorkedHistory } from '../WorkedHistory';
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
  RACCard: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACCard" {...rest}>
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
  RACRowTip: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACRowTip" {...rest}>
      {children}
    </div>
  ),
  RACTable: ({ renderTableHead, renderTableContent }: MockRACTableProps) => (
    <div data-testid="RACTable">
      <div id="table-head">{renderTableHead()}</div>
      <div id="table-content">{renderTableContent()}</div>
    </div>
  ),
  makeStyles: () => () => ({}),
}));

jest.mock('../../../../context/WorkedHistory/WorkedHistoryProvider', () => ({
  useWorkedHistoryActions: () => ({
    fetchWorkedHistory: jest.fn(),
  }),
  useWorkedHistory: () => ({
    workedHistory: [
      {
        workedDate: '2014-05-31T00:04:21.0-0500',
        notes: 'Test note1',
        accountActivityType: {
          code: 'CALLC',
          description: 'Text Sent To Phone',
        },
        accountActivitySubType: {
          code: '2WAYTXT',
          description: '2 WAY Text',
        },
        callResultType: {
          code: 'NA',
          description: 'No Answer',
        },
        commitment: {
          commitmentDate: '2014-05-31T00:04:21.0-0500',
          commitmentType: {
            code: 'PY',
            description: 'Payment',
          },
          commitmentStatus: {
            code: 'GD',
            description: 'Good',
          },
        },
        dueDate: '2021-07-25',
        daysPastDue: '10',
        phoneNumberDialed: '214-726-0111',
        relation: 'Friend',
        coWorker: {
          id: '236268',
          firstName: 'Tim',
          lastName: 'Sutton',
        },
      },
      {
        workedDate: '2014-05-31T00:04:21.0-0500',
        notes: 'Test note2',
        accountActivityType: {
          code: 'CALLC',
          description: 'Text Sent To Phone',
        },
        accountActivitySubType: {
          code: '2WAYTXT',
          description: '2 WAY Text',
        },
        callResultType: {
          code: 'LMAL',
          description: 'Text Sent To Phone',
        },
        commitment: {
          commitmentDate: '2014-05-31T00:04:21.0-0500',
          commitmentType: {
            code: 'PY',
            description: 'Payment',
          },
          commitmentStatus: {
            code: 'GD',
            description: 'Good',
          },
        },
        dueDate: '2021-07-25',
        daysPastDue: '10',
        phoneNumberDialed: '214-726-0111',
        relation: 'Friend',
        coWorker: {
          id: '236268',
          firstName: 'Tim',
          lastName: 'Sutton',
        },
      },
      {
        workedDate: '2014-05-31T00:04:21.0-0500',
        notes: 'Test note3',
        accountActivityType: {
          code: 'CALLC',
          description: 'Text Sent To Phone',
        },
        accountActivitySubType: {
          code: '2WAYTXT',
          description: '2 WAY Text',
        },
        callResultType: {
          code: 'NOT_EXISTING_CODE',
          description: 'Text Sent To Phone',
        },
        commitment: {
          commitmentDate: '2014-05-31T00:04:21.0-0500',
          commitmentType: {
            code: 'PY',
            description: 'Payment',
          },
          commitmentStatus: {
            code: 'GD',
            description: 'Good',
          },
        },
        dueDate: '2021-07-25',
        daysPastDue: '10',
        phoneNumberDialed: '214-726-0111',
        relation: 'Friend',
        coWorker: {
          id: '236268',
          firstName: 'Tim',
          lastName: 'Sutton',
        },
      },
      {
        workedDate: '2014-05-31T00:04:21.0-0500',
        notes: 'Test note 4',
        accountActivityType: {
          code: 'CMT',
          description: 'Text Sent To Phone',
        },
        accountActivitySubType: {
          code: '2WAYTXT',
          description: '2 WAY Text',
        },
        callResultType: {
          code: 'LMAL',
          description: 'Text Sent To Phone',
        },
        commitment: {
          commitmentDate: '2014-05-31T00:04:21.0-0500',
          commitmentType: {
            code: 'PY',
            description: 'Payment',
          },
          commitmentStatus: {
            code: 'BR',
            description: 'Broken',
          },
        },
        dueDate: '2021-07-25',
        daysPastDue: '10',
        phoneNumberDialed: '214-726-0111',
        relation: 'Friend',
        coWorker: {
          id: '236268',
          firstName: 'Tim',
          lastName: 'Sutton',
        },
      },
      {
        workedDate: '2014-05-31T00:04:21.0-0500',
        notes: 'Test note 5',
        accountActivityType: {
          code: 'CMT',
          description: 'Text Sent To Phone',
        },
        accountActivitySubType: {
          code: '2WAYTXT',
          description: '2 WAY Text',
        },
        callResultType: {
          code: 'LMAL',
          description: 'Text Sent To Phone',
        },
        commitment: {
          commitmentDate: '2014-05-31T00:04:21.0-0500',
          commitmentType: {
            code: 'PY',
            description: 'Payment',
          },
          commitmentStatus: {
            code: 'NOT_EXISTING_CODE',
            description: 'Not existing, default to white',
          },
        },
        dueDate: '2021-07-25',
        daysPastDue: '10',
        phoneNumberDialed: '214-726-0111',
        relation: 'Friend',
        coWorker: {
          id: '236268',
          firstName: 'Tim',
          lastName: 'Sutton',
        },
      },
      {
        workedDate: '2014-05-31T00:04:21.0-0500',
        notes: 'Test note 6',
        accountActivityType: {
          code: 'TXTS',
          description: 'Text Sent To Phone',
        },
        accountActivitySubType: {
          code: '2WAYTXT',
          description: '2 WAY Text',
        },
        callResultType: {
          code: 'LMAL',
          description: 'Text Sent To Phone',
        },
        commitment: {
          commitmentDate: '2014-05-31T00:04:21.0-0500',
          commitmentType: {
            code: 'PY',
            description: 'Payment',
          },
          commitmentStatus: {
            code: 'NOT_EXISTING_CODE',
            description: 'Not existing, default to white',
          },
        },
        dueDate: '2021-07-25',
        daysPastDue: '10',
        phoneNumberDialed: '214-726-0111',
        relation: 'Friend',
        coWorker: {
          id: '236268',
          firstName: 'Tim',
          lastName: 'Sutton',
        },
      },
      {
        workedDate: '2014-05-31T00:04:21.0-0500',
        notes: 'Test note 7',
        accountActivityType: {
          code: 'TXTR',
          description: 'Text Sent To Phone',
        },
        accountActivitySubType: {
          code: '2WAYTXT',
          description: '2 WAY Text',
        },
        callResultType: {
          code: 'LMAL',
          description: 'Text Sent To Phone',
        },
        commitment: {
          commitmentDate: '2014-05-31T00:04:21.0-0500',
          commitmentType: {
            code: 'PY',
            description: 'Payment',
          },
          commitmentStatus: {
            code: 'GD',
            description: 'Good',
          },
        },
        dueDate: '2021-07-25',
        daysPastDue: '10',
        phoneNumberDialed: '214-726-0111',
        relation: 'Friend',
        coWorker: {
          id: '236268',
          firstName: 'Tim',
          lastName: 'Sutton',
        },
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
describe('WorkedHistory', () => {
  it('renders correctly', () => {
    jest.spyOn(RouteData, 'useLocation').mockImplementationOnce(() => ({
      pathname: '/testroute',
      search: '',
      hash: '',
      state: {
        customer: {
          customerFirstName: 'First',
          customerLastName: 'Last',
          customerId: '123ID',
        },
      },
    }));
    jest
      .spyOn(Utils, 'formatDateString')
      .mockImplementation(() => '12/12/2021');
    jest
      .spyOn(Utils, 'formatStringDateHoursAndMinutes')
      .mockImplementation(() => '11 AM');
    const tree = renderer.create(<WorkedHistory />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
