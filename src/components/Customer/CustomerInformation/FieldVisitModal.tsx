import {
  RACModal,
  Typography,
  RACButton,
  makeStyles,
  TextField,
} from '@rentacenter/racstrap';

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserStateContext } from '../../../context/user/user-contexts';
import { logActivity } from '../../../api/Customer';
import { ActivityPayload, CustomerLocationState } from '../../../types/types';
import {
  WORKED_HISTORY_ACTIVITY_TYPE_CODES,
  WORKED_HISTORY_CALL_RESULT_CODES,
} from '../../../constants/constants';
import { getSelectedStore } from '../../../utils/utils';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import { useCustomerPaymentSummary } from '../../../context/CustomerPaymentSummary/CustomerPaymentSummaryProvider';

export interface ModalProps {
  onClose: (onclose: boolean) => void;
  onSaveSuccess: () => void;
  onError: () => void;
}

export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    marginBottom: '2rem',
  },
  dialogRoot: {
    '& .MuiPaper-rounded': {
      borderRadius: theme.typography.pxToRem(12),
    },
    '& .MuiDialog-paperWidthXs': {
      maxWidth: theme.typography.pxToRem(500),
    },
    '& .MuiTypography-h5': {
      fontSize: theme.typography.pxToRem(20),
      fontWeight: 500,
      lineHeight: theme.typography.pxToRem(30),
    },
    '& .MuiTypography-h6': {
      fontFamily: 'OpenSans-semiBold',
      lineHeight: theme.typography.pxToRem(20),
    },
  },
  notesLabel: {
    color: '#212529',
    padding: '0px 0px 15px',
  },
  fieldVisitTextContent: {
    borderRadius: '5px',
    width: theme.typography.pxToRem(450),
  },
}));

export const FieldVisitModal = ({
  onClose,
  onSaveSuccess,
  onError,
}: ModalProps) => {
  const classes = useStyles();
  const location = useLocation<CustomerLocationState>();
  const [note, setNote] = useState('');
  const { user } = useUserStateContext();
  const [pending, setPending] = useState(false);

  const { customerDetails } = useCustomerDetails();
  const { customerPaymentSummary } = useCustomerPaymentSummary();

  const handleSave = () => {
    const now = new Date().toISOString();
    const customerId =
      customerDetails?.customerId ||
      location?.state?.customer?.customerId ||
      location?.pathname?.split('/')[3];

    const { daysPastDue } = location?.state?.customer || {};

    const payload: ActivityPayload = {
      storeNumber: getSelectedStore(),
      notes: note,
      daysPastDue:
        customerPaymentSummary?.pastDueSummary?.daysPastDue?.toString() ||
        daysPastDue?.toString(),
      activityDate: now,
      callResultRefCode: WORKED_HISTORY_CALL_RESULT_CODES.FIELD_VISIT,
      acctActivityRefCode: WORKED_HISTORY_ACTIVITY_TYPE_CODES.CALL_CUSTOMER,
      customerId: Number(customerId),
      coWorkerId: user?.employeeId || ' ',
      callTime: now,
    };
    setPending(true);
    logActivity(payload)
      .then(() => onSaveSuccess())
      .catch(() => onError())
      .finally(() => setPending(false));
  };

  return (
    <RACModal
      isOpen
      classes={{
        dialogContent: classes.dialogContent,
        dialog: classes.dialogRoot,
      }}
      maxWidth="xs"
      title="Field Visit"
      content={
        <>
          <Typography variant="h6" className={classes.notesLabel}>
            Notes
          </Typography>
          <TextField
            className={classes.fieldVisitTextContent}
            multiline
            autoFocus
            variant="outlined"
            maxRows={3}
            minRows={3}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        </>
      }
      onClose={() => onClose(false)}
      buttons={
        <>
          <RACButton
            variant="outlined"
            color="secondary"
            onClick={() => onClose(false)}
            disabled={pending}
          >
            Cancel
          </RACButton>
          <RACButton
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={pending}
            loading={pending}
          >
            Save
          </RACButton>
        </>
      }
    />
  );
};
