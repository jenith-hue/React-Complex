/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { AgreementInfo, populateDaysLateHistory } from '../AgreementInfo';
import * as Utils from '../../../../utils/utils';

interface PropWithChildren {
  children: JSX.Element;
}

interface MockRACTableProps {
  renderTableHead: () => JSX.Element;
  renderTableContent: () => JSX.Element;
}
// Notice that the below is required, even if there is an another
// jest.spyOn in the test.
// Otherwise, we'll get the following: TypeError: Cannot redefine property: useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '',
  }),
}));

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
    storeRowContentCell: 'storeRowContentCell',
    storeRowContent: 'storeRowContent',
    notVisible: 'notVisible',
  }),
}));

jest.mock('../../../../context/AgreementInfo/AgreementInfoProvider', () => ({
  useAgreementInfoActions: () => ({
    fetchAgreementInfo: jest.fn(),
  }),
  useAgreementInfo: () => ({
    stores: [
      {
        storeNumber: jest.fn(),
        city: 'Flagstaff',
        state: 'AZ',
        agreements: [
          {
            agreementNumber: '08767673445',
            nextDueDate: '2021-04-26',
            currentDaysLate: '28',
            daysLateHistory: [
              {
                dayslate: '1',
                count: '0',
              },
              {
                dayslate: '2',
                count: '1',
              },
              {
                dayslate: '3',
                count: '0',
              },
              {
                dayslate: '4',
                count: '0',
              },
              {
                dayslate: '5',
                count: '2',
              },
              {
                dayslate: '6',
                count: '0',
              },
              {
                dayslate: '7',
                count: '0',
              },
              {
                dayslate: '8',
                count: '0',
              },
              {
                dayslate: '9',
                count: '0',
              },
              {
                dayslate: '10',
                count: '0',
              },
            ],
          },
        ],
      },
    ],
  }),
}));

describe('AgreementInfo', () => {
  it('renders correctly', () => {
    jest
      .spyOn(Utils, 'formatDateString')
      .mockImplementation(() => '12/12/2021');

    const tree = renderer.create(
      <BrowserRouter>
        <AgreementInfo />
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
  describe('populateDaysLateHistory', () => {
    it('populates correctly when all data present', () => {
      const daysLateHistory = [
        { dayslate: 'On_Time', count: 1 },
        { dayslate: '1-6_Days_Late', count: 2 },
        { dayslate: '7-14_Days_Late', count: 3 },
        { dayslate: '15+_Days_Late', count: 4 },
      ];

      const result = populateDaysLateHistory(daysLateHistory);

      expect(result).toStrictEqual([
        { dayslate: 'On_Time', count: 1 },
        { dayslate: '1-6_Days_Late', count: 2 },
        { dayslate: '7-14_Days_Late', count: 3 },
        { dayslate: '15+_Days_Late', count: 4 },
      ]);
    });
    it('populates correctly when all data present (order different)', () => {
      const daysLateHistory = [
        { dayslate: '15+_Days_Late', count: 4 },
        { dayslate: '7-14_Days_Late', count: 3 },
        { dayslate: '1-6_Days_Late', count: 2 },
        { dayslate: 'On_Time', count: 1 },
      ];

      const result = populateDaysLateHistory(daysLateHistory);

      expect(result).toStrictEqual([
        { dayslate: 'On_Time', count: 1 },
        { dayslate: '1-6_Days_Late', count: 2 },
        { dayslate: '7-14_Days_Late', count: 3 },
        { dayslate: '15+_Days_Late', count: 4 },
      ]);
    });
    it('populates correctly when all data missing', () => {
      const daysLateHistory = null;

      const result = populateDaysLateHistory(daysLateHistory);

      expect(result).toStrictEqual([
        { dayslate: 'On_Time', count: 0 },
        { dayslate: '1-6_Days_Late', count: 0 },
        { dayslate: '7-14_Days_Late', count: 0 },
        { dayslate: '15+_Days_Late', count: 0 },
      ]);
    });
    it('populates correctly when data is empty arr', () => {
      const daysLateHistory = [] as any;

      const result = populateDaysLateHistory(daysLateHistory);

      expect(result).toStrictEqual([
        { dayslate: 'On_Time', count: 0 },
        { dayslate: '1-6_Days_Late', count: 0 },
        { dayslate: '7-14_Days_Late', count: 0 },
        { dayslate: '15+_Days_Late', count: 0 },
      ]);
    });
    it('populates correctly when some data missing', () => {
      const daysLateHistory = [
        { dayslate: 'On_Time', count: 1 },
        { dayslate: '7-14_Days_Late', count: 3 },
      ];

      const result = populateDaysLateHistory(daysLateHistory);

      expect(result).toStrictEqual([
        { dayslate: 'On_Time', count: 1 },
        { dayslate: '1-6_Days_Late', count: 0 },
        { dayslate: '7-14_Days_Late', count: 3 },
        { dayslate: '15+_Days_Late', count: 0 },
      ]);
    });
  });
});
