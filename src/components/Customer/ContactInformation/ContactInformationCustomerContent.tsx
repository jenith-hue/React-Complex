import {
  RACButton,
  RACTable,
  RACTableCell,
  RACTableRow,
  RACTooltip,
  Typography,
} from '@rentacenter/racstrap';

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import { CustomerLocationState, Phone } from '../../../types/types';
import { EditContactInformationModal } from './EditContactInformationModal';
import { withContactStyles, WrappedComponentProps } from './withContactStyles';
import { abbrev, formatPhoneNumber } from '../../../utils/utils';
import clsx from 'clsx';
import { useTextConversationActions } from '../../../context/TextConversationProvider/TextConversationProvider';

const ContactInformationCustomerContent_ = ({
  classes,
  onLogClicked,
}: WrappedComponentProps) => {
  const {
    customerDetails: { phones, firstName, lastName },
    isLogActivityAllowed,
  } = useCustomerDetails();
  const location = useLocation<CustomerLocationState>();

  const [
    showEditCustomerInformationModal,
    setShowEditCustomerInformationModal,
  ] = useState<boolean>(false);

  const [tempPhone, setTempPhone] = useState<Phone>();
  const popUpPhoneInstructions = (phone: Phone): void => {
    setTempPhone(phone);
    setShowEditCustomerInformationModal(true);
  };

  const closePhoneInstructionModal = () => {
    setShowEditCustomerInformationModal(false);
  };
  const { updatePhoneOptionsfromEdit } = useTextConversationActions();
  const updatePhoneNotes = (
    phoneId: string,
    notes: string,
    bestTimeToCall: string,
    phoneNumber: string,
    phoneType: string,
    ext: string
  ) => {
    phones?.map((one) => {
      if (phoneId == one.phoneId) {
        one.note = notes;
        one.callTimeTypeDesc = bestTimeToCall;
        one.phoneNumber = phoneNumber;
        one.extension = ext;
        one.phoneTypeDesc = phoneType;
      }
    });
    if (phoneType === 'Cell Phone') {
      updatePhoneOptionsfromEdit();
    }
  };
  const renderTableHead = () => (
    <>
      <RACTableCell>Name</RACTableCell>
      <RACTableCell>Phone Number</RACTableCell>
      <RACTableCell>Type</RACTableCell>
      <RACTableCell>Best Time to Call</RACTableCell>
      <RACTableCell>Phone Instructions</RACTableCell>
      <RACTableCell># Contacts Today</RACTableCell>
      <RACTableCell>Last Call Result</RACTableCell>
      <RACTableCell align="center">Action</RACTableCell>
    </>
  );

  const customerId =
    location?.state?.customer?.customerId || location?.pathname?.split('/')[3];

  const renderTableContent = () => (
    <>
      {phones?.map((phone) => (
        <RACTableRow backgroundColor="white" key={phone.phoneId}>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {`${firstName} ${lastName}`}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {formatPhoneNumber(
                phone.phoneNumber?.split('.')[0],
                !isLogActivityAllowed
              )}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {phone.phoneTypeDesc}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography variant="body2" className={classes.tableContentColor}>
              {phone.callTimeTypeDesc}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <RACTooltip placement="right-start" title={phone?.note || ''}>
              <Typography
                noWrap
                variant="body2"
                color="primary"
                className={clsx(phone.note)}
              >
                <span>{phone.note ? abbrev(phone.note) : ''}</span>
              </Typography>
            </RACTooltip>
            <Typography noWrap variant="body2" color="primary"></Typography>
          </RACTableCell>
          <RACTableCell>
            <Typography
              align="center"
              variant="body2"
              className={classes.tableContentColor}
            >
              {phone.communicationsToday}
            </Typography>
          </RACTableCell>
          <RACTableCell>
            <RACTooltip
              placement="right-start"
              title={phone.lastCallResultDescription || ''}
            >
              <Typography noWrap variant="body2" color="primary">
                <span>{abbrev(phone.lastCallResultDescription || '')}</span>
              </Typography>
            </RACTooltip>
          </RACTableCell>
          <RACTableCell className={classes.center}>
            <RACButton
              variant="outlined"
              color="primary"
              className={classes.logButton}
              onClick={() =>
                onLogClicked(customerId, phone.phoneNumber?.split('.')[0])
              }
              disabled={!phone?.phoneNumber || !isLogActivityAllowed}
            >
              Log
            </RACButton>
            <RACButton
              variant="contained"
              color="primary"
              className={classes.editButton}
              onClick={() => popUpPhoneInstructions(phone)}
            >
              Edit
            </RACButton>
          </RACTableCell>
        </RACTableRow>
      ))}
    </>
  );
  return (
    <>
      <EditContactInformationModal
        open={showEditCustomerInformationModal}
        phoneId={tempPhone?.phoneId || ''}
        note={tempPhone?.note || ''}
        ext={tempPhone?.extension || ''}
        bestTimeToCall={tempPhone?.callTimeType || ''}
        phoneType={tempPhone?.phoneType || ''}
        phoneNumber={tempPhone?.phoneNumber || ''}
        onChange={updatePhoneNotes}
        onClose={closePhoneInstructionModal}
      />
      <RACTable
        renderTableHead={renderTableHead}
        renderTableContent={renderTableContent}
      />
    </>
  );
};

export const ContactInformationCustomerContent = (props: any) =>
  withContactStyles(props)(ContactInformationCustomerContent_);
