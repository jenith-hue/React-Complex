import { ProductPermissions } from '../constants/constants';
import { DateRange } from '../domain/PastDueList/Filter';
import {
  GenericObject,
  PastDueCustomerResponse,
} from '../domain/PastDueList/PastDueCustomerList';

export interface Error {
  code: string;
  message: string;
}

export interface APIError {
  traceId: string;
  requestId: string;
  errors: Error[];
}

export interface User {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly route: string;
  readonly employeeId: string;
  readonly permissions: ProductPermissions[];
}

export interface Action<T1 = any, T2 = any> {
  type: T1;
  payload?: T2;
}

export interface ReferenceItem {
  readonly referenceCode: string;
  readonly displaySeq: number;
  readonly defaultValue: string;
  readonly description: string;
  readonly descSpanish?: string;
}

export interface ReferenceResponse {
  referenceKey: ReferenceKeys;
  referenceDetails: ReferenceItem[];
}

export interface ReferenceOption {
  readonly label: string;
  readonly value: string;
  readonly referenceCode: string;
  readonly displaySeq: number;
  readonly defaultValue: string;
  readonly description: string;
  readonly descSpanish?: string;
}

export enum PastDueListSearchCriteriaCommitmentType {
  BEST_TIME_TO_CALL = 'bestTimeToCall',
  COMMITMENT_STATUS = 'commitmentStatus',
  COMMUNICATION_TYPE = 'communicationType',
  CUSTOMERS_WITH_NO_CALL_ACTIVITY = 'customersWithNoCallActivity',
  DAYS_LATE = 'daysLate',
  LANGUAGE = 'language',
}

export enum ReferenceKeys {
  BEST_TIME_TO_CALL = 'CALL_TIME',
  COMMITMENT_STATUS = 'COMMITMENT_STATUS',
  LANGUAGE = 'LANGUAGE',
  ROUTE = 'ROUTE',
  CALL_RESULT = 'CALL_RESULT',
  COMMITMENT_TYPE = 'COMMITMENT_TYPE',
  //TODO: coworker reference is not present
  COWORKER = 'COWORKER',
  // TODO: check if this mapping in correct
  AM_ACTIVITY = 'CALL_RESULT',
  PHONE_TYPE = 'PHONE_TYPE',
  DAYS_LATE = 'DAYS_LATE',
}

export interface CustomerLocationState {
  customer: PastDueCustomerResponse;
  customerIndex: number;
}

export enum AddressType {
  PRIMARY = 'PRIM',
  MAILING = 'MAIL',
}

export interface Address {
  city: string;
  addressType: AddressType;
  postalCode: string;
  latitude: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  addressId: number;
  longitude: string;
}

export interface EmployerReference {
  lengthOfEmploymentYears: string;
  city: string;
  daysPaid: string;
  jobTitle: string;
  postalCode: string;
  employmentBeginDate: string;
  doNotVisit: string;
  employerName: string;
  active: string;
  employerReferenceId: string;
  employerPhoneExtension: string;
  supervisorLastName: string;
  verifiedDate: string;
  doNotCall: string;
  supervisorFirstName: string;
  addressLine1: string;
  employmentEndDate: string;
  addressLine2: string;
  state: string;
  employerPayschedule: string;
  takeHomePay: string;
  workEndTime: string;
  workStartTime: string;
  employerPhoneNumber: string;
  phoneNumber: string;
  bestTimeToCall: string;
  note: string | null;
  lastCallResultDescription?: string;
  communicationsToday?: string;
}

export interface PersonalReference {
  bestTimeToCallDesc: string;
  relationshipTypeDesc: string;
  bestTimeToCall: string;
  firstName: string;
  lastName: string;
  relationLengthYears: string;
  phoneNumber: string;
  relationshipType: string;
  verifiedDate: string;
  doNotCall: string;
  active: string;
  personalReferenceId: string;
  lastCallResultDescription?: string;
  communicationsToday?: string;
  landlordFirstName?: string;
  landlordLastName?: string;
  landlordReferenceId?: string;
}

// TODO: check possible phone types
export enum PhoneType {
  CELL = 'CELL',
  HOME = 'HOME',
  WORK = 'WORK',
}

export interface Phone {
  relationshipTypeDesc?: string;
  personalReferenceId?: string;
  firstName?: string;
  lastName?: string;
  phoneTypeDesc: string;
  callTimeTypeDesc: string;
  bestTimeToCallDesc?: string;
  note: string | null;
  phoneType: PhoneType;
  extension: string;
  phoneNumber: string;
  phoneId: string;
  callTimeType: string;
  primary: string;
  lastCallResultDescription?: string;
  communicationsToday?: string;
}

export interface CoCustomerPhone extends Phone {
  coCustomerFirstName: string;
  coCustomerLastName: string;
  coCustomerId: string;
}

export interface Vehicle {
  vehicleColor: string;
  vehicleYear: string;
  customerVehicleId: number;
  vehPlanExpirationDate: string;
  vehRegState: string;
  vehicleModel: string;
  vehicleVin: string;
  vehFinancedFrom: string;
  vehicleIndex: string;
  vehicleLicensePlate: string;
  vehMonthlyPayment: string;
  vehicleMake: string;
}

export interface LandlordReference {
  leaseTerm: string;
  leaseCompanyName: string;
  leaseLengthYears: string;
  city: string;
  phoneExtension: string;
  postalCode: string;
  active: string;
  landlordLastName: string;
  landlordReferenceId: number;
  monthlyRent: string;
  landlordFirstName: string;
  bestTimeToCall: string;
  leaseLengthMonths: string;
  phoneNumber: string;
  leaseHolderName: string;
  verifiedDate: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
}

export interface CustomerRoute {
  customerRouteId: string;
  routeCode: string;
  routeCodeDesc: string;
  storeId: string;
  storeNumber: string;
  storeRouteId: string;
}

export interface CustomerDetailsResponse {
  customerRoutes?: CustomerRoute[];
  addresses: Address[];
  paymentReminderCallsAllowed: string;
  activeAgreements: string;
  acceptCheck: string;
  source: string;
  employerReferences: EmployerReference[];
  suffix: string;
  phoneSolicitationAllowed: string;
  taxExemptReqDate: string;
  monthlyMortgagePayment: string;
  emailAddress: string;
  printReceiptMethod: string;
  customerType: string;
  skipDate: string;
  verifiedDate: string;
  personalReferences: PersonalReference[];
  oktaCreatedDate: string;
  governmentId: string;
  deDecisionId: string;
  firstName: string;
  preferredContactMethod: string;
  taxId: string;
  salutation: string;
  lastName: string;
  preferredLanguage: string;
  preferredLanguageDesc: string;
  oktaId: string;
  decisionStatus: string;
  phones: Phone[];
  coCustomerPhones: CoCustomerPhone[];
  vehicles: Vehicle[];
  skip?: string;
  mailSolicitationAllowed: string;
  middleInitial: string;
  customerId: string;
  homeStore: string;
  hard?: string;
  mdmId: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  verified: string;
  dateOfBirth: string;
  globalCustomerId: string;
  governmentIdType: string;
  residenceSince: string;
  stolen: string;
  createdDate: string;
  customerSinceDate: string;
  landlordReferences: LandlordReference[];
  createdBy: string;
  emailSolicitationAllowed: string;
  inActiveAgreements: string;
  governmentIdIssuedState: string;
  taxIdType: string;
  remotePaymentAllowed: string;
  pifAgreements: string;
  epoAgreements: string;
  coCustomer: string;
  coCustomerId?: string;
  entPartyId: string;
}

export type StyleClasses<T extends string | number | symbol> = Partial<
  Record<T, string>
>;

export interface CodeAndDescriptionType {
  code: string;
  description: string;
}

export interface Coworker {
  id: string;
  firstName: string;
  lastName: string;
}

export interface WorkedHistoryCommitmentType {
  commitmentDate: string;
  commitmentType: CodeAndDescriptionType;
  commitmentStatus: CodeAndDescriptionType;
  commitmentActualStatus: CodeAndDescriptionType;
  notes: string;
}

export interface WorkedHistoryColorType {
  row: string;
  tip: string;
}

export interface PhoneContact {
  phoneNumber: number;
  firstName: string;
  lastName: string;
  phoneType: GenericObject;
  relationshipType: GenericObject;
}

export interface WorkedHistoryItemType {
  activityDate: string;
  notes: string;
  accountActivityType: CodeAndDescriptionType;
  accountActivitySubType: CodeAndDescriptionType;
  callResultType: CodeAndDescriptionType;
  commitment: WorkedHistoryCommitmentType;
  pastDueDate: string;
  daysLate: string;
  phoneNumberDialed: string;
  phoneContact: PhoneContact;
  relation: string;
  coWorker: Coworker;
  color?: WorkedHistoryColorType;
}

export interface WorkedHistoryResponse {
  // Align with Kurt regarding the type of customerId
  customerId: number | string;
  // worked history is paginated; we need the total field to calculate the number of pages
  total: number;
  workedHistory: WorkedHistoryItemType[];
}

export interface StoreRouteResponse {
  storeNumber: string;
  routeIds: StoreRouteItemType[];
}

export interface StoreRouteItemType {
  routeId: string;
  routeRefCode: string;
  description: string;
}

export interface RouteResponse {
  readonly routeCode: string;
  readonly routeDescription: string;
}

export interface RouteOption {
  readonly label: string;
  readonly value: string;
  readonly routeCode: string;
  readonly routeDescription: string;
}
export interface TextMessage {
  statusUpdateDate: string;
  language: string;
  originator: string;
  message: string;
  messagePhoneNumber: string;
  transactionId: string;
  messageStatus: string;
  phoneNumber: string;
  messageType: string;
  textMessageId: string;
  subType: string;
  messageDate: string;
  messageSid: string;
  employeeId: string;
  tooltipTitle?: string;
  tooltipSubTitle?: string[];
}

export interface TextMessagesResponse {
  messages: TextMessage[];
}

export interface AgreementInfoDaysLate {
  dayslate: string | number;
  count: string | number;
}

export interface AgreementInfoAgreement {
  agreementNumber: string;
  agreementId: string;
  nextDueDate: string;
  contractType: string;
  currentDaysLate: string | number;
  daysLateHistory: AgreementInfoDaysLate[];
}

export interface AgreementInfoStore {
  storeNumber: string;
  city: string;
  state: string;
  agreements: AgreementInfoAgreement[];
}

export interface AgreementInfoResponse {
  customerId: string;
  total: number;
  stores: AgreementInfoStore[];
}

export interface SendFreeTextMessageDTO {
  textMessage: string;
  storeNumber: string | number;
  phoneNumber: string;
  callBackUrl?: string;
  messageType: string;
  useWhatsApp?: string;
  messageSubstitutes?: any;
  callBackParams?: {
    firstName: string;
    lastName: string;
    storeNumber: string | number;
  };
  language: string;
  messageTemplateKey?: string;
  transactionId: string;
}

export interface MessageDTO {
  callBackUrl: string;
  statusUpdateDate: string;
  messageSubstitutes: any;
  language: string;
  originator: string;
  message: string;
  messagePhoneNumber: string;
  transactionId: string;
  messageStatus: string;
  phoneNumber: string;
  messageType: string;
  textMessageId: string;
  callBackParams: {
    coWorkerFirstName?: string;
    coWorkerLastName?: string;
    firstName: string;
    lastName: string;
    storeNumber: string | number;
    employeeId: string | number;
  };
  subType: string;
  messageDate: string;
  messageSid: string;
}

export interface GetMessagesDTO {
  messages: MessageDTO[];
}

export interface TextMessage {
  statusUpdateDate: string;
  message: string;
  phoneNumber: string;
  customerId: string;
  textMessageId: string;
  messageDate: string;
  callBackParams: any;
  isSentByRAC: boolean;
  fullName: string;
  initials: string;
  storeNumber: string;
}

export interface PrintLetterCustomerDetails {
  customerId: number | string;
  globalCustomerId: string;
  firstName: string;
  lastName: string;
  address: PrintLetterAddress;
  rentalAgreementExpiration: string;
  deadlineToReturnProperty: string;
}

export interface PrintLetterAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PrintLetterStoreDetails {
  storeNumber: string;
  name: string;
  phoneNumber: string;
  address: PrintLetterAddress;
}
export interface PrintLetterRequestPayload {
  storeNumber: string;
  customerId: string[];
  coWorkerId: string;
  letterType: string;
}

// this is expected to change (when integrating with the BE request)
export interface PrintLetterResponse {
  letterDetails: PrintLetterDetails;
}

export interface PrintLetterDetails {
  letterType: string;
  dateOfNotice: string;
  customer: PrintLetterCustomerDetails[];
  store: PrintLetterStoreDetails;
}

export interface Option {
  label: string;
  value: string;
}

export interface WorkedHistoryLabel {
  text: string;
  background: string;
}
export interface ActivityPayload {
  storeNumber: string;
  activityDate: string;
  notes: string;
  callResultRefCode: string;
  commitmentId?: number;
  acctActivityRefCode: string;
  daysPastDue?: string;
  customerId: number;
  phoneNumberDialed?: string;
  coWorkerId: string;
  receiptId?: number;
  callTime: string;
}
export interface TakeCommitmentInput {
  storeNumber: string;
  customerId: string;
  coWorkerId: string;
  commitmentType: string;
  amount: string;
  notes: string;
  commitmentDate: string;
}
export enum ActivityLogSearchCriteriaCommitmentType {
  DAYS_LATE = 'daysLate',
  // routes are missing, because are fetched from an another API
  LANGUAGE = 'language',
  COWORKER = 'language',
  AM_ACTIVITY = 'amActivity',
  PHONE_TYPE = 'phoneType',
}

export interface ActivityLogSearchCriteriaResponse {
  readonly referenceCode: string;
  readonly displaySeq: number;
  readonly defaultValue: string;
  readonly description: string;
  readonly descSpanish?: string;
}

export interface ActivityLogSearchCriteriaOption {
  readonly label: string;
  readonly value: string;
  readonly referenceCode: string;
  readonly displaySeq: number;
  readonly defaultValue: string;
  readonly description: string;
  readonly descSpanish?: string;
}

export interface Pagination {
  pageSize: number;
  startingPage: number;
  totalPages: number;
}

export interface PaymentHistory {
  storeNumber: string | number;
  paymentDate: string;
  receiptDate: string;
  receiptId: string | number;
  receiptTransactionType: {
    code: string;
    description: string;
  };
  paymentAmount: string | number;
  nextDueDate: string;
  agreementId: string | number;
  agreementNumber: string | number;
  daysExtension: string | number;
  daysLate: string | number;
  paymentOrigin: {
    code: string;
    description: string;
  };
  paymentMethodType: string[];
  netRentalRevenue: string | number;
  clubPayment: string | number;
}

export interface PaymentHistoryResponse {
  customerId: string | number;
  pageInfo: Pagination;
  payments: PaymentHistory[];
}

export interface CustomerPaymentSummaryResponse {
  customerId: string | number;
  storeNumber: string;
  customerAccount?: CustomerAccountInfo[];
  pastDueSummary?: PastDueSummaryInfo;
  paymentMetrics?: PaymentMetricsInfo;
}

export interface AccountTypeInfo {
  code?: string;
  description?: string;
}
export interface CustomerAccountInfo {
  customerAccountId?: string;
  accountType?: AccountTypeInfo;
  agreementId?: string;
  accountBalance?: string;
  feeAmount?: string;
  promoFreeDays?: string;
}

export interface PastDueSummaryInfo {
  pastDueDate?: string;
  daysPastDue?: string;
  amountDue?: string;
}

export interface PaymentMetricsInfo {
  nsfAndCccbCount?: string;
  totalRevenue?: string;
}

export interface StoreCoworkersResponse {
  firstName: string;
  lastName: string;
  userId: string;
  roleDescription: string;
  roleCode: string;
}

export interface CoworkerOption {
  readonly label: string;
  readonly value: string;
  readonly roleCode: string;
  readonly roleDescription: string;
}

export interface GetCustomerFieldSheetsPayload {
  storeNumber: string;
  workedHistoryType: string;
  customerIds: string[];
}

export interface FieldSheetSection1 {
  route: string;
  store: string;
  delivery: string;
  date: string;
}

export interface FieldSheetSection2 {
  customerColumn: string;
  workColumn: string;
  vehicleColumn: string;
  phoneColumn: string;
}

export interface FieldSheetSection3NSFChargeback {
  nsfTotalNumber: string;
  nsfTotalAmount: string;
  achTotalNumber: string;
  achTotalAmount: string;
  chargebackTotalNumber: string;
  chargebackTotalAmount: string;
}

export interface FieldSheetSection3CustomerCredits {
  promoFreeDays: string;
  suspense: string;
  promo: string;
  sips: string;
  coa: string;
  total: string;
}

export interface FieldSheetSection4CustomerAlerts {
  alertTime: string;
  alertText: string;
}

export interface FieldSheetSection5ProductBalances {
  agreementNumber: string;
  epo: string;
  remainingValue: string;
  paidIn: string;
}

export interface FieldSheetSection6 {
  section6PastDueAgreements: FieldSheetSection6PastDueAgreements;
  section6Inventory: FieldSheetSection7Inventory[];
  section6Payments: FieldSheetSection8Payments[];
  section6Total: FieldSheetSection9Total;
}

export interface FieldSheetSection6PastDueAgreements {
  agreementNumber: string;
  date: string;
  pastDue1to6: string;
  pastDue7to14: string;
  pastDue15Plus: string;
  nextDueDate: string;
  pastDue: string;
}

export interface FieldSheetSection7Inventory {
  department: string;
  subDepartment: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  itemNumber: string;
}

export interface FieldSheetSection8Payments {
  paidOn: string;
  receipt: string;
  rental: string;
  tax: string;
  dueDate: string;
  freeDays: string;
  daysLate: string;
  type: string;
  tendered: string;
  payOffDate: string;
}

export interface FieldSheetSection9Total {
  rent: string;
  ldw: string;
  carriedLate: string;
  deferredRent: string;
  carriedRent: string;
  otherFees: string;
  lateFees: string;
  tax: string;
  total: string;
}

export interface FieldSheetSection10Club {
  club: string;
  activeSince: string;
  dueDate: string;
  pastDue: string;
}

export interface FieldSheetSection11PaymentsLast3 {
  paidOn: string;
  receipt: string;
  amountPaid: string;
  dueDate: string;
  tendered: string;
}

export interface FieldSheetSection12GrandTotalAllPastDue {
  rent: string;
  ldw: string;
  carriedLate: string;
  deferredRent: string;
  carriedRent: string;
  otherFees: string;
  lateFees: string;
  tax: string;
  total: string;
  club: string;
}

export interface FieldSheetSection14Total {
  totalWorkedHistoryDays: string;
  workedHistoryDays: string;
}

export interface FieldSheetSection14WorkedHistory {
  date: string;
  phoneDialed: string;
  workedResult: string;
  employee: string;
  relation: string;
  contactName: string;
}

export interface FieldSheetSection15TotalCommitments {
  total: string;
  open: string;
  honored: string;
  broken: string;
  revised: string;
  brokenPaid: string;
}

export interface FieldSheetSection16CommitmentsSinceDueDate {
  date: string;
  time: string;
  status: string;
  amount: string;
  memo: string;
}

export interface FieldSheet {
  section1: FieldSheetSection1;
  section2: FieldSheetSection2;
  section2Corenter: FieldSheetSection2;
  section3NSFChargeback: FieldSheetSection3NSFChargeback;
  section3CustomerCredits: FieldSheetSection3CustomerCredits;
  section4CustomerAlerts: FieldSheetSection4CustomerAlerts[];
  section5ProductBalances: FieldSheetSection5ProductBalances[];
  section6: FieldSheetSection6[];
  section10Club: FieldSheetSection10Club;
  section11PaymentsLast3: FieldSheetSection11PaymentsLast3[];
  section12GrandTotal: FieldSheetSection12GrandTotalAllPastDue;
  section14Total: FieldSheetSection14Total;
  section14WorkedHistory: FieldSheetSection14WorkedHistory[];
  section15TotalCommitments: FieldSheetSection15TotalCommitments;
  section16CommitmentsSinceDueDate: FieldSheetSection16CommitmentsSinceDueDate[];
}

export interface Agreement {
  agreementNumber: string;
  inventory: [
    {
      brand: string;
      department: string;
      itemNumber: string;
      modelNumber: string;
      serialNumber: string;
      subDepartment: string;
    }
  ];
  nextDueDate: string;
  openDate: string;
  pastDue: string;
  pastDue1to6: string;
  pastDue7to14: string;
  pastDue15Plus: string;
  payments: any[];
  totals: {
    carriedLate: string;
    carriedRent: string;
    deferredRent: string;
    lateFees: string;
    ldw: string;
    otherFees: string;
    rent: string;
    tax: string;
    total: string;
  };
}

export interface FieldSheetResponseCustomer {
  corenter: {
    globalCustomerId: string;
    customerId: string;
    firstName: string;
    middleInitial: string;
    lastName: string;
    suffix: string;
    emailAddress: string;
    customerSinceDate: string;
    phones: [
      {
        callTimeType: { code: string; description: string };
        extension: string;
        note: string;
        phoneNumber: string;
        phoneType: { code: string; description: string };
        primary: string;
      }
    ];
  };
  addresses: [
    {
      addressLine1: string;
      addressLine2: string;
      city: string;
      postalCode: string;
      state: string;
      addressTypeCode: string;
      addressTypeDesc: string;
    }
  ];
  alerts: [
    {
      alertCleared: string;
      alertText: string;
      alertTime: string;
      alertType: string;
    }
  ];
  commitmentInfo: {
    commitmentsSinceDueDate: [
      {
        commitmentDate: string;
        amount: string;
        code: string;
        description: string;
        memo: string;
      }
    ];
    totals: {
      broken: string;
      brokenPaid: string;
      honored: string;
      open: string;
      revised: string;
      total: string;
    };
  };
  currentAgreementInfo: {
    agreements: Agreement[];
  };
  currentClubInfo: {
    activeSince: string;
    clubName: string;
    dueDate: string;
    pastDue: string;
    payments: [
      {
        amountPaid: string;
        dueDate: string;
        paidOn: string;
        paymentMethod: string;
        receiptNumber: string;

        rental: string;
        tax: string;
        freeDays: string;
        daysLate: string;
        tendered: string;
        payoffDate: string;
      }
    ];
  };
  customerCreditInfo: {
    coa: string;
    promo: string;
    promoFreeDays: string;
    sips: string;
    suspense: string;
    total: string;
  };
  customerId: string;
  customerSinceDate: string;
  emailAddress: string;
  employerReferences: [
    {
      active: string;
      employerName: string;
      employerPhoneExtension: string;
      employerPhoneNumber: string;
      employmentBeginDate: string;
      jobTitle: string;
      supervisorFirstName: string;
      supervisorLastName: string;
      workEndTime: string;
      workStartTime: string;
      addressLine1: string | null;
      addressLine2: string | null;
      city: string | null;
      state: string | null;
    }
  ];
  firstName: string;
  globalCustomerId: string;
  grandTotalsAllPastDue: {
    carriedLate: string;
    carriedRent: string;
    club: string;
    deferredRent: string;
    lateFees: string;
    ldw: string;
    otherFees: string;
    rent: string;
    tax: string;
    total: string;
  };
  lastName: string;
  middleInitial: string;
  nsfAndChargebackInfo: {
    achTotalAmount: string;
    achTotalNumber: string;
    chargeBackTotalAmount: string;
    chargeBackTotalNumber: string;
    nsfTotalAmount: string;
    nsfTotalNumber: string;
  };
  pastDueAgreementInfo: [
    {
      agreementNumber: string;
      inventory: [
        {
          brand: string;
          department: string;
          itemNumber: string;
          modelNumber: string;
          serialNumber: string;
          subDepartment: string;
        }
      ];
      nextDueDate: string;
      openDate: string;
      pastDue: string;
      pastDue1to6: string;
      pastDue7to14: string;
      pastDue15Plus: string;
      payments: [
        {
          daysLate: string;
          dueDate: string;
          freeDays: string;
          paidOn: string;
          paymentMethod: string;
          paymentOrigin: string;
          payoffDate: string;
          receiptNumber: string;
          rental: string;
          tax: string;
        }
      ];
      totals: {
        carriedLate: string;
        carriedRent: string;
        deferredRent: string;
        lateFees: string;
        ldw: string;
        otherFees: string;
        rent: string;
        tax: string;
        total: string;
      };
    }
  ];

  pastDueClubInfo: {
    activeSince: string;
    clubName: string;
    dueDate: string;
    pastDue: string;
    payments: [
      {
        amountPaid: string;
        dueDate: string;
        paidOn: string;
        paymentMethod: string;
        receiptNumber: string;
      }
    ];
  };
  phones: [
    {
      callTimeType: { code: string; description: string };
      extension: string;
      note: string;
      phoneNumber: string;
      phoneType: { code: string; description: string };
      primary: string;
    }
  ];
  productBalances: [
    {
      agreementNumber: string;
      epo: string;
      paidIn: string;
      remainingValue: string;
    }
  ];
  route: {
    code: string;
    description: string;
  };
  suffix: string;
  vehicles: [
    {
      vehFinancedFrom: string;
      vehMonthlyPayment: string;
      vehPlanExpirationDate: string;
      vehRegState: string;
      vehicleColor: string;
      vehicleIndex: string;
      vehicleLicensePlate: string;
      vehicleMake: string;
      vehicleModel: string;
      vehicleVin: string;
      vehicleYear: string;
    }
  ];
  workedHistoryInfo: {
    totalWorkedHistoryDays: string;
    workedHistoryDays: string;
    workedItems: [
      {
        callResult: string;
        coWorker: string;
        contact: string;
        phoneNumber: string;
        relation: string;
        workedDate: string;
      }
    ];
  };
}
export interface FieldSheetResponse {
  customersFieldSheet: {
    fieldSheets: [
      {
        customer: FieldSheetResponseCustomer[];
      }
    ];
    storeAddress: {
      addressLine1: string;
      city: string;
      postalCode: string;
      state: string;
    };
    storeName: string;
    storeNumber: string;
  };
}

export interface AssignRoutePayload {
  storeNumber: string;
  routeRefCode: string;
  customerId: number | string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface Alert {
  alertTypeId: string;
  alertTypeDescEn: string;
  alertTypeDescEs?: string | null;
}

export interface AllAlerts {
  alert: Alert[];
}

export interface CustomerAlert {
  alertTypeId: string;
  customerAlertId: string | null;
  alertCleared: number;
  alertText: string | null;
  alertTypeDescEn: string | null;
  alertTypeDescEs?: string | null;
}

export interface AlertPayload {
  alertTypeId: number;
  customerAlertId: string | null | number;
  alertClear: number;
  alertText: string | null;
}

export interface CustomerAlertResponse {
  customeralert: CustomerAlert[];
}

export interface CustomerAlertPayload {
  alertTypes: AlertPayload[];
  customerId: number;
  userId: string;
}

export interface StoreDetail {
  companyName: string;
  companyCode: string;
  storeType: string;
  storeId: string;
  storeNumber: string;
  storeName: string;
  lob: string;
  countryAbb: string;
  stateName: string;
  stateAbb: string;
  city: string;
  zip: string;
  fullZip: string;
  addressLine1: string;
  workPhoneNumber: string;
  latitude: string;
  longitude: string;
}

export interface StoreDetailResponse {
  response: StoreDetail[];
}

export interface ActivityLogFilter {
  activityDateRange?: DateRange;
  phoneType: string[];
  route: string[];
  coWorker: string[];
  activityTimeRange?: DateRange;
  daysPastDue: string[];
  language: string[];
  accountActivityType?: string[];
}

export interface ActivityLogFilterPayload extends ActivityLogFilter {
  storeNumber: string;
}

export const defaultActivityLogFilter = {
  phoneType: [],
  route: [],
  coWorker: [],
  daysPastDue: [],
  language: [],
  accountActivityType: [],
};
export interface CustomerPhoneInstructionPayload {
  customerId: string;
  globalCustomerId: string;
  phones: CustomerPhoneInstruction[];
}

export interface CustomerPhoneInstruction {
  note: string;
  phoneType: PhoneType;
  phoneNumber: string;
  phoneId: string;
  callTimeType: string;
  primary: string;
  extension: string;
}

export interface PhoneCommunication {
  communicationsThisYear: string;
  communicationsToday: string;
  lastCallResult: { code: string; description: string };
  phoneNumber: string;
}

export interface CommunicationsDetailsResponse {
  communicationsPerDayAllowed: string | null;
  communicationsPerYearAllowed: string | null;
  customerId?: string;
  phoneCommunications?: PhoneCommunication[];
  totalCommunicationsThisYear: string;
  totalCommunicationsToday: string;
}

export interface CommunicationsDetails {
  communicationsPerDayAllowed: number | null;
  communicationsPerYearAllowed: number | null;
  customerId?: string;
  phoneCommunications?: PhoneCommunication[];
  totalCommunicationsThisYear: number;
  totalCommunicationsToday: number;
}

export interface StoreConfigsPayload {
  storeNumbers: string[];
  paramKeyNames: string[];
}

export interface StoreConfigsResponse {
  storeNumber: string;
  configDetails: StoreConfigDetails[];
}

export interface StoreConfigDetails {
  paramValue: string;
  paramKeyName: string;
  paramGroupName: string;
  paramCategoryName: string;
  paramKeyId: string;
  paramHierarchy: string;
}

export interface PhoneTypeOption {
  label: string;
  value: string;
  phoneType: string;
}
