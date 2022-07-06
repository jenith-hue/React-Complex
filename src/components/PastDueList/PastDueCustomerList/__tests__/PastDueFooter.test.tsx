import {
  FULL_API_ERROR_MESSAGE,
  NO_15_DAY_LETTER,
  NO_15_DAY_LETTER_MULTIPLE_CUSTOMERS,
} from '../../../../constants/constants';
import { getApiErrorMessage } from '../PastDueFooter';

describe('PastDueFooter', () => {
  describe('getApiErrorMessage', () => {
    it('returns correctly, when api error', () => {
      expect(getApiErrorMessage(false, ['1', '2'])).toBe(
        FULL_API_ERROR_MESSAGE
      );
    });
    it('returns correctly, when letter missing and multiple customers selected', () => {
      expect(getApiErrorMessage(true, ['1', '2'])).toBe(
        NO_15_DAY_LETTER_MULTIPLE_CUSTOMERS
      );
    });
    it('returns correctly, when letter missing and only 1 customer selected', () => {
      expect(getApiErrorMessage(true, ['1'])).toBe(NO_15_DAY_LETTER);
    });
  });
});
