import { RACCOLOR, RACModal } from '@rentacenter/racstrap';
import { Typography } from '@rentacenter/racstrap';
import { RACButton, makeStyles } from '@rentacenter/racstrap';
import React from 'react';
import clsx from 'clsx';

export interface ModalProps {
  onClose: (onclose: boolean) => void;
  onConfirm: () => void;
  customerName: string;
  disableActionButtons?: boolean;
}

export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    textAlign: 'center',
    margin: `2rem 0`,
  },
  dialogActions: {
    justifyContent: 'center',
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
  },
  radioLabel: {
    fontFamily: 'OpenSans-regular',
  },
  label: {
    fontFamily: 'OpenSans-semibold',
    fontSize: theme.typography.pxToRem(14),
    color: RACCOLOR.BLUE_CRAYOLA,
  },
  letter: {
    paddingBottom: theme.typography.pxToRem(14),
  },
}));

export const PrintLetterModal = ({
  onClose,
  onConfirm,
  customerName,
  disableActionButtons,
}: ModalProps) => {
  const classes = useStyles();

  return (
    <RACModal
      isOpen
      classes={{
        dialogContent: classes.dialogContent,
        dialogActions: classes.dialogActions,
        dialog: classes.dialogRoot,
      }}
      maxWidth="xs"
      title="Select Letter"
      content={
        <Typography display="inline" variant="body1">
          <div className={clsx(classes.letter)}>
            <label className={clsx(classes.label)}>{customerName}</label>
          </div>
          15 Day Letter
        </Typography>
      }
      onClose={() => onClose(false)}
      buttons={
        <>
          <RACButton
            variant="outlined"
            color="secondary"
            onClick={() => onClose(false)}
            disabled={disableActionButtons}
          >
            Cancel
          </RACButton>
          <RACButton
            variant="contained"
            color="primary"
            onClick={onConfirm}
            loading={disableActionButtons}
            disabled={disableActionButtons}
          >
            Ok
          </RACButton>
        </>
      }
    />
  );
};
