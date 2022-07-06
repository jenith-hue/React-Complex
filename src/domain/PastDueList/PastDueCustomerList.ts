import { RACCOLOR } from '@rentacenter/racstrap';

export enum PastDueListStatusLegend {
  FirstPaymentDefault = 'firstPaymentDefault',
  SecondPaymentDefault = 'secondPaymentDefault',
  LeftMessage = 'LeftMessage',
  Commitment = 'Commitment',
  NoContact = 'NoContact',
  BrokenCommitment = 'BrokenCommitment',
  TextSent = 'TextSent',
  TextReceived = 'TextReceived',
}

export interface PastDueListStatusLegendEntityProps {
  label: string;
  color?: string;
}

export const PastDueListStatusLegendNames: Partial<
  Record<PastDueListStatusLegend, PastDueListStatusLegendEntityProps>
> = {
  [PastDueListStatusLegend.FirstPaymentDefault]: {
    label: '*First Payment Defaults',
  },
  [PastDueListStatusLegend.SecondPaymentDefault]: {
    label: '**Second Payment Defaults',
  },
  [PastDueListStatusLegend.LeftMessage]: {
    label: 'Left Message',
    color: RACCOLOR.TUFTS_BLUE,
  },
  [PastDueListStatusLegend.Commitment]: {
    label: 'Commitment',
    color: RACCOLOR.HONEYCOMB,
  },
  [PastDueListStatusLegend.NoContact]: {
    label: 'No Contact',
    color: RACCOLOR.RICH_LILAC,
  },
  [PastDueListStatusLegend.BrokenCommitment]: {
    label: 'Broken Commitment',
    color: RACCOLOR.PUNCH,
  },
  [PastDueListStatusLegend.TextSent]: {
    label: 'Text Sent',
    color: RACCOLOR.BLUE_MANA,
  },
  [PastDueListStatusLegend.TextReceived]: {
    label: 'Text Received',
    color: RACCOLOR.INTERGALACTIC_COWBOY,
  },
};

export interface GenericObject {
  code: string;
  description: string;
}

export interface RouteObject {
  code: string;
  description: string;
  routeCode?: string;
  routeDescription?: string;
}

export interface Commitment {
  commitmentDate: string;
  commitmentStatus: GenericObject;
  commitmentType: GenericObject;
  commitmentActualStatus: GenericObject;
  notes?: string;
  commitmentNotes?: string;
  commitmentAmount?: string;
}

export interface PastDueCustomerResponse {
  readonly customerId: string;
  readonly globalCustomerId: string;
  readonly customerFirstName: string;
  readonly customerLastName: string;
  readonly daysPastDue: string;
  readonly languageRef: string;
  route: RouteObject;
  readonly commitment: Commitment;
  readonly callResultType: GenericObject;
  readonly accountActivityType: GenericObject;
  readonly accountActivitySubType: GenericObject;
  readonly activeAgreementCount: string;
  readonly myStoreAgreementCount: string;
  readonly nsfChargebackAmount: string;
  readonly communicationsTotal: string;
  readonly communicationsToday: string;
  readonly autoPayFlag: string;
  readonly sentLetterFlag: string;
  readonly skip: string;
  readonly stolen: string;
  readonly hard: string;
  readonly firstPaymentDefault: string;
  readonly secondPaymentDefault: string;
  readonly pastDueDate: string;
  readonly letterType: GenericObject;
}

export const getFilterByLabel = (label: string) => {
  return (
    Object.entries(PastDueListStatusLegendNames).filter(
      (item) => item[1]?.label === label
    )[0][0] || ''
  );
};
