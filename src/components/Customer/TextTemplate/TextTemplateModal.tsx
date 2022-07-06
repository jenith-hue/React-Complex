import { makeStyles, RACModal } from '@rentacenter/racstrap';
import { RACButton } from '@rentacenter/racstrap';
import React, { useState, useEffect } from 'react';
import { capitalize } from 'lodash';
import { CategoryList } from './CategoryList';
import { QuickPhase } from './QuickPhase';
import { getTextTemplates } from '../../../api/Customer';
import {
  QuickResponse,
  TextTemplate,
} from '../../../domain/TextConversation/TextTemplate';
import { useTextConversationActions } from '../../../context/TextConversationProvider/TextConversationProvider';
import {
  Language,
  TEXT_TEMPLATE_PLACEHOLDER,
} from '../../../constants/constants';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import { useUserStateContext } from '../../../context/user/user-contexts';
import { useStoreDetails } from '../../../context/Store/StoreProvider';
import { formatDateString, formatPhoneNumber } from '../../../utils/utils';
import { useCustomerPaymentSummary } from '../../../context/CustomerPaymentSummary/CustomerPaymentSummaryProvider';
export const CO_CUSTOMER_TAB = 'Co-Customer';
import { FRCStoreType, RentACenter } from '../../../constants/constants';

const EmptyPastDueDate = '__ /__ /____';
export interface ModalProps {
  open: boolean;
  isCommunicationAllowed: boolean;
  preferredLanguageDesc: string;
  onClose: (onclose: boolean) => void;
}

interface TextTemplateContentProps {
  textTemplates?: TextTemplate[];
  selectedTextTemplate?: TextTemplate;
  selectedQuickPhase?: QuickResponse;
  onCategoryChange: (category: string) => void;
  onQuickPhaseChange: (quickPhase: string) => void;
}

export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    display: 'flex',
    padding: 0,
    borderTop: `${theme.typography.pxToRem(1)} solid #dee2e6`,
  },
  dialogActions: {
    marginBottom: '.5rem',
  },
  dialogRoot: {
    '& .MuiPaper-rounded': {
      borderRadius: theme.typography.pxToRem(12),
    },
    '& .MuiDialog-paperWidthMd': {
      maxWidth: theme.typography.pxToRem(800),
      height: theme.typography.pxToRem(510),
      maxHeight: theme.typography.pxToRem(510),
    },
    '& .MuiTypography-h5': {
      fontSize: theme.typography.pxToRem(18),
      fontWeight: 500,
      lineHeight: theme.typography.pxToRem(27),
    },
  },
  textTemplateLeftPannel: {
    width: '34%',
  },
  textTemplateRightPannel: {
    width: '66%',
  },
}));

const randomise = (quickResponses: QuickResponse[] | undefined) => {
  if (!quickResponses) return [];
  return quickResponses
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export const TextTemplateContent = ({
  textTemplates,
  selectedTextTemplate,
  selectedQuickPhase,
  onCategoryChange,
  onQuickPhaseChange,
}: TextTemplateContentProps) => {
  const classes = useStyles();
  if (!textTemplates || !selectedTextTemplate) return <></>;

  const categoryList = textTemplates.map((template) => template.category);
  const quickPhases =
    textTemplates.find(
      (template) => template.category === selectedTextTemplate.category
    )?.quickresponse || [];

  return (
    <>
      <div className={classes.textTemplateLeftPannel}>
        <CategoryList
          categories={categoryList}
          onClick={onCategoryChange}
          selectedCategory={selectedTextTemplate.category}
        />
      </div>
      <div className={classes.textTemplateRightPannel}>
        <QuickPhase
          quickPhases={quickPhases}
          onChange={onQuickPhaseChange}
          selectedPhase={selectedQuickPhase}
        />
      </div>
    </>
  );
};

export const TextTemplateModal = ({
  onClose,
  open,
  isCommunicationAllowed,
  preferredLanguageDesc,
}: ModalProps) => {
  const { user } = useUserStateContext();
  const { customerPaymentSummary: customerPaymentSummaryResponse } =
    useCustomerPaymentSummary();
  const { store } = useStoreDetails();
  const {
    customerDetails: { firstName, lastName },
    textConversationSelectedTab,
    coCustomerDetails: { firstName: coCustomerFirstName },
  } = useCustomerDetails();
  const [textTemplates, setTextTemplates] = useState<TextTemplate[]>();
  const [selectedTextTemplate, setSelectedTextTemplate] =
    useState<TextTemplate>();
  const [selectedQuickPhase, setSelectedQuickPhase] = useState<QuickResponse>();
  const classes = useStyles();
  const textTemplatePlaceHolders = Object.values(TEXT_TEMPLATE_PLACEHOLDER);
  const pastDueDate = formatDateString(
    customerPaymentSummaryResponse?.pastDueSummary?.pastDueDate
  );
  const selectedCustomerName = (selectedTab: string) => {
    if (selectedTab === CO_CUSTOMER_TAB) {
      return `${capitalize(coCustomerFirstName)}`;
    }
    return `${capitalize(firstName)}`;
  };
  const selectedCustomerFirstName = (selectedTab: string) => {
    if (selectedTab === CO_CUSTOMER_TAB) {
      return capitalize(coCustomerFirstName);
    }
    return capitalize(firstName);
  };
  const getPlaceHolderValue = (isSpanish?: boolean) => {
    return {
      [TEXT_TEMPLATE_PLACEHOLDER.DUE_DATE]: !isSpanish
        ? formatDateString(pastDueDate) || EmptyPastDueDate
        : formatDateString(pastDueDate, Language.Spanish) || EmptyPastDueDate,
      [TEXT_TEMPLATE_PLACEHOLDER.COWORKER_NAME]: `${
        user?.firstName
      } ${user?.lastName.charAt(0).toUpperCase()}`,
      [TEXT_TEMPLATE_PLACEHOLDER.CUSTOMER_NAME]: selectedCustomerName(
        textConversationSelectedTab
      ),
      [TEXT_TEMPLATE_PLACEHOLDER.CUSTOMER_FIRST_NAME]:
        selectedCustomerFirstName(textConversationSelectedTab) || '',
      [TEXT_TEMPLATE_PLACEHOLDER.STORE_PHONE]: formatPhoneNumber(
        store?.workPhoneNumber || ''
      ),
    };
  };

  const placeHolderExists = (text: string) =>
    textTemplatePlaceHolders.filter((placeHolder) =>
      text.includes(placeHolder)
    );

  const replaceTextTemplatePlaceHolders = (quickResponses: QuickResponse[]) => {
    quickResponses.forEach((quickResponse) => {
      const placeHoldersPresentInEnglishMessage = placeHolderExists(
        quickResponse.message
      );
      const placeHoldersPresentInSpanishMessage = placeHolderExists(
        quickResponse.spanishMessage
      );
      const placeHoldersPresentInMessage = [
        ...placeHoldersPresentInEnglishMessage,
        ...placeHoldersPresentInSpanishMessage,
      ];
      if (placeHoldersPresentInMessage?.length) {
        placeHoldersPresentInMessage.forEach((placeHolder) => {
          quickResponse.spanishMessage = quickResponse.spanishMessage.replace(
            placeHolder,
            getPlaceHolderValue(true)[placeHolder]
          );
          quickResponse.message = quickResponse.message.replace(
            placeHolder,
            getPlaceHolderValue(false)[placeHolder]
          );
        });
      }
    });
  };

  const onCategoryChange = (category: string) => {
    if (textTemplates) {
      const selectedCategory = textTemplates.find(
        (template) => template.category === category
      );
      if (!selectedCategory) return;
      const randomiseQuickPhases = randomise(selectedCategory.quickresponse);
      selectedCategory.quickresponse = randomiseQuickPhases;
      setSelectedTextTemplate(selectedCategory);
      const selectedPhase = selectedCategory.quickresponse?.[0];
      setSelectedQuickPhase(selectedPhase);
    }
  };

  const onQuickPhaseChange = (quickPhase: string) => {
    if (textTemplates) {
      const selectedPhase = textTemplates
        .find(
          (template) => template.category === selectedTextTemplate?.category
        )
        ?.quickresponse.find((quickPhases) => quickPhases.title === quickPhase);
      selectedPhase && setSelectedQuickPhase(selectedPhase);
    }
  };

  useEffect(() => {
    if (open && textTemplates) {
      setSelectedTextTemplate(textTemplates[0]);
      textTemplates[0].quickresponse?.[0] &&
        setSelectedQuickPhase(textTemplates[0].quickresponse[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    getTextTemplates()
      .then((templates) => {
        if (!templates || !templates.length) return;

        const sortedTemplates = templates.sort((a, b) => a.order - b.order);
        setTextTemplates(sortedTemplates);
        setSelectedTextTemplate(sortedTemplates[0]);
        sortedTemplates[0].quickresponse?.[0] &&
          setSelectedQuickPhase(sortedTemplates[0].quickresponse[0]);
      })
      // eslint-disable-next-line no-console
      .catch(() => console.log('Catch me!'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && firstName && lastName && textTemplates?.length && store) {
      const templates = [...textTemplates];
      templates.forEach((template) =>
        replaceTextTemplatePlaceHolders(template.quickresponse)
      );
      setTextTemplates(templates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, firstName, lastName, pastDueDate, textTemplates?.length, store]);

  const { sendMessage } = useTextConversationActions();
  const messageSender = () => {
    let messageSender = '';
    if (store?.storeType === FRCStoreType) {
      if (
        selectedTextTemplate?.category &&
        selectedTextTemplate?.category !== 'Evening Texts Past Due 1-3 Days' &&
        selectedTextTemplate?.category !== 'Evening Texts Past Due 4-7 Days'
      ) {
        messageSender = `${user?.firstName} ${user?.lastName
          .charAt(0)
          .toUpperCase()}`;
      }
      messageSender = `${messageSender} ${store?.storeNumber}`;
    } else {
      messageSender = RentACenter;
    }
    return messageSender;
  };

  const messageSenderwithStore = messageSender();
  const message =
    preferredLanguageDesc?.toLowerCase() === Language.English
      ? `${selectedQuickPhase?.message} - ${messageSenderwithStore}`
      : `${selectedQuickPhase?.spanishMessage} - ${messageSenderwithStore}`;
  return (
    <RACModal
      isOpen={open}
      classes={{
        dialogContent: classes.dialogContent,
        dialog: classes.dialogRoot,
      }}
      maxWidth="md"
      title="Text Templates"
      content={
        <TextTemplateContent
          textTemplates={textTemplates}
          selectedTextTemplate={selectedTextTemplate}
          selectedQuickPhase={selectedQuickPhase}
          onCategoryChange={onCategoryChange}
          onQuickPhaseChange={onQuickPhaseChange}
        />
      }
      onClose={() => onClose(false)}
      buttons={
        <>
          <RACButton
            variant="outlined"
            color="secondary"
            onClick={() => onClose(false)}
          >
            Cancel
          </RACButton>
          <RACButton
            disabled={!isCommunicationAllowed}
            variant="contained"
            color="primary"
            onClick={() => {
              onClose(false);
              sendMessage(message as string);
            }}
          >
            Send
          </RACButton>
        </>
      }
    />
  );
};
