export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Filter {
  bestTimeToCall: string[];
  commitmentDateRange?: DateRange;
  route?: string;
  includeAutoPay: string;
  daysPastDue: string[];
  //customersWithCallActivity?: string;
  commitmentStatus: string[];
  language: string[];
  communicationType: string[];
  pastDueDateRange?: DateRange;
  customersWithActivity?: string;
}

export interface FilterPayload extends Filter {
  storeNumber: string;
}

export const defaultFilter = {
  bestTimeToCall: [],
  storeNumber: '',
  includeAutoPay: 'Y',
  daysPastDue: [],
  commitmentStatus: [],
  language: [],
  communicationType: [],
};
