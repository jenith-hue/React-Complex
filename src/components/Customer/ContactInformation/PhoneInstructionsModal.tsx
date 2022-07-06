import clsx from 'clsx';

import {
  RACModal,
  RACButton,
  makeStyles,
  RACCOLOR,
  TextField,
} from '@rentacenter/racstrap';

import React, { useState } from 'react';
import { updatePhoneInstructions } from '../../../api/Customer';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import { CustomerPhoneInstruction } from '../../../types/types';
import { PHONE_INSTRUCTIONS_ERROR_MESSAGE } from '../../../constants/constants';

export interface ModalProps {
  onClose: (onclose: string) => void;
  onError?: (message: string) => void;
  onChange: (key: string, value: string) => void;
  phoneId: string;
  note: string | null;
}
export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    textAlign: 'left',
    height: theme.typography.pxToRem(200),
  },
  dialogRoot: {
    '& .MuiDialogContent-root': {
      padding: '20px 10px 0px 20px',
    },
    '& .MuiDialog-paperWidthSm': {
      maxWidth: theme.typography.pxToRem(500),
      maxHeight: theme.typography.pxToRem(400),
      marginTop: theme.typography.pxToRem(515),
    },
    '& .MuiTypography-h4': {
      fontSize: '20px !important',
    },
    '& .MuiOutlinedInput-multiline': {
      padding: theme.typography.pxToRem(10),
    },
    '& .MuiInputBase-multiline': {
      margin: '8px 0px 0px 0px !important',
    },
    '& .MuiInputBase-input': {
      fontFamily: 'OpenSans-regular',
      fontSize: theme.typography.pxToRem(14),
    },

    height: theme.typography.pxToRem(400),
  },
  dialogTitle: {
    fontFamily: 'OpenSans-bold',
    fontSize: '20px !important',
    color: '#212529',
  },
  label: {
    fontFamily: 'OpenSans-regular',
    fontSize: theme.typography.pxToRem(16),
    color: '#212529',
    padding: '0px 0px 8px',
  },
  dialogActions: {
    paddingRight: theme.typography.pxToRem(15),
    paddingBottom: theme.typography.pxToRem(15),
  },
  textfield: {
    width: theme.typography.pxToRem(468),
    color: RACCOLOR.ONYX,
  },
  button: {
    height: theme.typography.pxToRem(47),
    width: theme.typography.pxToRem(96),
    paddingTop: theme.typography.pxToRem(12),
    paddingRight: theme.typography.pxToRem(25),
    paddingBottom: theme.typography.pxToRem(12),
    paddingLeft: theme.typography.pxToRem(25),
    marginRight: theme.typography.pxToRem(9),
    backgroundColor: '#FAFCFF !important',
    borderColor: '#CEE0FF !important',
    border: '1px solid !important',
    color: '#5a5a5a !important',
    '&:hover': {
      color: '#FFF !important',
      borderColor: '#565e64 !important',
      backgroundColor: '#5c636a !important',
    },
  },
  smallbutton: {
    height: theme.typography.pxToRem(43),
    width: theme.typography.pxToRem(77),
  },
}));

export const PhoneInstructionsModal = ({
  phoneId,
  note,
  onChange,
  onClose,
  onError,
}: ModalProps) => {
  const classes = useStyles();
  const {
    customerDetails: { customerId, globalCustomerId, phones, coCustomerId },
    coCustomerDetails: {
      phones: coCustomerPhones,
      globalCustomerId: coCustomerGlobalCustomerId,
    },
  } = useCustomerDetails();
  const [tempNotes, setTempNotes] = useState(note == null ? '' : note);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onChange(phoneId, tempNotes);
    onClose(phoneId);
  };

  const handleSave = () => {
    const selectedCustomerPhone = phones?.find(
      (phone) => phone.phoneId === phoneId
    ) as CustomerPhoneInstruction;

    const selectedCoCustomerPhones = coCustomerPhones?.find(
      (phone) => phone.phoneId === phoneId
    ) as CustomerPhoneInstruction;

    if (
      (!selectedCustomerPhone && !selectedCoCustomerPhones) ||
      (selectedCustomerPhone && (!customerId || !globalCustomerId)) ||
      (selectedCoCustomerPhones &&
        (!coCustomerId || !coCustomerGlobalCustomerId))
    )
      return;

    const selectedPhone = selectedCustomerPhone
      ? selectedCustomerPhone
      : selectedCoCustomerPhones;

    selectedPhone.note = tempNotes;
    const payload = selectedCustomerPhone
      ? {
          customerId: customerId || '',
          globalCustomerId: globalCustomerId || '',
          phones: [selectedPhone],
        }
      : {
          customerId: coCustomerId || '',
          globalCustomerId: coCustomerGlobalCustomerId || '',
          phones: [selectedPhone],
        };

    setLoading(true);
    updatePhoneInstructions(payload)
      .then(handleClose)
      .catch(() => onError && onError(PHONE_INSTRUCTIONS_ERROR_MESSAGE))
      .finally(() => setLoading(false));
  };

  return (
    <RACModal
      isOpen
      titleVariant="h4"
      classes={{
        dialogTitle: classes.dialogTitle,
        dialogContent: classes.dialogContent,
        dialog: classes.dialogRoot,
        dialogActions: classes.dialogActions,
      }}
      maxWidth="sm"
      title="Phone Instructions"
      content={
        <>
          <label className={clsx(classes.label)}>Notes</label>
          <TextField
            multiline
            autoFocus
            onFocus={(event) =>
              event.currentTarget.setSelectionRange(
                tempNotes.length,
                tempNotes.length
              )
            }
            variant="outlined"
            value={tempNotes}
            key={phoneId}
            maxRows={3}
            minRows={3}
            className={clsx(classes.textfield)}
            onChange={(e) => {
              setTempNotes(e.target.value);
            }}
            disabled={loading}
          />
        </>
      }
      onClose={handleClose}
      buttons={
        <>
          <RACButton
            variant="outlined"
            color="secondary"
            className={clsx(classes.button)}
            onClick={() => onClose(phoneId)}
            disabled={loading}
          >
            Cancel
          </RACButton>
          <RACButton
            variant="contained"
            color="primary"
            className={clsx(classes.smallbutton)}
            onClick={handleSave}
            disabled={loading}
          >
            Save
          </RACButton>
        </>
      }
    />
  );
};
