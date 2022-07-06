import {
  makeStyles,
  RACCOLOR,
  RACRowTip,
  RACTable,
  RACTableCell,
  RACTableRow,
  Typography,
} from '@rentacenter/racstrap';
import React, { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  ApiStateWrapper,
  Loader,
} from '../../../common/ApiStateWrapper/ApiStateWrapper';
import { LegendItemList } from '../../../common/Legend/LegendItemList';
import {
  INITIAL_OFFSET,
  WORKED_HISTORY_ACTIVITY_TYPE_CODES,
  WORKED_HISTORY_API_LIMIT,
} from '../../../constants/constants';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import {
  PastDueListCustomerStateContext,
  PastDueListCustomerDispatchStateContext,
} from '../../../context/PastDueListCustomer/PastDueListCustomerProvider';
import {
  useWorkedHistory,
  useWorkedHistoryActions,
} from '../../../context/WorkedHistory/WorkedHistoryProvider';
import { WorkedHistoryStatusLegendNames } from '../../../domain/WorkedHistory/WorkedHistory';
import { WorkedHistoryCommitmentType } from '../../../types/types';
import {
  abbrev,
  formatDateString,
  formatPhoneNumber,
  formatStringDateHoursAndMinutes,
} from '../../../utils/utils';
import { WorkedHistoryNotesModal } from './WorkedHistoryNotesModal';
import { CommitmentNotesModal } from './CommitmentNotesModal';

const useClasses = makeStyles((theme: any) => ({
  legendWrapper: {
    height: theme.typography.pxToRem(70),
  },
  tableContentColor: {
    color: RACCOLOR.INDEPENDENCE,
  },
  noLeftPadding: {
    paddingLeft: 0,
  },
  tableRoot: {
    marginTop: theme.typography.pxToRem(16),
  },
  tableHead: {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    background: 'white',
  },
  contentHeight: {
    height: theme.typography.pxToRem(330),
  },
  // row: {
  //   display: 'flex',
  // },
  notes: {
    cursor: 'pointer',
  },
  tipRoot: {
    borderLeftWidth: theme.typography.pxToRem(6),
  },
}));

export const WorkedHistory = () => {
  const [offset, setOffset] = useState<number>(INITIAL_OFFSET);
  const [isFirstFetch, setIsFirstFetch] = useState<boolean>(true);
  const {
    workedHistory: data,
    hasApiError,
    loading,
    reloadWorkedHistory,
    hasMore,
  } = useWorkedHistory();
  const { filter } = useContext(PastDueListCustomerStateContext);

  const { isLogActivityAllowed, customerDetails } = useCustomerDetails();
  const { firstName, lastName } = customerDetails || {};

  const { setSeletedFilter } = useContext(
    PastDueListCustomerDispatchStateContext
  );

  const onSelect = (selectedFilter: string) => {
    filter === selectedFilter
      ? setSeletedFilter('')
      : setSeletedFilter(selectedFilter);
  };
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isCommitmentNotesModalOpen, setIsCommitmentNotesModalOpen] =
    useState(false);
  const [selectedCommitment, setSelectedCommitment] =
    useState<WorkedHistoryCommitmentType | null>();
  const [workedResultText, setWorkedResultText] = useState('');
  const [noteText, setNoteText] = useState('');

  const handleCommitmentNotesModalClose = () => {
    setIsCommitmentNotesModalOpen(false);
    setSelectedCommitment(null);
  };

  const renderTableHead = () => (
    <>
      <RACTableCell>
        <Typography variant="h5">Worked Date & Time</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Worked Result</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Notes</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Commitment Status</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Due Date</Typography>
      </RACTableCell>
      <RACTableCell align="center">
        <Typography variant="h5">Days Late</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Phone # Dialed</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Relation</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Source</Typography>
      </RACTableCell>
    </>
  );
  const renderTableContent = () => (
    <>
      {data?.map((dataObj, index) => {
        const code: string | undefined = dataObj.accountActivityType?.code;
        const description: string | undefined =
          code?.toUpperCase() ===
          WORKED_HISTORY_ACTIVITY_TYPE_CODES.CALL_CUSTOMER
            ? dataObj.callResultType?.description
            : dataObj.accountActivityType?.description;
        const workedDateString = `${formatDateString(
          dataObj.activityDate
        )} ${formatStringDateHoursAndMinutes(dataObj.activityDate)}`;

        const noteText = dataObj.commitment?.notes || dataObj?.notes || '';

        const soureName: string | undefined =
          code?.toUpperCase() ===
          WORKED_HISTORY_ACTIVITY_TYPE_CODES.TEXT_RECEIVED
            ? `${firstName} ${lastName}`
            : `${dataObj.coWorker?.firstName || ''} ${
                dataObj.coWorker?.lastName || ''
              }`;

        return (
          <RACTableRow key={index} hover backgroundColor={dataObj.color?.row}>
            <RACTableCell
              classes={{
                root: classes.noLeftPadding,
              }}
            >
              <div
              // className={classes.row}
              >
                <RACRowTip
                  classes={{ root: classes.tipRoot }}
                  tipColor={dataObj.color?.tip || RACCOLOR.WHITE}
                />
                <Typography
                  display="inline"
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {workedDateString}
                </Typography>
              </div>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2">{description}</Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography
                noWrap
                variant="body2"
                className={classes.tableContentColor}
              >
                <Typography noWrap variant="body2" color="primary">
                  <span
                    className={classes.notes}
                    onClick={() => {
                      if (dataObj.commitment) {
                        setSelectedCommitment(dataObj.commitment);
                        setIsCommitmentNotesModalOpen(true);
                      } else {
                        setIsNotesModalOpen(true);
                        setWorkedResultText(description || '');
                        setNoteText(noteText);
                      }
                    }}
                  >
                    {abbrev(noteText)}
                  </span>
                </Typography>
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {dataObj.commitment?.commitmentStatus?.description}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {formatDateString(dataObj.pastDueDate)}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography
                align="center"
                variant="body2"
                className={classes.tableContentColor}
              >
                {dataObj.daysLate}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {formatPhoneNumber(
                  dataObj.phoneNumberDialed || '',
                  !isLogActivityAllowed
                )}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {dataObj.phoneContact?.relationshipType?.description || ''}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {soureName}
              </Typography>
            </RACTableCell>
          </RACTableRow>
        );
      })}
    </>
  );

  const classes = useClasses();
  const { fetchWorkedHistory } = useWorkedHistoryActions();

  useEffect(() => {
    if (!isFirstFetch && reloadWorkedHistory) {
      fetchWorkedHistory(offset, WORKED_HISTORY_API_LIMIT);
    }
    setIsFirstFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadWorkedHistory]);

  useEffect(() => {
    if (offset === INITIAL_OFFSET && isFirstFetch) {
      fetchWorkedHistory(offset, WORKED_HISTORY_API_LIMIT);
      setIsFirstFetch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFirstFetch) {
      fetchWorkedHistory(offset, WORKED_HISTORY_API_LIMIT);
    }
    setIsFirstFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    data.length > 1 && setOffset(offset + WORKED_HISTORY_API_LIMIT);
  };

  return (
    <>
      {isNotesModalOpen && (
        <WorkedHistoryNotesModal
          noteText={noteText}
          workedResultText={workedResultText}
          open={isNotesModalOpen}
          onClose={() => setIsNotesModalOpen(false)}
        />
      )}
      {isCommitmentNotesModalOpen && selectedCommitment && (
        <CommitmentNotesModal
          commitment={selectedCommitment}
          onClose={handleCommitmentNotesModalClose}
        />
      )}
      <div className={classes.legendWrapper}>
        <LegendItemList
          list={WorkedHistoryStatusLegendNames}
          onSelect={onSelect}
        />
      </div>
      <InfiniteScroll
        next={fetchNextPage}
        dataLength={data.length}
        hasMore={hasMore}
        height={330}
        loader={loading && data?.length ? <Loader /> : null}
      >
        <ApiStateWrapper
          loading={loading && data?.length === 0}
          hasApiError={hasApiError && data?.length === 0}
          response={data}
          successContent={
            <RACTable
              headClasses={{ root: classes.tableHead }}
              classes={{ root: classes.tableRoot }}
              renderTableHead={renderTableHead}
              renderTableContent={renderTableContent}
            />
          }
          classes={{
            loader: classes.contentHeight,
            apiError: classes.contentHeight,
            noItems: classes.contentHeight,
          }}
        />
      </InfiniteScroll>
    </>
  );
};
