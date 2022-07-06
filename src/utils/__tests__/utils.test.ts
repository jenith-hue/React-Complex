import { AxiosResponse } from 'axios';
import { CONTENT_TYPE } from '../../constants/constants';
import {
  formatDateString,
  formatMoney,
  formatPhoneNumber,
  getContentType,
  getErrorMessage,
  getLatestItem,
  mapReferenceResponse,
  mapRoutesResponse,
  moveItemToTheEnd,
  orderByField,
  sanitizeURL,
  toLocaleStringWithMinutes,
  formatStringDateHoursAndMinutes,
} from '../utils';

describe('utils', () => {
  describe('Error Handler Service', () => {
    const error: any = {
      traceId: '1',
      requestId: '1',
      errors: [
        {
          code: 'STO109',
          message:
            'Violate Event Limit Rule: There are 4 events which already exceed max limit 4',
        },
      ],
    };

    const response = {
      data: error,
      status: 400,
    } as AxiosResponse<any>;

    it('should extract message for req status 400 and existing error code', () => {
      const message = getErrorMessage(response);

      expect(message).toBe(error.errors[0].message);
    });

    it('should return null for undefined response', () => {
      const errorMessage = getErrorMessage(undefined);

      expect(errorMessage).toEqual(null);
    });
  });
  describe('sanitizeURL', () => {
    const urls: Array<string> = [
      '',
      'https:////a.bad.url',
      'http://should.not.change',
      'http:////should.change.url',
      'https:////should.not.affect.param?redirectUrl=https:////possibly.bad.url',
    ];
    const expectedSanitizedURLs: Array<string> = [
      '',
      'https://a.bad.url',
      'http://should.not.change',
      'https://should.change.url',
      'https://should.not.affect.param?redirectUrl=https:////possibly.bad.url',
    ];

    it('should sanitize URLs', () => {
      const sanitizedURLs = urls.map((url: string) => sanitizeURL(url));

      expect(sanitizedURLs).toEqual(expectedSanitizedURLs);
    });
  });
  describe('orderByField', () => {
    it('returns input, when array input is missing', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(orderByField('fieldName', null)).toBe(null);
    });
    it('returns input, when array input is empty', () => {
      expect(orderByField('fieldName', [])).toStrictEqual([]);
    });
    it('returns input, when field name is missing', () => {
      const arrayToOrder = [
        {
          id: '1',
          nr: 1,
        },
      ];
      expect(orderByField('', arrayToOrder)).toStrictEqual(arrayToOrder);
    });
    it('returns ok, when array has only one element', () => {
      const arrayToOrder = [
        {
          id: '1',
          nr: 1,
        },
      ];
      expect(orderByField('nr', arrayToOrder)).toStrictEqual(arrayToOrder);
    });
    it('returns ordered list, when array has only one element', () => {
      const arrayToOrder = [
        {
          id: '4',
          nr: 4,
        },
        {
          id: '5',
          nr: 5,
        },
        {
          id: '3',
          nr: 3,
        },
        {
          id: '1',
          nr: 1,
        },
        {
          id: '2',
          nr: 2,
        },
      ];
      const expectedResult = [
        {
          id: '1',
          nr: 1,
        },
        {
          id: '2',
          nr: 2,
        },
        {
          id: '3',
          nr: 3,
        },
        {
          id: '4',
          nr: 4,
        },
        {
          id: '5',
          nr: 5,
        },
      ];
      expect(orderByField('nr', arrayToOrder)).toStrictEqual(expectedResult);
    });
  });
  describe('mapReferenceResponse', () => {
    it('returns input, when array is missing', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(mapReferenceResponse(null)).toBe(null);
    });
    it('returns input, when array is empty', () => {
      expect(mapReferenceResponse([])).toStrictEqual([]);
    });
    it('maps description and referenceCode to label and value, without dropping rest of fields ', () => {
      const description1 = 'Description 1';
      const description2 = 'Description 2';
      const referenceCode1 = 'Reference code 1';
      const referenceCode2 = 'Reference code 2';
      const arrayToMap = [
        {
          displaySeq: 1,
          defaultValue: 'Default value 1',
          description: description1,
          referenceCode: referenceCode1,
        },
        {
          displaySeq: 2,
          defaultValue: 'Default value 2',
          description: description2,
          referenceCode: referenceCode2,
        },
      ];
      const expectedResult = [
        {
          displaySeq: 1,
          defaultValue: 'Default value 1',
          description: description1,
          referenceCode: referenceCode1,
          // added values
          label: description1,
          value: referenceCode1,
        },
        {
          displaySeq: 2,
          defaultValue: 'Default value 2',
          description: description2,
          referenceCode: referenceCode2,
          // added values
          label: description2,
          value: referenceCode2,
        },
      ];
      expect(mapReferenceResponse(arrayToMap)).toStrictEqual(expectedResult);
    });
  });
  describe('mapRoutesResponse', () => {
    it('returns input, when array is missing', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(mapRoutesResponse(null)).toBe(null);
    });
    it('returns input, when array is empty', () => {
      expect(mapRoutesResponse([])).toStrictEqual([]);
    });
    it('maps routeDescription and routeCode to label and value, without dropping rest of fields ', () => {
      const description1 = 'Description 1';
      const description2 = 'Description 2';
      const code1 = 'Reference code 1';
      const code2 = 'Reference code 2';
      const arrayToMap = [
        {
          routeDescription: description1,
          routeCode: code1,
        },
        {
          routeDescription: description2,
          routeCode: code2,
        },
      ];
      const expectedResult = [
        {
          routeDescription: description1,
          routeCode: code1,
          // added values
          label: description1,
          value: code1,
        },
        {
          routeDescription: description2,
          routeCode: code2,
          // added values
          label: description2,
          value: code2,
        },
      ];
      expect(mapRoutesResponse(arrayToMap)).toStrictEqual(expectedResult);
    });
  });
  describe('moveItemToTheEnd', () => {
    const value = 'Other';
    const fieldName = 'alertTypeDescEn';
    const randomItem = {
      alertTypeDescEn: 'Random',
    };

    const otherItem = {
      alertTypeDescEn: value,
    };
    it('returns received value, when fieldName is missing', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        moveItemToTheEnd([randomItem, otherItem, randomItem], undefined, value)
      ).toStrictEqual([randomItem, otherItem, randomItem]);
    });
    it('returns received value, when received array is missing', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(moveItemToTheEnd(undefined, fieldName, value)).toBeUndefined();
    });
    it('returns received value, when received value is missing', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        moveItemToTheEnd([randomItem], fieldName, undefined)
      ).toStrictEqual([randomItem]);
    });
    it('returns received array, when has only 1 item', () => {
      expect(moveItemToTheEnd([randomItem], fieldName, value)).toStrictEqual([
        randomItem,
      ]);
    });
    it('returns received array, when cannot find Other item ', () => {
      expect(
        moveItemToTheEnd([randomItem, randomItem], fieldName, value)
      ).toStrictEqual([randomItem, randomItem]);
    });
    it('moves other to the end of array', () => {
      expect(
        moveItemToTheEnd([randomItem, otherItem, randomItem], fieldName, value)
      ).toStrictEqual([randomItem, randomItem, otherItem]);
    });
  });

  describe('getLatestItem', () => {
    it('returns undefined, when param is undefined', () => {
      expect(getLatestItem()).toBeUndefined();
    });
    it('returns undefined, when param is object', () => {
      expect(getLatestItem({ length: 123 })).toBeUndefined();
    });
    it('returns undefined, when param is string', () => {
      expect(getLatestItem('test')).toBeUndefined();
    });
    it('returns undefined, when array is empty', () => {
      expect(getLatestItem([])).toBeUndefined();
    });
    it('returns item, when array is a signle item', () => {
      expect(getLatestItem([{ id: 1 }])).toStrictEqual({ id: 1 });
    });
    it('returns last item, when array is multiple items', () => {
      expect(getLatestItem([{ id: 1 }, { id: 2 }, { id: 3 }])).toStrictEqual({
        id: 3,
      });
    });
  });
  describe('formatPhoneNumber', () => {
    it('noop, when param missing', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(formatPhoneNumber()).toBe(undefined);
    });
    it('noop, when param is empty string', () => {
      expect(formatPhoneNumber('')).toBe('');
    });
    it('noop, when param contains "-"', () => {
      expect(formatPhoneNumber('522 123-4567')).toBe('522 123-4567');
    });
    it('format correctly', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
    });
    it('mask last digits', () => {
      expect(formatPhoneNumber('1234567890', true)).toBe('(***) ***-****');
    });
  });
  describe('toLocaleStringWithMinutes', () => {
    it('return empty string, when param is missing', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(toLocaleStringWithMinutes()).toBe('');
    });
    it('return empty string, when param is not date', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(toLocaleStringWithMinutes('2021-12-09T10:46:57.577Z')).toBe('');
    });
  });
  describe('formatMoney', () => {
    it('returns $0.00, when param cannot be coerced', () => {
      expect(formatMoney('abcd')).toBe('$0.00');
    });
    it('returns $0.00, when param is 0', () => {
      expect(formatMoney(0)).toBe('$0.00');
    });
    it('returns $0.00, when param is 0 (string)', () => {
      expect(formatMoney('0')).toBe('$0.00');
    });
    it('returns $123.00, when param is 123 (string)', () => {
      expect(formatMoney('123')).toBe('$123.00');
    });
    it('returns $123.00, when param is 123', () => {
      expect(formatMoney(123)).toBe('$123.00');
    });
    it('returns $123.99, when param is 123.99111', () => {
      expect(formatMoney(123.99111)).toBe('$123.99');
    });
    it('returns $124.00, when param is 123.99999', () => {
      expect(formatMoney(123.99999)).toBe('$124.00');
    });
  });
  describe('getContentType', () => {
    it('return fileContentType when present', () => {
      const fileName = 'file-name.pdf';
      const fileContentType = CONTENT_TYPE.html;

      expect(getContentType(fileName, fileContentType)).toBe(CONTENT_TYPE.html);
    });
    it('return correctly for pdf', () => {
      const fileName = 'file-name.pdf';

      expect(getContentType(fileName)).toBe(CONTENT_TYPE.pdf);
    });
    it('return correctly for html', () => {
      const fileName = 'file-name.html';

      expect(getContentType(fileName)).toBe(CONTENT_TYPE.html);
    });
    it('default to pdf when type not found', () => {
      const fileName = 'file-name.some-type';

      expect(getContentType(fileName)).toBe(CONTENT_TYPE.pdf);
    });
    it('default to pdf when extension is missing', () => {
      const fileName = 'file-name-without-extension';

      expect(getContentType(fileName)).toBe(CONTENT_TYPE.pdf);
    });
    it('default to pdf when file name is missing', () => {
      const fileName = '';

      expect(getContentType(fileName)).toBe(CONTENT_TYPE.pdf);
    });
  });
  describe('formatDateString', () => {
    it('returns empty string, when input not string', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(formatDateString(123)).toStrictEqual('');
    });
    it('returns empty string, when input is empty', () => {
      expect(formatDateString('')).toStrictEqual('');
    });
    it('returns correctly for 2021-07-19T00:00:00', () => {
      expect(formatDateString('2021-07-19T00:00:00')).toStrictEqual(
        // eslint-disable-next-line sonarjs/no-duplicate-string
        '07/19/2021'
      );
    });
    // eslint-disable-next-line sonarjs/no-identical-functions
    it('returns correctly for 2021-07-19T23:59:59', () => {
      expect(formatDateString('2021-07-19T00:00:00')).toStrictEqual(
        '07/19/2021'
      );
    });
    it('returns correctly for 2021-07-19', () => {
      expect(formatDateString('2021-07-19')).toStrictEqual('07/19/2021');
    });
  });
  describe('formatStringDateHoursAndMinutes', () => {
    it('returns correctly 1', () => {
      const input = '2022-03-31T00:00:44.738-05:00';
      const expected = '12:00 AM';

      expect(formatStringDateHoursAndMinutes(input)).toStrictEqual(expected);
    });
    it('returns correctly 2', () => {
      const input = '2022-03-31T00:59:44.738-05:00';
      const expected = '12:59 AM';

      expect(formatStringDateHoursAndMinutes(input)).toStrictEqual(expected);
    });
    it('returns correctly 3', () => {
      const input = '2022-03-31T05:30:44.738-05:00';
      const expected = '5:30 AM';

      expect(formatStringDateHoursAndMinutes(input)).toStrictEqual(expected);
    });
    it('returns correctly 4', () => {
      const input = '2022-03-31T12:00:44.738-05:00';
      const expected = '12:00 PM';

      expect(formatStringDateHoursAndMinutes(input)).toStrictEqual(expected);
    });
    it('returns correctly 5', () => {
      const input = '2022-03-31T12:59:44.738-05:00';
      const expected = '12:59 PM';

      expect(formatStringDateHoursAndMinutes(input)).toStrictEqual(expected);
    });
    it('returns correctly 6', () => {
      const input = '2022-03-31T17:30:44.738-05:00';
      const expected = '5:30 PM';

      expect(formatStringDateHoursAndMinutes(input)).toStrictEqual(expected);
    });
    it('returns empty string when first split 1 fails', () => {
      const input = '2022-03-31';
      const expected = '';

      expect(formatStringDateHoursAndMinutes(input)).toStrictEqual(expected);
    });
    it('returns empty string when first split 2 fails', () => {
      const input = '2022-03-31T17';
      const expected = '';

      expect(formatStringDateHoursAndMinutes(input)).toStrictEqual(expected);
    });
  });
});
