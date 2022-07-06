/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MESSAGE_STATUS } from '../../../constants/constants';
import {
  checkIfCommunicationAllowed,
  checkIfLogActivityIsAllowed,
  sortByPrimary,
} from '../CustomerDetailsProvider';

describe('CustomerDetailsProvider', () => {
  describe('checkIfCommunicationAllowed', () => {
    it('returns false, when communication details are missing', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(checkIfCommunicationAllowed(null)).toBeFalsy();
    });
    it('returns false, when communication limit per day is reached', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const communicationDetails = {
        communicationsPerDayAllowed: 3,
        communicationsPerYearAllowed: 6,
        totalCommunicationsThisYear: 3,
        totalCommunicationsToday: 3,
      };
      expect(checkIfCommunicationAllowed(communicationDetails)).toBeFalsy();
    });
    it('returns false, when communication limit per day is exceeded', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const communicationDetails = {
        communicationsPerDayAllowed: 3,
        communicationsPerYearAllowed: 6,
        totalCommunicationsThisYear: 3,
        totalCommunicationsToday: 4,
      };
      expect(checkIfCommunicationAllowed(communicationDetails)).toBeFalsy();
    });
    it('returns false, when communication limit per year is reached', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const communicationDetails = {
        communicationsPerDayAllowed: 3,
        communicationsPerYearAllowed: 6,
        totalCommunicationsThisYear: 6,
        totalCommunicationsToday: 1,
      };
      expect(checkIfCommunicationAllowed(communicationDetails)).toBeFalsy();
    });
    it('returns false, when communication limit per year is exceeded', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const communicationDetails = {
        communicationsPerDayAllowed: 3,
        communicationsPerYearAllowed: 6,
        totalCommunicationsThisYear: 7,
        totalCommunicationsToday: 1,
      };
      expect(checkIfCommunicationAllowed(communicationDetails)).toBeFalsy();
    });
    it('skip communication per year check, when limit not present', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const communicationDetails = {
        communicationsPerDayAllowed: 3,
        communicationsPerYearAllowed: null,
        totalCommunicationsThisYear: 6,
        totalCommunicationsToday: 2,
      };
      expect(checkIfCommunicationAllowed(communicationDetails)).toBeTruthy();
    });
    it('return true, when limits are not reached', () => {
      const communicationDetails = {
        communicationsPerDayAllowed: 3,
        communicationsPerYearAllowed: 6,
        totalCommunicationsThisYear: 5,
        totalCommunicationsToday: 2,
      };
      expect(checkIfCommunicationAllowed(communicationDetails)).toBeTruthy();
    });
    it('return true, when customer is the last one to reply', () => {
      const communicationDetails = {
        communicationsPerDayAllowed: '3',
        communicationsPerYearAllowed: '6',
        totalCommunicationsThisYear: '9999',
        totalCommunicationsToday: '9999',
      };
      const message = {
        messageStatus: MESSAGE_STATUS.RECEIVED,
      };
      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        checkIfCommunicationAllowed(communicationDetails, message)
      ).toBeTruthy();
    });
  });
  describe('sortByPrimary', () => {
    it('returns empty array, when input is empty', () => {
      expect(sortByPrimary([])).toStrictEqual([]);
    });
    it('sorts correctly by primary', () => {
      const phones = [
        {
          phoneId: '1',
          primary: 'N',
        },
        {
          phoneId: '2',
          primary: 'N',
        },
        {
          phoneId: '3',
          primary: 'Y',
        },
        {
          phoneId: '4',
          primary: 'N',
        },
      ];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(sortByPrimary(phones)).toStrictEqual([
        {
          phoneId: '3',
          primary: 'Y',
        },
        {
          phoneId: '1',
          primary: 'N',
        },
        {
          phoneId: '2',
          primary: 'N',
        },
        {
          phoneId: '4',
          primary: 'N',
        },
      ]);
    });
  });
  describe('checkIfLogActivityIsAllowed', () => {
    it('returns false, when communications details are missing', () => {
      //@ts-ignore
      expect(checkIfLogActivityIsAllowed(null)).toBeFalsy();
    });
    it('returns false, when communications per year exceeded', () => {
      const communicationDetails = {
        communicationsPerDayAllowed: 3,
        communicationsPerYearAllowed: 3,
        totalCommunicationsThisYear: 3,
        totalCommunicationsToday: 0,
      };
      //@ts-ignore
      expect(checkIfLogActivityIsAllowed(communicationDetails)).toBeFalsy();
    });
    it('returns false, when communications per year exceeded and per day is missing', () => {
      const communicationDetails = {
        communicationsPerDayAllowed: null,
        communicationsPerYearAllowed: 3,
        totalCommunicationsThisYear: 3,
        totalCommunicationsToday: 0,
      };
      //@ts-ignore
      expect(checkIfLogActivityIsAllowed(communicationDetails)).toBeFalsy();
    });
    it('returns true, when communications per year NOT exceeded and per day is missing', () => {
      const communicationDetails = {
        communicationsPerDayAllowed: null,
        communicationsPerYearAllowed: 3,
        totalCommunicationsThisYear: 0,
        totalCommunicationsToday: 0,
      };
      //@ts-ignore
      expect(checkIfLogActivityIsAllowed(communicationDetails)).toBeTruthy();
    });
    it('returns true, when communications per year NOT exceeded and per day exceeded', () => {
      const communicationDetails = {
        communicationsPerDayAllowed: null,
        communicationsPerYearAllowed: 3,
        totalCommunicationsThisYear: 1,
        totalCommunicationsToday: 1,
      };
      //@ts-ignore
      expect(checkIfLogActivityIsAllowed(communicationDetails)).toBeTruthy();
    });
    it('returns true, when communications per year is missing, but per day NOT exceeded', () => {
      const communicationDetails = {
        communicationsPerDayAllowed: 3,
        communicationsPerYearAllowed: null,
        totalCommunicationsThisYear: 1,
        totalCommunicationsToday: 1,
      };
      //@ts-ignore
      expect(checkIfLogActivityIsAllowed(communicationDetails)).toBeTruthy();
    });
    it('returns false, when communications per year is missing, but per day exceeded', () => {
      const communicationDetails = {
        communicationsPerDayAllowed: 3,
        communicationsPerYearAllowed: null,
        totalCommunicationsThisYear: 1,
        totalCommunicationsToday: 3,
      };
      //@ts-ignore
      expect(checkIfLogActivityIsAllowed(communicationDetails)).toBeFalsy();
    });
  });
});
