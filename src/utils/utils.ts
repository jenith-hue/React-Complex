import { AxiosResponse } from 'axios';
import { add, sub, format } from 'date-fns';

import { isEmpty } from 'lodash';
import {
  ALL_OPTION,
  CONTENT_TYPE,
  DATE_FORMAT,
  Language,
  STORE_NUMBER_KEY,
} from '../constants/constants';
import { ReferenceItem, RouteResponse } from '../types/types';
import * as crypto from 'crypto';

export const sanitizeURL = (url: string): string => {
  if (!url) {
    return '';
  }

  const badURLRegex = RegExp('^((https)|(http)):/{3,}');
  const isBadURL = badURLRegex.test(url);

  if (isBadURL) {
    return 'https://' + url.replace(badURLRegex, '');
  }

  return url;
};

export const abbrev = (strToCutOff: string): string => {
  if (strToCutOff && strToCutOff.length > 13) {
    return strToCutOff.substr(0, 13) + '...';
  }

  return strToCutOff;
};

export const getErrorMessage = (response?: AxiosResponse<any>) => {
  if (response?.status === 400 && response?.data.errors[0].code) {
    return response?.data.errors[0].message;
  }

  return null;
};

export const orderByField = (fieldName: string, arrayToOrder: any[]) => {
  if (!arrayToOrder || !arrayToOrder.length || !fieldName) return arrayToOrder;
  return arrayToOrder.sort((a, b) => (a[fieldName] > b[fieldName] ? 1 : -1));
};

export const orderByFieldAndValue = (
  value: string,
  fieldName: string,
  arrayToOrder: any[]
) => {
  if (!arrayToOrder || !arrayToOrder.length || !fieldName) return arrayToOrder;
  return arrayToOrder.sort((a) => (a[fieldName] === value ? -1 : 1));
};

export const mapReferenceResponse = (references: ReferenceItem[]) => {
  if (!references || !references.length) return references;
  return references.map((reference) => ({
    label: reference.description,
    value: reference.referenceCode,
    ...reference,
  }));
};

// Not deleting method, because might be useful for Route selection in customer info header.
export const mapRoutesResponse = (routes: RouteResponse[]) => {
  if (!routes || !routes.length) return routes;
  return routes.map((routeObj) => ({
    label: routeObj.routeDescription,
    value: routeObj.routeCode,
    ...routeObj,
  }));
};

export const addAllOption = (arrayWithOptions: any[]) => {
  if (!arrayWithOptions) {
    return [
      {
        label: ALL_OPTION,
        value: ALL_OPTION,
      },
    ];
  }

  return [
    {
      label: ALL_OPTION,
      value: ALL_OPTION,
    },
    ...arrayWithOptions,
  ];
};

export const pipe =
  (...fns: any) =>
  (x: any) =>
    fns.reduce((v: any, f: (value: any) => void) => f(v), x);

export const formatDate = (date: Date, dateFormat = DATE_FORMAT): string => {
  if (isValidDate(date)) return format(date, dateFormat);
  return '';
};

// Dates are stored with local timezone of the respective store.
// We want to show the same data, by ignoring the user's local date settings
// e.g. 2021-07-19T16:07:42 or 2021-07-20
// yyyy-mm-dd
export const formatDateString = (
  dateAsString: string | undefined,
  returnedFormat?: string
): string => {
  if (!dateAsString || typeof dateAsString !== 'string') {
    return '';
  }
  let dateWithoutHours;
  if (dateAsString.includes('T')) {
    dateWithoutHours = dateAsString.split('T')[0];
  } else {
    dateWithoutHours = dateAsString;
  }

  // [0] = 'yyyy'; [1] = 'mm'; [2] = 'dd'
  let dateAsArray = [] as string[];
  if (dateWithoutHours.includes('-')) {
    dateAsArray = dateWithoutHours.split('-');
  } else if (dateWithoutHours.includes('/')) {
    dateAsArray = dateWithoutHours.split('/');
  }

  if (dateAsArray?.length !== 3) {
    return '';
  }

  if (returnedFormat === Language.Spanish) {
    return `${dateAsArray[2]} de ${spanishMonths[dateAsArray[1]]} de ${
      dateAsArray[0]
    }`;
  }

  if (returnedFormat === 'MM-dd-yyyy') {
    return `${dateAsArray[1]}-${dateAsArray[2]}-${dateAsArray[0]}`;
  }
  // mm/dd/yyyy
  return `${dateAsArray[1]}/${dateAsArray[2]}/${dateAsArray[0]}`;
};

export const toLocaleStringWithMinutes = (date: Date): string => {
  if (isValidDate(date))
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

  return '';
};

// e.g. "2022-03-31T02:56:44.738-05:00"
export const formatStringDateHoursAndMinutes = (
  dateAsString: string | undefined
): string => {
  try {
    if (dateAsString && isValidDate(new Date(dateAsString))) {
      const split1 = dateAsString.split('T');
      if (!split1[1]) {
        return '';
      }
      const split2 = split1[1].split(':');
      if (!split2[1]) {
        return '';
      }

      const hours = Number(split2[0]);
      const minutes = split2[1];

      let hoursToDisplay = hours % 12;
      let meridian = 'AM';

      if (hours >= 12) {
        meridian = 'PM';
      }
      if (hoursToDisplay === 0) {
        hoursToDisplay = 12;
      }

      return `${hoursToDisplay}:${minutes} ${meridian}`;
    }

    return '';
  } catch {
    return '';
  }
};

export type ListStatus =
  | 'initial'
  | 'loading'
  | 'apiError'
  | 'empty'
  | 'success';
export interface ComponentStateProps {
  loading?: boolean;
  hasApiError?: boolean;
  response?: any;
}

export const getComponentState = ({
  loading,
  hasApiError,
  response,
}: ComponentStateProps): ListStatus => {
  if (loading) return 'loading';
  if (hasApiError) return 'apiError';

  if (response) {
    if (Array.isArray(response)) {
      return response.length > 0 ? 'success' : 'empty';
    } else if (isEmpty(response)) {
      return 'empty';
    }
    return 'success';
  } else {
    return 'initial';
  }
};

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function isValidDate(d: any) {
  return d instanceof Date && !isNaN(d.getTime());
}

export const moveItemToTheEnd = (
  items: any,
  fieldName: string,
  value: string | number
): any => {
  if (!fieldName) return items;
  if (!value) return items;
  if (!Array.isArray(items)) return items;
  if (items.length < 2) return items;
  const itemsCopy = [...items];

  const index = itemsCopy.findIndex((item) => item[fieldName] === value);
  if (index < 0) return items;

  itemsCopy.splice(index, 1);
  return [...itemsCopy, items[index]];
};

export const formatPhoneNumberForPrintLetter = (phone: string) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }

  return null;
};

export const getLatestItem = (items?: any): any => {
  if (!Array.isArray(items)) return undefined;
  if (items.length > 0) {
    return items[items.length - 1];
  }

  return undefined;
};

export const formatPhoneNumber = (phone: string, isMasked?: boolean) => {
  if (phone && isMasked) return `(***) ***-****`;
  if (!phone || phone.includes('-')) return phone;

  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
};

export const getSelectedStore = () =>
  sessionStorage.getItem(STORE_NUMBER_KEY) || '';

export const randomNumericStringGenerator = (numberOfDigits = 8) => {
  if (typeof numberOfDigits !== 'number') {
    throw new TypeError(
      `Expected number instead got: ${typeof numberOfDigits}`
    );
  }

  return crypto
    .randomBytes(4)
    .readUInt32BE(0)
    .toString()
    .substr(0, numberOfDigits);
};

export const b64toBlob = (
  b64Data: any,
  contentType = 'application/pdf',
  sliceSize = 512
) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

export const formatMoney = (amount: string | number) => {
  if (amount === null || amount === undefined || isNaN(amount as number)) {
    return '$0.00';
  }

  return `$${Number(amount).toFixed(2)}`;
};

export const getContentType = (fileName: string, fileContentType?: string) => {
  if (fileContentType) return fileContentType;
  let result;

  if (fileName && typeof fileName === 'string') {
    const splits = fileName.split('.');
    const extension = splits[splits.length - 1] as string;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    result = CONTENT_TYPE[extension];
  }

  return result || CONTENT_TYPE.pdf;
};

export const SIX_MONTHS_AGO = sub(new Date(), { months: 6 });
export const SIX_MONTHS_AFTER = add(new Date(), { months: 6 });

export const thirtyDaysBeforeToDate = (toDate: Date) =>
  sub(toDate, { days: 31 });
export const thirtyDaysAfterFromDate = (fromDate: Date) =>
  add(fromDate, { days: 31 });

export const spanishMonths: any = {
  '01': 'enero',
  '02': 'febrero',
  '03': 'marzo',
  '04': 'abril',
  '05': 'mayo',
  '06': 'junio',
  '07': 'julio',
  '08': 'agosto',
  '09': 'septiembre',
  '10': 'octubre',
  '11': 'noviembre',
  '12': 'diciembre',
};
