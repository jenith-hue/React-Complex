import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  RACButton,
  RACSelect,
  Typography,
} from '@rentacenter/racstrap';
import clsx from 'clsx';
import {
  API_ERROR_MESSAGE,
  ASSIGN_ROUTE_ERROR_MESSAGE,
  DELETE_ALERT_ERROR_MESSAGE,
  UPDATE_ALERT_ERROR_MESSAGE,
} from '../../../constants/constants';
import {
  useCustomerHeader,
  useCustomerHeaderActions,
} from '../../../context/CustomerHeader/CustomerHeaderProvider';
import { AssignAlertModal } from './AssignAlertModal';
import { CustomerAlert_ as CustomerAlert } from './CustomerAlert';
import { getCustomerFullName } from '../../PastDueList/PastDueCustomerList/CustomerList';
import { ApiErrorModal } from '../../../common/ApiError/ApiError';
import { useCustomerAlerts } from '../../../context/CustomerAlert/CustomerAlertsProvider';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import { useLocation } from 'react-router-dom';
import { CustomerLocationState } from '../../../types/types';

export const CustomerHeaderTestId = 'CustomerHeaderTestId';
export const assignAlertButtonTestId = 'assignAlertButtonTestId';
export const customerNameTestId = 'customerNameTestId';

const useClasses = makeStyles((theme: any) => ({
  customerHeader: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: 'white',
    padding: theme.typography.pxToRem(8),
    margin: `${theme.typography.pxToRem(0)} -${theme.typography.pxToRem(10)}`,
  },
  marginTop4: {
    marginTop: theme.typography.pxToRem(4),
  },
  marginTop8: {
    marginTop: theme.typography.pxToRem(8),
  },
  customerNameWrapper: { display: 'flex' },
  customerHeaderLabel: {
    fontSize: theme.typography.pxToRem(22),
    lineHeight: theme.typography.pxToRem(26),
    marginTop: theme.typography.pxToRem(8),
    marginBottom: theme.typography.pxToRem(8),
    paddingRight: theme.typography.pxToRem(24),
    width: '50%',
  },
  customerHeaderLeftPanel: {
    display: 'flex',
    minWidth: '41%',
    borderRight: `${theme.typography.pxToRem(1)} solid #D3D3D3`,
  },
  customerName: { color: '#2179FE', display: 'flex' },
  customerHeaderRightPanel: { display: 'flex', minWidth: '61%' },
  alert: {
    width: '58%',
    padding: `${theme.typography.pxToRem(0)} ${theme.typography.pxToRem(16)}`,
  },
  route: {
    display: 'flex',
    width: '42%',
    paddingRight: theme.typography.pxToRem(25),
  },
  assignAlertButtonWrapper: {
    width: '41%',
  },
  assignAlertButton: {
    height: theme.typography.pxToRem(43),
    marginTop: theme.typography.pxToRem(8),
  },
  routeSelect: {
    width: '50%',
    padding: `${theme.typography.pxToRem(0)} ${theme.typography.pxToRem(
      16
    )} ${theme.typography.pxToRem(0)} ${theme.typography.pxToRem(8)}`,
  },
  selectOptionsPaper: {
    maxHeight: theme.typography.pxToRem(200),
  },
}));

export const CustomerHeader = () => {
  const classes = useClasses();
  const location = useLocation<CustomerLocationState>();
  const [openAssignAlertModal, setOpenAssignAlertModal] =
    useState<boolean>(false);

  const {
    routeOptions,
    selectedRouteOption,
    isLoading,
    hasRouteApiError,
    hasAssignRouteApiError,
    isRouteSelectionDisabled,
  } = useCustomerHeader();

  const { onChangeRoute } = useCustomerHeaderActions();

  const [isApiErrorOpen, setIsApiErrorOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const {
    customerAlerts,
    hasApiError,
    hasDeleteApiError,
    hasFetchAllAlertsError,
    isFetchAllAlertsLoading,
  } = useCustomerAlerts();
  const activeCustomerAlerts = customerAlerts.filter(
    (alert) => alert.alertCleared === 0
  )?.length;
  const alertsCountLabel = activeCustomerAlerts
    ? `(${activeCustomerAlerts})`
    : '';
  const { customerDetails } = useCustomerDetails();

  const { firstName, lastName } = customerDetails || {};

  const { firstPaymentDefault, secondPaymentDefault } =
    location?.state?.customer || {};

  const handleOnSaveAlert = () => {
    setOpenAssignAlertModal(false);
  };

  useEffect(() => {
    if (hasApiError || hasDeleteApiError || hasAssignRouteApiError) {
      let errorMessage = '';
      if (hasDeleteApiError) {
        errorMessage = DELETE_ALERT_ERROR_MESSAGE;
      } else if (hasAssignRouteApiError) {
        errorMessage = ASSIGN_ROUTE_ERROR_MESSAGE;
      } else {
        errorMessage = UPDATE_ALERT_ERROR_MESSAGE;
      }
      setIsApiErrorOpen(true);
      setApiErrorMessage(errorMessage);
    }
  }, [hasApiError, hasDeleteApiError, hasAssignRouteApiError]);

  return (
    <>
      {isApiErrorOpen && (
        <ApiErrorModal
          open={isApiErrorOpen}
          onClose={() => setIsApiErrorOpen(false)}
          message={apiErrorMessage}
        />
      )}
      <div
        className={classes.customerHeader}
        data-testid={CustomerHeaderTestId}
      >
        <div
          className={clsx(classes.customerHeaderLeftPanel, classes.marginTop8)}
        >
          {openAssignAlertModal && (
            <AssignAlertModal
              onSave={handleOnSaveAlert}
              onClose={() => setOpenAssignAlertModal(false)}
              open={openAssignAlertModal}
            />
          )}
          <Typography
            variant="h5"
            component="h2"
            classes={{ root: classes.customerHeaderLabel }}
          >
            Customer Information
          </Typography>
          <div className={classes.marginTop4}>
            <Typography display="inline" variant="body1">
              Customer Name
            </Typography>
            <div
              className={clsx(classes.customerNameWrapper, classes.marginTop4)}
            >
              <div
                className={clsx(classes.customerName, classes.marginTop4)}
                data-testid={customerNameTestId}
              >
                <Typography display="inline" variant="body1">
                  {getCustomerFullName(
                    firstName || '',
                    lastName || '',
                    firstPaymentDefault || '',
                    secondPaymentDefault || ''
                  )}
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div
          className={clsx(classes.customerHeaderRightPanel, classes.marginTop8)}
        >
          <div className={classes.alert}>
            <Typography display="inline" variant="body1">
              Customer Alerts {alertsCountLabel}
            </Typography>
            <CustomerAlert />
          </div>
          <div className={classes.route}>
            <div className={classes.assignAlertButtonWrapper}>
              <RACButton
                disabled={isFetchAllAlertsLoading || hasFetchAllAlertsError}
                variant="contained"
                size="large"
                color="primary"
                className={classes.assignAlertButton}
                data-testid={assignAlertButtonTestId}
                onClick={() => {
                  setOpenAssignAlertModal(true);
                }}
              >
                Assign Alert
              </RACButton>
            </div>
            <div className={classes.routeSelect}>
              <RACSelect
                classes={{ paper: classes.selectOptionsPaper }}
                inputLabel="Route"
                defaultValue={selectedRouteOption + ''}
                options={routeOptions}
                loading={isLoading}
                isDisabled={isRouteSelectionDisabled}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onChangeRoute(e.target.value)
                }
                {...(hasRouteApiError && {
                  errorMessage: API_ERROR_MESSAGE,
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
