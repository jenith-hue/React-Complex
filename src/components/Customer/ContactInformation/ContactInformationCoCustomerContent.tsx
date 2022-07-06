import {
  RACButton,
  RACTable,
  RACTableCell,
  RACTableRow,
  RACTooltip,
  Typography,
} from '@rentacenter/racstrap';
import React, { useState } from 'react';
import { PhoneInstructionsModal } from './PhoneInstructionsModal';
import { withContactStyles, WrappedComponentProps } from './withContactStyles';
import { abbrev, formatPhoneNumber } from '../../../utils/utils';
import { ApiStateWrapper } from '../../../common/ApiStateWrapper/ApiStateWrapper';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import clsx from 'clsx';

const coCustomerContentTestId = 'coCustomerContentTestId';

const ContactInformationCoCustomerContent_ = ({
  classes,
  onLogClicked,
  onError,
}: WrappedComponentProps) => {
  const {
    coCustomerDetails,
    loadingCoCustomer,
    hasApiErrorCoCustomer,
    isLogActivityAllowed,
  } = useCustomerDetails();

  const [showPhoneInstructionModal, setShowPhoneInstructionModal] =
    useState<boolean>(false);

  const [phoneInstructionsPhoneId, setPhoneInstructionsPhoneId] =
    useState<string>('');
  const [phoneInstructionsNotes, setPhoneInstructionsNotes] =
    useState<string>('');

  const popUpPhoneInstructions = (
    mykey: string,
    myvalue: string | null
  ): void => {
    setPhoneInstructionsPhoneId(mykey);
    setPhoneInstructionsNotes(myvalue == null ? '' : myvalue);
    setShowPhoneInstructionModal(true);
  };

  const closePhoneInstructionModal = () => {
    setShowPhoneInstructionModal(false);
  };

  const updatePhoneNotes = (phoneId: string, notes: string) => {
    coCustomerDetails?.phones?.forEach((one) => {
      if (phoneId == one.phoneId) {
        one.note = notes;
      }
    });
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

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const renderTableContent = () => (
    <>
      {coCustomerDetails &&
        coCustomerDetails.phones?.map((phone) => (
          <RACTableRow
            backgroundColor="white"
            key={phone.phoneId || phone.personalReferenceId}
          >
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {phone.phoneId
                  ? `${coCustomerDetails.firstName || ''} ${
                      coCustomerDetails.lastName || ''
                    }`
                  : `${phone.firstName || ''} ${phone.lastName || ''}`}
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
                {phone.phoneTypeDesc || phone.relationshipTypeDesc}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              <Typography variant="body2" className={classes.tableContentColor}>
                {phone.callTimeTypeDesc || phone.bestTimeToCallDesc}
              </Typography>
            </RACTableCell>
            <RACTableCell>
              {showPhoneInstructionModal && (
                <PhoneInstructionsModal
                  phoneId={phoneInstructionsPhoneId}
                  note={phoneInstructionsNotes}
                  onChange={updatePhoneNotes}
                  onClose={closePhoneInstructionModal}
                  onError={onError}
                />
              )}
              {phone.phoneId && (
                <RACButton
                  variant="text"
                  size="small"
                  color="primary"
                  onClick={() =>
                    popUpPhoneInstructions(phone?.phoneId, phone?.note)
                  }
                >
                  {phone.note ? (
                    <Typography noWrap variant="body2" color="primary">
                      <RACTooltip title={phone?.note}>
                        <span>{abbrev(phone?.note)}</span>
                      </RACTooltip>
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      color="primary"
                      className={classes.underline}
                    >
                      Add
                    </Typography>
                  )}
                </RACButton>
              )}
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
              <Typography noWrap variant="body2" color="primary">
                <RACTooltip title={phone.lastCallResultDescription || ''}>
                  <span>{abbrev(phone.lastCallResultDescription || '')}</span>
                </RACTooltip>
              </Typography>
            </RACTableCell>
            <RACTableCell className={classes.center}>
              <RACButton
                variant="outlined"
                color="primary"
                className={classes.logButton}
                onClick={() =>
                  onLogClicked(
                    String(coCustomerDetails.customerId),
                    phone.phoneNumber
                  )
                }
                disabled={!phone.phoneNumber || !isLogActivityAllowed}
              >
                Log
              </RACButton>
            </RACTableCell>
          </RACTableRow>
        ))}
    </>
  );
  return (
    <div
      className={clsx(
        classes.listWrapper,
        (loadingCoCustomer || hasApiErrorCoCustomer) && classes.tabContentLoader
      )}
      data-testid={coCustomerContentTestId}
    >
      <ApiStateWrapper
        loading={loadingCoCustomer}
        hasApiError={hasApiErrorCoCustomer}
        response={coCustomerDetails}
        successContent={
          <RACTable
            renderTableHead={renderTableHead}
            renderTableContent={renderTableContent}
          />
        }
      />
    </div>
  );
};

export const ContactInformationCoCustomerContent = (props: any) =>
  withContactStyles(props)(ContactInformationCoCustomerContent_);
