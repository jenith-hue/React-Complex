import {
  RACModal,
  RACCheckBox,
  RACButton,
  makeStyles,
  RACTextField,
} from '@rentacenter/racstrap';
import React, { useState, useEffect } from 'react';
import { AlertPayload } from '../../../types/types';
import { getCancelTokenSource } from '../../../api/client';
import { CancelTokenSource } from 'axios';
import {
  useCustomerAlerts,
  useCustomerAlertsActions,
} from '../../../context/CustomerAlert/CustomerAlertsProvider';
import { Option } from '../../../types/types';
import { REQUIRED_FIELD_MESSAGE } from '../../../constants/constants';

export interface ModalProps {
  onClose: (onclose: boolean) => void;
  onSave: () => void;
  open: boolean;
}

export const OTHER_ALERT_TYPE_ID = '3';

export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    marginBottom: '2rem',
    padding: '0.5rem 1rem',
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
    '& .MuiFormControlLabel-root': {
      display: 'flex',
    },
    '& .MuiFormControlLabel-label': {
      fontSize: theme.typography.pxToRem(16),
      fontFamily: 'OpenSans-regular',
    },
    '& .MuiOutlinedInput-multiline': {
      margin: '0.75rem !important',
    },
    '& p': {
      marginLeft: theme.typography.pxToRem(12),
    },
  },
  otherTextContent: {
    width: '100%',
  },
  flex: {
    display: 'flex',
    '& .MuiSvgIcon-root': { fontSize: 30 },
  },
}));

export const AssignAlertModal = ({ onClose, onSave }: ModalProps) => {
  const classes = useStyles();

  const [assignAlertModalValues, setAssignAlertModalValues] = useState<
    Option[]
  >([]);
  const { customerAlerts, loading, allAlerts } = useCustomerAlerts();
  const { saveCustomerAlerts } = useCustomerAlertsActions();
  const getSavedAlerts = () => {
    if (customerAlerts?.length) {
      return (
        customerAlerts
          .filter(
            (alert) =>
              alert.alertCleared === 0 &&
              alert.alertTypeId !== OTHER_ALERT_TYPE_ID
          )
          ?.map((alert) => String(alert.alertTypeId)) || []
      );
    }
    return [];
  };

  const [selectedAlerts, setSelectedAlerts] = useState<string[]>(
    getSavedAlerts()
  );

  const [otherTextContent, setOtherTextContent] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const alertName = event.target.name;
    if (!selectedAlerts.includes(alertName)) {
      const selected = [...selectedAlerts, alertName];
      setSelectedAlerts(selected);
    } else {
      const selected = selectedAlerts.filter((alert) => alert !== alertName);
      setSelectedAlerts(selected);
    }
  };

  useEffect(() => {
    setAssignAlertModalValues(
      allAlerts.map(
        (alert) =>
          ({
            value: alert.alertTypeId,
            label: alert.alertTypeDescEn,
          } as Option)
      )
    );
  }, [allAlerts]);
  useEffect(() => {
    const alerts = getSavedAlerts();
    alerts?.length && setSelectedAlerts(alerts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerAlerts]);

  const buildAlertTypesPayload = (): AlertPayload[] => {
    const savedAlertIds = customerAlerts
      .filter((alert) => alert.alertTypeId !== OTHER_ALERT_TYPE_ID)
      ?.map((alert) => alert.alertTypeId);

    return selectedAlerts?.map((alert) => {
      let alertText = '';
      if (alert === OTHER_ALERT_TYPE_ID) {
        // If option is other
        alertText = otherTextContent;
      } else {
        alertText =
          assignAlertModalValues.find((option) => option.value === alert)
            ?.label || '';
      }

      if (savedAlertIds.includes(alert)) {
        const savedAlert = customerAlerts.find(
          (savedCustomerAlert) => savedCustomerAlert.alertTypeId === alert
        );

        if (savedAlert) {
          return {
            alertTypeId: Number(alert),
            customerAlertId: Number(savedAlert?.customerAlertId),
            alertClear: 0,
            alertText: alertText,
          };
        }
      }

      return {
        alertTypeId: Number(alert),
        customerAlertId: null,
        alertClear: 0,
        alertText: alertText,
      };
    });
  };

  const handleSaveAlert = async () => {
    if (
      selectedAlerts.includes(OTHER_ALERT_TYPE_ID) &&
      otherTextContent.trim() === ''
    )
      return;
    const cancelToken: CancelTokenSource = getCancelTokenSource();
    const customerAlertPayload = buildAlertTypesPayload();
    saveCustomerAlerts(customerAlertPayload, cancelToken).finally(onSave);
  };

  const alertAlreadyExist = (alertId: string) =>
    alertId !== OTHER_ALERT_TYPE_ID &&
    customerAlerts?.find(
      (alert) => alert.alertTypeId === alertId && alert.alertCleared === 0
    );

  return (
    <RACModal
      isOpen
      classes={{
        dialogContent: classes.dialogContent,
        dialog: classes.dialogRoot,
      }}
      maxWidth="xs"
      title="Customer Alerts"
      content={
        <>
          {assignAlertModalValues?.map((alerts, index) => {
            return (
              <RACCheckBox
                label={alerts.label}
                size="medium"
                checked={selectedAlerts.includes(alerts.value)}
                disabled={!!alertAlreadyExist(alerts.value)}
                onChange={handleChange}
                name={alerts.value}
                key={index}
                classes={{ checkbox: classes.flex }}
              />
            );
          })}

          {selectedAlerts.includes(OTHER_ALERT_TYPE_ID) && (
            <RACTextField
              classes={{ input: classes.otherTextContent }}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              multiline
              variant="outlined"
              maxRows={3}
              minRows={3}
              value={otherTextContent}
              onChange={(value) => {
                setOtherTextContent(value);
              }}
              errorMessage={
                otherTextContent.trim() === '' ? REQUIRED_FIELD_MESSAGE : ''
              }
            />
          )}
        </>
      }
      onClose={() => onClose(false)}
      buttons={
        <>
          <RACButton
            variant="outlined"
            color="secondary"
            onClick={() => onClose(false)}
            disabled={loading}
          >
            Cancel
          </RACButton>
          <RACButton
            variant="contained"
            color="primary"
            disabled={loading}
            loading={loading}
            onClick={handleSaveAlert}
          >
            Save
          </RACButton>
        </>
      }
    />
  );
};
