/* eslint-disable react-hooks/exhaustive-deps */
import {
  makeStyles,
  RACTable,
  RACTableCell,
  RACTableRow,
  TableSortLabel,
} from '@rentacenter/racstrap';
import { CancelTokenSource } from 'axios';
import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getActivityLogs } from '../../../api/activityLog';
import { getCancelTokenSource } from '../../../api/client';
import {
  ApiStateWrapper,
  Loader,
} from '../../../common/ApiStateWrapper/ApiStateWrapper';
import {
  ACTIVITY_LOG_API_LIMIT,
  ALL_OPTION,
  AM_ACTIVITY_OPTIONS,
  AUTO_SYSTEM_TEXT,
  INITIAL_OFFSET,
  TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY,
  WORKED_HISTORY_ACTIVITY_TYPE_CODES,
} from '../../../constants/constants';
import {
  ActivityLogResultDispatchStateContext,
  ActivityLogResultStateContext,
} from '../../../context/ActivityLogResult/ActivityLogResultProvider';
import { useFilters } from '../../../context/ActivityLogSearchCriteria/ActivityLogSearchCriteriaProvider';
import { ActivityLogResponse } from '../../../domain/ActivityLog/ActivityLogResult';
import { ActivityLogFilter } from '../../../types/types';
import {
  formatDateString,
  formatPhoneNumber,
  formatStringDateHoursAndMinutes,
  getSelectedStore,
} from '../../../utils/utils';
export const activityLogListTestId = 'activityLogListTestId';

const useClasses = makeStyles((theme: any) => ({
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
    '@media print': {
      padding: '1rem',
      boxShadow: 'none',
    },
  },
  paddingTopBottom8: {
    paddingTop: '.5rem',
    paddingBottom: '.5rem',
    '@media print': {
      paddingTop: '.2rem',
      paddingBottom: '.0rem',
    },
  },
  contentHeight: {
    height: theme.typography.pxToRem(500),
  },
  print: {
    '@media print': {
      width: '100vw',
    },
  },
  printFontSize: {
    '@media print': {
      fontSize: theme.typography.pxToRem(8),
      padding: '.2rem .2rem',
    },
  },
  sortIcon: {
    '@media print': {
      display: 'none',
    },
  },
  printPreviewHeaderWrapper: {
    display: 'none',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '2px solid Gray',
    paddingBottom: theme.typography.pxToRem(10),
    marginBottom: theme.typography.pxToRem(10),
    ...theme.typography.body1,
    fontSize: theme.typography.pxToRem(8),
    '@media print': {
      display: 'flex',
    },
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
}));

export const tableHeaderList = [
  'Date',
  'Call Time',
  'Customer',
  'Route',
  'Phone Number Dialed',
  'Phone Type',
  'A/M Activity',
  'Contact Name',
  'Relation',
  'Days Late',
  'Commitment Date',
  'Commitment Time',
  'Status',
  'Due Date',
  'Employee',
];

export const ActivityLogList = () => {
  const initialCallToken = useRef<CancelTokenSource>();

  const [offset, setOffset] = useState<number>(INITIAL_OFFSET);
  const [isFirstFetch, setIsFirstFetch] = useState<boolean>(true);
  const classes = useClasses();
  const { filter } = useFilters();
  const { loading, hasApiError, activityLog, hasMore } = useContext(
    ActivityLogResultStateContext
  );
  const isActivityLogEmpty = !activityLog || activityLog?.length === 0;
  const {
    setFilteredActivityLog,
    setApiHasError,
    setApiLoadingState,
    clearActivityLog,
  } = useContext(ActivityLogResultDispatchStateContext);

  const renderTableHead = () => (
    <>
      {tableHeaderList.map((col, index) => {
        if (index === 0) {
          return (
            <RACTableCell
              key={index}
              classes={{
                root: clsx(classes.paddingTopBottom8, classes.printFontSize),
              }}
            >
              <TableSortLabel
                active
                classes={{ icon: classes.sortIcon }}
                // eslint-disable-next-line no-console
                onClick={() => console.log('Implement me!')}
              >
                {col}
              </TableSortLabel>
            </RACTableCell>
          );
        } else {
          return (
            <RACTableCell
              key={index}
              classes={{
                root: clsx(classes.paddingTopBottom8, classes.printFontSize),
              }}
            >
              {col}
            </RACTableCell>
          );
        }
      })}
    </>
  );

  const renderTableContent = () => {
    if (isActivityLogEmpty) return <></>;

    return renderTableContentFilled();
  };

  const renderTableContentFilled = () => (
    <>
      {activityLog?.map((log, index) => {
        const code: string | undefined = log.accountActivityType?.code;
        const description: string | undefined =
          code?.toUpperCase() ===
          WORKED_HISTORY_ACTIVITY_TYPE_CODES.CALL_CUSTOMER
            ? log.callResultType?.description
            : log.accountActivityType?.description;
        const soureName: string | undefined =
          code?.toUpperCase() ===
          WORKED_HISTORY_ACTIVITY_TYPE_CODES.TEXT_RECEIVED
            ? `${log.customerFirstName || ''} ${log.customerLastName || ''}`
            : `${log.coWorker?.firstName || ''} ${
                log.coWorker?.lastName || ''
              }`;

        return (
          <RACTableRow key={index} hover backgroundColor="white">
            <>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >
                {formatDateString(log.activityDate)}
              </RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >
                {formatStringDateHoursAndMinutes(log.activityDate)}
              </RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >{`${log.customerFirstName} ${log.customerLastName}`}</RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >
                {log.route?.description}
              </RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >
                {log.phoneNumberDialed &&
                  formatPhoneNumber(log.phoneNumberDialed)}
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
                  root: clsx(classes.printFontSize),
                }}
              >
                {description}
              </RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >{`${log.phoneContact?.firstName || ''} ${
                log.phoneContact?.lastName || ''
              }`}</RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >
                {log.phoneContact?.relationshipType?.description || ''}
              </RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >
                {log.daysLate}
              </RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >
                {formatDateString(log.commitment?.commitmentDate)}
              </RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >
                {formatStringDateHoursAndMinutes(
                  log.commitment?.commitmentDate
                )}
              </RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >
                {log.commitment?.commitmentStatus?.description}
              </RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >
                {formatDateString(log.pastDueDate)}
              </RACTableCell>
              <RACTableCell
                classes={{
                  root: clsx(classes.printFontSize),
                }}
              >
                {soureName}
              </RACTableCell>
            </>
          </RACTableRow>
        );
      })}
    </>
  );

  const formatAllFields = (field: string[]) =>
    field.includes(ALL_OPTION) ? [] : field;

  const createFilterPayload = (filter: ActivityLogFilter) => {
    return {
      ...filter,
      storeNumber: getSelectedStore(),
      daysPastDue: formatAllFields(filter.daysPastDue),
      language: formatAllFields(filter.language),
      coWorker: formatAllFields(filter.coWorker),
      phoneType: formatAllFields(filter.phoneType),
      route: formatAllFields(filter.route),
      accountActivityType: getSelectedAmActivityOptions(
        filter.accountActivityType || []
      ),
      callResult: formatAllFields(
        getSelectedCallActivityOptions(filter.accountActivityType || [])
      ),
    };
  };

  const getSelectedAmActivityOptions = (option: string[]) => {
    const selectedOptions: string[] = [];
    if (!option || option.length === 0) {
      selectedOptions.push(
        AM_ACTIVITY_OPTIONS.CALL_CUSTOMER,
        AM_ACTIVITY_OPTIONS.CALL_ALTERNATIVE,
        AM_ACTIVITY_OPTIONS.CALL_REFERENCE,
        AM_ACTIVITY_OPTIONS.CALL_EMPLOYER,
        AM_ACTIVITY_OPTIONS.TEXT_RECEIVED,
        AM_ACTIVITY_OPTIONS.TEXT_SENT,
        AM_ACTIVITY_OPTIONS.TEXT_SENT_FAILED,
        AM_ACTIVITY_OPTIONS.COMMITMENT,
        AM_ACTIVITY_OPTIONS.LP
      );
    } else {
      option.map((options) => {
        if (options.includes(ALL_OPTION))
          selectedOptions.push(
            AM_ACTIVITY_OPTIONS.CALL_CUSTOMER,
            AM_ACTIVITY_OPTIONS.CALL_ALTERNATIVE,
            AM_ACTIVITY_OPTIONS.CALL_REFERENCE,
            AM_ACTIVITY_OPTIONS.CALL_EMPLOYER,
            AM_ACTIVITY_OPTIONS.TEXT_RECEIVED,
            AM_ACTIVITY_OPTIONS.TEXT_SENT,
            AM_ACTIVITY_OPTIONS.TEXT_SENT_FAILED,
            AM_ACTIVITY_OPTIONS.COMMITMENT,
            AM_ACTIVITY_OPTIONS.LP
          );
        else if (
          options.toUpperCase() === AM_ACTIVITY_OPTIONS.TEXT_RECEIVED ||
          options.toUpperCase() === AM_ACTIVITY_OPTIONS.TEXT_SENT ||
          options.toUpperCase() === AM_ACTIVITY_OPTIONS.TEXT_SENT_FAILED
        ) {
          selectedOptions.push(options);
        } else if (
          selectedOptions.includes(AM_ACTIVITY_OPTIONS.CALL_CUSTOMER)
        ) {
          return selectedOptions;
        } else {
          selectedOptions.push(
            AM_ACTIVITY_OPTIONS.CALL_CUSTOMER,
            AM_ACTIVITY_OPTIONS.CALL_ALTERNATIVE,
            AM_ACTIVITY_OPTIONS.CALL_REFERENCE,
            AM_ACTIVITY_OPTIONS.CALL_EMPLOYER
          );
        }
      });
      return selectedOptions;
    }
    return selectedOptions;
  };

  const getSelectedCallActivityOptions = (option: string[]) => {
    const selectedCallOptions: string[] = [] || undefined;
    option.map((options) => {
      if (
        options.toUpperCase() === AM_ACTIVITY_OPTIONS.TEXT_RECEIVED ||
        options.toUpperCase() === AM_ACTIVITY_OPTIONS.TEXT_SENT ||
        options.toUpperCase() === AM_ACTIVITY_OPTIONS.TEXT_SENT_FAILED
      )
        return selectedCallOptions;
      else selectedCallOptions.push(options);
    });
    return selectedCallOptions;
  };

  const fetchActivityLogs = (resetActivityLog: boolean) => {
    if (initialCallToken?.current) {
      initialCallToken.current?.cancel();
    }
    initialCallToken.current = getCancelTokenSource();

    setApiHasError(false);
    setApiLoadingState(true);
    getActivityLogs(
      createFilterPayload(filter),
      offset,
      ACTIVITY_LOG_API_LIMIT,
      undefined,
      undefined,
      initialCallToken.current?.token
    )
      .then((response: ActivityLogResponse) => {
        const responseToUse = {} as ActivityLogResponse;
        if (response?.accountActivities?.length) {
          responseToUse.accountActivities = response.accountActivities.map(
            (accountActivity) => {
              if (!accountActivity.commitment) {
                return accountActivity;
              }
              return {
                ...accountActivity,
                commitment: {
                  ...accountActivity.commitment,
                  commitmentStatus:
                    accountActivity.commitment.commitmentActualStatus,
                },
              };
            }
          );
        }
        const accountActivitiesWithAutoSystemText =
          responseToUse?.accountActivities?.map((al: any) => {
            if (
              al?.coWorker?.firstName ===
                TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY ||
              al?.coWorker?.lastName ===
                TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY
            ) {
              return {
                ...al,
                coWorker: {
                  ...al?.coWorker,
                  firstName: AUTO_SYSTEM_TEXT,
                  lastName: '',
                },
              };
            }
            return al;
          });
        setFilteredActivityLog(
          accountActivitiesWithAutoSystemText || [],
          resetActivityLog
        );
        setApiLoadingState(false);
      })
      .catch((err) => {
        if (!err.__CANCEL__) {
          setApiHasError(true);
          setFilteredActivityLog([], resetActivityLog);
          setApiLoadingState(false);
        }
      });
  };

  useEffect(() => {
    clearActivityLog();
    if (offset === INITIAL_OFFSET && !isFirstFetch) {
      fetchActivityLogs(true);
      setIsFirstFetch(false);
    }
    setOffset(INITIAL_OFFSET);
  }, [filter]);

  useEffect(() => {
    fetchActivityLogs(false);
    setIsFirstFetch(false);
  }, [offset]);

  /*
  Increment the offset.
  Fetch is handled in the useEffect that listens on the offset.
  */
  const fetchNextPage = () => {
    /*
    fetchNextPage is used by infinite scroll component
    the first fetch is handled by our component, therefore we are not letting the
    infinite scroll to trigger the first request.
    Handles the case when you apply the filters
    (offset set to 0 -> request is triggered, but infinite scroll is also triggering a request, because its data length is 0)
    */
    if (activityLog.length < 1) return;
    setOffset(offset + ACTIVITY_LOG_API_LIMIT);
  };
  return (
    <div className={clsx(classes.activityLogListWrapper, classes.print)}>
      <div
        className={classes.activityLogList}
        data-testid={activityLogListTestId}
      >
        <InfiniteScroll
          next={fetchNextPage}
          dataLength={activityLog.length}
          hasMore={hasMore}
          height={500}
          loader={loading && activityLog?.length ? <Loader /> : null}
        >
          <ApiStateWrapper
            // show loading only for the first request
            loading={loading && activityLog.length === 0}
            // show error only if the first request fails
            hasApiError={hasApiError && activityLog.length === 0}
            response={activityLog}
            successContent={
              <RACTable
                renderTableHead={renderTableHead}
                renderTableContent={renderTableContent}
                stickyHeader
              />
            }
            classes={{
              loader: classes.contentHeight,
              apiError: classes.contentHeight,
              noItems: classes.contentHeight,
            }}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};
