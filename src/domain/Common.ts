export interface State {
  readonly name: string;
  readonly abbreviation: StateAbbreviation;
}
export enum StateAbbreviation {
  AL = 'AL',
  AK = 'AK',
  AZ = 'AZ',
  AR = 'AR',
  CA = 'CA',
  CO = 'CO',
  CT = 'CT',
  DE = 'DE',
  DC = 'DC',
  FL = 'FL',
  GA = 'GA',
  HI = 'HI',
  ID = 'ID',
  IL = 'IL',
  IN = 'IN',
  IA = 'IA',
  KS = 'KS',
  KY = 'KY',
  LA = 'LA',
  ME = 'ME',
  MD = 'MD',
  MA = 'MA',
  MI = 'MI',
  MN = 'MN',
  MS = 'MS',
  MO = 'MO',
  MT = 'MT',
  NE = 'NE',
  NV = 'NV',
  NH = 'NH',
  NJ = 'NJ',
  NM = 'NM',
  NY = 'NY',
  NC = 'NC',
  ND = 'ND',
  OH = 'OH',
  OK = 'OK',
  OR = 'OR',
  PA = 'PA',
  RI = 'RI',
  SC = 'SC',
  SD = 'SD',
  TN = 'TN',
  TX = 'TX',
  UT = 'UT',
  VT = 'VT',
  VA = 'VA',
  WA = 'WA',
  WV = 'WV',
  WI = 'WI',
  WY = 'WY',
  AS = 'AS',
  FM = 'FM',
  GU = 'GU',
  MP = 'MP',
  PW = 'PW',
  PR = 'PR',
  VI = 'VI',
  AE = 'AE',
}

export const usStates: State[] = [
  {
    name: 'Alabama',
    abbreviation: StateAbbreviation.AL,
  },
  {
    name: 'Alaska',
    abbreviation: StateAbbreviation.AK,
  },
  {
    name: 'Arizona',
    abbreviation: StateAbbreviation.AZ,
  },
  {
    name: 'Arkansas',
    abbreviation: StateAbbreviation.AR,
  },
  {
    name: 'California',
    abbreviation: StateAbbreviation.CA,
  },
  {
    name: 'Colorado',
    abbreviation: StateAbbreviation.CO,
  },
  {
    name: 'Connecticut',
    abbreviation: StateAbbreviation.CT,
  },
  {
    name: 'Delaware',
    abbreviation: StateAbbreviation.DE,
  },
  {
    name: 'District of Columbia',
    abbreviation: StateAbbreviation.DC,
  },
  {
    name: 'Florida',
    abbreviation: StateAbbreviation.FL,
  },
  {
    name: 'Georgia',
    abbreviation: StateAbbreviation.GA,
  },
  {
    name: 'Hawaii',
    abbreviation: StateAbbreviation.HI,
  },
  {
    name: 'Idaho',
    abbreviation: StateAbbreviation.ID,
  },
  {
    name: 'Illinois',
    abbreviation: StateAbbreviation.IL,
  },
  {
    name: 'Indiana',
    abbreviation: StateAbbreviation.IN,
  },
  {
    name: 'Iowa',
    abbreviation: StateAbbreviation.IA,
  },
  {
    name: 'Kansas',
    abbreviation: StateAbbreviation.KS,
  },
  {
    name: 'Kentucky',
    abbreviation: StateAbbreviation.KY,
  },
  {
    name: 'Louisiana',
    abbreviation: StateAbbreviation.LA,
  },
  {
    name: 'Maine',
    abbreviation: StateAbbreviation.ME,
  },
  {
    name: 'Maryland',
    abbreviation: StateAbbreviation.MD,
  },
  {
    name: 'Massachusetts',
    abbreviation: StateAbbreviation.MA,
  },
  {
    name: 'Michigan',
    abbreviation: StateAbbreviation.MI,
  },
  {
    name: 'Minnesota',
    abbreviation: StateAbbreviation.MN,
  },
  {
    name: 'Mississippi',
    abbreviation: StateAbbreviation.MS,
  },
  {
    name: 'Missouri',
    abbreviation: StateAbbreviation.MO,
  },
  {
    name: 'Montana',
    abbreviation: StateAbbreviation.MT,
  },
  {
    name: 'Nebraska',
    abbreviation: StateAbbreviation.NE,
  },
  {
    name: 'Nevada',
    abbreviation: StateAbbreviation.NV,
  },
  {
    name: 'New Hampshire',
    abbreviation: StateAbbreviation.NH,
  },
  {
    name: 'New Jersey',
    abbreviation: StateAbbreviation.NJ,
  },
  {
    name: 'New Mexico',
    abbreviation: StateAbbreviation.NM,
  },
  {
    name: 'New York',
    abbreviation: StateAbbreviation.NY,
  },
  {
    name: 'North Carolina',
    abbreviation: StateAbbreviation.NC,
  },
  {
    name: 'North Dakota',
    abbreviation: StateAbbreviation.ND,
  },
  {
    name: 'Ohio',
    abbreviation: StateAbbreviation.OH,
  },
  {
    name: 'Oklahoma',
    abbreviation: StateAbbreviation.OK,
  },
  {
    name: 'Oregon',
    abbreviation: StateAbbreviation.OR,
  },
  {
    name: 'Pennsylvania',
    abbreviation: StateAbbreviation.PA,
  },
  {
    name: 'Rhode Island',
    abbreviation: StateAbbreviation.RI,
  },
  {
    name: 'South Carolina',
    abbreviation: StateAbbreviation.SC,
  },
  {
    name: 'South Dakota',
    abbreviation: StateAbbreviation.SD,
  },
  {
    name: 'Tennessee',
    abbreviation: StateAbbreviation.TN,
  },
  {
    name: 'Texas',
    abbreviation: StateAbbreviation.TX,
  },
  {
    name: 'Utah',
    abbreviation: StateAbbreviation.UT,
  },
  {
    name: 'Vermont',
    abbreviation: StateAbbreviation.VT,
  },
  {
    name: 'Virginia',
    abbreviation: StateAbbreviation.VA,
  },
  {
    name: 'Washington',
    abbreviation: StateAbbreviation.WA,
  },
  {
    name: 'West Virginia',
    abbreviation: StateAbbreviation.WV,
  },
  {
    name: 'Wisconsin',
    abbreviation: StateAbbreviation.WI,
  },
  {
    name: 'Wyoming',
    abbreviation: StateAbbreviation.WY,
  },
  // unincorporated teritories
  {
    name: 'American Samoa',
    abbreviation: StateAbbreviation.AS,
  },
  {
    name: 'Federated States Of Micronesia',
    abbreviation: StateAbbreviation.FM,
  },
  {
    name: 'Guam',
    abbreviation: StateAbbreviation.GU,
  },
  {
    name: 'Northern Mariana Islands',
    abbreviation: StateAbbreviation.MP,
  },
  {
    name: 'Palau',
    abbreviation: StateAbbreviation.PW,
  },
  {
    name: 'Puerto Rico',
    abbreviation: StateAbbreviation.PR,
  },
  {
    name: 'Virgin Islands',
    abbreviation: StateAbbreviation.VI,
  },
  {
    name: 'Armed Forces Europe',
    abbreviation: StateAbbreviation.AE,
  },
];

export function getNameForAbbreviation(
  abbreviation: StateAbbreviation
): string | undefined {
  return usStates.find((state) => state.abbreviation === abbreviation)?.name;
}

export const buildStateOptions = () =>
  usStates.map((state) => {
    return { label: state.abbreviation, value: state.abbreviation };
  });
