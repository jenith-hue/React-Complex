import { RACSelectOption } from '@rentacenter/racstrap';
import { CancelTokenSource } from 'axios';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getTextMessages, sendTextMessage } from '../../api/textMessages';
import {
  CO_CUSTOMER_TAB,
  CUSTOMER_TAB,
  TEXT_CONVERSATION_CUSTOMER_MESSAGE,
  TEXT_CONVERSATION_STORE_BAT,
  TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY,
  TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY_TOOLTIP_TEXT,
  TEXT_CONVERSATION_SYSTEM_MESSAGE_INITIALS_TEXT,
  TEXT_CONVERSATION_SYSTEM_MESSAGE_OUTBOUND,
  TEXT_CONVERSATION_SYSTEM_MESSAGE_OUTBOUND_TOOLTIP_TEXT,
  TEXT_CONVERSATION_STORE_SIMS,
  TEXT_CONVERSATION_STORE_MESSAGE_INITIALS_TEXT,
} from '../../constants/constants';
import {
  CoCustomerPhone,
  CustomerLocationState,
  GetMessagesDTO,
  MessageDTO,
  Phone,
  PhoneType,
  PhoneTypeOption,
  SendFreeTextMessageDTO,
  TextMessage,
} from '../../types/types';
import {
  formatPhoneNumber,
  getLatestItem,
  getSelectedStore,
  pipe,
} from '../../utils/utils';
import {
  useCustomerDetails,
  useCustomerDetailsActions,
} from '../CustomerDetails/CustomerDetailsProvider';
import { useUserStateContext } from '../user/user-contexts';
import { useWorkedHistoryActions } from '../WorkedHistory/WorkedHistoryProvider';

export const AVAILABLE_TABS = [CUSTOMER_TAB, CO_CUSTOMER_TAB];

export const EMPTY_PHONE_OPTION = { label: '', value: '', phoneType: '' };
const CO_CUSTOMER_TAB_INDEX = 1;

const filterByCell = (phones: Phone[]) =>
  // only cell phone types are required
  // TODO: check possible phone types and maybe drop const [phoneType, setPhoneType] = React.useState<string>('');
  phones.filter((phone) => phone.phoneType === PhoneType.CELL);

const mapPhonesToOptions = (phones: Phone[]) =>
  phones.map((phone) => ({
    label: phone.phoneNumber,
    value: phone.phoneId,
    phoneType: phone.phoneType,
  }));

export const getPossiblePhoneOptions = (
  phones: Phone[] | CoCustomerPhone[]
) => {
  return pipe(filterByCell, mapPhonesToOptions)(phones);
};

export interface TextConversationState {
  phoneOptions: RACSelectOption[];
  selectedPhoneOption: PhoneTypeOption;
  fullName: string;
  messages: TextMessage[];
  selectedTab: string;
  isLoading: boolean;
  hasApiError: boolean;
  disabledTabs: number[];
  customerPhones: Phone[];
  coCustomerPhones: Phone[];
  preferredLanguage: string;
  isCommunicationAllowed: boolean;
}

export interface TextConversationDispatchState {
  sendMessage: (message: string) => Promise<void>;
  onPhoneOptionChanged: (id: string) => void;
  onRefresh: () => void;
  setTextConversationSelectedTab: (tab: string) => void;
  updatePhoneOptionsfromEdit: () => void;
}

export const TextConversationStateContext =
  createContext<TextConversationState>({} as TextConversationState);
export const TextConversationDispatchContext =
  createContext<TextConversationDispatchState>(
    {} as TextConversationDispatchState
  );

export const getMessageMetadata = (
  message: MessageDTO,
  details: { firstName: string; lastName: string }
): {
  initials: string;
  fullName: string;
  // eslint-disable-next-line sonarjs/cognitive-complexity
} => {
  if (message.originator === TEXT_CONVERSATION_CUSTOMER_MESSAGE) {
    return {
      initials: `${details.firstName?.[0] || ''}${details.lastName?.[0] || ''}`,
      fullName: `${details.firstName || ''} ${details.lastName || ''}`,
    };
  }
  if (message.originator === TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY) {
    return {
      initials: TEXT_CONVERSATION_SYSTEM_MESSAGE_INITIALS_TEXT,
      fullName: TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY_TOOLTIP_TEXT,
    };
  }
  if (message.originator === TEXT_CONVERSATION_SYSTEM_MESSAGE_OUTBOUND) {
    return {
      initials: TEXT_CONVERSATION_SYSTEM_MESSAGE_INITIALS_TEXT,
      fullName: TEXT_CONVERSATION_SYSTEM_MESSAGE_OUTBOUND_TOOLTIP_TEXT,
    };
  }
  if (
    message.originator === TEXT_CONVERSATION_STORE_SIMS ||
    message.originator === TEXT_CONVERSATION_STORE_BAT
  ) {
    return {
      initials: TEXT_CONVERSATION_STORE_MESSAGE_INITIALS_TEXT,
      fullName: message.callBackParams?.coWorkerFirstName
        ? `Coworker: ${message.callBackParams.coWorkerFirstName || ''} ${
            message.callBackParams.coWorkerLastName || ''
          }`
        : '',
    };
  }
  if (
    message?.callBackParams?.coWorkerFirstName ||
    message?.callBackParams?.coWorkerLastName
  ) {
    return {
      initials: `${message.callBackParams.coWorkerFirstName?.[0] || ''}${
        message.callBackParams.coWorkerLastName?.[0] || ''
      }`,
      fullName: `${message.callBackParams.coWorkerFirstName || ''} ${
        message.callBackParams.coWorkerLastName || ''
      }`,
    };
  }

  return {
    initials: '',
    fullName: '',
  };
};
export const mapGetMessagesDTO = (
  getMessageResponse: GetMessagesDTO,
  customerDetails: { firstName: string; lastName: string }
) => {
  if (!getMessageResponse?.messages?.length) return [];

  return getMessageResponse.messages.map((incomingMessage) => {
    const { initials, fullName } = getMessageMetadata(
      incomingMessage,
      customerDetails
    );
    return {
      statusUpdateDate: incomingMessage.statusUpdateDate,
      message: incomingMessage.message,
      messagePhoneNumber: incomingMessage.messagePhoneNumber,
      customerId: incomingMessage.transactionId,
      textMessageId: incomingMessage.textMessageId,
      messageDate: incomingMessage.messageDate,
      initials: initials,
      fullName: fullName,
      storeNumber: incomingMessage.callBackParams?.storeNumber || '',
      employeeId: incomingMessage.callBackParams?.employeeId || '',
      originator: incomingMessage.originator,
      // BE return phone number with state prefix; we have to drop it
      phoneNumber: incomingMessage.phoneNumber?.substring(1) || '',
      messageStatus: incomingMessage.messageStatus,
    } as TextMessage;
  });
};

export const sortByMessageDate = (messages: TextMessage[]) => {
  if (!messages?.length) return [];

  const sortedMessages = [...messages] as TextMessage[];

  sortedMessages.sort((a, b) => {
    return (
      new Date(a?.messageDate).getTime() - new Date(b?.messageDate).getTime()
    );
  });

  return sortedMessages;
};

export const addIsSentByRACFlag = (messages: TextMessage[]) => {
  if (!messages?.length) return [];

  return messages.map(
    (message) =>
      ({
        ...message,
        isSentByRAC: message.originator !== TEXT_CONVERSATION_CUSTOMER_MESSAGE,
      } as TextMessage)
  );
};

export const addTooltip = (
  messages: TextMessage[],
  isPhoneNumberMasked: boolean
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  if (!messages?.length) return [];

  return messages.map((message) => {
    const tooltipSubTitle = [];
    if (
      ![
        TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY,
        TEXT_CONVERSATION_SYSTEM_MESSAGE_OUTBOUND,
        TEXT_CONVERSATION_STORE_SIMS,
        TEXT_CONVERSATION_STORE_BAT,
      ].includes(message.originator)
    ) {
      if (message.isSentByRAC) {
        if (message.employeeId)
          tooltipSubTitle.push(`ID: ${message.employeeId}`);
        if (message.storeNumber)
          tooltipSubTitle.push(`Store: ${message.storeNumber}`);
      } else {
        tooltipSubTitle.push(
          formatPhoneNumber(message.phoneNumber, isPhoneNumberMasked)
        );
      }
    }

    if (
      [TEXT_CONVERSATION_STORE_SIMS, TEXT_CONVERSATION_STORE_BAT].includes(
        message.originator
      )
    ) {
      tooltipSubTitle.push('Store');
    }
    return {
      ...message,
      tooltipTitle: message.fullName,
      tooltipSubTitle,
    } as TextMessage;
  });
};

export const TextConversationProvider = (props: { children: ReactNode }) => {
  const [phoneOptions, setPhoneOptions] = React.useState<RACSelectOption[]>([]);
  const [selectedPhoneOption, setSelectedPhoneOption] =
    React.useState<PhoneTypeOption>({ label: '', value: '', phoneType: '' });
  const [fullName, setFullName] = React.useState<string>('');
  const [messages, setMessages] = React.useState<TextMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasApiError, setHasApiError] = React.useState<boolean>(false);
  const [disabledTabs, setDisabledTabs] = React.useState<number[]>([]);
  const [preferredLanguage, setCustomerPreferredLanguage] =
    React.useState<string>('');

  const {
    customerDetails: {
      phones,
      firstName,
      lastName,
      customerId,
      preferredLanguageDesc: customerPreferredLanguage,
      entPartyId: customerEntPartyId,
      globalCustomerId,
    },
    coCustomerDetails: {
      firstName: coCustomerFirstName,
      lastName: coCustomerLastName,
      customerId: coCustomerId,
      phones: coCustomerPhones,
      preferredLanguageDesc: coCustomerPreferredLanguage,
      entPartyId: coCustomerEntPartyId,
      globalCustomerId: coCustomerGlobalCustomerId,
    },
    isCommunicationAllowed,
    textConversationSelectedTab,
  } = useCustomerDetails();

  const { setTextConversationSelectedTab, setLastMessage } =
    useCustomerDetailsActions();
  // used to set the callBackParams, when sending a new message
  const { user } = useUserStateContext();

  const location = useLocation<CustomerLocationState>();

  const storeNumber = getSelectedStore();

  const { fetchCommunicationDetailsForCustomer } = useCustomerDetailsActions();
  const { setReloadWorkedHistory } = useWorkedHistoryActions();

  const onFetchTextMessages = async (
    customerOrCoCustomerId: string,
    customerOrCoCustomerEntPartyId: string,
    cancelToken?: CancelTokenSource
  ) => {
    if (!customerOrCoCustomerId) return;
    setHasApiError(false);
    setIsLoading(true);
    getTextMessages(
      customerOrCoCustomerId,
      customerOrCoCustomerEntPartyId,
      cancelToken?.token
    )
      .then((response) => {
        let customerOrCoCustomerDetails = {
          firstName: firstName || '',
          lastName: lastName || '',
        };
        const isPhoneNumberMasked = !isCommunicationAllowed;
        if (textConversationSelectedTab === CO_CUSTOMER_TAB) {
          customerOrCoCustomerDetails = {
            firstName: coCustomerFirstName || '',
            lastName: coCustomerLastName || '',
          };
        }
        const mappedMessages = mapGetMessagesDTO(
          response,
          customerOrCoCustomerDetails
        );

        const messagesWithFlag = addIsSentByRACFlag(mappedMessages);

        const sortedTextMessages = sortByMessageDate(messagesWithFlag);

        const messagesWithTooltip = addTooltip(
          sortedTextMessages,
          isPhoneNumberMasked
        );
        setMessages(messagesWithTooltip);
        setLastMessage(getLatestItem(messagesWithTooltip));
      })
      .catch(() => setHasApiError(true))
      .finally(() => setIsLoading(false));
  };

  const onPhoneOptionChanged = (id: string) => {
    if (!phones?.length) return;
    const selectedPhone = phones.find((phone) => phone.phoneId === id);
    setSelectedPhoneOption({
      label: selectedPhone?.phoneNumber || ' ',
      value: selectedPhone?.phoneId || '',
      phoneType: selectedPhone?.phoneType || '',
    });
  };

  const onTabSelected = (
    customerOrCoCustomerId: string | number | undefined,
    customerOrCoCustomerEntPartyId: string | number | undefined,
    fullName: string,
    phones: Phone[],
    preferredLanguage: string,
    cancelToken?: CancelTokenSource
  ) => {
    if (!phones?.length || !customerOrCoCustomerId) return;
    setMessages([]);
    setLastMessage(undefined);

    const possiblePhoneOptions = getPossiblePhoneOptions(phones);
    setPhoneOptions(possiblePhoneOptions);

    const firstPhoneOption = possiblePhoneOptions?.[0] || EMPTY_PHONE_OPTION;

    setSelectedPhoneOption(firstPhoneOption);

    setFullName(fullName);

    setCustomerPreferredLanguage(preferredLanguage);

    onFetchTextMessages(
      String(customerOrCoCustomerId),
      String(customerOrCoCustomerEntPartyId),
      cancelToken
    );
  };

  useEffect(() => {
    if (textConversationSelectedTab === CUSTOMER_TAB) {
      onTabSelected(
        customerId,
        customerEntPartyId,
        `${firstName || ''} ${lastName || ''}`,
        phones || [],
        customerPreferredLanguage || ''
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textConversationSelectedTab, customerId]);

  useEffect(() => {
    if (textConversationSelectedTab === CO_CUSTOMER_TAB) {
      onTabSelected(
        coCustomerId,
        coCustomerEntPartyId,
        `${coCustomerFirstName || ''} ${coCustomerLastName || ''}`,
        coCustomerPhones || [],
        coCustomerPreferredLanguage || ''
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textConversationSelectedTab, coCustomerId]);

  useEffect(() => {
    if (!coCustomerId) {
      setDisabledTabs([CO_CUSTOMER_TAB_INDEX]);
    } else {
      setDisabledTabs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coCustomerId]);

  const sendMessage = async (message: string) => {
    let customerOrCoCustomerId;
    let firstname = firstName;
    let lastname = lastName;
    let globalcustomerId = globalCustomerId;
    if (textConversationSelectedTab === CUSTOMER_TAB) {
      const customerId =
        location?.state?.customer?.customerId ||
        location?.pathname?.split('/')[3];
      customerOrCoCustomerId = customerId;
    } else {
      customerOrCoCustomerId = coCustomerId;
      firstname = coCustomerFirstName;
      lastname = coCustomerLastName;
      globalcustomerId = coCustomerGlobalCustomerId;
    }
    const payload = {
      textMessage: message,
      storeNumber,
      phoneNumber: selectedPhoneOption.label,
      messageType: '2WAYTXT',
      callBackParams: {
        firstName: firstname,
        lastName: lastname,
        customerId: customerOrCoCustomerId,
        globalCustomerId: globalcustomerId,
        coWorkerFirstName: user?.firstName,
        coWorkerLastName: user?.lastName,
        coWorkerId: user?.id,
        storeNumber,
        employeeId: user?.employeeId,
        // userId: user?.id,
        // email: user?.email,
      },
      language: 'en',
      transactionId: `${customerOrCoCustomerId}`,
    } as SendFreeTextMessageDTO;
    setIsLoading(true);
    await sendTextMessage(payload);

    onRefresh();
  };

  const onRefresh = () => {
    fetchCommunicationDetailsForCustomer(undefined, false);
    setReloadWorkedHistory(true);
    if (textConversationSelectedTab === CO_CUSTOMER_TAB) {
      onFetchTextMessages(String(coCustomerId), String(coCustomerEntPartyId));
    } else {
      const customerId =
        location?.state?.customer?.customerId ||
        location?.pathname?.split('/')[3];
      onFetchTextMessages(customerId, String(customerEntPartyId));
    }
  };

  const updatePhoneOptionsfromEdit = () => {
    if (textConversationSelectedTab === CUSTOMER_TAB) {
      setTextConversationSelectedTab('');
      setTextConversationSelectedTab(CUSTOMER_TAB);
    }
    if (textConversationSelectedTab === CO_CUSTOMER_TAB) {
      setTextConversationSelectedTab('');
      setTextConversationSelectedTab(CO_CUSTOMER_TAB);
    }
  };
  return (
    <TextConversationStateContext.Provider
      value={{
        phoneOptions,
        selectedPhoneOption,
        fullName,
        messages,
        selectedTab: textConversationSelectedTab,
        isLoading,
        hasApiError,
        disabledTabs,
        customerPhones: phones || [],
        preferredLanguage,
        coCustomerPhones: coCustomerPhones || [],
        isCommunicationAllowed,
      }}
    >
      <TextConversationDispatchContext.Provider
        value={{
          sendMessage,
          onPhoneOptionChanged,
          onRefresh,
          setTextConversationSelectedTab,
          updatePhoneOptionsfromEdit,
        }}
      >
        {props.children}
      </TextConversationDispatchContext.Provider>
    </TextConversationStateContext.Provider>
  );
};

export const useTextConversation = () =>
  useContext(TextConversationStateContext);

export const useTextConversationActions = () =>
  useContext(TextConversationDispatchContext);
