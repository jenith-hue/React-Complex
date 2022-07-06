import {
  RACModal,
  RACButton,
  makeStyles,
  RACCOLOR,
  TextField,
  RACDatePicker,
  RACTimePicker,
  Typography,
  RACTextField,
} from '@rentacenter/racstrap';

import React from 'react';
import { WorkedHistoryCommitmentType } from '../../../types/types';
import { useCustomerPaymentSummary } from '../../../context/CustomerPaymentSummary/CustomerPaymentSummaryProvider';
import clsx from 'clsx';
import { Commitment } from '../../../domain/PastDueList/PastDueCustomerList';

interface ModalProps {
  commitment: WorkedHistoryCommitmentType | Commitment;
  onClose: () => void;
}
const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    textAlign: 'left',
    height: theme.typography.pxToRem(400),
  },
  dialogRoot: {
    '& .MuiDialogContent-root': {
      padding: '1rem',
    },
    '& .MuiDialog-paperWidthSm': {
      maxWidth: theme.typography.pxToRem(800),
      maxHeight: theme.typography.pxToRem(407),
    },
    '& .MuiTypography-h4': {
      fontSize: '20px !important',
    },
    '& .MuiOutlinedInput-multiline': {
      padding: theme.typography.pxToRem(10),
    },
    '& .MuiInputBase-multiline': {
      margin: '8px 0px 0px 0px !important',
    },
    '& .MuiInputBase-input': {
      fontFamily: 'OpenSans-regular',
      fontSize: theme.typography.pxToRem(14),
    },
  },
  notesLabel: {
    color: theme.palette.text.primary,
    transform: 'scale(1) !important',
    ...theme.typography.body1,
    position: 'relative',
    display: 'block',
  },
  amountLabel: {
    color: theme.palette.text.primary,
    transform: 'scale(1) !important',
    ...theme.typography.body1,
  },
  dialogActions: {
    paddingRight: theme.typography.pxToRem(15),
    paddingBottom: theme.typography.pxToRem(15),
  },
  notesWrapper: {
    display: 'inline-flex',
    position: 'relative',
    flexDirection: 'column',
    width: '100%',
    marginTop: theme.typography.pxToRem(24),
    marginBotton: theme.typography.pxToRem(16),
  },
  modalColumn: {
    width: '25%',
    paddingRight: theme.typography.pxToRem(12),
  },
  row: {
    display: 'flex',
  },
  topBottomLeftBorderRadius: {
    borderTopLeftRadius: `${theme.typography.pxToRem(9)} !important`,
    borderBottomLeftRadius: `${theme.typography.pxToRem(9)} !important`,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  topBottomRightBorderRadius: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: `${theme.typography.pxToRem(9)} !important`,
    borderTopRightRadius: `${theme.typography.pxToRem(9)} !important`,
  },
  amountValue: {
    padding: `${theme.typography.pxToRem(6)} ${theme.typography.pxToRem(
      12
    )} ${theme.typography.pxToRem(6)} 0`,
    backgroundColor: RACCOLOR.ICEWIND_DALE,
    // Replace with SATIN_WHITE
    border: `${theme.typography.pxToRem(1)} solid ${RACCOLOR.ICEWIND_DALE}`,
    lineHeight: theme.typography.pxToRem(18),
    width: '90%',
    marginLeft: theme.typography.pxToRem(-1),
  },
  amountWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  amountValueWrapper: {
    marginTop: theme.typography.pxToRem(3),
    width: '100%',
    display: 'inline-flex',
  },
  amount$Value: {
    width: '10%',
    padding: `${theme.typography.pxToRem(6)} ${theme.typography.pxToRem(12)}`,
    backgroundColor: RACCOLOR.ICEWIND_DALE,
    // Replace with SATIN_WHITE
    border: `${theme.typography.pxToRem(1)} solid ${RACCOLOR.ICEWIND_DALE}`,
    lineHeight: theme.typography.pxToRem(18),
  },
}));

interface CommitmentNotesModalContentProps {
  commitment: Commitment;
}

const CommitmentNotesModalContent = ({
  commitment,
}: CommitmentNotesModalContentProps) => {
  const classes = useStyles();
  const { customerPaymentSummary: customerPaymentSummaryResponse } =
    useCustomerPaymentSummary();
  const {
    notes,
    commitmentDate,
    commitmentType,
    commitmentNotes,
    commitmentAmount,
  } = commitment || {};
  const splitCommitmentDate = commitmentDate?.split('T');
  const amount =
    customerPaymentSummaryResponse?.pastDueSummary?.amountDue ||
    commitmentAmount ||
    '';

  return (
    <>
      <div className={classes.row}>
        <div className={classes.modalColumn}>
          <RACTextField
            name="CommitmentType"
            label="Commitment Type"
            value={commitmentType?.description || ''}
            type="text"
            disabled
          />
        </div>
        <div className={classes.modalColumn}>
          <RACDatePicker
            label="Date"
            disabled
            value={splitCommitmentDate?.[0] || ''}
            name="commitmentDate"
          />
        </div>
        <div className={classes.modalColumn}>
          <RACTimePicker
            disabled
            label="Time"
            name="commitmentTime"
            value={splitCommitmentDate?.[1] || ''}
          />
        </div>
        <div className={classes.modalColumn}>
          <label className={classes.amountLabel}>Amount</label>
          <div className={classes.amountValueWrapper}>
            <Typography
              display="inline"
              variant="body2"
              className={clsx(
                classes.amount$Value,
                classes.topBottomLeftBorderRadius
              )}
            >
              $
            </Typography>
            <Typography
              display="inline"
              variant="body2"
              className={clsx(
                classes.amountValue,
                classes.topBottomRightBorderRadius
              )}
            >
              {amount}
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.notesWrapper}>
        <label className={classes.notesLabel}>Notes</label>
        <TextField
          multiline
          variant="outlined"
          disabled
          value={notes || commitmentNotes || ''}
          key="logActivityNote"
          maxRows={4}
          minRows={47}
        />
      </div>
    </>
  );
};

export const CommitmentNotesModal = ({ commitment, onClose }: ModalProps) => {
  const classes = useStyles();

  return (
    <RACModal
      isOpen
      titleVariant="h4"
      classes={{
        dialogContent: classes.dialogContent,
        dialog: classes.dialogRoot,
        dialogActions: classes.dialogActions,
      }}
      maxWidth="sm"
      title="Commitment Notes"
      content={<CommitmentNotesModalContent commitment={commitment} />}
      onClose={onClose}
      buttons={
        <RACButton variant="contained" color="primary" onClick={onClose}>
          Ok
        </RACButton>
      }
    />
  );
};
