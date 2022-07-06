/* eslint-disable sonarjs/no-identical-functions */
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { getFieldSheets } from '../../api/Customer';
import { printLetterOptions } from '../../constants/constants';
import {
  Agreement,
  FieldSheet,
  FieldSheetResponseCustomer,
  FieldSheetSection1,
  FieldSheetSection10Club,
  FieldSheetSection11PaymentsLast3,
  FieldSheetSection12GrandTotalAllPastDue,
  FieldSheetSection14Total,
  FieldSheetSection14WorkedHistory,
  FieldSheetSection15TotalCommitments,
  FieldSheetSection16CommitmentsSinceDueDate,
  FieldSheetSection2,
  FieldSheetSection3CustomerCredits,
  FieldSheetSection3NSFChargeback,
  FieldSheetSection4CustomerAlerts,
  FieldSheetSection5ProductBalances,
  FieldSheetSection6,
  FieldSheetSection6PastDueAgreements,
  FieldSheetSection7Inventory,
  FieldSheetSection8Payments,
  FieldSheetSection9Total,
  GetCustomerFieldSheetsPayload,
} from '../../types/types';
import {
  formatDate,
  formatDateString,
  formatMoney,
  formatPhoneNumber,
  formatStringDateHoursAndMinutes,
  getSelectedStore,
  orderByFieldAndValue,
} from '../../utils/utils';

export interface FieldSheetsState {
  fieldSheets: FieldSheet[];
  isLoading: boolean;
  hasApiError: boolean;
}

export interface FieldSheetsDispatchState {
  onFetchFieldSheets: (days: string, selectedCustomerIds: string[]) => void;
  setHasApiError: (value: boolean) => void;
}

export const FieldSheetsStateContext = createContext<FieldSheetsState>(
  {} as FieldSheetsState
);

export const FieldSheetsDispatchStateContext =
  createContext<FieldSheetsDispatchState>({} as FieldSheetsDispatchState);

const mapSection1 = (
  customer: FieldSheetResponseCustomer,
  storeName: string,
  storeNumber: string
): FieldSheetSection1 => {
  const customerAddress = customer.addresses?.find(
    (address) => address.addressTypeCode === 'PRIM'
  );
  const deliveryAddress = `${customerAddress?.addressLine1 || ''} 
  ${customerAddress?.city || ''} 
  ${customerAddress?.state || ''} 
  ${customerAddress?.postalCode || ''}`;

  const store = `${storeName || ''} 
  ${storeNumber || ''}`;

  return {
    route: customer.route.description,
    store: store,
    delivery: deliveryAddress,
    date: formatDate(new Date()),
  };
};

const mapSection2 = (
  customer: FieldSheetResponseCustomer
  // eslint-disable-next-line sonarjs/cognitive-complexity
): FieldSheetSection2 => {
  const customerSinceDateFormatted = formatDateString(
    customer.customerSinceDate
  );
  let customerSinceString = '';
  let customerAddress = '';

  if (customerSinceDateFormatted) {
    customerSinceString = `Customer since: ${customerSinceDateFormatted}`;
  }

  const primaryAddress = customer.addresses?.find(
    (address) => address.addressTypeCode === 'PRIM'
  );
  if (primaryAddress) {
    customerAddress = `${primaryAddress?.addressLine1 || ''} ${
      primaryAddress?.addressLine2 || ''
    } \n ${primaryAddress.city || ''} ${primaryAddress.state || ''} \n ${
      primaryAddress.postalCode || ''
    }`;
  }
  const customerColumn = `${customerSinceString}\n${customer.firstName || ''} ${
    customer.lastName || ''
  }\n ${customerAddress}`;

  const activeEmployer = customer.employerReferences?.find(
    (employer) => employer.active && employer.active !== 'N'
  );

  const employerName = activeEmployer?.employerName;
  const employerPhoneNumber = formatPhoneNumber(
    activeEmployer?.employerPhoneNumber || ''
  );
  const employerAddressLine1 = activeEmployer?.addressLine1 || '';
  const employerAddressLine2 = activeEmployer?.addressLine2 || '';

  const employerCity = activeEmployer?.city || '';
  const employerState = activeEmployer?.state || '';
  let workColumn = `${employerName}\n${employerAddressLine1}${employerAddressLine2}\n${employerCity}, ${employerState}\n${employerPhoneNumber}\nShift: ${
    activeEmployer?.workStartTime || ''
  } - ${activeEmployer?.workEndTime || ''}\n`;

  if (!activeEmployer) workColumn = '';

  const phonesOrderedByPrimary = orderByFieldAndValue(
    'Y',
    'primary',
    customer.phones
  );
  const phoneColumn =
    phonesOrderedByPrimary?.map(
      (phone) => `${formatPhoneNumber(phone.phoneNumber)}
    ${
      phone.callTimeTypeDesc
        ? 'Best time to call:\n Call in ' + phone.callTimeTypeDesc
        : ''
    }\n\n`
    ) || [];
  return {
    customerColumn,
    workColumn,
    vehicleColumn: '',
    phoneColumn: phoneColumn.join(' '),
  };
};

const mapSection2Corenter = (
  customer: FieldSheetResponseCustomer
  // eslint-disable-next-line sonarjs/cognitive-complexity
): FieldSheetSection2 => {
  const { corenter } = customer;
  if (!corenter) {
    return {
      customerColumn: '',
      workColumn: '',
      vehicleColumn: '',
      phoneColumn: '',
    };
  }
  const customerSinceDateFormatted = formatDateString(
    corenter.customerSinceDate
  );
  let customerSinceString = '';

  if (customerSinceDateFormatted) {
    customerSinceString = `Customer since: ${customerSinceDateFormatted}`;
  }
  const customerColumn = `${customerSinceString}\n${corenter.firstName || ''} ${
    corenter.lastName || ''
  }`;

  const workColumn = '';

  const phonesOrderedByPrimary = orderByFieldAndValue(
    'Y',
    'primary',
    corenter.phones
  );
  const phoneColumn =
    phonesOrderedByPrimary?.map(
      (phone) => `${formatPhoneNumber(phone.phoneNumber)}
    ${
      phone.callTimeTypeDesc
        ? 'Best time to call:\n Call in ' + phone.callTimeTypeDesc
        : ''
    }\n\n`
    ) || [];
  return {
    customerColumn,
    workColumn,
    vehicleColumn: '',
    phoneColumn: phoneColumn.join(' '),
  };
};

const mapSection3 = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection3NSFChargeback => {
  const {
    nsfTotalAmount,
    nsfTotalNumber,
    achTotalAmount,
    achTotalNumber,
    chargeBackTotalAmount: chargebackTotalAmount,
    chargeBackTotalNumber: chargebackTotalNumber,
  } = customer?.nsfAndChargebackInfo || {};

  return {
    nsfTotalAmount: formatMoney(nsfTotalAmount),
    nsfTotalNumber,
    achTotalAmount: formatMoney(achTotalAmount),
    achTotalNumber,
    chargebackTotalAmount: formatMoney(chargebackTotalAmount),
    chargebackTotalNumber,
  };
};

const mapSection3CustomerCredit = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection3CustomerCredits => {
  const { suspense, promo, sips, promoFreeDays, coa, total } =
    customer?.customerCreditInfo || {};

  return { suspense, promo, sips, promoFreeDays, coa, total };
};

const mapSection4Alerts = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection4CustomerAlerts[] => {
  const activeAlerts =
    customer.alerts?.filter((alert) => alert.alertCleared !== '1') || [];

  return activeAlerts.map((alert) => ({
    alertTime: formatDateString(alert.alertTime) || '',
    alertText: alert.alertText || alert.alertType || '',
  }));
};

const mapSection5ProductBalances = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection5ProductBalances[] => {
  return (
    customer?.productBalances?.map((balance) => ({
      agreementNumber: balance.agreementNumber,
      epo: formatMoney(balance.epo),
      paidIn: formatMoney(balance.paidIn),
      remainingValue: formatMoney(balance.remainingValue),
    })) || []
  );
};

const mapSection6PastDueAgreements = (
  agreement: Agreement
): FieldSheetSection6PastDueAgreements => {
  return {
    agreementNumber: agreement.agreementNumber || '',
    date: formatDateString(agreement.openDate),
    pastDue1to6: agreement.pastDue1to6 || '',
    pastDue7to14: agreement.pastDue7to14 || '',
    pastDue15Plus: agreement.pastDue15Plus || '',
    nextDueDate: formatDateString(agreement.nextDueDate),
    pastDue: agreement.pastDue || '',
  };
};

const mapSection7Inventory = (
  agreement: Agreement
): FieldSheetSection7Inventory[] => {
  return (
    agreement?.inventory?.map((inv) => ({
      ...inv,
    })) || []
  );
};

const mapSection8Payments = (
  agreement: Agreement
): FieldSheetSection8Payments[] => {
  return (
    agreement?.payments?.map((payment) => ({
      paidOn: formatDateString(payment.paidOn) || '',
      receipt: payment.receiptNumber || '',
      rental: formatMoney(payment.rental) || '',
      tax: formatMoney(payment.tax) || '',
      dueDate: formatDateString(payment.dueDate) || '',
      freeDays: payment.freeDays || '0',
      daysLate: payment.daysLate || '0',
      type: payment.paymentOrigin || '',
      tendered: payment.paymentMethod || '',
      payOffDate: payment.payoffDate || '',
    })) || []
  );
};

const mapSection9Total = (agreement: Agreement): FieldSheetSection9Total => {
  return {
    carriedLate: formatMoney(agreement.totals?.carriedLate),
    carriedRent: formatMoney(agreement.totals?.carriedRent),
    deferredRent: formatMoney(agreement.totals?.deferredRent),
    lateFees: formatMoney(agreement.totals?.lateFees),
    ldw: formatMoney(agreement.totals?.ldw),
    otherFees: formatMoney(agreement.totals?.otherFees),
    rent: formatMoney(agreement.totals?.rent),
    tax: formatMoney(agreement.totals?.tax),
    total: formatMoney(agreement.totals?.total),
  };
};

const mapSection6 = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection6[] => {
  return (
    customer?.pastDueAgreementInfo?.map((agreement) => ({
      section6PastDueAgreements: mapSection6PastDueAgreements(agreement),
      section6Inventory: mapSection7Inventory(agreement),
      section6Payments: mapSection8Payments(agreement),
      section6Total: mapSection9Total(agreement),
    })) || []
  );
};
const mapSection10Club = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection10Club => {
  return {
    activeSince: formatDateString(customer.pastDueClubInfo?.activeSince) || '',
    club: customer.pastDueClubInfo?.clubName || '',
    dueDate: formatDateString(customer.pastDueClubInfo?.dueDate) || '',
    pastDue: customer.pastDueClubInfo?.pastDue || '',
  };
};

const mapSection11Payments = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection11PaymentsLast3[] => {
  return (
    customer?.pastDueClubInfo?.payments?.map((payment) => ({
      amountPaid: formatMoney(payment.amountPaid),
      dueDate: formatDateString(payment.dueDate) || '',
      paidOn: formatDateString(payment.paidOn) || '',
      receipt: payment.receiptNumber || '',
      tendered: payment.paymentMethod || '',
    })) || []
  );
};

const mapSection12GrandTotal = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection12GrandTotalAllPastDue => {
  return {
    carriedLate: formatMoney(customer?.grandTotalsAllPastDue?.carriedLate),
    carriedRent: formatMoney(customer?.grandTotalsAllPastDue?.carriedRent),
    deferredRent: formatMoney(customer?.grandTotalsAllPastDue?.deferredRent),
    lateFees: formatMoney(customer?.grandTotalsAllPastDue?.lateFees),
    ldw: formatMoney(customer?.grandTotalsAllPastDue?.ldw),
    otherFees: formatMoney(customer?.grandTotalsAllPastDue?.otherFees),
    rent: formatMoney(customer?.grandTotalsAllPastDue?.rent),
    tax: formatMoney(customer?.grandTotalsAllPastDue?.tax),
    total: formatMoney(customer?.grandTotalsAllPastDue?.total),
    club: formatMoney(customer?.grandTotalsAllPastDue?.club),
  };
};

const mapSection14TotalWorkedHistory = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection14Total => {
  const workedHistoryLabel =
    printLetterOptions.find(
      (option) =>
        option.value === customer?.workedHistoryInfo?.workedHistoryDays
    )?.label || '';

  return {
    totalWorkedHistoryDays:
      customer?.workedHistoryInfo?.totalWorkedHistoryDays || '0',
    workedHistoryDays: workedHistoryLabel,
  };
};

const mapSection14WorkedHistory = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection14WorkedHistory[] => {
  return customer.workedHistoryInfo?.workedItems?.map((item) => ({
    date: formatDateString(item.workedDate),
    workedResult: item.callResult || '',
    employee: item.coWorker || '',
    contactName: item.contact || '',
    phoneDialed: item.phoneNumber || '',
    relation: item.relation || '',
  }));
};

const mapSection15TotalCommitments = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection15TotalCommitments => {
  return {
    broken: customer?.commitmentInfo?.totals?.broken || '0',
    brokenPaid: customer?.commitmentInfo?.totals?.brokenPaid || '0',
    honored: customer?.commitmentInfo?.totals?.honored || '0',
    open: customer?.commitmentInfo?.totals?.open || '0',
    revised: customer?.commitmentInfo?.totals?.revised || '0',
    total: customer?.commitmentInfo?.totals?.total || '0',
  };
};

const mapSection16Commitments = (
  customer: FieldSheetResponseCustomer
): FieldSheetSection16CommitmentsSinceDueDate[] => {
  return (
    customer?.commitmentInfo?.commitmentsSinceDueDate?.map((commitment) => ({
      date: formatDateString(commitment.commitmentDate),
      time: formatStringDateHoursAndMinutes(commitment.commitmentDate),
      status: commitment.description || '',
      amount: formatMoney(commitment.amount),
      memo: commitment.memo || '',
    })) || []
  );
};
const FieldSheetsProvider = (props: { children: ReactNode }) => {
  const [fieldSheets, setFieldSheets] = useState<FieldSheet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasApiError, setHasApiError] = useState<boolean>(false);

  const onFetchFieldSheets = async (days: string, customerIds: string[]) => {
    try {
      setFieldSheets([]);
      setIsLoading(true);
      setHasApiError(false);
      const payload = {
        storeNumber: getSelectedStore(),
        workedHistoryType: days,
        customerIds,
      } as GetCustomerFieldSheetsPayload;
      const response = await getFieldSheets(payload);
      const storeName = response.customersFieldSheet?.storeName;
      const storeNumber = response.customersFieldSheet?.storeNumber;
      const mappedFieldSheets =
        response.customersFieldSheet?.fieldSheets[0]?.customer.map(
          (sheet: any) =>
            ({
              section1: mapSection1(
                sheet,
                storeName,
                storeNumber
              ) as FieldSheetSection1,
              section2: mapSection2(sheet) as FieldSheetSection2,
              section2Corenter: mapSection2Corenter(
                sheet
              ) as FieldSheetSection2,
              section3NSFChargeback: mapSection3(
                sheet
              ) as FieldSheetSection3NSFChargeback,
              section3CustomerCredits: mapSection3CustomerCredit(
                sheet
              ) as FieldSheetSection3CustomerCredits,
              section4CustomerAlerts: mapSection4Alerts(
                sheet
              ) as FieldSheetSection4CustomerAlerts[],
              section5ProductBalances: mapSection5ProductBalances(
                sheet
              ) as FieldSheetSection5ProductBalances[],
              section6: mapSection6(sheet) as FieldSheetSection6[],
              section10Club: mapSection10Club(sheet) as FieldSheetSection10Club,
              section11PaymentsLast3: mapSection11Payments(
                sheet
              ) as FieldSheetSection11PaymentsLast3[],
              section12GrandTotal: mapSection12GrandTotal(
                sheet
              ) as FieldSheetSection12GrandTotalAllPastDue,
              section14Total: mapSection14TotalWorkedHistory(
                sheet
              ) as FieldSheetSection14Total,
              section14WorkedHistory: mapSection14WorkedHistory(
                sheet
              ) as FieldSheetSection14WorkedHistory[],
              section15TotalCommitments: mapSection15TotalCommitments(
                sheet
              ) as FieldSheetSection15TotalCommitments,
              section16CommitmentsSinceDueDate: mapSection16Commitments(
                sheet
              ) as FieldSheetSection16CommitmentsSinceDueDate[],
            } as FieldSheet)
        ) || [];

      setFieldSheets(mappedFieldSheets);
    } catch {
      setHasApiError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FieldSheetsStateContext.Provider
      value={{
        isLoading,
        hasApiError,
        fieldSheets,
      }}
    >
      <FieldSheetsDispatchStateContext.Provider
        value={{
          onFetchFieldSheets,
          setHasApiError,
        }}
      >
        {props.children}
      </FieldSheetsDispatchStateContext.Provider>
    </FieldSheetsStateContext.Provider>
  );
};

export const useFieldSheetsActions = () =>
  useContext(FieldSheetsDispatchStateContext);

export const useFieldSheets = () => useContext(FieldSheetsStateContext);

export default FieldSheetsProvider;
