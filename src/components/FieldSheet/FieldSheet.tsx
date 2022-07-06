import { RACButton, RACModal, withStyles } from '@rentacenter/racstrap';
import React from 'react';
import ReactToPrint from 'react-to-print';
import { FieldSheet } from '../../types/types';
import ComponentToPrint from './ComponentToPrint';

export interface FieldSheetPreviewProps {
  fieldSheets?: FieldSheet[];
  classes: any;
  isLoading: boolean;
  onClose: () => void;
  onSave: () => void;
}

const useStyles = (theme: any) => ({
  fieldSheetContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: theme.typography.pxToRem(30),
    background: 'white',
  },
  underline: {
    textDecoration: 'underline',
  },
  dialogContent: {
    textAlign: 'center',
    margin: `2rem 0`,
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
  previewContainer: {
    height: theme.typography.pxToRem(600),
    pageBreakInside: 'avoid',
    '& div': {
      pageBreakInside: 'avoid',
    },
  },
});

// This has to be class component, in order to integrate with react-to-print
class FieldSheetPreview extends React.Component<FieldSheetPreviewProps> {
  render() {
    const { classes, onClose, onSave, fieldSheets, isLoading } = this.props;
    return (
      <RACModal
        isOpen
        classes={{
          dialogContent: classes.dialogContent,
          dialogActions: classes.dialogActions,
          dialog: classes.dialogRoot,
        }}
        maxWidth="lg"
        title="Field Sheet"
        content={
          <div className={classes.previewContainer}>
            <ComponentToPrint
              fieldSheets={fieldSheets}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              ref={(el) => (this.componentRef = el)}
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
              onAfterPrint={onSave}
              trigger={() => {
                return (
                  <RACButton
                    variant="contained"
                    color="primary"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    OK
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
export default withStyles(useStyles)(FieldSheetPreview);
