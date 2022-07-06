/* eslint-disable sonarjs/no-duplicate-string */
import {
  RACCOLOR,
  RACTable,
  RACTableCell,
  RACTableRow,
  Typography,
  withStyles,
} from '@rentacenter/racstrap';
import clsx from 'clsx';
import React from 'react';
import {
  FieldSheet,
  FieldSheetSection6PastDueAgreements,
  FieldSheetSection7Inventory,
  FieldSheetSection8Payments,
  FieldSheetSection9Total,
} from '../../types/types';
import { formatDate, toLocaleStringWithMinutes } from '../../utils/utils';

export interface FieldSheetLetterProps {
  fieldSheet: FieldSheet;
  classes?: any;
}

const useStyles = (theme: any) => ({
  breakPage: {
    breakBefore: 'page',
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: theme.typography.pxToRem(30),
    paddingTop: 0,
    background: 'white',
    gap: 4,
  },
  row: {
    display: 'flex',
    gap: 4,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  largeColumn: {
    display: 'flex',
    flexDirection: 'column',
    flex: 3,
  },
  tableContentColor: {
    color: RACCOLOR.INDEPENDENCE,
  },
  tableRowBackground: {
    color: 'transparent',
  },
  tableHead: {
    '& th': {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
    },
  },
  tableRoot: {
    '& td': {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
    },
  },
  alignItemsCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  highlightedBg: {
    background: RACCOLOR.SATIN_WHITE,
  },
  dottedBorder: {
    borderTopStyle: 'dotted',
    borderBottomStyle: 'dotted',
  },
  fullWidthUnderline: {
    width: '100%',
    borderBottomStyle: 'solid',
  },
  noWrap: {
    whiteSpace: 'nowrap',
  },
  textUnderline: {
    textDecoration: 'underline',
  },
  paddingBottom20: {
    paddingBottom: theme.typography.pxToRem(20),
  },
  carBox: {
    width: '100%',
    height: theme.typography.pxToRem(100),
    borderStyle: 'dotted',
  },
  withNewLine: {
    whiteSpace: 'pre-wrap',
  },
  marginRight15: {
    marginRight: theme.typography.pxToRem(15),
  },
  customerTextAlign: {
    verticalAlign: 'text-top',
  },
});

// This has to be class component, in order to integrate with react-to-print
class Template extends React.Component<FieldSheetLetterProps> {
  render() {
    const {
      classes,
      fieldSheet: {
        section1,
        section2,
        section2Corenter,
        section3NSFChargeback,
        section3CustomerCredits,
        section4CustomerAlerts,
        section5ProductBalances,
        section6,
        section10Club,
        section11PaymentsLast3,
        section12GrandTotal,
        section14Total,
        section14WorkedHistory,
        section15TotalCommitments,
        section16CommitmentsSinceDueDate,
      },
    } = this.props;
    const renderMetaHeader = () => (
      <>
        <RACTableCell>
          <Typography variant="h6">Route</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Store</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography align="right" variant="h6">
            Delivery
          </Typography>
        </RACTableCell>
      </>
    );

    const renderMetaContent = () => (
      <>
        <RACTableRow className={classes.tableRowBackground}>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section1.route}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section1.store}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography
              align="right"
              variant="body2"
              className={classes.tableContentColor}
            >
              {section1.delivery}
            </Typography>
          </RACTableCell>
        </RACTableRow>
      </>
    );

    const renderCustomerHeader = () => (
      <>
        <RACTableCell className={classes.customerTextAlign}>
          <Typography className={classes.highlightedBg} variant="h6">
            Customer
          </Typography>
        </RACTableCell>
        <RACTableCell className={classes.customerTextAlign}>
          <Typography className={classes.highlightedBg} variant="h6">
            Work
          </Typography>
        </RACTableCell>
        <RACTableCell className={classes.customerTextAlign}>
          <Typography
            className={classes.highlightedBg}
            align="center"
            variant="h6"
          >
            Vehicle
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography
            className={classes.highlightedBg}
            align="right"
            variant="h6"
          >
            Phone
          </Typography>
        </RACTableCell>
      </>
    );

    const renderCustomerContent = () => (
      <>
        <RACTableRow className={classes.tableRowBackground}>
          <RACTableCell className={classes.customerTextAlign}>
            <Typography
              variant="body2"
              className={clsx(classes.tableContentColor, classes.withNewLine)}
            >
              {section2.customerColumn}
            </Typography>
          </RACTableCell>
          <RACTableCell className={classes.customerTextAlign}>
            <Typography
              variant="body2"
              className={clsx(classes.tableContentColor, classes.withNewLine)}
            >
              {section2.workColumn}
            </Typography>
          </RACTableCell>
          <RACTableCell className={classes.customerTextAlign}>
            <Typography
              align="center"
              variant="body2"
              className={clsx(classes.tableContentColor, classes.withNewLine)}
            >
              {section2.vehicleColumn}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography
              align="right"
              variant="body2"
              className={clsx(classes.tableContentColor, classes.withNewLine)}
            >
              {section2.phoneColumn}
            </Typography>
          </RACTableCell>
        </RACTableRow>
        <RACTableRow className={classes.tableRowBackground}>
          <RACTableCell className={classes.customerTextAlign}>
            <Typography
              variant="body2"
              className={clsx(classes.tableContentColor, classes.withNewLine)}
            >
              {section2Corenter.customerColumn}
            </Typography>
          </RACTableCell>
          <RACTableCell className={classes.customerTextAlign}>
            <Typography
              variant="body2"
              className={clsx(classes.tableContentColor, classes.withNewLine)}
            >
              {section2Corenter.workColumn}
            </Typography>
          </RACTableCell>
          <RACTableCell className={classes.customerTextAlign}>
            <Typography
              align="center"
              variant="body2"
              className={clsx(classes.tableContentColor, classes.withNewLine)}
            >
              {section2Corenter.vehicleColumn}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography
              align="right"
              variant="body2"
              className={clsx(classes.tableContentColor, classes.withNewLine)}
            >
              {section2Corenter.phoneColumn}
            </Typography>
          </RACTableCell>
        </RACTableRow>
      </>
    );

    const renderCreditHeader = () => (
      <>
        <RACTableCell>
          <Typography variant="h6"></Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">NSF</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">ACH</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Chargeback</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Promo free days</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Suspense</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Promo</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">SIPS</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">COA</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Total</Typography>
        </RACTableCell>
      </>
    );

    const renderCreditContent = () => (
      <>
        <RACTableRow className={classes.tableRowBackground}>
          <RACTableCell>
            <Typography variant="h6" className={classes.tableContentColor}>
              Total number
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3NSFChargeback.nsfTotalNumber}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3NSFChargeback.achTotalNumber}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3NSFChargeback.chargebackTotalNumber}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3CustomerCredits.promoFreeDays}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3CustomerCredits.suspense}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3CustomerCredits.promo}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3CustomerCredits.sips}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3CustomerCredits.coa}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3CustomerCredits.total}
            </Typography>
          </RACTableCell>
        </RACTableRow>
        <RACTableRow className={classes.tableRowBackground}>
          <RACTableCell>
            <Typography variant="h6" className={classes.tableContentColor}>
              Total amount
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3NSFChargeback.nsfTotalAmount}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3NSFChargeback.achTotalAmount}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section3NSFChargeback.chargebackTotalAmount}
            </Typography>
          </RACTableCell>
          <RACTableCell></RACTableCell>
          <RACTableCell></RACTableCell>
          <RACTableCell></RACTableCell>
          <RACTableCell></RACTableCell>
          <RACTableCell></RACTableCell>
          <RACTableCell></RACTableCell>
        </RACTableRow>
      </>
    );

    const renderAlertsHeader = () => (
      <>
        <RACTableCell>
          <Typography variant="h6">Customer Alerts</Typography>
        </RACTableCell>
      </>
    );

    const renderAlertsContent = () => (
      <>
        {section4CustomerAlerts?.map((alert, index) => (
          <RACTableRow key={index} className={classes.tableRowBackground}>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {alert.alertTime}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {alert.alertText}
              </Typography>
            </RACTableCell>
          </RACTableRow>
        ))}
      </>
    );

    const renderProductBalancesHeader = () => (
      <>
        <RACTableCell>
          <Typography variant="h6">Product Balances</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Agreement #</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">EPO</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Remaining Value</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Paid In</Typography>
        </RACTableCell>
      </>
    );

    const renderProductBalancesContent = () => (
      <>
        {section5ProductBalances?.map((balance, index) => (
          <RACTableRow key={index} className={classes.tableRowBackground}>
            <RACTableCell>
              <Typography
                variant="body2"
                className={classes.tableContentColor}
              ></Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {balance.agreementNumber}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {balance.epo}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {balance.remainingValue}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {balance.paidIn}
              </Typography>
            </RACTableCell>
          </RACTableRow>
        ))}
      </>
    );

    const renderPastDueAgreementsHeader = () => (
      <>
        <RACTableCell>
          <Typography variant="h6">RA#</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Date</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">PD 1-6</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">PD 7-14</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">PD 15+</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Next Due Date</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Past Due</Typography>
        </RACTableCell>
      </>
    );

    const renderPastDueAgreementsContent =
      (data: FieldSheetSection6PastDueAgreements, index: number) => () =>
        (
          <>
            <RACTableRow
              key={`past-due-agreement-${index}`}
              className={classes.tableRowBackground}
            >
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {data.agreementNumber}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {data.date}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {data.pastDue1to6}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {data.pastDue7to14}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {data.pastDue15Plus}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {data.nextDueDate}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {data.pastDue}
                </Typography>
              </RACTableCell>
            </RACTableRow>
          </>
        );

    const renderInventoryHeader = () => (
      <>
        <RACTableCell>
          <Typography variant="h6">Inventory</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Dept</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">SubDep</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Brand</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Model #</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Serial #</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Item #</Typography>
        </RACTableCell>
      </>
    );

    const renderInventoryContent =
      (section6Inventory: FieldSheetSection7Inventory[], index: number) => () =>
        (
          <>
            {section6Inventory?.map((data, indexRow) => (
              <RACTableRow
                key={`inventory-${index}-${indexRow}`}
                className={classes.tableRowBackground}
              >
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  ></Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.department}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.subDepartment}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.brand}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.modelNumber}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.serialNumber}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.itemNumber}
                  </Typography>
                </RACTableCell>
              </RACTableRow>
            ))}
          </>
        );

    const renderPaymentHeader = () => (
      <>
        <RACTableCell>
          <Typography variant="h6">Payments</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Paid On</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Receipt</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Rental</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Tax</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Due Date</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Free Days</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Days Late</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Type</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Tendered</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Payoff Date</Typography>
        </RACTableCell>
      </>
    );

    const renderPaymentContent =
      (section6Payments: FieldSheetSection8Payments[], index: number) => () =>
        (
          <>
            {section6Payments?.map((data, indexRow) => (
              <RACTableRow
                key={`payments-${index}-${indexRow}`}
                className={classes.tableRowBackground}
              >
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  ></Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.paidOn}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.receipt}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.rental}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.tax}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.dueDate}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.freeDays}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.daysLate}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.type}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.tendered}
                  </Typography>
                </RACTableCell>
                <RACTableCell>
                  <Typography
                    variant="body2"
                    className={classes.tableContentColor}
                  >
                    {data.payOffDate}
                  </Typography>
                </RACTableCell>
              </RACTableRow>
            ))}
          </>
        );

    const renderTotalHeader = () => (
      <>
        <RACTableCell>
          <Typography variant="h6">Total</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Rent</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">LDW</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Carried Late</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Deferred Rent</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Carried Rent</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Other Fees</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Late Fees</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Tax</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Total</Typography>
        </RACTableCell>
      </>
    );

    const renderTotalContent =
      (total: FieldSheetSection9Total, index: number) => () =>
        (
          <>
            <RACTableRow
              key={`total-${index}`}
              className={classes.tableRowBackground}
            >
              <RACTableCell>
                <Typography
                  variant="h6"
                  className={classes.tableContentColor}
                ></Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {total.rent}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {total.ldw}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {total.carriedLate}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {total.deferredRent}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {total.carriedRent}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {total.otherFees}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {total.lateFees}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {total.tax}
                </Typography>
              </RACTableCell>
              <RACTableCell>
                <Typography
                  variant="body2"
                  className={classes.tableContentColor}
                >
                  {total.total}
                </Typography>
              </RACTableCell>
            </RACTableRow>
          </>
        );

    const renderClubHeader = () => (
      <>
        <RACTableCell>
          <Typography variant="h6">Club</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Active Since</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Due Date</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Past Due</Typography>
        </RACTableCell>
      </>
    );

    const renderClubContent = () => (
      <RACTableRow className={classes.tableRowBackground}>
        <RACTableCell>
          <Typography variant="body2" className={classes.tableContentColor}>
            {section10Club.club}
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="body2" className={classes.tableContentColor}>
            {section10Club.activeSince}
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="body2" className={classes.tableContentColor}>
            {section10Club.dueDate}
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="body2" className={classes.tableContentColor}>
            {section10Club.pastDue}
          </Typography>
        </RACTableCell>
      </RACTableRow>
    );

    const renderLastPaymentsHeader = () => (
      <>
        <RACTableCell>
          <Typography variant="h6">Payments (last 3)</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Paid On</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Receipt#</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Amount Paid</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Due Date</Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography variant="h6">Tendered</Typography>
        </RACTableCell>
      </>
    );

    const renderLastPaymentsContent = () => (
      <>
        {section11PaymentsLast3?.map((data, index) => (
          <RACTableRow key={index} className={classes.tableRowBackground}>
            <RACTableCell>
              <Typography
                variant="body2"
                className={classes.tableContentColor}
              ></Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.paidOn}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.receipt}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.amountPaid}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.dueDate}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.tendered}
              </Typography>
            </RACTableCell>
          </RACTableRow>
        ))}
      </>
    );

    const renderRentHeader = () => (
      <>
        <RACTableCell>
          <Typography
            className={classes.textUnderline}
            variant="h6"
          ></Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Rent
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            LDW
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Club
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Carried Late
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Deferred Rent
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Carried Rent
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Other Fees
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Late Fees
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Tax
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Total
          </Typography>
        </RACTableCell>
      </>
    );

    const renderRentContent = () => (
      <>
        <RACTableRow className={classes.tableRowBackground}>
          <RACTableCell>
            <Typography variant="h6" className={classes.tableContentColor}>
              Total
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section12GrandTotal.rent}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section12GrandTotal.ldw}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section12GrandTotal.club}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section12GrandTotal.carriedLate}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section12GrandTotal.deferredRent}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section12GrandTotal.carriedRent}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section12GrandTotal.otherFees}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section12GrandTotal.lateFees}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section12GrandTotal.tax}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {section12GrandTotal.total}
            </Typography>
          </RACTableCell>
        </RACTableRow>
      </>
    );

    const renderWorkedHistoryHeader = () => (
      <>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Date
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Phone # Dialed
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Worked Result
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Employee
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Relation
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Contact Name
          </Typography>
        </RACTableCell>
      </>
    );

    const renderWorkedHistoryContent = () => (
      <>
        {section14WorkedHistory?.map((data, index) => (
          <RACTableRow key={index} className={classes.tableRowBackground}>
            <RACTableCell>
              <Typography variant="h6" className={classes.tableContentColor}>
                {data.date}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.phoneDialed}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.workedResult}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.employee}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.relation}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.contactName}
              </Typography>
            </RACTableCell>
          </RACTableRow>
        ))}
      </>
    );

    const renderCommitmentsSinceDueDateHeader = () => (
      <>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Date
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Time
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Status
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            $ Amount
          </Typography>
        </RACTableCell>
        <RACTableCell>
          <Typography className={classes.textUnderline} variant="h6">
            Memo
          </Typography>
        </RACTableCell>
      </>
    );

    const renderCommitmentsSinceDueDateContent = () => (
      <>
        {section16CommitmentsSinceDueDate?.map((data, index) => (
          <RACTableRow key={index} className={classes.tableRowBackground}>
            <RACTableCell>
              <Typography variant="h6" className={classes.tableContentColor}>
                {data.date}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.time}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.status}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.amount}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {data.memo}
              </Typography>
            </RACTableCell>
          </RACTableRow>
        ))}
      </>
    );
    const now = new Date();
    return (
      <>
        <div className={classes.container}>
          <Typography align="center" variant="h4">
            Field Sheet
          </Typography>
          <div data-testid="metadata" className={classes.row}>
            <div className={classes.largeColumn}>
              <RACTable
                headClasses={{ root: classes.tableHead }}
                classes={{ root: classes.tableRoot }}
                renderTableHead={renderMetaHeader}
                renderTableContent={renderMetaContent}
              />
              <RACTable
                headClasses={{
                  root: clsx(classes.tableHead, classes.highlightedBg),
                }}
                classes={{ root: classes.tableRoot }}
                renderTableHead={renderCustomerHeader}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                renderTableContent={renderCustomerContent}
              />
            </div>
            <div className={classes.column}>
              <div className={clsx(classes.row, classes.spaceBetween)}>
                <Typography display="inline" variant="h6">
                  Date:
                </Typography>
                <Typography
                  className={classes.alignItemsCenter}
                  variant="body2"
                >
                  {formatDate(now)} {toLocaleStringWithMinutes(now)}
                </Typography>
              </div>
              <div className={clsx(classes.row, classes.spaceBetween)}>
                <Typography display="inline" variant="h6">
                  CAR notes:
                </Typography>
              </div>
              <div className={clsx(classes.row, classes.carBox)}></div>
            </div>
          </div>
          <div className={clsx(classes.row, classes.spaceBetween)}>
            <Typography
              className={classes.highlightedBg}
              display="inline"
              variant="h6"
            >
              NSF/Chargeback:
            </Typography>
            <Typography
              className={classes.highlightedBg}
              display="inline"
              variant="h6"
            >
              Cust Credits:
            </Typography>
            {
              // Placeholders to make flex align the previous 2 items correctly
            }
            <Typography display="inline" variant="h6"></Typography>
            <Typography display="inline" variant="h6"></Typography>
          </div>
          <RACTable
            headClasses={{
              root: clsx(classes.tableHead, classes.highlightedBg),
            }}
            classes={{ root: classes.tableRoot }}
            renderTableHead={renderCreditHeader}
            renderTableContent={renderCreditContent}
          />
          <RACTable
            headClasses={{
              root: clsx(classes.tableHead, classes.highlightedBg),
            }}
            classes={{ root: classes.tableRoot }}
            renderTableHead={renderAlertsHeader}
            renderTableContent={renderAlertsContent}
          />
          <RACTable
            headClasses={{
              root: clsx(classes.tableHead, classes.highlightedBg),
            }}
            classes={{ root: classes.tableRoot }}
            renderTableHead={renderProductBalancesHeader}
            renderTableContent={renderProductBalancesContent}
          />
          <div className={classes.row}>
            <Typography
              className={classes.highlightedBg}
              display="inline"
              variant="h6"
            >
              Past Due Agreements:
            </Typography>
          </div>
          <>
            {section6.map((data, index) => (
              <React.Fragment key={`section6-${index}`}>
                <RACTable
                  headClasses={{
                    root: clsx(classes.tableHead, classes.highlightedBg),
                  }}
                  classes={{ root: classes.tableRoot }}
                  renderTableHead={renderPastDueAgreementsHeader}
                  renderTableContent={renderPastDueAgreementsContent(
                    data?.section6PastDueAgreements,
                    index
                  )}
                />
                <RACTable
                  headClasses={{
                    root: clsx(classes.tableHead, classes.highlightedBg),
                  }}
                  classes={{ root: classes.tableRoot }}
                  renderTableHead={renderInventoryHeader}
                  renderTableContent={renderInventoryContent(
                    data?.section6Inventory,
                    index
                  )}
                />
                <RACTable
                  headClasses={{
                    root: clsx(classes.tableHead, classes.highlightedBg),
                  }}
                  classes={{ root: classes.tableRoot }}
                  renderTableHead={renderPaymentHeader}
                  renderTableContent={renderPaymentContent(
                    data?.section6Payments,
                    index
                  )}
                />
                <RACTable
                  headClasses={{
                    root: clsx(classes.tableHead, classes.highlightedBg),
                  }}
                  classes={{ root: classes.tableRoot }}
                  renderTableHead={renderTotalHeader}
                  renderTableContent={renderTotalContent(
                    data?.section6Total,
                    index
                  )}
                />
              </React.Fragment>
            ))}
          </>
          <RACTable
            headClasses={{
              root: clsx(classes.tableHead),
            }}
            classes={{ root: classes.tableRoot }}
            renderTableHead={renderLastPaymentsHeader}
            renderTableContent={renderLastPaymentsContent}
          />
          <div className={classes.row}>
            <Typography
              className={classes.noWrap}
              display="inline"
              variant="h6"
            >
              Grand Total All Past Due
            </Typography>
            <Typography
              className={classes.fullWidthUnderline}
              display="inline"
              variant="body2"
            ></Typography>
          </div>
          <RACTable
            headClasses={{
              root: clsx(classes.tableHead),
            }}
            classes={{ root: classes.tableRoot }}
            renderTableHead={renderRentHeader}
            renderTableContent={renderRentContent}
          />
          <div className={clsx(classes.row, classes.paddingBottom20)}>
            <Typography
              className={classes.noWrap}
              display="inline"
              variant="h6"
            >
              Current Agreements
            </Typography>
            <Typography
              className={classes.fullWidthUnderline}
              display="inline"
              variant="body2"
            ></Typography>
          </div>
          <div className={clsx(classes.row, classes.paddingBottom20)}>
            <Typography
              className={classes.noWrap}
              display="inline"
              variant="h6"
            >
              Club Details
            </Typography>
            <Typography
              className={clsx(classes.fullWidthUnderline)}
              display="inline"
              variant="body2"
            ></Typography>
          </div>
          <div className={classes.row}>
            <RACTable
              headClasses={{
                root: clsx(classes.tableHead, classes.dottedBorder),
              }}
              classes={{ root: classes.tableRoot }}
              renderTableHead={renderClubHeader}
              renderTableContent={renderClubContent}
            />
          </div>
          <div className={classes.row}>
            <Typography
              className={classes.fullWidthUnderline}
              display="inline"
              variant="body2"
            >
              {''}
            </Typography>
          </div>
          <div className={classes.row}>
            <Typography
              className={classes.noWrap}
              display="inline"
              variant="h6"
            >
              Total Worked History:
            </Typography>
            <Typography display="inline" variant="body2">
              {section14Total.totalWorkedHistoryDays}
            </Typography>
          </div>
          <div className={classes.row}>
            <Typography
              className={classes.noWrap}
              display="inline"
              variant="h6"
            >
              {`Worked History ( ${section14Total.workedHistoryDays}):`}
            </Typography>
            <Typography display="inline" variant="body2"></Typography>
          </div>
          <div className={classes.row}>
            <Typography
              className={classes.fullWidthUnderline}
              display="inline"
              variant="body2"
            >
              {''}
            </Typography>
          </div>
          <RACTable
            headClasses={{
              root: clsx(classes.tableHead),
            }}
            classes={{ root: classes.tableRoot }}
            renderTableHead={renderWorkedHistoryHeader}
            renderTableContent={renderWorkedHistoryContent}
          />
          <div className={classes.row}>
            <Typography
              className={classes.noWrap}
              display="inline"
              variant="h6"
            >
              Total Commitments:
            </Typography>
            <Typography display="inline" variant="body2">
              Total:
            </Typography>
            <Typography
              className={classes.marginRight15}
              display="inline"
              variant="body2"
            >
              {section15TotalCommitments.total}
            </Typography>
            <Typography display="inline" variant="body2">
              Open:
            </Typography>
            <Typography
              className={classes.marginRight15}
              display="inline"
              variant="body2"
            >
              {section15TotalCommitments.open}
            </Typography>
            <Typography display="inline" variant="body2">
              Honored:
            </Typography>
            <Typography
              className={classes.marginRight15}
              display="inline"
              variant="body2"
            >
              {section15TotalCommitments.honored}
            </Typography>
            <Typography display="inline" variant="body2">
              Broken:
            </Typography>
            <Typography
              className={classes.marginRight15}
              display="inline"
              variant="body2"
            >
              {section15TotalCommitments.broken}
            </Typography>
            <Typography display="inline" variant="body2">
              Revised:
            </Typography>
            <Typography
              className={classes.marginRight15}
              display="inline"
              variant="body2"
            >
              {section15TotalCommitments.revised}
            </Typography>
            <Typography display="inline" variant="body2">
              Broken Paid:
            </Typography>
            <Typography display="inline" variant="body2">
              {section15TotalCommitments.brokenPaid}
            </Typography>
          </div>
          <div className={classes.row}>
            <Typography
              className={classes.noWrap}
              display="inline"
              variant="h6"
            >
              Commitments (Since Due Date):
            </Typography>
            <Typography display="inline" variant="body2"></Typography>
          </div>
          <div className={classes.row}>
            <Typography
              className={classes.fullWidthUnderline}
              display="inline"
              variant="body2"
            >
              {''}
            </Typography>
          </div>
          <RACTable
            headClasses={{
              root: clsx(classes.tableHead),
            }}
            classes={{ root: classes.tableRoot }}
            renderTableHead={renderCommitmentsSinceDueDateHeader}
            renderTableContent={renderCommitmentsSinceDueDateContent}
          />
        </div>
        <div className={classes.breakPage}> </div>
      </>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export default withStyles(useStyles)(Template);
