import { CancelTokenSource } from 'axios';
import { isEqual, uniqWith } from 'lodash';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { getCancelTokenSource } from '../../api/client';
import {
  getCommunicationDetails,
  getCustomerDetails,
} from '../../api/Customer';
import { CUSTOMER_TAB, MESSAGE_STATUS } from '../../constants/constants';
import {
  CommunicationsDetails,
  CustomerDetailsResponse,
  CustomerLocationState,
  EmployerReference,
  PersonalReference,
  Phone,
  TextMessage,
} from '../../types/types';

// Helps for destructuring, so we don't have to add extra checks
const EmptyCustomerDetails = {
  addresses: [],
  employerReferences: [],
  personalReferences: [],
  landlordReferences: [],
  phones: [],
  coCustomerPhones: [],
};
export interface CustomerDetailsState {
  customerDetails: Partial<CustomerDetailsResponse>;
  coCustomerDetails: Partial<CustomerDetailsResponse>;
  loading?: boolean;
  hasApiError: boolean;
  pastDueDate?: string;
  daysPastDue: string | number;
  amountDue?: string;
  loadingCoCustomer?: boolean;
  hasApiErrorCoCustomer: boolean;
  isCommunicationAllowed: boolean;
  isLogActivityAllowed: boolean;
  textConversationSelectedTab: string;
}

export interface CustomerDetailsDispatchState {
  fetchCustomerDetails: (
    customerId: string,
    cancelToken: CancelTokenSource
  ) => void;
  fetchCommunicationDetailsForCustomer: (
    customerDetailsParam?: CustomerDetailsResponse,
    isCustomer?: boolean
  ) => Promise<void>;
  setTextConversationSelectedTab: (tab: string) => void;
  setLastMessage: (message: TextMessage | undefined) => void;
}

export const CustomerDetailsStateContext = createContext<CustomerDetailsState>(
  {} as CustomerDetailsState
);
export const CustomerDetailsDispatchContext =
  createContext<CustomerDetailsDispatchState>(
    {} as CustomerDetailsDispatchState
  );

export const sortByPrimary = (phones: Phone[]) =>
  phones?.sort((phone) => {
    if (phone.primary === 'Y') return -1;
    return 1;
  });

export const mapCommunicationDetailsToPhones = (
  communicationsDetails: CommunicationsDetails,
  phones: any[],
  extraFields?: any
): any[] => {
  if (!communicationsDetails?.phoneCommunications?.length || !phones?.length)
    return phones || [];

  const { phoneCommunications } = communicationsDetails;
  const extendWithFields = extraFields ? extraFields : {};

  const mappedPhoneNumbers = phones?.map((phone: any) => {
    const communicationDetailsForPhone = phoneCommunications?.find(
      (communication) => communication.phoneNumber === phone.phoneNumber
    );

    return {
      ...phone,
      lastCallResultDescription:
        communicationDetailsForPhone?.lastCallResult?.description || '',
      communicationsToday:
        communicationDetailsForPhone?.communicationsToday || '0',
      ...extendWithFields,
    };
  });

  return sortByPrimary(mappedPhoneNumbers);
};

/*
  Communication is not allowed when:
  - limit per day is reached
  - limit per year is reached
*/
export const checkIfLogActivityIsAllowed = (
  communicationsDetails?: CommunicationsDetails
): boolean => {
  if (!communicationsDetails) return false;
  const {
    communicationsPerDayAllowed,
    communicationsPerYearAllowed,
    totalCommunicationsThisYear,
    totalCommunicationsToday,
  } = communicationsDetails;

  if (
    communicationsPerYearAllowed &&
    totalCommunicationsThisYear >= communicationsPerYearAllowed
  )
    return false;

  if (
    communicationsPerDayAllowed &&
    totalCommunicationsToday >= communicationsPerDayAllowed
  )
    return false;

  return true;
};

/*
  Communication is not allowed when(same as for log activity):
  - limit per day is reached
  - limit per year is reached

  Exception:
  - limit is reached, but customer is the last one to reply
*/
export const checkIfCommunicationAllowed = (
  communicationsDetails?: CommunicationsDetails,
  latestTextMessage?: TextMessage
): boolean => {
  if (
    latestTextMessage &&
    latestTextMessage.messageStatus === MESSAGE_STATUS.RECEIVED
  ) {
    return true;
  }

  return checkIfLogActivityIsAllowed(communicationsDetails);
};

export const CustomerDetailsProvider = (props: { children: ReactNode }) => {
  const [customerDetails, setCustomerDetails] =
    useState<Partial<CustomerDetailsResponse>>(EmptyCustomerDetails);

  const [coCustomerDetails, setCoCustomerDetails] =
    useState<Partial<CustomerDetailsResponse>>(EmptyCustomerDetails);

  const [loading, setLoading] = useState<boolean>();
  const [hasApiError, setHasApiError] = useState(false);
  const [loadingCoCustomer, setLoadingCoCustomer] = useState<boolean>();
  const [hasApiErrorCoCustomer, setHasApiErrorCoCustomer] = useState(false);

  const [pastDueDate, setPastDueDate] = useState('');
  const [daysPastDue, setDaysPastDue] = useState<string | number>('');
  // TODO: connect amount due
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [amountDue, setAmountDue] = useState('');
  const [isCommunicationAllowed, setIsCommunicationAllowed] =
    useState<boolean>(false);

  const [isLogActivityAllowed, setIsLogActivityAllowed] =
    useState<boolean>(false);

  const [communicationDetailsCustomer, setCommunicationDetailsCustomer] =
    useState<CommunicationsDetails>();

  const [lastMessage, setLastMessage] = useState<TextMessage | undefined>();

  /*
  selectedTab has been moved from TextConversationProvider to CustomerDetailsProvider,
  in order to avoid dependency cycle.
  */
  const [textConversationSelectedTab, setTextConversationSelectedTab] =
    useState<string>(CUSTOMER_TAB);

  const location = useLocation<CustomerLocationState>();

  const setStateValuesFromLocation = () => {
    if (location?.state?.customer) {
      const { daysPastDue, pastDueDate } = location.state.customer;

      setPastDueDate(pastDueDate);
      setDaysPastDue(daysPastDue);
    }
  };

  useEffect(() => {
    setIsCommunicationAllowed(
      checkIfCommunicationAllowed(communicationDetailsCustomer, lastMessage)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, communicationDetailsCustomer]);

  useEffect(() => {
    if (!communicationDetailsCustomer || !coCustomerDetails?.customerId) return;

    const phonesWithCommunicationDetails = mapCommunicationDetailsToPhones(
      communicationDetailsCustomer,
      coCustomerDetails.phones || []
    );

    setCoCustomerDetails({
      ...coCustomerDetails,
      phones: phonesWithCommunicationDetails,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communicationDetailsCustomer]);

  useEffect(() => {
    const customerId = location?.state?.customer?.customerId;

    const urlCustomerId = location?.pathname?.split('/')[3];

    if (!customerId && !urlCustomerId) return;
    setIsCommunicationAllowed(false);
    setIsLogActivityAllowed(false);
    const cancelToken: CancelTokenSource = getCancelTokenSource();
    fetchCustomerDetails(customerId || urlCustomerId, cancelToken);
    setStateValuesFromLocation();
    return () => {
      cancelToken.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  /*
    Stores the response into state (communicationDetailsCustomer)
    and extracts communication details by phone for customer, reference and empoyer.
    The communication details for coCustomer are handled in a useEffect.
  */
  const fetchCommunicationDetailsForCustomer = async (
    customerDetailsParam?: CustomerDetailsResponse,
    isCustomer?: boolean
  ) => {
    try {
      const customerDetailsToUse = customerDetailsParam
        ? customerDetailsParam
        : isCustomer
        ? customerDetails
        : coCustomerDetails;

      if (!customerDetailsToUse?.customerId) return;
      const response = await getCommunicationDetails(
        customerDetailsToUse?.customerId
      );
      const {
        communicationsPerDayAllowed,
        communicationsPerYearAllowed,
        totalCommunicationsThisYear,
        totalCommunicationsToday,
      } = response;
      const communicationDetailsWithNumbers = {
        ...response,
        communicationsPerDayAllowed: Number(communicationsPerDayAllowed),
        communicationsPerYearAllowed: Number(communicationsPerYearAllowed),
        totalCommunicationsThisYear: Number(totalCommunicationsThisYear),
        totalCommunicationsToday: Number(totalCommunicationsToday),
      };
      setCommunicationDetailsCustomer(communicationDetailsWithNumbers);

      setIsLogActivityAllowed(
        checkIfLogActivityIsAllowed(communicationDetailsWithNumbers)
      );

      const phonesWithCommunicationDetails = mapCommunicationDetailsToPhones(
        communicationDetailsWithNumbers,
        customerDetailsToUse?.phones || []
      ) as Phone[];

      let personalReferencesWithCommunicationDetails =
        mapCommunicationDetailsToPhones(
          communicationDetailsWithNumbers,
          customerDetailsToUse?.personalReferences || []
        ) as PersonalReference[];

      /*
      Landlord and personal references are mapped into one array:
        personalReferences: [
          ...personalReferencesWithCommunicationDetails,
          ...landLordReferencesWithCommunicationDetails,
        ],
        Which under certain circumstances leads to duplicate values.
        (e.g. when this function - fetchCommunicationDetailsForCustomer - is rerun).
        In order to avoid this situation, we are filtering out those reference objects which do not have
        personalReferenceId. 
       */
      personalReferencesWithCommunicationDetails =
        personalReferencesWithCommunicationDetails.filter(
          (reference) => reference.personalReferenceId
        );
      const landLordReferencesWithCommunicationDetails =
        mapCommunicationDetailsToPhones(
          communicationDetailsWithNumbers,
          customerDetailsToUse?.landlordReferences || [],
          {
            relationshipTypeDesc: 'Landlord',
          }
        ) as PersonalReference[];

      const employerWithCommunicationDetails = mapCommunicationDetailsToPhones(
        communicationDetailsWithNumbers,
        customerDetailsToUse.employerReferences || []
      ) as EmployerReference[];

      const details = {
        ...customerDetailsToUse,
        phones: phonesWithCommunicationDetails,
        personalReferences: [
          ...personalReferencesWithCommunicationDetails,
          ...landLordReferencesWithCommunicationDetails,
        ],
        employerReferences: employerWithCommunicationDetails,
      };

      const coCustomerdetails: any = {
        ...customerDetailsToUse,
        phones: uniqWith(
          [
            ...phonesWithCommunicationDetails,
            ...personalReferencesWithCommunicationDetails,
          ],
          isEqual
        ),
        personalReferences: personalReferencesWithCommunicationDetails,
        employerReferences: employerWithCommunicationDetails,
      };
      if (isCustomer) {
        setCustomerDetails(details);
      }
      setCoCustomerDetails(coCustomerdetails);
    } catch {
      setIsCommunicationAllowed(false);
      setIsLogActivityAllowed(false);
    }
  };

  const fetchCustomerDetails = (
    customerId: string,
    cancelToken: CancelTokenSource
  ) => {
    setHasApiError(false);
    setLoading(true);
    setCustomerDetails(EmptyCustomerDetails);
    setCoCustomerDetails(EmptyCustomerDetails);
    getCustomerDetails(customerId, cancelToken.token)
      .then(async (response) => {
        response.employerReferences =
          response.employerReferences?.map((employerRef) => ({
            ...employerRef,
            phoneNumber: employerRef.employerPhoneNumber,
          })) || [];
        setCustomerDetails(response);
        if (response.coCustomerId) {
          await fetchCoCustomerDetails(response.coCustomerId, cancelToken);
        }
        await fetchCommunicationDetailsForCustomer(response, true);
      })
      .catch(() => !cancelToken.token.reason && setHasApiError(true))
      .finally(() => !cancelToken.token.reason && setLoading(false));
  };

  const fetchCoCustomerDetails = (
    customerId: string,
    cancelToken: CancelTokenSource
  ) => {
    setCoCustomerDetails(EmptyCustomerDetails);
    setHasApiErrorCoCustomer(false);
    setLoadingCoCustomer(true);
    getCustomerDetails(customerId, cancelToken.token)
      .then(async (response) => {
        setCoCustomerDetails(response);
        await fetchCommunicationDetailsForCustomer(response, false);
      })
      .catch(() => !cancelToken.token.reason && setHasApiErrorCoCustomer(true))
      .finally(() => !cancelToken.token.reason && setLoadingCoCustomer(false));
  };

  return (
    <CustomerDetailsStateContext.Provider
      value={{
        customerDetails,
        coCustomerDetails,
        loading,
        hasApiError,
        pastDueDate,
        daysPastDue,
        amountDue,
        loadingCoCustomer,
        hasApiErrorCoCustomer,
        isCommunicationAllowed,
        isLogActivityAllowed,
        textConversationSelectedTab,
      }}
    >
      <CustomerDetailsDispatchContext.Provider
        value={{
          fetchCustomerDetails,
          fetchCommunicationDetailsForCustomer,
          setTextConversationSelectedTab,
          setLastMessage,
        }}
      >
        {props.children}
      </CustomerDetailsDispatchContext.Provider>
    </CustomerDetailsStateContext.Provider>
  );
};

export const useCustomerDetails = () => useContext(CustomerDetailsStateContext);

export const useCustomerDetailsActions = () =>
  useContext(CustomerDetailsDispatchContext);
