/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/no-duplicate-string */
import {
  WORKED_HISTORY_ACTIVITY_TYPE_CODES,
  WORKED_HISTORY_CALL_RESULT_CODES,
  WORKED_HISTORY_COLORS,
  WORKED_HISTORY_COMMITMENT_STATUS_CODES,
} from '../../../constants/constants';
import { getRowColor } from '../WorkedHistoryProvider';

// Notice that the below is required, even if there is an another
// jest.spyOn in the test.
// Otherwise, we'll get the following: TypeError: Cannot redefine property: useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '',
  }),
}));

describe('WorkedHistoryProviderTest', () => {
  const { BROKEN } = WORKED_HISTORY_COMMITMENT_STATUS_CODES;
  const { LMAL, LMCE, LMWK, LMR1, LMR2, LMR3, LMR4, NO_ANSWER } =
    WORKED_HISTORY_CALL_RESULT_CODES;
  const { CALL_CUSTOMER, COMMITMENT, TEXT_SENT, TEXT_RECEIVED } =
    WORKED_HISTORY_ACTIVITY_TYPE_CODES;
  const {
    TEXT_SENT: TEXT_SENT_COLOR,
    LEFT_MESSAGE,
    COMMITMENT: COMMITMENT_COLOR,
    BROKEN_COMMITMENT,
    TEXT_RECEIVED: TEXT_RECEIVED_COLOR,
    NO_COLOR,
    NO_ANSWER: NO_ANSWER_COLOR,
  } = WORKED_HISTORY_COLORS;
  describe('getRowColor', () => {
    it('returns NO_COLOR, when accountActivityTypeCode is missing', () => {
      expect(
        getRowColor(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          null,
          LMAL,
          BROKEN
        )
      ).toStrictEqual(NO_COLOR);
    });
    it(
      'returns NO_ANSWER color, when accountActivityTypeCode is CALL_CUSTOMER' +
        'and callResultTypeCode is NO_ANSWER',
      () => {
        expect(getRowColor(CALL_CUSTOMER, NO_ANSWER, BROKEN)).toStrictEqual(
          NO_ANSWER_COLOR
        );
      }
    );
    it(
      'returns LEFT_MESSAGE color, when accountActivityTypeCode is CALL_CUSTOMER' +
        'and callResultTypeCode is LMAL',
      () => {
        expect(getRowColor(CALL_CUSTOMER, LMAL, BROKEN)).toStrictEqual(
          LEFT_MESSAGE
        );
      }
    );
    it(
      'returns LEFT_MESSAGE color, when accountActivityTypeCode is CALL_CUSTOMER' +
        'and callResultTypeCode is LMCE',
      () => {
        expect(getRowColor(CALL_CUSTOMER, LMCE, BROKEN)).toStrictEqual(
          LEFT_MESSAGE
        );
      }
    );
    it(
      'returns LEFT_MESSAGE color, when accountActivityTypeCode is CALL_CUSTOMER' +
        'and callResultTypeCode is LMWK',
      () => {
        expect(getRowColor(CALL_CUSTOMER, LMWK, BROKEN)).toStrictEqual(
          LEFT_MESSAGE
        );
      }
    );
    it(
      'returns LEFT_MESSAGE color, when accountActivityTypeCode is CALL_CUSTOMER' +
        'and callResultTypeCode is LMR1',
      () => {
        expect(getRowColor(CALL_CUSTOMER, LMR1, BROKEN)).toStrictEqual(
          LEFT_MESSAGE
        );
      }
    );
    it(
      'returns LEFT_MESSAGE color, when accountActivityTypeCode is CALL_CUSTOMER' +
        'and callResultTypeCode is LMR2',
      () => {
        expect(getRowColor(CALL_CUSTOMER, LMR2, BROKEN)).toStrictEqual(
          LEFT_MESSAGE
        );
      }
    );
    it(
      'returns LEFT_MESSAGE color, when accountActivityTypeCode is CALL_CUSTOMER' +
        'and callResultTypeCode is LMR3',
      () => {
        expect(getRowColor(CALL_CUSTOMER, LMR3, BROKEN)).toStrictEqual(
          LEFT_MESSAGE
        );
      }
    );
    it(
      'returns LEFT_MESSAGE color, when accountActivityTypeCode is CALL_CUSTOMER' +
        'and callResultTypeCode is LMR4',
      () => {
        expect(getRowColor(CALL_CUSTOMER, LMR4, BROKEN)).toStrictEqual(
          LEFT_MESSAGE
        );
      }
    );
    it(
      'returns NO_COLOR color, when accountActivityTypeCode is CALL_CUSTOMER' +
        'and callResultTypeCode is NOT "NO_ANSWER", "LMAL", "LMCE", "LMWK", "LMR1", "LMR2", "LMR3" or "LMR4"',
      () => {
        expect(getRowColor(CALL_CUSTOMER, undefined, BROKEN)).toStrictEqual(
          NO_COLOR
        );
      }
    );
    it(
      'returns BROKEN_COMMITMENT color, when accountActivityTypeCode is COMMITMENT' +
        'and commitmentStatusCode is BROKEN',
      () => {
        expect(getRowColor(COMMITMENT, LMR4, BROKEN)).toStrictEqual(
          BROKEN_COMMITMENT
        );
      }
    );
    it(
      'returns COMMITMENT color, when accountActivityTypeCode is COMMITMENT' +
        'and commitmentStatusCode is NOT BROKEN',
      () => {
        expect(getRowColor(COMMITMENT, LMR4, undefined)).toStrictEqual(
          COMMITMENT_COLOR
        );
      }
    );
    it('returns TEXT_SENT color, when accountActivityTypeCode is TEXT_SENT', () => {
      expect(getRowColor(TEXT_SENT, LMR4, BROKEN)).toStrictEqual(
        TEXT_SENT_COLOR
      );
    });
    it('returns TEXT_RECEIVED color, when accountActivityTypeCode is TEXT_RECEIVED', () => {
      expect(getRowColor(TEXT_RECEIVED, LMR4, BROKEN)).toStrictEqual(
        TEXT_RECEIVED_COLOR
      );
    });
    it('return NO_COLOR as fallback option', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(getRowColor('NOT_EXISTING_CODE', LMR4, BROKEN)).toStrictEqual(
        NO_COLOR
      );
    });
  });
});
