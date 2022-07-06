import { RACButton, RACModal, withStyles } from '@rentacenter/racstrap';
import React from 'react';
import ReactToPrint from 'react-to-print';
import { StoreDetail, User } from '../../../types/types';
import ComponentToPrint from './ComponentToPrint';
import { AccountActivity } from '../../../domain/ActivityLog/ActivityLogResult';

export interface ActivityLogListPreviewProps {
  classes: any;
  selectedDateRangeFromOption: string;
  selectedDateRangeToOption: string;
  store?: StoreDetail;
  user?: User;
  onClose: () => void;
  activityLog?: AccountActivity[];
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
  dialogContent: {
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
    height: theme.typography.pxToRem(420),
  },
});

// This has to be class component, in order to integrate with react-to-print
class ActivityLogListPreview extends React.Component<ActivityLogListPreviewProps> {
  render() {
    const {
      classes,
      onClose,
      selectedDateRangeFromOption,
      selectedDateRangeToOption,
      store,
      user,
      activityLog,
    } = this.props;

    return (
      <RACModal
        isOpen
        classes={{
          dialogContent: classes.dialogContent,
          dialogActions: classes.dialogActions,
          dialog: classes.dialogRoot,
        }}
        maxWidth="lg"
        title="AM Activity Log"
        content={
          <div className={classes.previewContainer}>
            <ComponentToPrint
              activityLog={activityLog}
              store={store}
              user={user}
              selectedDateRangeFromOption={selectedDateRangeFromOption}
              selectedDateRangeToOption={selectedDateRangeToOption}
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
              onAfterPrint={onClose}
              trigger={() => {
                return (
                  <RACButton variant="contained" color="primary">
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
export default withStyles(useStyles)(ActivityLogListPreview);
