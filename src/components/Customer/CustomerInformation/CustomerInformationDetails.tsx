import {
  Grid,
  makeStyles,
  RACCheckBox,
  RACCOLOR,
  Typography,
} from '@rentacenter/racstrap';
import clsx from 'clsx';
import React from 'react';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import { useCustomerPaymentSummary } from '../../../context/CustomerPaymentSummary/CustomerPaymentSummaryProvider';
import { formatDateString } from '../../../utils/utils';

import { CustomerAddress } from './CustomerAddress';
import {
  getPaymentScheduleValue,
  getDaysPaidValue,
} from '../../../constants/constants';

const useStyles = makeStyles((theme: any) => ({
  container: {
    width: '100%',
    margin: '1.25rem',
  },
  halfContainer: {
    width: '100%',
  },
  noLeftPadding: {
    paddingLeft: '0 !important',
  },
  leftRightPadding12: {
    padding: `${theme.typography.pxToRem(0)} ${theme.typography.pxToRem(12)}`,
  },
  valueText: {
    color: `${RACCOLOR.GRAY}`,
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  outlinedBox: {
    width: 'fit-content',
    background: RACCOLOR.LAVENDER_MIST,
    padding: theme.typography.pxToRem(15),
    borderRadius: theme.typography.pxToRem(6),
  },
  outlinedBoxValue: {
    fontFamily: 'OpenSans-bold',
  },
  noTopAndBottomPadding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  boxesContainer: {
    padding: `
    ${theme.typography.pxToRem(24)} 
    ${theme.typography.pxToRem(24)} ${theme.typography.pxToRem(
      24
    )} ${theme.typography.pxToRem(10)}`,
  },
  alignChildrenBottom: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
}));

export const CustomerInformationDetails = () => {
  const classes = useStyles();
  const {
    customerDetails: {
      pifAgreements,
      epoAgreements,
      skip,
      hard,
      employerReferences,
      customerSinceDate,
    },
  } = useCustomerDetails();

  const { customerPaymentSummary: customerPaymentSummaryResponse } =
    useCustomerPaymentSummary();

  const createdDateString = `${formatDateString(customerSinceDate)}`;

  const activeEmployerReferences =
    employerReferences &&
    employerReferences.filter(
      (employer) => employer.active?.toUpperCase() === 'Y'
    );

  const primaryActiveEmployerReferences =
    activeEmployerReferences && activeEmployerReferences[0];

  return (
    <div className={classes.container}>
      <Grid container>
        <Grid item sm={6} md={6} lg={6}>
          <CustomerAddress />
        </Grid>
        <Grid item sm={6} md={6} lg={6}>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
            classes={{ root: classes.leftRightPadding12 }}
          >
            <Grid item sm={6} md={6} lg={6}>
              <Grid container spacing={3}>
                <Grid item md={12} lg={12}>
                  <Typography variant="h4">Payment & Agreement Info</Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={5}>
                  <Typography display="inline" variant="body1">
                    PIF Agreements:
                  </Typography>
                </Grid>
                <Grid
                  className={classes.alignChildrenBottom}
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={7}
                >
                  <Typography
                    display="inline"
                    variant="body1"
                    className={classes.valueText}
                  >
                    {pifAgreements}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={5}>
                  <Typography display="inline" variant="body1">
                    EPO Agreements:
                  </Typography>
                </Grid>
                <Grid
                  className={classes.alignChildrenBottom}
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={7}
                >
                  <Typography
                    display="inline"
                    variant="body1"
                    className={classes.valueText}
                  >
                    {epoAgreements}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={5}>
                  <Typography display="inline" variant="body1">
                    NSFC/CCCB:{' '}
                  </Typography>
                </Grid>
                <Grid
                  className={classes.alignChildrenBottom}
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={7}
                >
                  <Typography
                    display="inline"
                    variant="body1"
                    className={classes.valueText}
                  >
                    {customerPaymentSummaryResponse?.paymentMetrics
                      ?.nsfAndCccbCount || ''}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={6} md={6} lg={6}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography variant="h4">Payday Information</Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={5}>
                  <Typography display="inline" variant="body1">
                    Payment schedule:
                  </Typography>
                </Grid>
                <Grid
                  className={classes.alignChildrenBottom}
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={7}
                >
                  <Typography
                    display="inline"
                    variant="body1"
                    className={classes.valueText}
                  >
                    {primaryActiveEmployerReferences &&
                      getPaymentScheduleValue[
                        primaryActiveEmployerReferences.employerPayschedule
                      ]}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={5}>
                  <Typography display="inline" variant="body1">
                    Day paid:
                  </Typography>
                </Grid>
                <Grid
                  className={classes.alignChildrenBottom}
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={7}
                >
                  <Typography
                    display="inline"
                    variant="body1"
                    className={classes.valueText}
                  >
                    {(primaryActiveEmployerReferences &&
                      getDaysPaidValue[
                        primaryActiveEmployerReferences?.daysPaid
                      ]) ||
                      primaryActiveEmployerReferences?.daysPaid}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <RACCheckBox
                    label="Skip"
                    classes={{
                      checkbox: clsx(
                        classes.noLeftPadding,
                        classes.noTopAndBottomPadding
                      ),
                    }}
                    checked={skip?.toUpperCase() === 'Y'}
                    disabled
                  />
                  <RACCheckBox
                    label="Hard"
                    disabled
                    checked={hard?.toUpperCase() === 'Y'}
                    classes={{ checkbox: classes.noTopAndBottomPadding }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
              classes={{ root: classes.boxesContainer }}
            >
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <div className={classes.outlinedBox}>
                  <Typography display="inline" variant="body1" color="primary">
                    Total revenue:{' '}
                  </Typography>
                  <Typography
                    display="inline"
                    variant="body1"
                    color="primary"
                    className={classes.outlinedBoxValue}
                  >
                    $
                    {customerPaymentSummaryResponse?.paymentMetrics
                      ?.totalRevenue || ''}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <div className={classes.outlinedBox}>
                  <Typography display="inline" variant="body1" color="primary">
                    Customer since:
                  </Typography>
                  <Typography
                    display="inline"
                    variant="body1"
                    color="primary"
                    className={classes.outlinedBoxValue}
                  >
                    {` ${createdDateString}`}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
