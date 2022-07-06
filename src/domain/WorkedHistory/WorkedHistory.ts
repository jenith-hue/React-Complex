import { RACCOLOR } from '@rentacenter/racstrap';

export enum WorkedHistoryStatusLegend {
  LeftMessage = 'LeftMessage',
  Commitment = 'Commitment',
  NoContact = 'NoContact',
  BrokenCommitment = 'BrokenCommitment',
  TextSent = 'TextSent',
  TextReceived = 'TextReceived',
}

export interface WorkedHistoryStatusLegendEntityProps {
  label: string;
  color?: string;
}

export const WorkedHistoryStatusLegendNames: Partial<
  Record<WorkedHistoryStatusLegend, WorkedHistoryStatusLegendEntityProps>
> = {
  [WorkedHistoryStatusLegend.LeftMessage]: {
    label: 'Left Message',
    color: RACCOLOR.TUFTS_BLUE,
  },
  [WorkedHistoryStatusLegend.Commitment]: {
    label: 'Commitment',
    color: RACCOLOR.HONEYCOMB,
  },
  [WorkedHistoryStatusLegend.NoContact]: {
    label: 'No Contact',
    color: RACCOLOR.RICH_LILAC,
  },
  [WorkedHistoryStatusLegend.BrokenCommitment]: {
    label: 'Broken Commitment',
    color: RACCOLOR.PUNCH,
  },
  [WorkedHistoryStatusLegend.TextSent]: {
    label: 'Text Sent',
    color: RACCOLOR.BLUE_MANA,
  },
  [WorkedHistoryStatusLegend.TextReceived]: {
    label: 'Text Received',
    color: RACCOLOR.INTERGALACTIC_COWBOY,
  },
};

export interface LogWorkedHistoryPayload {
  storeNumber: string;
  activityDate: string;
  notes: string;
  callResultRefCode: string;
  commitmentId: string;
  acctActivityRefCode: string;
  daysPastDue: string;
  customerId: string | number;
  phoneNumberDialed: string;
  coWorkerId: string;
  receiptId: string;
  callTime: string;
}
