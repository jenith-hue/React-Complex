import {
  RACButton,
  RACTable,
  RACTableCell,
  RACTableRow,
  RACTooltip,
  Typography,
} from '@rentacenter/racstrap';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import { CustomerLocationState } from '../../../types/types';
import { abbrev, formatPhoneNumber } from '../../../utils/utils';
import { withContactStyles, WrappedComponentProps } from './withContactStyles';

export const ContactInformationEmployerContent_ = ({
  classes,
  onLogClicked,
}: WrappedComponentProps) => {
  const {
    customerDetails: { employerReferences: data },
    isLogActivityAllowed,
  } = useCustomerDetails();
  const location = useLocation<CustomerLocationState>();

  const renderTableHead = () => (
    <>
      <RACTableCell>Company Name</RACTableCell>
      <RACTableCell>Employer Phone Number</RACTableCell>
      <RACTableCell># Contacts Today</RACTableCell>
      <RACTableCell>Last Call Result</RACTableCell>
      <RACTableCell align="center">Action</RACTableCell>
    </>
  );

  const customerId =
    location?.state?.customer?.customerId || location?.pathname?.split('/')[3];

  const renderTableContent = () => (
    <>
      {data?.map((dataObj) => (
        <RACTableRow backgroundColor="white" key={dataObj.employerReferenceId}>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {dataObj.employerName}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {formatPhoneNumber(
                dataObj.employerPhoneNumber,
                dataObj.doNotCall === 'Y' || !isLogActivityAllowed
              )}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography
              align="center"
              variant="body2"
              className={classes.tableContentColor}
            >
              {dataObj.communicationsToday}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography noWrap variant="body2" color="primary">
              <RACTooltip title={dataObj.lastCallResultDescription || ''}>
                <span>{abbrev(dataObj.lastCallResultDescription || '')}</span>
              </RACTooltip>
            </Typography>
          </RACTableCell>
          <RACTableCell className={classes.center}>
            <RACButton
              variant="outlined"
              color="primary"
              className={classes.logButton}
              onClick={() =>
                onLogClicked(customerId, dataObj.employerPhoneNumber)
              }
              disabled={
                !dataObj?.employerPhoneNumber ||
                !isLogActivityAllowed ||
                dataObj.doNotCall === 'Y'
              }
            >
              Log
            </RACButton>
          </RACTableCell>
        </RACTableRow>
      ))}
    </>
  );
  return (
    <RACTable
      renderTableHead={renderTableHead}
      renderTableContent={renderTableContent}
    />
  );
};

export const ContactInformationEmployerContent = (props: any) =>
  withContactStyles(props)(ContactInformationEmployerContent_);
