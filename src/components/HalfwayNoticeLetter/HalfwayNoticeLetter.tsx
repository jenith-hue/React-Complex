import { RACButton, RACModal, withStyles } from '@rentacenter/racstrap';
import React from 'react';
import ReactToPrint from 'react-to-print';
import { PrintLetterDetails } from '../../types/types';
import ComponentToPrint from './ComponentToPrint';

export interface HalfwayNoticeLetterProps {
  printLetterDetails: PrintLetterDetails;
  classes: any;
  onClose: () => void;
}

const useStyles = (theme: any) => ({
  halfwayNoticeContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: theme.typography.pxToRem(30),
    background: 'white',
  },
  section: {
    paddingBottom: theme.typography.pxToRem(30),
  },
  paragraph: {
    paddingBottom: theme.typography.pxToRem(15),
  },
  headerMetadata: {
    width: theme.typography.pxToRem(400),
  },
  underline: {
    textDecoration: 'underline',
  },
  dialogContent: {
    textAlign: 'center',
  },
  dialogActions: {
    justifyContent: 'flex-end',
    position: 'sticky',
    bottom: 0,
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
  previewContainer: {
    height: theme.typography.pxToRem(600),
    overflowY: 'auto',
    marginRight: theme.typography.pxToRem(5),
  },
});

// This has to be class component, in order to integrate with react-to-print
class HalfwayNoticeLetter extends React.Component<HalfwayNoticeLetterProps> {
  render() {
    const { classes, onClose, printLetterDetails } = this.props;
    return (
      <RACModal
        isOpen
        classes={{
          dialogContent: classes.dialogContent,
          dialogActions: classes.dialogActions,
          dialog: classes.dialogRoot,
        }}
        maxWidth="lg"
        title="Print preview"
        content={
          <div className={classes.previewContainer}>
            <ComponentToPrint
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              ref={(el) => (this.componentRef = el)}
              printLetterDetails={printLetterDetails}
            />
          </div>
        }
        onClose={onClose}
        buttons={
          <>
            <RACButton variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </RACButton>
            <ReactToPrint
              onAfterPrint={onClose}
              trigger={() => {
                return (
                  <RACButton variant="contained" color="primary">
                    Ok
                  </RACButton>
                );
              }}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              content={() => this.componentRef}
            />
          </>
        }
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export default withStyles(useStyles)(HalfwayNoticeLetter);
