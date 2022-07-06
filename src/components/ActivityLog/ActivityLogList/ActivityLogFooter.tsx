import { Icon, makeStyles, RACButton, RACCard } from '@rentacenter/racstrap';
import clsx from 'clsx';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { AppRoute } from '../../../config/route-config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActivityLogResultStateContext } from '../../../context/ActivityLogResult/ActivityLogResultProvider';
import { ActivityLogSearchCriteriaStateContext } from '../../../context/ActivityLogSearchCriteria/ActivityLogSearchCriteriaProvider';
import { useStoreDetails } from '../../../context/Store/StoreProvider';
import { useUserStateContext } from '../../../context/user/user-contexts';
import ActivityLogListModal from './ActivityLogListModal';
import { isEmpty } from 'lodash';

const useStyles = makeStyles((theme: any) => ({
  footerRoot: {
    width: '100%',
    marginBottom: '0rem',
    display: 'block',
    position: 'fixed',
    bottom: '0',
    left: '0',
    zIndex: 99999,
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.typography.pxToRem(0),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '0',
  },
  cardBody: {
    flex: '0 0 auto',
    padding: '1rem 1rem',
  },
  leftButtonsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: theme.typography.pxToRem(4),
  },
  rightButtonsContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    gap: theme.typography.pxToRem(4),
  },
  button: {
    height: theme.typography.pxToRem(43),
  },
  hideOnPrint: {
    '@media print': {
      display: 'none',
    },
  },
}));

export const ActivityLogFooter = () => {
  const classes = useStyles();
  const { hasApiError, loading, activityLog } = useContext(
    ActivityLogResultStateContext
  );
  const [openPrintPriviewModal, setOpenPrintPriviewModal] = useState(false);
  const { user } = useUserStateContext();
  const { store } = useStoreDetails();
  const { selectedDateRangeFromOption, selectedDateRangeToOption } = useContext(
    ActivityLogSearchCriteriaStateContext
  );

  return (
    <div className={clsx(classes.footerRoot, classes.hideOnPrint)}>
      <RACCard className={classes.card}>
        <div className={clsx(classes.cardBody)}>
          <div className={clsx(classes.row)}>
            <div className={classes.leftButtonsContainer}>
              <Link
                style={{ color: 'inherit', textDecoration: 'unset' }}
                to={{
                  // using PastDueList as placeholder
                  pathname: AppRoute.PastDueList,
                }}
              >
                <RACButton variant="outlined" color="secondary">
                  Cancel
                </RACButton>
              </Link>
            </div>
            <div className={classes.rightButtonsContainer}>
              {openPrintPriviewModal && (
                <ActivityLogListModal
                  activityLog={activityLog}
                  store={store}
                  user={user}
                  onClose={() => setOpenPrintPriviewModal(false)}
                  selectedDateRangeFromOption={selectedDateRangeFromOption}
                  selectedDateRangeToOption={selectedDateRangeToOption}
                />
              )}
              <RACButton
                disabled={
                  hasApiError ||
                  loading ||
                  openPrintPriviewModal ||
                  !activityLog ||
                  isEmpty(activityLog) ||
                  (Array.isArray(activityLog) && activityLog.length === 0)
                }
                className={clsx(classes.button)}
                variant="contained"
                size="small"
                key="activityLogFooterPrint"
                color="primary"
                startIcon={
                  <Icon>
                    <FontAwesomeIcon icon={faPrint} />
                  </Icon>
                }
                onClick={() => setOpenPrintPriviewModal(true)}
              >
                Print
              </RACButton>
            </div>
          </div>
        </div>
      </RACCard>
    </div>
  );
};
