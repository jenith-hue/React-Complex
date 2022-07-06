import {
  makeStyles,
  RACCard,
  RACTabs,
  Typography,
  RACCOLOR,
} from '@rentacenter/racstrap';
import React, { useState } from 'react';
import { ContactInformationCustomerContent } from './ContactInformationCustomerContent';
import { ContactInformationReferencesContent } from './ContactInformationReferencesContent';
import { ContactInformationEmployerContent } from './ContactInformationEmployerContent';
import { ContactInformationCoCustomerContent } from './ContactInformationCoCustomerContent';
import { LogActivityModal } from './LogActivityModal';
import { useWorkedHistoryActions } from '../../../context/WorkedHistory/WorkedHistoryProvider';
import {
  ACCT_ACTIVITY_REF_CODES,
  LOG_ACTIVITY_ERROR_MESSAGE,
} from '../../../constants/constants';
import { ApiErrorModal } from '../../../common/ApiError/ApiError';
import { useCustomerPaymentSummary } from '../../../context/CustomerPaymentSummary/CustomerPaymentSummaryProvider';
import {
  useCustomerDetails,
  useCustomerDetailsActions,
} from '../../../context/CustomerDetails/CustomerDetailsProvider';
import { formatDateString } from '../../../utils/utils';

const AVAILABLE_TABS = ['Customer', 'Co-Customer', 'References', 'Employer'];
const CO_CUSTOMER_TAB_INDEX = 1;
const REFERNCES_TAB_INDEX = 2;
const EMPLOYER_TAB_INDEX = 3;
/*
Reason for having both whiteSpace: 'nowrap' and <Typography noWrap ....>:
The one from css (th and td see below) will make the string to not break into new line.
The one from Typography will add the 3 dots (...) when string cannot be completely displayed.
*/
const useStyles = makeStyles((theme: any) => ({
  contactInformationRoot: {
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  row: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: theme.typography.pxToRem(8),
  },
  // TODO Align with designers regarding the card height
  // Should have a fixed height? Should be the same height as for text messages?
  // Or height depends on the number of rows?
  cardContentContainer: {
    marginLeft: '1.25rem',
    marginRight: '1.25rem',
    overflowX: 'auto',
    '& th': {
      whiteSpace: 'nowrap',
    },
    '& td': {
      maxWidth: theme.typography.pxToRem(160),
      whiteSpace: 'break-spaces',
    },
  },
  tabPanel: {
    height: '26rem',
    maxHeight: '26rem',
    overflow: 'auto',
  },
  dueContainer: {
    display: 'flex',
    gap: theme.typography.pxToRem(8),
  },
  dueInfo: {
    paddingRight: theme.typography.pxToRem(8),
  },
  dueKey: {
    color: `${RACCOLOR.MAXIMUM_RED} !important`,
  },
  dueValue: {
    color: `${RACCOLOR.CARNELIAN} !important`,
  },
}));

export const ContactInformation = () => {
  const classes = useStyles();

  const [openLogActivityModal, setOpenLogActivityModal] = useState(false);
  // can be the customer, co-customer, employer or reference
  const [personId, setPersonId] = useState('');
  const [callType, setCallType] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

  const [isApiErrorOpen, setIsApiErrorOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const { onLogWorkedHistory } = useWorkedHistoryActions();

  const {
    customerDetails: { coCustomerId, personalReferences, employerReferences },
  } = useCustomerDetails();

  const { customerPaymentSummary: customerPaymentSummaryResponse } =
    useCustomerPaymentSummary();

  const { fetchCommunicationDetailsForCustomer } = useCustomerDetailsActions();

  const disabledTabsToStore = [];
  if (!coCustomerId) {
    disabledTabsToStore.push(CO_CUSTOMER_TAB_INDEX);
  }
  if (!personalReferences?.length) {
    disabledTabsToStore.push(REFERNCES_TAB_INDEX);
  }
  if (!employerReferences?.length) {
    disabledTabsToStore.push(EMPLOYER_TAB_INDEX);
  }

  const onLogWorkedHistoryWithSuccess = () => {
    setOpenLogActivityModal(false);
    setApiErrorMessage('');
  };

  const onLogWorkedHistoryWithError = () => {
    setOpenLogActivityModal(false);
    setIsApiErrorOpen(true);
    setApiErrorMessage(LOG_ACTIVITY_ERROR_MESSAGE);
  };

  const daysPastDue = customerPaymentSummaryResponse?.pastDueSummary
    ?.daysPastDue
    ? customerPaymentSummaryResponse?.pastDueSummary?.daysPastDue
    : '';

  const handleError = (message: string) => {
    setApiErrorMessage(message);
    setIsApiErrorOpen(true);
  };

  return (
    <div className={classes.contactInformationRoot}>
      {isApiErrorOpen && (
        <ApiErrorModal
          open={isApiErrorOpen}
          message={apiErrorMessage}
          onClose={() => {
            setApiErrorMessage('');
            setIsApiErrorOpen(false);
          }}
        />
      )}
      <div className={classes.row}>
        <Typography noWrap variant="h4">
          Contact Information
        </Typography>
        <div className={classes.dueContainer}>
          <div className={classes.dueInfo}>
            <Typography
              display="inline"
              variant="body1"
              className={classes.dueKey}
            >
              Due Date:{' '}
            </Typography>
            <Typography
              display="inline"
              variant="h6"
              className={classes.dueValue}
            >
              {formatDateString(
                customerPaymentSummaryResponse?.pastDueSummary?.pastDueDate
              )}
            </Typography>
          </div>
          <div className={classes.dueInfo}>
            <Typography
              display="inline"
              variant="body1"
              className={classes.dueKey}
            >
              Days Past Due:{' '}
            </Typography>
            <Typography
              display="inline"
              variant="h6"
              className={classes.dueValue}
            >
              {daysPastDue}
            </Typography>
          </div>
          <div className={classes.dueInfo}>
            <Typography
              display="inline"
              variant="body1"
              className={classes.dueKey}
            >
              Amount Due:{' '}
            </Typography>
            <Typography
              display="inline"
              variant="h5"
              className={classes.dueValue}
            >
              ${customerPaymentSummaryResponse?.pastDueSummary?.amountDue || ''}
            </Typography>
          </div>
        </div>
      </div>
      <RACCard>
        <div className={classes.cardContentContainer}>
          {openLogActivityModal && (
            <LogActivityModal
              open={openLogActivityModal}
              onSave={(callResult: string, note: string) => {
                onLogWorkedHistory(
                  callResult,
                  note,
                  daysPastDue?.toString(),
                  personId,
                  callType,
                  phoneNo,
                  onLogWorkedHistoryWithSuccess,
                  onLogWorkedHistoryWithError
                ).then(() => {
                  fetchCommunicationDetailsForCustomer();
                });
              }}
              onClose={() => setOpenLogActivityModal(false)}
            />
          )}
          <RACTabs
            classes={{
              tabPanel: classes.tabPanel,
            }}
            defaultValue={0}
            tabs={AVAILABLE_TABS}
            contentForTabs={[
              <ContactInformationCustomerContent
                key="customer"
                onLogClicked={(personId: string, phone: string) => {
                  setPersonId(personId);
                  setCallType(ACCT_ACTIVITY_REF_CODES.CALL_CUSTOMER);
                  setOpenLogActivityModal(true);
                  setPhoneNo(phone);
                }}
                onError={handleError}
              />,
              <ContactInformationCoCustomerContent
                key="co-customer"
                onLogClicked={(personId: string, phone: string) => {
                  setPersonId(personId);
                  setCallType(ACCT_ACTIVITY_REF_CODES.CALL_ALTERNATIVE);
                  setOpenLogActivityModal(true);
                  setPhoneNo(phone);
                }}
                onError={handleError}
              />,
              <ContactInformationReferencesContent
                key="references"
                onLogClicked={(personId: string, phone: string) => {
                  setPersonId(personId);
                  setCallType(ACCT_ACTIVITY_REF_CODES.CALL_REFERENCE);
                  setOpenLogActivityModal(true);
                  setPhoneNo(phone);
                }}
              />,
              <ContactInformationEmployerContent
                key="employer"
                onLogClicked={(personId: string, phone: string) => {
                  setPersonId(personId);
                  setCallType(ACCT_ACTIVITY_REF_CODES.CALL_EMPLOYER);
                  setOpenLogActivityModal(true);
                  setPhoneNo(phone);
                }}
              />,
            ]}
            // drop ts ignore after deploying racstrap
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            disabledTabs={disabledTabsToStore}
          />
        </div>
      </RACCard>
    </div>
  );
};
