import { Typography, withStyles } from '@rentacenter/racstrap';
import clsx from 'clsx';
import React from 'react';
import { getNameForAbbreviation, StateAbbreviation } from '../../domain/Common';
import { PrintLetterDetails } from '../../types/types';
import {
  formatDateString,
  formatPhoneNumberForPrintLetter,
} from '../../utils/utils';

export interface HalfwayNoticeLetterProps {
  printLetterDetails: PrintLetterDetails;
  classes?: any;
}

const useStyles = (theme: any) => ({
  allLettersContainer: {
    width: '100%',
  },
  breakPage: {
    breakBefore: 'page',
  },
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
  alignLeft: {
    textAlign: 'left',
  },
  lineHeight7: {
    lineHeight: theme.typography.pxToRem(7),
  },
  margin20: {
    marginBottom: theme.typography.pxToRem(20),
  },
});

const dateFormat = 'MM-dd-yyyy';

// This has to be class component, in order to integrate with react-to-print
class ComponentToPrint extends React.Component<HalfwayNoticeLetterProps> {
  render() {
    const {
      classes,
      printLetterDetails: { customer, store, dateOfNotice },
    } = this.props;
    return (
      <div className={classes.allLettersContainer}>
        {customer.map(
          (
            {
              firstName,
              lastName,
              rentalAgreementExpiration,
              deadlineToReturnProperty,
              address: customerAddress,
            },
            index
          ) => {
            const { address, phoneNumber } = store;
            const storeAddressLines = [
              address.addressLine1,
              address.addressLine2,
            ]
              .filter(Boolean)
              .join(', ');
            const storeAddressDetails = [
              address.city,
              getNameForAbbreviation(address.state as StateAbbreviation),
              address.zipCode,
            ]
              .filter(Boolean)
              .join(', ');
            const formatedPhoneNumber =
              formatPhoneNumberForPrintLetter(phoneNumber) || phoneNumber;
            const customerName = `${firstName} ${lastName}`;
            const customerAddressLineDetails = [
              customerAddress.addressLine1,
              customerAddress.addressLine2,
            ]
              .filter(Boolean)
              .join(', ');
            const customerAddressDetails = [
              customerAddress.city,
              getNameForAbbreviation(
                customerAddress.state as StateAbbreviation
              ),
              customerAddress.zipCode,
            ]
              .filter(Boolean)
              .join(', ');

            return (
              <span key={index}>
                <div className={classes.halfwayNoticeContainer}>
                  <div className={clsx(classes.section, classes.alignLeft)}>
                    <Typography align="left" variant="h6">
                      Rent-A-Center, Inc.
                    </Typography>
                  </div>
                  <div
                    className={clsx(classes.section, classes.headerMetadata)}
                  >
                    <Typography
                      align="left"
                      variant="h6"
                      className={clsx(classes.paragraph, classes.lineHeight7)}
                    >
                      {storeAddressLines}
                    </Typography>
                    <Typography
                      align="left"
                      variant="h6"
                      className={clsx(classes.paragraph, classes.lineHeight7)}
                    >
                      {storeAddressDetails}
                    </Typography>
                    <Typography
                      align="left"
                      variant="h6"
                      className={clsx(
                        classes.paragraph,
                        classes.lineHeight7,
                        classes.margin20
                      )}
                    >
                      {formatedPhoneNumber}
                    </Typography>
                    <Typography
                      align="left"
                      variant="h6"
                      className={clsx(classes.paragraph, classes.lineHeight7)}
                    >
                      {customerName}
                    </Typography>
                    <Typography
                      align="left"
                      variant="h6"
                      className={clsx(classes.paragraph, classes.lineHeight7)}
                    >
                      {customerAddressLineDetails}
                    </Typography>
                    <Typography
                      align="left"
                      variant="h6"
                      className={clsx(classes.paragraph, classes.lineHeight7)}
                    >
                      {customerAddressDetails}
                    </Typography>
                  </div>
                  <div className={clsx(classes.section, classes.alignLeft)}>
                    <Typography
                      variant="h5"
                      align="center"
                      className={classes.paragraph}
                    >
                      5-Day Demand Notice For Return of Rented Property
                    </Typography>
                    <div>
                      <Typography align="left" display="inline" variant="h5">
                        Date Rental Agreement Expired:
                      </Typography>
                      <Typography
                        align="left"
                        display="inline"
                        variant="h6"
                        className={classes.underline}
                      >
                        {` ${formatDateString(
                          rentalAgreementExpiration.split('T')[0],
                          dateFormat
                        )}`}
                      </Typography>
                    </div>
                    <div>
                      <Typography align="left" display="inline" variant="h5">
                        Date of Notice:
                      </Typography>
                      <Typography
                        align="left"
                        display="inline"
                        variant="h6"
                        className={classes.underline}
                      >
                        {` ${formatDateString(
                          dateOfNotice.split('T')[0],
                          dateFormat
                        )}`}
                      </Typography>
                    </div>
                    <div>
                      <Typography align="left" display="inline" variant="h5">
                        Deadline to Return Property:
                      </Typography>
                      <Typography
                        align="left"
                        display="inline"
                        variant="h6"
                        className={classes.underline}
                      >
                        {` ${formatDateString(
                          deadlineToReturnProperty.split('T')[0],
                          dateFormat
                        )} `}
                      </Typography>
                      <Typography align="left" display="inline" variant="h6">
                        ( if a Sunday or a holiday, then the next business day).
                      </Typography>
                    </div>
                    <div className={classes.paragraph}>
                      <Typography align="left" display="inline" variant="h6">
                        To:
                      </Typography>
                      <Typography
                        align="left"
                        display="inline"
                        variant="h6"
                        className={classes.underline}
                      >
                        {` ${customerName}`}
                      </Typography>
                    </div>
                    <div className={classes.paragraph}>
                      <Typography align="left" variant="h6">
                        Your rental agreement expired more than 15 days ago when
                        you failed to make a renewal payment. Nevertheless, you
                        have refused to either renew your agreement or make
                        arrangements to return our property to our store.
                      </Typography>
                    </div>
                    <div className={classes.paragraph}>
                      <Typography align="left" variant="h6">
                        You must either return the rented property to our store
                        or contact me at the above phone number to schedule a
                        pick up time. We must receive the property no later than
                        5:00 p.m.on the above deadline date. This is consistent
                        with our legal rights under your rental agreement.
                      </Typography>
                    </div>
                    <div className={classes.paragraph}>
                      <Typography align="left" variant="h6">
                        Do not underestimate the seriousness of this situation.
                        Please call the Store Manager at the above phone number
                        to discuss the many options we have available to
                        successfully resolve this matter. We anticipate your
                        visit or call soon.
                      </Typography>
                    </div>
                  </div>
                  <div className={classes.paragraph}>
                    <Typography align="left" variant="h6">
                      Sincerely,
                    </Typography>
                    <Typography
                      align="left"
                      variant="h6"
                      className={classes.underline}
                    >
                      {/* {storeManagerName} */}
                    </Typography>
                    <Typography align="left" variant="h6">
                      Store Manager
                    </Typography>
                  </div>
                </div>
                <div className={classes.breakPage}> </div>
              </span>
            );
          }
        )}
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export default withStyles(useStyles)(ComponentToPrint);
