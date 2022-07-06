import {
  makeStyles,
  RACButton,
  RACModal,
  Typography,
} from '@rentacenter/racstrap';
import React from 'react';
import { ReactComponent as ApiErrorIcon } from '../../assets/img/apiErrorIcon.svg';
import { FULL_API_ERROR_MESSAGE } from '../../constants/constants';

export interface ModalProps {
  open: boolean;
  message?: string;
  onClose: () => void;
}
export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    textAlign: 'left',
    height: theme.typography.pxToRem(400),
  },
  dialogRoot: {
    '& .MuiDialogContent-root': {
      padding: '1rem',
      flexDirection: 'column',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: theme.typography.pxToRem(100),
    },
    '& .MuiDialog-paperWidthSm': {
      maxWidth: theme.typography.pxToRem(500),
      maxHeight: theme.typography.pxToRem(363),
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
  dialogActions: {
    paddingRight: theme.typography.pxToRem(15),
    paddingBottom: theme.typography.pxToRem(15),
    justifyContent: 'center',
  },
  apiErrorMessage: {
    fontSize: '1rem !important',
  },
}));

export interface ApiErrorModalContentProps {
  message?: string;
}
const ApiErrorModalContent = ({ message }: ApiErrorModalContentProps) => {
  const classes = useStyles();
  return (
    <>
      <ApiErrorIcon />
      <Typography variant="body2" className={classes.apiErrorMessage}>
        {message || FULL_API_ERROR_MESSAGE}
      </Typography>
    </>
  );
};

export const ApiErrorModal = ({ message, open, onClose }: ModalProps) => {
  const classes = useStyles();

  return (
    <RACModal
      isOpen={open}
      titleVariant="h4"
      classes={{
        dialogContent: classes.dialogContent,
        dialog: classes.dialogRoot,
        dialogActions: classes.dialogActions,
      }}
      maxWidth="sm"
      title=""
      content={<ApiErrorModalContent message={message} />}
      onClose={onClose}
      buttons={
        <>
          <RACButton variant="contained" color="primary" onClick={onClose}>
            OK
          </RACButton>
        </>
      }
    />
  );
};
