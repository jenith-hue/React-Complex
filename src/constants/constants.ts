import { RACCOLOR } from '@rentacenter/racstrap';
import { ActivityLogSearchCriteriaOption } from '../types/types';

export const LOG_ACTIVITY_NOTES_MAX_LENGTH = 256;
export const ProductType = 'RACPAD_ACCTMGMT';
export const STORE_NUMBER_KEY = 'storeNumber';
export enum ProductPermissions {
  CHANGE_CUSTOMER_ROUTE = 'RACPAD_AM_ROUTE',
}

export enum TextPermissions {
  TEXT_MESSAGE_ALLOWED = 'TWO_WAY_TEXTING',
  TEMPLATE_MESSAGE_ALLOWED = 'SHOW_TEXT_TEMPLATE',
  FREE_FORM_MESSAGE_ALLOWED = 'SHOW_FREE_FORM_TEXT',
}

export enum CustomerInformationFooterAction {
  NEXT = 'NEXT',
  PREVIOUS = 'PREVIOUS',
}

export const ALL_OPTION = 'All';
export const ALL_OPTION_DESC = 'Customer with and without activity';
export const YES_OPTION_DESC = 'Customers with activity ( of any type)';
export const NO_OPTION_DESC = 'Customer with No activity';
export const TXT_RECEIVED = 'Text Received';
export const SELECT_ONE_OPTION = '<Select One>';

export const DATE_FORMAT = 'MM/dd/yyyy';
export const DATE_FORMAT_API = 'MM-dd-yyyy';

export const API_ERROR_MESSAGE = 'Unable to fetch the data';
export const REQUIRED_FIELD_MESSAGE = 'This field is required';
export const INVALID_PHONE_NUMBER = 'Invalid number';
export const FULL_API_ERROR_MESSAGE =
  'Unable to fetch the data. Please try again later.';
export const LOG_ACTIVITY_ERROR_MESSAGE =
  'Unable to log activity. Please try again later.';
export const TAKE_COMMITMENT_ERROR_MESSAGE =
  'Unable to take commitment. Please try again later.';
export const NO_15_DAY_LETTER = 'No 15 day letter for this customer';
export const NO_15_DAY_LETTER_MULTIPLE_CUSTOMERS =
  'No 15 day letter for this customers';
export const UPDATE_ALERT_ERROR_MESSAGE =
  'Unable to update customer alerts. Please try again later.';
export const DELETE_ALERT_ERROR_MESSAGE =
  'Unable to remove customer alert. Please try again later.';
export const ASSIGN_ROUTE_ERROR_MESSAGE =
  'Failed to assign route. Please try again later.';
export const PHONE_INSTRUCTIONS_ERROR_MESSAGE =
  'Failed to save phone instructions. Please try again later.';
export const FRCStoreType = 'RFI';
export const RentACenter = 'Rent-A-Center';

export enum WORKED_HISTORY_ACTIVITY_TYPE_CODES {
  CALL_CUSTOMER = 'CALLC',
  COMMITMENT = 'CMT',
  TEXT_SENT = 'TXTS',
  TEXT_RECEIVED = 'TXTR',
}

export enum AM_ACTIVITY_OPTIONS {
  TEXT_RECEIVED = 'TXTR',
  TEXT_SENT = 'TXTS',
  TEXT_SENT_FAILED = 'TXTSF',
  COMMITMENT = 'CMT',
  LP = 'LP',
  CALL_CUSTOMER = 'CALLC',
  CALL_ALTERNATIVE = 'CALLA',
  CALL_REFERENCE = 'CALLR',
  CALL_EMPLOYER = 'CALLE',
}

export enum WORKED_HISTORY_CALL_RESULT_CODES {
  LMAL = 'LMAL',
  LMCE = 'LMCE',
  LMWK = 'LMWK',
  LMR1 = 'LMR1',
  LMR2 = 'LMR2',
  LMR3 = 'LMR3',
  LMR4 = 'LMR4',
  NO_ANSWER = 'NA',
  FIELD_VISIT = 'FIELD',
}

export enum WORKED_HISTORY_COMMITMENT_STATUS_CODES {
  BROKEN = 'BR',
  OPEN = 'OP',
}

export const WORKED_HISTORY_ROW_COLORS = {
  TEXT_SENT: RACCOLOR?.ALICE_BLUE,
  LEFT_MESSAGE: RACCOLOR?.ALICE_BLUE,
  COMMITMENT: RACCOLOR?.CADMIUM_YELLOW,
  BROKEN_COMMITMENT: RACCOLOR?.LINEN,
  TEXT_RECEIVED: RACCOLOR?.MAGNOLIA,
  NO_ANSWER: RACCOLOR?.PINK_LACE,
  NO_COLOR: RACCOLOR?.WHITE,
};

export const WORKED_HISTORY_TIP_COLORS = {
  TEXT_SENT: RACCOLOR?.BLUE_MANA,
  LEFT_MESSAGE: RACCOLOR?.TUFTS_BLUE,
  COMMITMENT: RACCOLOR?.HONEYCOMB,
  BROKEN_COMMITMENT: RACCOLOR?.PUNCH,
  TEXT_RECEIVED: RACCOLOR?.INTERGALACTIC_COWBOY,
  NO_ANSWER: RACCOLOR?.RICH_LILAC,
  NO_COLOR: RACCOLOR?.WHITE,
};

export const WORKED_HISTORY_COLORS = {
  TEXT_SENT: {
    row: WORKED_HISTORY_ROW_COLORS.TEXT_SENT,
    tip: WORKED_HISTORY_TIP_COLORS.TEXT_SENT,
  },
  LEFT_MESSAGE: {
    row: WORKED_HISTORY_ROW_COLORS.LEFT_MESSAGE,
    tip: WORKED_HISTORY_TIP_COLORS.LEFT_MESSAGE,
  },
  COMMITMENT: {
    row: WORKED_HISTORY_ROW_COLORS.COMMITMENT,
    tip: WORKED_HISTORY_TIP_COLORS.COMMITMENT,
  },
  BROKEN_COMMITMENT: {
    row: WORKED_HISTORY_ROW_COLORS.BROKEN_COMMITMENT,
    tip: WORKED_HISTORY_TIP_COLORS.BROKEN_COMMITMENT,
  },
  TEXT_RECEIVED: {
    row: WORKED_HISTORY_ROW_COLORS.TEXT_RECEIVED,
    tip: WORKED_HISTORY_TIP_COLORS.TEXT_RECEIVED,
  },
  NO_COLOR: {
    row: WORKED_HISTORY_ROW_COLORS.NO_COLOR,
    tip: WORKED_HISTORY_TIP_COLORS.NO_COLOR,
  },
  NO_ANSWER: {
    row: WORKED_HISTORY_ROW_COLORS.NO_ANSWER,
    tip: WORKED_HISTORY_TIP_COLORS.NO_ANSWER,
  },
};

export const PAST_DUE_LIST_SEARCH_DAYS_LATE_OPTIONS = [
  {
    description: ALL_OPTION,
    label: ALL_OPTION,
    value: ALL_OPTION,
    referenceCode: ALL_OPTION,
  },
  {
    description: '0',
    label: '0',
    value: 'Z',
    referenceCode: 'Z',
  },
  {
    description: '1-6',
    label: '1-6',
    value: 'ONTOSI',
    referenceCode: 'ONTOSI',
  },
  {
    description: '7-14',
    label: '7-14',
    value: 'SETOFO',
    referenceCode: 'SETOFO',
  },
  {
    description: '15+',
    label: '15+',
    value: 'FIFPLUS',
    referenceCode: 'FIFPLUS',
  },
];

export const PAST_DUE_LIST_SEARCH_COMMUNICATION_TYPE_OPTIONS = [
  {
    description: ALL_OPTION,
    label: ALL_OPTION,
    value: ALL_OPTION,
    referenceCode: ALL_OPTION,
  },
  {
    description: 'All Texts',
    label: 'All Texts',
    value: 'AT',
    referenceCode: 'AT',
  },
  {
    description: 'Calls Only',
    label: 'Calls Only',
    value: 'CO',
    referenceCode: 'CO',
  },
  {
    description: 'Enroll Text',
    label: 'Enroll Text',
    value: 'ET',
    referenceCode: 'ET',
  },
  {
    description: TXT_RECEIVED,
    label: TXT_RECEIVED,
    value: 'TR',
    referenceCode: 'TR',
  },
  {
    description: 'Text Sent',
    label: 'Text Sent',
    value: 'TS',
    referenceCode: 'TS',
  },
];

export const PAST_DUE_LIST_SEARCH_ACTIVITY_OPTIONS = [
  {
    description: ALL_OPTION,
    label: ALL_OPTION,
    value: ALL_OPTION,
    referenceCode: ALL_OPTION,
  },
  {
    description: 'Yes',
    label: 'Yes',
    value: 'YES',
    referenceCode: 'Y',
  },
  {
    description: 'No',
    label: 'No',
    value: 'NO',
    referenceCode: 'N',
  },
];

export const PAST_DUE_LIST_SEARCH_CALL_ACTIVITY_TOOLTIP = [
  {
    label: ALL_OPTION_DESC,
    value: ALL_OPTION,
  },
  {
    label: YES_OPTION_DESC,
    value: 'YES',
  },
  {
    label: NO_OPTION_DESC,
    value: 'NO',
  },
];

export const ACCT_ACTIVITY_REF_CODES = {
  CALL_CUSTOMER: 'CALLC',
  CALL_ALTERNATIVE: 'CALLA',
  CALL_REFERENCE: 'CALLR',
  CALL_EMPLOYER: 'CALLE',
};

export const ITEMS_PER_PAGE = 50;
export const ITEMS_PER_PAGE_20 = 20;

export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export enum LOCAL_STORAGE_KEY {
  PAST_DUE_LIST = 'PAST_DUE_LIST',
}

export const LETTER_TYPE = {
  COL: 'COL',
};

export enum TEXT_TEMPLATE_PLACEHOLDER {
  STORE_PHONE = '[[[STOREPHONE]]]',
  DUE_DATE = '[[[DUEDATE]]]',
  CUSTOMER_NAME = '[[[CUSTOMERNAME]]]',
  COWORKER_NAME = '[[[COWORKERNAME]]]',
  CUSTOMER_FIRST_NAME = '[[[CUSTOMERFIRSTNAME]]]',
}

export const getPaymentScheduleValue: any = {
  BIWK: 'Bi-Weekly',
  DAILY: 'Daily',
  MON: 'Monthly',
  NONE: 'Not Given',
  SEMI: 'Semi-Monthly',
  WK: 'Weekly',
};

export const getDaysPaidValue: any = {
  SUN: 'Sunday',
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
  LD: 'Last Day',
  '1N15': '1 & 15',
  '2N16': '2 & 16',
  '3N17': '3 & 17',
  '4N18': '4 & 18',
  '6N20': '6 & 20',
  '7N21': '7 & 21',
  '8N22': '8 & 22',
  '9N23': '9 & 23',
  '10N24': '10 & 24',
  '11N25': '11 & 25',
  '12N26': '12 & 26',
  '13N27': '13 & 27',
  '14N28': '14 & 28',
  '15N30': '15 & 30',
};

export const RECEIPT_TYPE = 'RCP';

export const TEXT_CONVERSATION_CUSTOMER_MESSAGE = 'TWL';

export const TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY = 'COMS';
export const TEXT_CONVERSATION_STORE_SIMS = 'SIMS';
export const TEXT_CONVERSATION_STORE_BAT = 'BAT';
export const TEXT_CONVERSATION_SYSTEM_MESSAGE_OUTBOUND = 'EC';
export const TEXT_CONVERSATION_SYSTEM_MESSAGE_INITIALS_TEXT = 'S';
export const TEXT_CONVERSATION_STORE_MESSAGE_INITIALS_TEXT = 'ST';
export const TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY_TOOLTIP_TEXT =
  'System COMS Text';
export const TEXT_CONVERSATION_SYSTEM_MESSAGE_OUTBOUND_TOOLTIP_TEXT =
  'System EC Text';
export const TEXT_OPTIONS: ActivityLogSearchCriteriaOption[] = [
  {
    label: TXT_RECEIVED,
    value: 'TXTR',
    referenceCode: 'TXTR',
    displaySeq: 16,
    defaultValue: '0',
    description: TXT_RECEIVED,
    descSpanish: '',
  },
  {
    label: 'Text Sent To Phone',
    value: 'TXTS',
    referenceCode: 'TXTS',
    displaySeq: 17,
    defaultValue: '0',
    description: 'Text Sent To Phone',
    descSpanish: '',
  },
  {
    label: 'Text Sent To Phone Failed',
    value: 'TXTSF',
    referenceCode: 'TXTSF',
    displaySeq: 18,
    defaultValue: '0',
    description: 'Text Sent To Phone Failed',
    descSpanish: '',
  },
];

export const CUSTOMER_TAB = 'Customer';
export const CO_CUSTOMER_TAB = 'Co-Customer';

export enum CONTENT_TYPE {
  pdf = 'application/pdf',
  html = 'text/html',
  jpg = 'image/jpg',
  jpeg = 'image/jpeg',
  jpe = 'image/jpe',
  gif = 'image/gif',
  png = 'image/png',
  bmp = 'image/bmp',
}

export const AUTO_SYSTEM_TEXT = 'Auto System Text';

// MAX limit is 50 (from ES)
// limit is how many rows to return
export const WORKED_HISTORY_API_LIMIT = 20;
export const ACTIVITY_LOG_API_LIMIT = 20;
export const PAST_DUE_LIST_API_LIMIT = 20;
export const INITIAL_OFFSET = 0;

export const MESSAGE_STATUS = {
  RECEIVED: 'RECEIVED',
  DELIVERED: 'DELIVERED',
};

export enum CACHED_KEYS {
  TAKE_COMMITMENT_CACHED_KEY = 'commitment-cached-key',
  LOG_ACTIVITY_CACHED_KEY = 'log-activity-cached-key',
  AM_ACTIVITY_LOG_SEARCH_KEY = 'am-activity-log-cached-key',
  PAST_DUE_SEARCH_KEY = 'past-due-list-cached-key',
  EDIT_CUSTOMER_INFORMATION_KEY = 'edit-customer-information-cached-key',
}

export const printLetterOptions = [
  { label: 'None', value: 'NONE' },
  { label: '7 Days', value: '7' },
  { label: '14 Days', value: '14' },
];

export enum Language {
  English = 'english',
  Spanish = 'spanish',
}
