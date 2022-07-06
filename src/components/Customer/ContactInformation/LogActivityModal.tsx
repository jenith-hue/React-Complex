import {
  RACModal,
  RACButton,
  makeStyles,
  RACSelect,
  TextField,
} from '@rentacenter/racstrap';

import React, { useEffect, useState } from 'react';
import { orderByDescField } from '../../../context/PastDueListSearchCriteria/PastDueListSearchCriteriaProvider';
import { getReference } from '../../../api/reference';
import { ReferenceKeys } from '../../../types/types';
import { mapReferenceResponse, pipe } from '../../../utils/utils';
import {
  API_ERROR_MESSAGE,
  CACHED_KEYS,
  LOG_ACTIVITY_NOTES_MAX_LENGTH,
  SELECT_ONE_OPTION,
} from '../../../constants/constants';
import { Option } from '../../../types/types';

export const addSelectOneOption = (arrayWithOptions: any[]) => {
  if (!arrayWithOptions) {
    return [
      {
        label: SELECT_ONE_OPTION,
        value: '',
      },
    ];
  }

  return [
    {
      label: SELECT_ONE_OPTION,
      value: '',
    },
    ...arrayWithOptions,
  ];
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (callResult: string, note: string) => void;
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
      maxWidth: theme.typography.pxToRem(500),
      maxHeight: theme.typography.pxToRem(363),
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
  callResultWrapper: {
    width: '75%',
  },
  callResultOptionsPaper: {
    maxHeight: theme.typography.pxToRem(150),
  },
  notesCharacterCount: {
    marginTop: theme.typography.pxToRem(5),
  },
}));

export interface LogActivityModalContentProps {
  callResultOptions: Option[];
  apiError: boolean;
  callResult: string;
  note: string;
  isLoading: boolean;

  setCallResult: (result: string) => void;
  setNote: (note: string) => void;
}
const LogActivityModalContent = ({
  callResultOptions,
  apiError,
  callResult,
  note,
  isLoading,

  setCallResult,
  setNote,
}: LogActivityModalContentProps) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.callResultWrapper}>
        <RACSelect
          classes={{ paper: classes.callResultOptionsPaper }}
          inputLabel="Call Result"
          isDisabled={isLoading}
          defaultValue={callResult}
          loading={isLoading && !callResult.length}
          options={callResultOptions}
          onChange={(e: React.ChangeEvent<{ value: any }>) =>
            setCallResult(e.target.value)
          }
          {...(apiError && {
            errorMessage: API_ERROR_MESSAGE,
          })}
        />
      </div>
      <div className={classes.notesWrapper}>
        <label className={classes.notesLabel}>Notes</label>
        <TextField
          multiline
          disabled={isLoading}
          variant="outlined"
          value={note}
          key="logActivityNote"
          maxRows={3}
          minRows={3}
          onChange={(e) => {
            if (note.length >= LOG_ACTIVITY_NOTES_MAX_LENGTH) {
              const trimmedNote = e.target.value?.substring(
                0,
                LOG_ACTIVITY_NOTES_MAX_LENGTH
              );
              setNote(trimmedNote);
            } else {
              setNote(e.target.value);
            }
          }}
        />
        <span className={classes.notesCharacterCount}>
          ({LOG_ACTIVITY_NOTES_MAX_LENGTH}/{note.length})
        </span>
      </div>
    </>
  );
};

export const LogActivityModal = ({ open, onSave, onClose }: ModalProps) => {
  const classes = useStyles();
  const [callResultOptions, setCallResultOptions] = useState<Option[]>([]);
  const [apiError, setApiError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [callResult, setCallResult] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    setIsLoading(true);
    getReference(
      [ReferenceKeys.CALL_RESULT],
      CACHED_KEYS.LOG_ACTIVITY_CACHED_KEY
    )
      .then((response: any) =>
        pipe(
          orderByDescField,
          mapReferenceResponse,
          addSelectOneOption,
          setCallResultOptions
        )(response?.references[0]?.referenceDetails)
      )
      .catch(() => {
        setApiError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleOnSave = () => {
    setIsLoading(true);
    onSave(callResult, note);
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
      title="Log Activity"
      content={
        <LogActivityModalContent
          callResultOptions={callResultOptions}
          apiError={apiError}
          isLoading={isLoading}
          callResult={callResult}
          note={note}
          setCallResult={setCallResult}
          setNote={setNote}
        />
      }
      onClose={() => {
        setCallResultOptions([]);
        setApiError(false);
        setCallResult('');
        setNote('');
        onClose();
      }}
      buttons={
        <>
          <RACButton variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </RACButton>
          <RACButton
            disabled={!callResult.length || isLoading}
            variant="contained"
            color="primary"
            loading={isLoading && callResult.length > 0}
            onClick={handleOnSave}
          >
            Save
          </RACButton>
        </>
      }
    />
  );
};
