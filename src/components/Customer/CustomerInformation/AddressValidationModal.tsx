import { RACModal, RACRadio } from '@rentacenter/racstrap';
import { RACButton, makeStyles } from '@rentacenter/racstrap';
import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import clsx from 'clsx';

export interface ModalProps {
  onClose: (onclose: boolean) => void;
  suggestedAddress?: Record<string, unknown>;
  enteredAddress?: Record<string, unknown>;
  handleSave: (onsave: string) => void;
  pending: boolean;
  text?: string;
}

export interface AddressNotValidatedModalProps {
  onClose: (onclose: boolean) => void;
  pending: boolean;
  text?: string;
}

export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    marginBottom: '2rem',
  },
  dialogContent2: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold',
  },
  dialogRoot: {
    '& .MuiPaper-rounded': {
      borderRadius: theme.typography.pxToRem(12),
    },
    '& .MuiDialog-paperWidthXs': {
      maxWidth: theme.typography.pxToRem(500),
    },
    '& .MuiTypography-h5': {
      fontFamily: 'OpenSans-semiBold',
      fontSize: theme.typography.pxToRem(20),
      fontWeight: 500,
      lineHeight: theme.typography.pxToRem(30),
    },
    '& .MuiTypography-h6': {
      fontFamily: 'OpenSans-semiBold',
      lineHeight: theme.typography.pxToRem(20),
    },
  },
  suggestedAddressesHeadline: {
    fontFamily: 'OpenSans-Bold !important',
    margin: '10px 0 !important',
  },
  suggestedAddressesInput: {
    fontSize: `${theme.typography.pxToRem(14)} !important`,
  },
  buttonRoot: {
    margin: 'auto',
  },
  cancelButton: {
    margin: 'auto',
    marginLeft: theme.typography.pxToRem(16),
  },
}));

export const AddressNotValidatedModal = ({
  onClose,
  text,
  pending,
}: AddressNotValidatedModalProps) => {
  const classes = useStyles();

  return (
    <RACModal
      isOpen
      classes={{
        dialogContent: classes.dialogContent2,
        dialog: classes.dialogRoot,
      }}
      maxWidth="sm"
      title="Validation Message"
      content={
        <>
          <Typography
            variant="body1"
            display="inline"
            className={classes.suggestedAddressesHeadline}
          >
            {text}
          </Typography>
          {!text?.includes('Zip') && (
            <Typography
              variant="body1"
              display="block"
              className={classes.suggestedAddressesHeadline}
            >
              Please Validate Address Manually
            </Typography>
          )}
        </>
      }
      onClose={() => onClose(false)}
      buttons={
        <>
          <RACButton
            variant="contained"
            color="primary"
            className={classes.buttonRoot}
            onClick={() => onClose(false)}
            disabled={pending}
            loading={pending}
          >
            Ok
          </RACButton>
        </>
      }
    />
  );
};

export const AddressValidationModal = ({
  onClose,
  suggestedAddress,
  enteredAddress,
  handleSave,
  pending,
}: ModalProps) => {
  const { StreetAddress, City, StateProvince, PostalCode } =
    suggestedAddress || {};

  const suggestedAddressString = `${StreetAddress}, ${City}, ${StateProvince} - ${PostalCode}`;

  const { addressLine1, addressLine2, city, state, postalCode } =
    enteredAddress || {};

  const addressLine2value = addressLine2 ? `${addressLine2}, ` : '';

  const enteredAddressString = `${addressLine1}, ${addressLine2value}${city}, ${state} - ${postalCode}`;

  const classes = useStyles();
  const [selectedSuggestedAddress, setSelectedSuggestedAddress] = useState(
    suggestedAddressString
  );
  const [selectedEnteredAddress, setSelectedEnteredAddress] = useState('');

  const handleSuggestedAddressSelect = (value: string) => {
    setSelectedSuggestedAddress(value);
    setSelectedEnteredAddress('');
  };

  const handleEnteredAddressSelect = (value: string) => {
    setSelectedEnteredAddress(value);
    setSelectedSuggestedAddress('');
  };

  const isOverrideDisabled = pending || selectedSuggestedAddress.length > 0;

  const isContinueDisabled = pending || selectedEnteredAddress.length > 0;

  const isOverrideLoading = pending && selectedEnteredAddress.length > 0;
  const isContinueLoading = pending && selectedSuggestedAddress.length > 0;

  return (
    <RACModal
      isOpen
      classes={{
        dialogContent: classes.dialogContent,
        dialog: classes.dialogRoot,
      }}
      maxWidth="xs"
      title="Validation Message"
      content={
        <>
          <Typography display="inline" variant="body2">
            Entered address is not located
          </Typography>
          <div>
            <Typography className={clsx(classes.suggestedAddressesHeadline)}>
              Suggested Addresses
            </Typography>
            <RACRadio
              name="SuggestedAddress"
              label={suggestedAddressString}
              value={suggestedAddressString}
              checked={
                selectedSuggestedAddress.length > 0 &&
                suggestedAddressString === selectedSuggestedAddress
              }
              onChange={(event) =>
                handleSuggestedAddressSelect(event.target.value)
              }
              classes={{
                label: classes.suggestedAddressesInput,
              }}
            />
          </div>
          <div>
            <Typography className={clsx(classes.suggestedAddressesHeadline)}>
              Entered Address
            </Typography>
            <RACRadio
              name="EnteredAddress"
              label={enteredAddressString}
              value={enteredAddressString}
              checked={
                selectedEnteredAddress.length > 0 &&
                enteredAddressString === selectedEnteredAddress
              }
              onChange={(event) =>
                handleEnteredAddressSelect(event.target.value)
              }
              classes={{
                label: classes.suggestedAddressesInput,
              }}
            />
          </div>
        </>
      }
      onClose={() => onClose(false)}
      buttons={
        <>
          <RACButton
            variant="outlined"
            color="secondary"
            onClick={() => onClose(false)}
            className={classes.cancelButton}
            disabled={pending}
          >
            Cancel
          </RACButton>
          <RACButton
            variant="contained"
            color="primary"
            onClick={() => handleSave('isEnteredAddress')}
            disabled={isOverrideDisabled}
            loading={isOverrideLoading}
          >
            Override
          </RACButton>
          <RACButton
            variant="contained"
            color="primary"
            onClick={() => handleSave('')}
            disabled={isContinueDisabled}
            loading={isContinueLoading}
          >
            Continue
          </RACButton>
        </>
      }
    />
  );
};
