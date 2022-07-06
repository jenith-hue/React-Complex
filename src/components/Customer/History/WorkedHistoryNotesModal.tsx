import {
  makeStyles,
  RACButton,
  RACCOLOR,
  RACModal,
  Typography,
} from '@rentacenter/racstrap';
import React from 'react';

export interface ModalProps {
  workedResultText: string;
  noteText: string;
  open: boolean;
  onClose: () => void;
}
export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    textAlign: 'left',
  },
  dialogRoot: {
    '& .MuiDialogContent-root': {
      padding: '1rem',
      flexDirection: 'column',
      display: 'flex',
      height: 'unset',
      gap: theme.typography.pxToRem(20),
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
  text: {
    fontSize: '1rem !important',
  },
  // same as for text templates -> generated text
  generatedTextValue: {
    borderRadius: '5px',
    minHeight: 'calc(1.5em + 0.75rem + 2px)',
    height: theme.typography.pxToRem(73),
    overflowY: 'auto',
    border: '1px solid #C4C4C4',
    padding: '0.375rem 0.75rem',
    marginBottom: '1rem',
    backgroundColor: RACCOLOR.CULTURED,
  },
}));

export interface WorkedHistoryNotesModalContentProps {
  workedResultText: string;
  noteText: string;
}
const WorkedHistoryNotesModalContent = ({
  workedResultText,
  noteText,
}: WorkedHistoryNotesModalContentProps) => {
  const classes = useStyles();
  return (
    <>
      <span>
        <Typography display="inline" variant="body1" className={classes.text}>
          Worked Result:{' '}
        </Typography>
        <Typography display="inline" variant="body2" className={classes.text}>
          {workedResultText}
        </Typography>
      </span>
      <Typography display="inline" variant="body2" className={classes.text}>
        Additional information on Activity Code
      </Typography>
      <span className={classes.generatedTextValue}>{noteText}</span>
    </>
  );
};

export const WorkedHistoryNotesModal = ({
  workedResultText,
  noteText,
  open,
  onClose,
}: ModalProps) => {
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
      content={
        <WorkedHistoryNotesModalContent
          workedResultText={workedResultText}
          noteText={noteText}
        />
      }
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
