import {
  makeStyles,
  RACButton,
  RACCOLOR,
  RACTable,
  RACTableCell,
  RACTableRow,
  Typography,
} from '@rentacenter/racstrap';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import {
  ApiStateWrapper,
  Loader,
} from '../../../common/ApiStateWrapper/ApiStateWrapper';
import { days, RECEIPT_TYPE } from '../../../constants/constants';
import {
  usePaymentHistory,
  usePaymentHistoryActions,
} from '../../../context/PaymentHistory/PaymentHistoryProvider';
import { CustomerLocationState } from '../../../types/types';
import {
  formatDateString,
  formatStringDateHoursAndMinutes,
} from '../../../utils/utils';
import { Document } from '../../Document/Document';

const useClasses = makeStyles((theme: any) => ({
  tableContentColor: {
    color: RACCOLOR.INDEPENDENCE,
  },
  tableRoot: {
    marginTop: theme.typography.pxToRem(16),
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
}));

export const CurrentPaymentHistory = () => {
  const [receiptId, setReceiptId] = useState('');

  const {
    payments,
    total,
    numberOfLoadedPayments,
    hasApiError,
    loading,
    init,
  } = usePaymentHistory();

  const renderTableHead = () => (
    <>
      <RACTableCell>
        <Typography variant="h5">Date paid</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Day</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Time</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Receipt #</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Total Payment</Typography>
      </RACTableCell>
      <RACTableCell align="center">
        <Typography variant="h5">Next Due Date</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Days Ext</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5"># Days late</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Store</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Payment Origin</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Tender Type</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Net Rent</Typography>
      </RACTableCell>
      <RACTableCell>
        <Typography variant="h5">Club</Typography>
      </RACTableCell>
    </>
  );

  const renderTableContent = () => (
    <>
      {payments?.map((dataObj, index) => {
        const paymentDate = new Date(dataObj.paymentDate || '');
        return (
          <RACTableRow key={index} hover backgroundColor="white">
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {formatDateString(dataObj.paymentDate)}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {days[paymentDate.getDay()]}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {formatStringDateHoursAndMinutes(dataObj.paymentDate)}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <RACButton
                variant="text"
                size="small"
                color="primary"
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log('Implement mee');
                }}
              >
                <Typography
                  variant="body2"
                  color="primary"
                  onClick={() => {
                    setReceiptId(dataObj.receiptId as string);
                  }}
                >
                  {dataObj.receiptId}
                </Typography>
              </RACButton>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {dataObj.paymentAmount !== 'null'
                  ? `$${dataObj.paymentAmount}`
                  : '-'}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography
                align="center"
                variant="body2"
                className={classes.tableContentColor}
              >
                {formatDateString(dataObj.nextDueDate)}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {dataObj.daysExtension}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {dataObj.daysLate}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {dataObj.storeNumber}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {dataObj?.paymentOrigin?.description || ''}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {dataObj.paymentMethodType?.join(', ')}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {dataObj.netRentalRevenue !== 'null'
                  ? `$${dataObj.netRentalRevenue}`
                  : '-'}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {dataObj.clubPayment !== 'null'
                  ? `$${dataObj.clubPayment}`
                  : '-'}
              </Typography>
            </RACTableCell>
          </RACTableRow>
        );
      })}
    </>
  );
  const classes = useClasses();
  const { fetchPaymentHistory, resetPaymentData } = usePaymentHistoryActions();

  const initialLoad = () => {
    fetchPaymentHistory(true);
    return resetPaymentData;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(initialLoad, []);

  const location = useLocation<CustomerLocationState>();
  useEffect(() => {
    if (!location?.state?.customer) return;
    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.customer]);

  return (
    <>
      {receiptId && (
        <Document
          title="Receipt"
          documentId={receiptId}
          typeId={RECEIPT_TYPE}
          onClose={() => setReceiptId('')}
        />
      )}
      <InfiniteScroll
        next={fetchPaymentHistory}
        dataLength={numberOfLoadedPayments}
        hasMore={numberOfLoadedPayments < total}
        height={330}
        loader={<Loader />}
      >
        <ApiStateWrapper
          loading={loading && init}
          hasApiError={hasApiError}
          response={payments}
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
    </>
  );
};
