import {
  makeStyles,
  RACCOLOR,
  RACTable,
  RACTableCell,
  RACTableRow,
  Typography,
} from '@rentacenter/racstrap';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  ApiStateWrapper,
  Loader,
} from '../../../common/ApiStateWrapper/ApiStateWrapper';
import {
  useAgreementInfo,
  useAgreementInfoActions,
} from '../../../context/AgreementInfo/AgreementInfoProvider';
import { formatDateString } from '../../../utils/utils';
import { AgreementInfoDaysLate } from '../../../types/types';
import { AppRoute } from '../../../config/route-config';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';

const useClasses = makeStyles((theme: any) => ({
  tableContentColor: {
    color: RACCOLOR.INDEPENDENCE,
  },
  tableRoot: {
    marginTop: theme.typography.pxToRem(16),
  },
  // aligns the content in the cell
  storeRowContentCell: {
    display: 'flex',
  },
  storeRowContent: {
    position: 'absolute',
  },
  notVisible: {
    visibility: 'hidden',
  },
  tableBody: {
    position: 'relative',
  },
  tableHead: {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    background: 'white',
  },
  contentHeight: {
    height: theme.typography.pxToRem(400),
  },
  greenColumn: {
    backgroundColor: '#81c783',
  },
  number: {
    color: RACCOLOR.BLUE_CRAYOLA,
    cursor: 'pointer',
  },
}));

export const EMPTY_DAYS_LATE_HISTORY = [
  { dayslate: 'On_Time', count: 0 },
  { dayslate: '1-6_Days_Late', count: 0 },
  { dayslate: '7-14_Days_Late', count: 0 },
  { dayslate: '15+_Days_Late', count: 0 },
];

export const populateDaysLateHistory = (
  daysLateHistory: AgreementInfoDaysLate[] | null | undefined
): AgreementInfoDaysLate[] => {
  return EMPTY_DAYS_LATE_HISTORY.map((emptyDaysLateObj) => {
    const daysLateObjFromAPI = daysLateHistory?.find(
      (obj) => obj.dayslate === emptyDaysLateObj.dayslate
    );

    return daysLateObjFromAPI || emptyDaysLateObj;
  });
};

export const AgreementInfo = () => {
  const { stores, total, numberOfLoadedAgreements, hasApiError, loading } =
    useAgreementInfo();
  const { customerDetails } = useCustomerDetails();
  const { customerId } = customerDetails || {};

  const renderTableHead = () => (
    <>
      <RACTableCell>
        <Typography variant="h5">Agreement</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Due Date</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Type</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Current</Typography>
      </RACTableCell>
      <RACTableCell color="green">
        <Typography className={classes.greenColumn} variant="h5">
          On Time
        </Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">1-6 Days Late</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">7-14 Days Late</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">15+ Days Late</Typography>
      </RACTableCell>
    </>
  );

  const daysLateHistoryCellGenerator = (
    daysLateHistory: AgreementInfoDaysLate[]
  ) => {
    const populatedDaysLateHistory = populateDaysLateHistory(daysLateHistory);

    return populatedDaysLateHistory.map(
      ({ count, dayslate }: AgreementInfoDaysLate) => (
        <RACTableCell key={dayslate}>
          <Typography variant="body2" className={classes.tableContentColor}>
            {count}
          </Typography>
        </RACTableCell>
      )
    );
  };
  const renderTableContent = () => (
    <>
      {stores?.map((storeObj) => {
        if (!storeObj?.agreements?.length) return null;

        return storeObj?.agreements?.map(
          (
            {
              agreementNumber,
              agreementId,
              nextDueDate,
              currentDaysLate,
              daysLateHistory,
              contractType,
            },
            index
          ) => {
            const dueDateString = `${formatDateString(nextDueDate)}`;
            const showAgreementNumLink = contractType === 'CLUB' ? false : true;
            return (
              <>
                {index === 0 && (
                  <RACTableRow
                    key={`${index}-${storeObj.storeNumber}`}
                    backgroundColor="white"
                  >
                    <RACTableCell className={classes.storeRowContentCell}>
                      <div className={classes.storeRowContent}>
                        <Typography variant="h4">{`${storeObj.storeNumber} - ${storeObj.city}, ${storeObj.state}`}</Typography>
                      </div>
                    </RACTableCell>
                    <RACTableCell>
                      <Typography
                        noWrap
                        display="inline"
                        variant="body2"
                        className={classes.notVisible}
                      >
                        {/* Using typography to ensure that all rows have the same
                        height(this is not visible in the table)*/}
                        0
                      </Typography>
                    </RACTableCell>
                  </RACTableRow>
                )}
                <RACTableRow key={index} backgroundColor="white">
                  <RACTableCell classes={{ root: classes.number }}>
                    {showAgreementNumLink ? (
                      <Link
                        style={{ color: 'inherit', textDecoration: 'unset' }}
                        to={{
                          pathname: `${AppRoute.CustomerAggrement}/${customerId}/${agreementId}`,
                          search: `?origin=am-customer`,
                        }}
                        className={'disi'}
                      >
                        {agreementNumber}
                      </Link>
                    ) : (
                      <Typography
                        display="inline"
                        variant="body2"
                        className={classes.tableContentColor}
                      >
                        {agreementNumber}
                      </Typography>
                    )}
                  </RACTableCell>
                  <RACTableCell>
                    <Typography
                      display="inline"
                      variant="body2"
                      className={classes.tableContentColor}
                    >
                      {dueDateString}
                    </Typography>
                  </RACTableCell>
                  <RACTableCell>
                    <Typography
                      display="inline"
                      variant="body2"
                      className={classes.tableContentColor}
                    >
                      {contractType}
                    </Typography>
                  </RACTableCell>
                  <RACTableCell>
                    <Typography
                      display="inline"
                      variant="body2"
                      className={classes.tableContentColor}
                    >
                      {currentDaysLate}
                    </Typography>
                  </RACTableCell>
                  {daysLateHistoryCellGenerator(daysLateHistory)}
                </RACTableRow>
              </>
            );
          }
        );
      })}
    </>
  );
  const classes = useClasses();
  const { fetchAgreementInfo } = useAgreementInfoActions();

  const initialLoad = () => {
    fetchAgreementInfo();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(initialLoad, []);
  return (
    <InfiniteScroll
      next={fetchAgreementInfo}
      dataLength={numberOfLoadedAgreements}
      hasMore={numberOfLoadedAgreements < total}
      height={330}
      loader={<Loader />}
    >
      <ApiStateWrapper
        loading={loading}
        hasApiError={hasApiError}
        response={stores}
        successContent={
          <RACTable
            bodyClasses={{ root: classes.tableBody }}
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
  );
};
