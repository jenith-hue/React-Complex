import clsx from 'clsx';

import {
  RACModal,
  RACButton,
  makeStyles,
  RACCOLOR,
  TextField,
  RACTextField,
  RACSelect,
  RACTextbox,
} from '@rentacenter/racstrap';

import React, { useEffect, useState } from 'react';
import { updatePhoneInstructions } from '../../../api/Customer';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import {
  CustomerPhoneInstruction,
  PhoneType,
  ReferenceKeys,
  ReferenceOption,
  ReferenceResponse,
} from '../../../types/types';
import {
  API_ERROR_MESSAGE,
  CACHED_KEYS,
  INVALID_PHONE_NUMBER,
  PHONE_INSTRUCTIONS_ERROR_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from '../../../constants/constants';
import { getReference } from '../../../api/reference';
import { orderByDisplaySeqField } from '../../../context/PastDueListSearchCriteria/PastDueListSearchCriteriaProvider';
import { pipe, mapReferenceResponse } from '../../../utils/utils';

export interface ModalProps {
  open: boolean;
  onClose: (onclose: string) => void;
  onError?: (message: string) => void;
  onChange: (
    phoneId: string,
    notes: string,
    bestTimeToCall: string,
    phoneNumber: string,
    phoneType: string,
    ext: string
  ) => void;
  phoneId: string;
  note: string | null;
  phoneNumber?: string;
  phoneType?: string;
  ext?: string;
  bestTimeToCall?: string;
  // notice that "Notes" are always editable
  isPhoneNumberEditable?: boolean;
  isExtEditable?: boolean;
  isBestTimeToCallEditable?: boolean;
}
export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    textAlign: 'left',
    height: theme.typography.pxToRem(250),
  },
  dialogRoot: {
    '& .MuiDialogContent-root': {
      padding: '20px 10px 0px 20px',
    },
    '& .MuiDialog-paperWidthSm': {
      maxWidth: theme.typography.pxToRem(550),
      maxHeight: theme.typography.pxToRem(500),
      marginTop: theme.typography.pxToRem(400),
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

    height: theme.typography.pxToRem(250),
  },
  dialogTitle: {
    fontFamily: 'OpenSans-bold',
    fontSize: '20px !important',
    color: '#212529',
  },
  label: {
    fontFamily: 'OpenSans-regular',
    fontSize: theme.typography.pxToRem(14),
    color: '#212529',
    padding: '0px 0px 8px',
    fontWeight: 'bold',
  },
  dialogActions: {
    paddingRight: theme.typography.pxToRem(15),
    paddingBottom: theme.typography.pxToRem(15),
  },
  textfield: {
    width: '100%',
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
  row: {
    display: 'inline-flex',
    width: '100%',
    marginBottom: theme.typography.pxToRem(5),
  },
  leftField: {
    width: '50%',
    marginLeft: theme.typography.pxToRem(5),
  },
  rightField: {
    width: '50%',
    marginRight: theme.typography.pxToRem(5),
  },
}));

export const getFormatedPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const PhoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return cleaned.replace(PhoneRegex, '($1) $2-$3');
};

export const getLabelFromValue = (options: ReferenceOption[], value: string) =>
  options.find((option) => option.value === value)?.label || '';

export const EditContactInformationModal = ({
  open,
  phoneId,
  note,
  phoneNumber,
  ext,
  phoneType,
  bestTimeToCall,
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
    } = {},
  } = useCustomerDetails();
  const [tempNotes, setTempNotes] = useState(note || '');
  const [tempPhoneNumber, setTempPhoneNumber] = useState(
    getFormatedPhone(phoneNumber || '')
  );
  const [tempExt, setTempExt] = useState(ext || '');
  const [tempPhoneType, setTempPhoneType] = useState(phoneType || '');
  const [tempBestTimeToCall, setTempBestTimeToCall] = useState(
    bestTimeToCall || ''
  );
  const [loading, setLoading] = useState(false);

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingOptionsApiError, setLoadingOptionsApiError] = useState(false);
  const [bestTimeToCallOptions, setBestTimeToCallOptions] = useState<
    ReferenceOption[]
  >([]);

  const [phoneTypes, setPhoneTypes] = useState<ReferenceOption[]>([]);
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState('');

  const handleClose = () => {
    onChange(
      phoneId,
      tempNotes,
      getLabelFromValue(bestTimeToCallOptions, tempBestTimeToCall),
      tempPhoneNumber,
      getLabelFromValue(phoneTypes, tempPhoneType),
      tempExt
    );
    onClose(phoneId);
  };

  const clearFields = () => {
    setTempNotes('');
    setTempPhoneType('');
    setTempBestTimeToCall('');
    setTempExt('');
    setTempPhoneNumber('');
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleSave = () => {
    if (!tempPhoneNumber.trim()) {
      setPhoneNumberErrorMessage(REQUIRED_FIELD_MESSAGE);
      return;
    } else if (tempPhoneNumber.trim().length < 10) {
      setPhoneNumberErrorMessage(INVALID_PHONE_NUMBER);
      return;
    }

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
    selectedPhone.callTimeType = tempBestTimeToCall;
    selectedPhone.phoneNumber = tempPhoneNumber;
    selectedPhone.phoneType = tempPhoneType as PhoneType;
    selectedPhone.extension = tempExt;
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

  useEffect(() => {
    setLoadingOptionsApiError(false);
    setLoadingOptions(true);
    getReference(
      [ReferenceKeys.PHONE_TYPE, ReferenceKeys.BEST_TIME_TO_CALL],
      CACHED_KEYS.EDIT_CUSTOMER_INFORMATION_KEY
    )
      .then((response: any) => {
        const { references } = response;
        references?.map((reference: ReferenceResponse) => {
          if (reference.referenceKey === ReferenceKeys.BEST_TIME_TO_CALL) {
            return pipe(
              orderByDisplaySeqField,
              mapReferenceResponse,
              setBestTimeToCallOptions
            )(reference?.referenceDetails);
          } else if (reference.referenceKey === ReferenceKeys.PHONE_TYPE) {
            return pipe(
              orderByDisplaySeqField,
              mapReferenceResponse,
              setPhoneTypes
            )(reference?.referenceDetails);
          }
        });
      })
      .catch(() => {
        setLoadingOptionsApiError(true);
      })
      .finally(() => {
        setLoadingOptions(false);
      });
  }, []);

  useEffect(() => {
    setTempNotes(note || '');
    setTempExt(ext || '');
    setTempBestTimeToCall(bestTimeToCall || '');
    setTempPhoneType(phoneType || '');
    setTempPhoneNumber(getFormatedPhone(phoneNumber || ''));
  }, [bestTimeToCall, ext, note, open, phoneNumber, phoneType]);

  const closeModal = () => {
    clearFields();
    onClose(phoneId);
  };

  const handlePhoneNumberChange = (e: any) => {
    setTempPhoneNumber(getFormatedPhone(e.target.value));
  };

  return (
    <RACModal
      isOpen={open}
      titleVariant="h4"
      classes={{
        dialogTitle: classes.dialogTitle,
        dialogContent: classes.dialogContent,
        dialog: classes.dialogRoot,
        dialogActions: classes.dialogActions,
      }}
      maxWidth="sm"
      title="Contact Information"
      content={
        <>
          <div className={classes.row}>
            <div className={classes.rightField}>
              <RACTextbox
                name="phoneNumber"
                type="phoneno"
                inputlabel="Phone Number"
                maxlength={10}
                value={tempPhoneNumber}
                disabled={loading}
                required
                OnChange={handlePhoneNumberChange}
                {...(phoneNumberErrorMessage && {
                  errorMessage: phoneNumberErrorMessage,
                })}
              />
            </div>
            <div className={classes.leftField}>
              <RACTextField
                name="ext"
                label="Ext"
                value={tempExt}
                disabled={loading}
                type="text"
                onChange={(value) => setTempExt(value)}
              />
            </div>
          </div>
          <div className={classes.row}>
            <div className={classes.rightField}>
              <RACSelect
                inputLabel="Phone Type"
                options={phoneTypes}
                loading={loadingOptions}
                defaultValue={tempPhoneType}
                onChange={(e: React.ChangeEvent<{ value: any }>) =>
                  setTempPhoneType(e.target.value)
                }
                {...(loadingOptionsApiError && {
                  errorMessage: API_ERROR_MESSAGE,
                })}
                required
                isDisabled={loading}
              />
            </div>
            <div className={classes.leftField}>
              <RACSelect
                inputLabel="Best Time to Call"
                options={bestTimeToCallOptions}
                loading={loadingOptions}
                defaultValue={tempBestTimeToCall}
                onChange={(e: React.ChangeEvent<{ value: any }>) =>
                  setTempBestTimeToCall(e.target.value)
                }
                required
                {...(loadingOptionsApiError && {
                  errorMessage: API_ERROR_MESSAGE,
                })}
                isDisabled={loading}
              />
            </div>
          </div>
          <div>
            <label className={clsx(classes.label)}>Notes</label>
            <TextField
              multiline
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
          </div>
        </>
      }
      onClose={closeModal}
      buttons={
        <>
          <RACButton
            variant="outlined"
            color="secondary"
            className={clsx(classes.button)}
            onClick={closeModal}
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
