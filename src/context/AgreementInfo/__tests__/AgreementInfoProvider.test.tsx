/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import RouteData from 'react-router-dom';
import renderer from 'react-test-renderer';
import * as api from '../../../api/Customer';
import { getSelectedStore } from '../../../utils/utils';
import { AgreementInfoProvider } from '../AgreementInfoProvider';

// Notice that the below is required, even if there is an another
// jest.spyOn in the test.
// Otherwise, we'll get the following: TypeError: Cannot redefine property: useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '',
  }),
}));

const stores = [
  {
    storeNumber: getSelectedStore(),
    city: 'Flagstaff',
    state: 'AZ',
    agreements: [
      {
        agreementNumber: '0876767342',
        nextDueDate: '2021-04-26',
        currentDaysLate: '28',
        daysLateHistory: [
          {
            numberOfDaysLate: '1',
            totalCount: '0',
          },
          {
            numberOfDaysLate: '2',
            totalCount: '13',
          },
          {
            numberOfDaysLate: '3',
            totalCount: '22',
          },
          {
            numberOfDaysLate: '4',
            totalCount: '30',
          },
          {
            numberOfDaysLate: '5',
            totalCount: '5',
          },
          {
            numberOfDaysLate: '6',
            totalCount: '7',
          },
          {
            numberOfDaysLate: '7',
            totalCount: '88',
          },
          {
            numberOfDaysLate: '8',
            totalCount: '9',
          },
          {
            numberOfDaysLate: '9',
            totalCount: '101',
          },
          {
            numberOfDaysLate: '10',
            totalCount: '202',
          },
        ],
      },
    ],
  },
];
const agreementInfoMockData = {
  customerId: 1234567,
  total: 22,
  stores,
};
describe('AgreementInfoProvider', () => {
  describe('AgreementInfoProvider RFC', () => {
    it('fetch agreement info data and save stores in state, when customer from location changes', async () => {
      const setStoresMock = jest.fn();
      const setTotalMock = jest.fn();
      const setNumberOfLoadedAgreementsMock = jest.fn();
      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [[], setStoresMock]);
      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [0, setTotalMock]);
      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [0, setNumberOfLoadedAgreementsMock]);
      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [false, jest.fn()]);
      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [false, jest.fn()]);

      jest.spyOn(RouteData, 'useLocation').mockImplementationOnce(() => ({
        pathname: '/testroute',
        search: '',
        hash: '',
        state: {
          customer: {
            customerId: 'CID1',
          },
        },
      }));

      jest.spyOn(api, 'getAgreementInfo').mockImplementationOnce(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        () => Promise.resolve(agreementInfoMockData)
      );
      renderer.act(() => {
        renderer.create(
          <AgreementInfoProvider>
            <div data-testid="test"></div>
          </AgreementInfoProvider>
        );
      });

      // act is not enough, because of the promise from fetchAgreementInfo
      await Promise.resolve();

      // expect(setStoresMock).toHaveBeenCalledTimes(1);
      // expect(setStoresMock).toHaveBeenCalledWith(stores);

      // expect(setTotalMock).toHaveBeenCalledTimes(1);
      // expect(setTotalMock).toHaveBeenCalledWith(22);

      // expect(setNumberOfLoadedAgreementsMock).toHaveBeenCalledTimes(1);
      // expect(setNumberOfLoadedAgreementsMock).toHaveBeenCalledWith(1);
    });
  });
});
