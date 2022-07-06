import React from 'react';
import { RACChip, makeStyles } from '@rentacenter/racstrap';
import {
  useCustomerAlerts,
  useCustomerAlertsActions,
} from '../../../context/CustomerAlert/CustomerAlertsProvider';

export const customerAlertTestId = 'customerAlertTestId';

const useClasses = makeStyles((theme: any) => ({
  customerAlert: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: 'white',
    overflowX: 'auto',
    padding: theme.typography.pxToRem(8),
    marginRight: theme.typography.pxToRem(10),
  },
  chip: {
    marginRight: '.5rem',
  },
}));

export const CustomerAlert_ = () => {
  const classes = useClasses();
  const { customerAlerts } = useCustomerAlerts();
  const { removeCustomerAlert } = useCustomerAlertsActions();

  return (
    <div className={classes.customerAlert} data-testid={customerAlertTestId}>
      {customerAlerts
        ?.filter((alert) => alert.alertCleared === 0)
        ?.map((alert) => (
          <RACChip
            classes={{ root: classes.chip }}
            key={alert.customerAlertId}
            label={alert.alertTypeDescEn}
            onDelete={() => removeCustomerAlert(alert)}
          />
        ))}
    </div>
  );
};
