import {
  RACTable,
  RACTableCell,
  RACTableRow,
  withStyles,
} from '@rentacenter/racstrap';
import React from 'react';
import clsx from 'clsx';
import {
  DAYS_OF_WEEK,
  formatDate,
  formatDateString,
  formatPhoneNumberForPrintLetter,
  formatStringDateHoursAndMinutes,
} from '../../../utils/utils';
import { AccountActivity } from '../../../domain/ActivityLog/ActivityLogResult';
import { tableHeaderList } from './ActivityLogList';
import logo from './logo.png';
import { StoreDetail, User } from '../../../types/types';
import { WORKED_HISTORY_ACTIVITY_TYPE_CODES } from '../../../constants/constants';

export interface ActivityLogListModalProps {
  activityLog?: AccountActivity[];
  classes?: any;
  selectedDateRangeFromOption: string;
  selectedDateRangeToOption: string;
  store?: StoreDetail;
  user?: User;
}

const useStyles = (theme: any) => ({
  activityLogListWrapper: {
    marginTop: '1rem',
    marginBottom: '7.5rem',
  },
  activityLogList: {
    flexDirection: 'row',
    boxSizing: 'border-box',
    borderRadius: '1rem',
    overflowX: 'auto',
    height: '31.25rem',
    padding: '1rem',
    boxShadow: 'none',
  },
  paddingTopBottom8: {
    paddingTop: '.2rem',
    paddingBottom: '.0rem',
  },
  contentHeight: {
    height: theme.typography.pxToRem(500),
  },
  print: {
    width: '100vw',
  },
  printFontSize: {
    fontSize: theme.typography.pxToRem(8),
    padding: '.2rem .2rem',
  },
  printPreviewHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '2px solid Gray',
    padding: theme.typography.pxToRem(10),
    ...theme.typography.body1,
    fontSize: theme.typography.pxToRem(8),
  },
  printPreviewHeaderBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  printPreviewHeaderCenterBlock: {
    alignSelf: 'center',
    fontSize: theme.typography.pxToRem(10),
  },
  printPreviewHeaderRightBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
    alignSelf: 'center',
    marginTop: theme.typography.pxToRem(70),
  },
  logo: {
    height: theme.typography.pxToRem(60),
    width: theme.typography.pxToRem(60),
    marginBottom: '1rem',
  },
});

// This has to be class component, in order to integrate with react-to-print
class ComponentToPrint extends React.Component<ActivityLogListModalProps> {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  render() {
    const {
      activityLog,
      classes,
      selectedDateRangeFromOption,
      selectedDateRangeToOption,
      store,
      user,
    } = this.props;

    const dateRangeFilter =
      selectedDateRangeFromOption || selectedDateRangeToOption
        ? `${selectedDateRangeFromOption} - ${selectedDateRangeToOption}`
        : 'All';

    const storeAddress = store
      ? `${store.addressLine1}, ${store.city}, ${store.stateName}, ${store.zip}`
      : '';
    const today = new Date();

    const renderTableHead = () => (
      <>
        {tableHeaderList.map((col, index) => (
          <RACTableCell
            key={index}
            classes={{
              root: clsx(classes.paddingTopBottom8, classes.printFontSize),
            }}
          >
            {col}
          </RACTableCell>
        ))}
      </>
    );

    const renderTableContent = () => (
      <>
        {activityLog?.map((log, index) => {
          const code: string | undefined = log.accountActivityType?.code;
          const description: string | undefined =
            code?.toUpperCase() ===
            WORKED_HISTORY_ACTIVITY_TYPE_CODES.CALL_CUSTOMER
              ? log.callResultType?.description
              : log.accountActivityType?.description;
          return (
            <RACTableRow key={index} hover backgroundColor="white">
              <>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >
                  {formatDateString(log.activityDate)}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >
                  {formatStringDateHoursAndMinutes(log.callDate)}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >{`${log.customerFirstName || ''} ${
                  log.customerLastName || ''
                }`}</RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >
                  {log.route?.description}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >
                  {log.phoneNumberDialed &&
                    formatPhoneNumberForPrintLetter(log.phoneNumberDialed)}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: clsx(classes.printFontSize),
                  }}
                >
                  {log.phoneContact?.phoneType?.code || ''}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >
                  {description || ''}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >{`${log.phoneContact?.firstName || ''} ${
                  log.phoneContact?.lastName || ''
                }`}</RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >
                  {log.phoneContact?.relationshipType?.description || ''}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >
                  {log.daysLate}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >
                  {formatDateString(log.commitment?.commitmentDate)}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >
                  {formatStringDateHoursAndMinutes(
                    log.commitment?.commitmentDate
                  )}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >
                  {log.commitment?.commitmentStatus?.description || ''}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >
                  {formatDateString(log.pastDueDate)}
                </RACTableCell>
                <RACTableCell
                  classes={{
                    root: classes.printFontSize,
                  }}
                >{`${log.coWorker?.firstName || ''} ${
                  log.coWorker?.lastName || ''
                }`}</RACTableCell>
              </>
            </RACTableRow>
          );
        })}
      </>
    );

    return (
      <div>
        <div className={classes.printPreviewHeaderWrapper}>
          <div className={classes.printPreviewHeaderBlock}>
            <img src={logo} className={classes.logo} alt="logoImage" />
            <span>Rent-A-Center. Inc.</span>
            <span>{`${store?.storeNumber} ${store?.storeName}`}</span>
            <span>{storeAddress}</span>
            <span>For the period {dateRangeFilter}</span>
          </div>
          <div className={classes.printPreviewHeaderCenterBlock}>
            <span>Generate Call Log</span>
          </div>
          <div className={classes.printPreviewHeaderRightBlock}>
            <span>{`${DAYS_OF_WEEK[today.getDay()]} ${formatDate(
              today
            )}`}</span>
            <span>
              Report requested by {`${user?.lastName}, ${user?.firstName}`}
            </span>
          </div>
        </div>
        <RACTable
          renderTableHead={renderTableHead}
          renderTableContent={renderTableContent}
        />
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export default withStyles(useStyles)(ComponentToPrint);
