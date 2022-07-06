import {
  RACModal,
  RACButton,
  makeStyles,
  RACCOLOR,
  RACSelect,
  TextField,
  RACDatePicker,
  RACTimePicker,
  Typography,
} from '@rentacenter/racstrap';

import React, { useEffect, useState } from 'react';
import { orderByDisplaySeqField } from '../../../context/PastDueListSearchCriteria/PastDueListSearchCriteriaProvider';
import { getReference } from '../../../api/reference';
import { ReferenceKeys } from '../../../types/types';
import {
  getSelectedStore,
  mapReferenceResponse,
  pipe,
} from '../../../utils/utils';
import { API_ERROR_MESSAGE, CACHED_KEYS } from '../../../constants/constants';
import { Option } from '../../../types/types';
import clsx from 'clsx';
import { useUserStateContext } from '../../../context/user/user-contexts';
import {
  TakeCommitmentInput,
  CustomerLocationState,
} from '../../../types/types';
import { useLocation } from 'react-router-dom';
import { takeCommitment } from '../../../api/Customer';
import { useCustomerPaymentSummary } from '../../../context/CustomerPaymentSummary/CustomerPaymentSummaryProvider';
import { addSelectOneOption } from '../ContactInformation/LogActivityModal';
import { format } from 'date-fns';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  onError: () => void;
}
export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    textAlign: 'left',
    height: theme.typography.pxToRem(400),
  },
  dialogRoot: {
    '& .MuiDialogContent-root': {
      padding: '1rem',
    },
    '& .MuiDialog-paperWidthSm': {
      maxWidth: theme.typography.pxToRem(800),
      maxHeight: theme.typography.pxToRem(407),
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
  },
  notesLabel: {
    color: theme.palette.text.primary,
    transform: 'scale(1) !important',
    ...theme.typography.body1,
    position: 'relative',
    display: 'block',
  },
  amountLabel: {
    color: theme.palette.text.primary,
    transform: 'scale(1) !important',
    ...theme.typography.body1,
  },
  dialogActions: {
    paddingRight: theme.typography.pxToRem(15),
    paddingBottom: theme.typography.pxToRem(15),
  },
  notesWrapper: {
    display: 'inline-flex',
    position: 'relative',
    flexDirection: 'column',
    width: '100%',
    marginTop: theme.typography.pxToRem(24),
    marginBotton: theme.typography.pxToRem(16),
  },
  modalColumn: {
    width: '25%',
    paddingRight: theme.typography.pxToRem(12),
  },
  row: {
    display: 'flex',
  },
  topBottomLeftBorderRadius: {
    borderTopLeftRadius: `${theme.typography.pxToRem(9)} !important`,
    borderBottomLeftRadius: `${theme.typography.pxToRem(9)} !important`,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  topBottomRightBorderRadius: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: `${theme.typography.pxToRem(9)} !important`,
    borderTopRightRadius: `${theme.typography.pxToRem(9)} !important`,
  },
  amountValue: {
    padding: `${theme.typography.pxToRem(6)} ${theme.typography.pxToRem(
      12
    )} ${theme.typography.pxToRem(6)} 0`,
    backgroundColor: RACCOLOR.ICEWIND_DALE,
    // Replace with SATIN_WHITE
    border: `${theme.typography.pxToRem(1)} solid ${RACCOLOR.ICEWIND_DALE}`,
    lineHeight: theme.typography.pxToRem(18),
    width: '90%',
    marginLeft: theme.typography.pxToRem(-1),
  },
  amountWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  amountValueWrapper: {
    marginTop: theme.typography.pxToRem(3),
    width: '100%',
    display: 'inline-flex',
  },
  amount$Value: {
    width: '10%',
    padding: `${theme.typography.pxToRem(6)} ${theme.typography.pxToRem(12)}`,
    backgroundColor: RACCOLOR.ICEWIND_DALE,
    // Replace with SATIN_WHITE
    border: `${theme.typography.pxToRem(1)} solid ${RACCOLOR.ICEWIND_DALE}`,
    lineHeight: theme.typography.pxToRem(18),
  },
}));

interface TakeCommitmentModalContentProps {
  validateForm: (state: boolean) => void;
  saveClicked: boolean;
  onSave: () => void;
  onError: () => void;
}

const TakeCommitmentModalContent = ({
  validateForm,
  saveClicked,
  onSave,
  onError,
}: TakeCommitmentModalContentProps) => {
  const classes = useStyles();
  const { customerPaymentSummary: customerPaymentSummaryResponse } =
    useCustomerPaymentSummary();
  const [commitmentType, setCommitmentType] = useState('');
  const [commitmentTypeOption, setCommitmentTypeOption] = useState<Option[]>(
    []
  );
  const [apiError, setApiError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const amount =
    customerPaymentSummaryResponse?.pastDueSummary?.amountDue || '';
  const dateFormat = 'yyyy-MM-dd';
  useEffect(() => {
    setIsLoading(true);
    getReference(
      [ReferenceKeys.COMMITMENT_TYPE],
      CACHED_KEYS.TAKE_COMMITMENT_CACHED_KEY
    )
      .then((response: any) =>
        pipe(
          orderByDisplaySeqField,
          mapReferenceResponse,
          addSelectOneOption,
          setCommitmentTypeOption
        )(response?.references[0]?.referenceDetails)
      )
      .catch(() => {
        setApiError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    validateForm(time === '' || date === '' || commitmentType === '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveClicked, time, date, commitmentType]);

  useEffect(() => {
    if (saveClicked) {
      handleSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveClicked]);

  const { user } = useUserStateContext();
  const location = useLocation<CustomerLocationState>();
  const handleSave = () => {
    const customerId =
      location?.state?.customer?.customerId ||
      location?.pathname?.split('/')[3];
    const payload: TakeCommitmentInput = {
      storeNumber: getSelectedStore(),
      notes: note,
      customerId: customerId,
      coWorkerId: user?.employeeId || ' ',
      commitmentType: commitmentType,
      amount: amount,
      commitmentDate: `${date}T${time}`,
    };

    takeCommitment(payload)
      .then(() => onSave())
      .catch(() => onError());
  };

  return (
    <>
      <div className={classes.row}>
        <div className={classes.modalColumn}>
          <RACSelect
            inputLabel="Commitment Type"
            defaultValue={commitmentType}
            options={commitmentTypeOption}
            loading={isLoading}
            onChange={(e: React.ChangeEvent<{ value: any }>) =>
              setCommitmentType(e.target.value)
            }
            {...(apiError && {
              errorMessage: API_ERROR_MESSAGE,
            })}
          />
        </div>
        <div className={classes.modalColumn}>
          <RACDatePicker
            label="Date"
            inputProps={{ min: format(new Date(), dateFormat) }}
            value={date}
            onChange={setDate}
            name="commitmentDate"
          />
        </div>
        <div className={classes.modalColumn}>
          <RACTimePicker
            onChange={setTime}
            label="Time"
            name="commitmentTime"
            value={time}
          />
        </div>
        <div className={classes.modalColumn}>
          <label className={classes.amountLabel}>Amount</label>
          <div className={classes.amountValueWrapper}>
            <Typography
              display="inline"
              variant="body2"
              className={clsx(
                classes.amount$Value,
                classes.topBottomLeftBorderRadius
              )}
            >
              $
            </Typography>
            <Typography
              display="inline"
              variant="body2"
              className={clsx(
                classes.amountValue,
                classes.topBottomRightBorderRadius
              )}
            >
              {amount}
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.notesWrapper}>
        <label className={classes.notesLabel}>Notes</label>
        <TextField
          multiline
          variant="outlined"
          value={note}
          key="logActivityNote"
          maxRows={4}
          minRows={47}
          onChange={(e) => {
            setNote(e.target.value);
          }}
        />
      </div>
    </>
  );
};

export const TakeCommitmentModal = ({
  open,
  onSave,
  onClose,
  onError,
}: ModalProps) => {
  const classes = useStyles();
  const [isFormInvalid, setIsFormInvalid] = useState(true);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveClick = () => {
    setIsSaveClicked(true);
    setLoading(true);
  };

  return (
    <RACModal
      isOpen={open}
      titleVariant="h4"
      classes={{
        dialogContent: classes.dialogContent,
        dialog: classes.dialogRoot,
        dialogActions: classes.dialogActions,
      }}
      maxWidth="sm"
      title="Take a Commitment"
      content={
        <TakeCommitmentModalContent
          validateForm={setIsFormInvalid}
          saveClicked={isSaveClicked}
          onSave={onSave}
          onError={onError}
        />
      }
      onClose={onClose}
      buttons={
        <>
          <RACButton
            variant="outlined"
            color="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </RACButton>
          <RACButton
            variant="contained"
            color="primary"
            onClick={handleSaveClick}
            disabled={isFormInvalid || loading}
            loading={loading}
          >
            Save
          </RACButton>
        </>
      }
    />
  );
};
