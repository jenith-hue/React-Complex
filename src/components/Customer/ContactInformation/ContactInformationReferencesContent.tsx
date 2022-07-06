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
import { abbrev, formatPhoneNumber } from '../../../utils/utils';
import { CustomerLocationState } from '../../../types/types';
import { withContactStyles, WrappedComponentProps } from './withContactStyles';

export const ContactInformationReferencesContent_ = ({
  classes,
  onLogClicked,
}: WrappedComponentProps) => {
  const {
    customerDetails: { personalReferences: data },
    isLogActivityAllowed,
  } = useCustomerDetails();
  const location = useLocation<CustomerLocationState>();

  const renderTableHead = () => (
    <>
      <RACTableCell>Name</RACTableCell>
      <RACTableCell>Phone Number</RACTableCell>
      <RACTableCell>Relation</RACTableCell>
      <RACTableCell>Best Time to Call</RACTableCell>
      <RACTableCell># Contacts Today</RACTableCell>
      <RACTableCell>Last Call Result</RACTableCell>
      <RACTableCell align="center">Action</RACTableCell>
    </>
  );

  const customerId =
    location?.state?.customer?.customerId || location?.pathname?.split('/')[3];

  const renderTableContent = () => (
    <React.Fragment>
      {data?.map((dataObj) => (
        <RACTableRow
          backgroundColor="white"
          key={
            dataObj.personalReferenceId
              ? `PR${dataObj.personalReferenceId}`
              : `LR${dataObj.landlordReferenceId}`
          }
        >
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {dataObj.firstName
                ? `${dataObj.firstName} ${dataObj.lastName || ''}`
                : `${dataObj.landlordFirstName || ''} ${
                    dataObj.landlordLastName || ''
                  }`}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {formatPhoneNumber(
                dataObj.phoneNumber,
                dataObj.doNotCall === 'Y' || !isLogActivityAllowed
              )}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {dataObj.relationshipTypeDesc}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {dataObj.bestTimeToCallDesc}
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
          <RACTableCell align="center">
            <RACButton
              variant="outlined"
              color="primary"
              className={classes.logButton}
              onClick={() =>
                onLogClicked(customerId, dataObj.phoneNumber?.split('.')[0])
              }
              disabled={
                !dataObj?.phoneNumber ||
                !isLogActivityAllowed ||
                dataObj.doNotCall === 'Y'
              }
            >
              Log
            </RACButton>
          </RACTableCell>
        </RACTableRow>
      ))}
    </React.Fragment>
  );
  return (
    <RACTable
      renderTableHead={renderTableHead}
      renderTableContent={renderTableContent}
    />
  );
};

export const ContactInformationReferencesContent = (props: any) =>
  withContactStyles(props)(ContactInformationReferencesContent_);
