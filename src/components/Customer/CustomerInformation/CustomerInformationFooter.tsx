import { makeStyles, RACButton, RACCard } from '@rentacenter/racstrap';
import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { ApiErrorModal } from '../../../common/ApiError/ApiError';
import { AppRoute } from '../../../config/route-config';
import {
  CustomerInformationFooterAction,
  FULL_API_ERROR_MESSAGE,
  LETTER_TYPE,
  LOCAL_STORAGE_KEY,
  LOG_ACTIVITY_ERROR_MESSAGE,
  TAKE_COMMITMENT_ERROR_MESSAGE,
  NO_15_DAY_LETTER,
  ALL_OPTION,
  PAST_DUE_LIST_API_LIMIT,
} from '../../../constants/constants';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import { useCustomerHeader } from '../../../context/CustomerHeader/CustomerHeaderProvider';
import {
  useFieldSheets,
  useFieldSheetsActions,
} from '../../../context/FieldSheets/FieldSheetsProvider';
import {
  PastDueListCustomerDispatchStateContext,
  PastDueListCustomerStateContext,
} from '../../../context/PastDueListCustomer/PastDueListCustomerProvider';
import {
  usePrintLetter,
  usePrintLetterActions,
} from '../../../context/PrintLetter/PrintLetterProvider';
import { useUserStateContext } from '../../../context/user/user-contexts';
import { useWorkedHistoryActions } from '../../../context/WorkedHistory/WorkedHistoryProvider';
import {
  CustomerLocationState,
  PrintLetterDetails,
} from '../../../types/types';
import { getSelectedStore } from '../../../utils/utils';
import FieldSheet from '../../FieldSheet/FieldSheet';
import HalfwayNoticeLetter from '../../HalfwayNoticeLetter/HalfwayNoticeLetter';
import { NoPrintLetterModal } from '../../PastDueList/PastDueCustomerList/NoPrintLetterModal';
import { PrintFieldSheetModal } from '../../PastDueList/PastDueCustomerList/PrintFieldSheetModal';
import { PrintLetterModal } from '../../PastDueList/PastDueCustomerList/PrintLetterModal';
import { FieldVisitModal } from './FieldVisitModal';
import { TakeCommitmentModal } from './TakeCommitmentModal';
import { useFilters } from '../../../context/PastDueListSearchCriteria/PastDueListSearchCriteriaProvider';
import { Filter } from '../../../domain/PastDueList/Filter';
import { PastDueCustomerResponse } from '../../../domain/PastDueList/PastDueCustomerList';
import { CancelTokenSource } from 'axios';
import { getCancelTokenSource } from '../../../api/client';
import { getPastDueList } from '../../../api/Customer';

const useStyles = makeStyles((theme: any) => ({
  footerRoot: {
    width: '100%',
    marginBottom: '0rem',
    display: 'block',
    position: 'fixed',
    bottom: '0',
    left: '0',
    zIndex: 1100,
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
}));

// eslint-disable-next-line sonarjs/cognitive-complexity
export const CustomerInformationFooter = () => {
  const initialCallToken = useRef<CancelTokenSource>();
  const classes = useStyles();
  const history = useHistory();
  const { user } = useUserStateContext();
  const location = useLocation<CustomerLocationState>();
  const customerlocation = useLocation<any>();
  const { setFilteredPastDueList } = useContext(
    PastDueListCustomerDispatchStateContext
  );
  const { pastDue } = useContext(PastDueListCustomerStateContext);

  const { setReloadWorkedHistory } = useWorkedHistoryActions();
  const [openTakeCommitmentModal, setOpenTakeCommitmentModal] =
    useState<boolean>(false);
  const [openFieldVisitModal, setOpenFieldVisitModal] =
    useState<boolean>(false);
  const [openPrintLetterModal, setOpenPrintLetterModal] =
    useState<boolean>(false);
  const [isPrintLetterPreview, setIsPrintLetterPreview] =
    useState<boolean>(false);
  const [isApiErrorOpen, setIsApiErrorOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const [isPrintFieldSheetPreview, setIsPrintFieldSheetPreview] =
    useState<boolean>(false);
  const [printFieldSheetClicked, setPrintFieldSheetClicked] =
    useState<boolean>(false);
  const [openNoPrintLetterModal, setOpenNoPrintLetterModal] =
    useState<boolean>(false);

  const { fetchPrintLetter } = usePrintLetterActions();
  const {
    letters,
    loading: printLetterLoading,
    hasApiError: hasPrintLetterApiError,
    noLetter,
  } = usePrintLetter();

  if (!pastDue || !pastDue.length) {
    const localPastDue = localStorage.getItem(LOCAL_STORAGE_KEY.PAST_DUE_LIST);
    if (localPastDue) {
      setFilteredPastDueList(JSON.parse(localPastDue), false);
    }
  }

  const togglePrintLetterPreview = () => {
    setIsPrintLetterPreview(!isPrintLetterPreview);
  };

  const { hasApiError, loading, customerDetails } = useCustomerDetails();

  const { setPastDueListLoading, setReloadPastDueList } = useContext(
    PastDueListCustomerDispatchStateContext
  );
  const { isLoading } = useCustomerHeader();

  const { onFetchFieldSheets, setHasApiError: setHasFieldSheetApiError } =
    useFieldSheetsActions();
  const {
    fieldSheets,
    isLoading: isFieldSheetLoading,
    hasApiError: hasPrintFieldSheetApiError,
  } = useFieldSheets();

  const disableActionButtons = hasApiError || loading;

  const handleFieldVisitSaveSuccess = () => {
    setOpenFieldVisitModal(false);
    setReloadWorkedHistory(true);
  };

  const handleTakeCommitmentSave = () => {
    setOpenTakeCommitmentModal(false);
    setReloadWorkedHistory(true);
  };

  const handleError = () => {
    setOpenFieldVisitModal(false);
    setApiErrorMessage(LOG_ACTIVITY_ERROR_MESSAGE);
    setIsApiErrorOpen(true);
  };

  const handleTakeCommitmentError = () => {
    setOpenTakeCommitmentModal(false);
    setApiErrorMessage(TAKE_COMMITMENT_ERROR_MESSAGE);
    setIsApiErrorOpen(true);
  };

  const handleNoPrintLetterClose = () => {
    setOpenPrintLetterModal(false);
    setOpenNoPrintLetterModal(false);
  };

  const handleNoPrintLetterConfirm = () => {
    setIsPrintLetterPreview(true);
    setOpenPrintLetterModal(false);
    setOpenNoPrintLetterModal(false);
  };

  const { filter } = useFilters();

  const formatAllFields = (field: string[]) =>
    field.includes(ALL_OPTION) ? [] : field;

  const createFilterPayload = (filter: Filter) => {
    return {
      ...filter,
      storeNumber: getSelectedStore(),
      daysPastDue: formatAllFields(filter.daysPastDue),
      bestTimeToCall: formatAllFields(filter.bestTimeToCall),
      commitmentStatus: formatAllFields(filter.commitmentStatus),
      communicationType: formatAllFields(filter.communicationType),
      language: formatAllFields(filter.language),
    };
  };

  const fetchPastDueList = (resetPastDueList: boolean, offset: number) => {
    if (initialCallToken?.current) {
      initialCallToken.current?.cancel();
    }
    initialCallToken.current = getCancelTokenSource();
    setPastDueListLoading(true);
    getPastDueList(
      createFilterPayload(filter),
      offset,
      PAST_DUE_LIST_API_LIMIT,
      initialCallToken.current?.token
    )
      .then((response: PastDueCustomerResponse[]) => {
        let responseToUse;
        if (response?.length) {
          responseToUse = response.map((pastDueItem) => {
            if (!pastDueItem.commitment) {
              return pastDueItem;
            }
            return {
              ...pastDueItem,
              commitment: {
                ...pastDueItem.commitment,
                commitmentStatus: pastDueItem.commitment.commitmentActualStatus,
              },
            };
          });
        }
        setFilteredPastDueList(responseToUse || [], resetPastDueList);
        setPastDueListLoading(false);
        setReloadPastDueList(false);
      })
      .catch((err) => {
        if (!err.__CANCEL__) {
          setIsApiErrorOpen(true);
          setApiErrorMessage(FULL_API_ERROR_MESSAGE);
          setPastDueListLoading(false);
          setReloadPastDueList(false);
        }
      });
  };

  const redirectCustomer = (action: CustomerInformationFooterAction) => {
    /* Invoke fetch past due list API call on second last customer, 
      and to append the data to local storage, resetPastDueList set to false */
    if (!pastDue) {
      return;
    }
    const customerId =
      location?.state?.customer?.customerId ||
      location?.pathname?.split('/')[3];
    const currentCustomerIndex = pastDue?.findIndex(
      (item) => item.customerId === customerId
    );
    if (currentCustomerIndex === -1) {
      return;
    }
    if (
      currentCustomerIndex === pastDue?.length - 2 &&
      pastDue?.length % PAST_DUE_LIST_API_LIMIT == 0
    ) {
      fetchPastDueList(false, pastDue && pastDue?.length);
    }
    const nextCustomerIndex =
      action === CustomerInformationFooterAction.NEXT
        ? currentCustomerIndex + 1
        : currentCustomerIndex - 1;
    if (pastDue?.[nextCustomerIndex]) {
      history.push(
        AppRoute.Customer + '/' + pastDue[nextCustomerIndex].customerId,
        {
          customer: pastDue[nextCustomerIndex],
          customerIndex: nextCustomerIndex,
        }
      );
    }
  };

  const onPrintLetterConfirm = async () => {
    const customerId = customerDetails?.customerId;

    if (openPrintLetterModal && customerId && user?.id) {
      const printLetterDetailPayload = {
        storeNumber: getSelectedStore(),
        customerId: [customerId],
        coWorkerId: user?.employeeId || ' ',
        letterType: LETTER_TYPE.COL,
      };

      fetchPrintLetter(printLetterDetailPayload);
    }
  };

  useEffect(() => {
    if (letters && !printLetterLoading && !hasPrintLetterApiError) {
      togglePrintLetterPreview();
      setOpenPrintLetterModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letters, printLetterLoading, hasPrintLetterApiError]);

  useEffect(() => {
    if (hasPrintLetterApiError || noLetter) {
      setOpenPrintLetterModal(false);
      setApiErrorMessage(noLetter ? NO_15_DAY_LETTER : FULL_API_ERROR_MESSAGE);
      setIsApiErrorOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPrintLetterApiError, noLetter]);

  const { customerFirstName, customerLastName } =
    location?.state?.customer || {};

  const fullName = `${customerDetails?.firstName || customerFirstName || ''} ${
    customerDetails?.lastName || customerLastName || ''
  }`;

  const togglePrintFieldSheetPreview = () => {
    setIsPrintFieldSheetPreview(!isPrintFieldSheetPreview);
  };
  const onPrintFieldSheetConfirm = (selectedValue: string) => {
    setIsPrintFieldSheetPreview(true);
    if (customerDetails?.customerId) {
      onFetchFieldSheets(selectedValue, [customerDetails.customerId]);
    }
  };

  useEffect(() => {
    if (hasPrintFieldSheetApiError) {
      setIsPrintFieldSheetPreview(false);
      setPrintFieldSheetClicked(false);
      setApiErrorMessage(FULL_API_ERROR_MESSAGE);
      setIsApiErrorOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPrintFieldSheetApiError]);

  const isPrintFieldSheetDisplayed =
    isPrintFieldSheetPreview && fieldSheets?.length;

  const isPrintLetterDisplayed =
    isPrintLetterPreview && !noLetter && letters?.customer?.length;

  const isCustomerRedirect =
    customerlocation?.state?.redirectSource === 'customer';

  const customerId =
    location?.state?.customer?.customerId || location?.pathname?.split('/')[3];
  const customerIndex = pastDue?.findIndex(
    (item) => item.customerId === customerId
  );
  return (
    <div className={clsx(classes.footerRoot)}>
      {isApiErrorOpen && (
        <ApiErrorModal
          open={isApiErrorOpen}
          message={apiErrorMessage}
          onClose={() => {
            setApiErrorMessage('');
            setIsApiErrorOpen(false);
            setHasFieldSheetApiError(false);
          }}
        />
      )}
      {openNoPrintLetterModal && (
        <NoPrintLetterModal
          onClose={handleNoPrintLetterClose}
          onConfirm={handleNoPrintLetterConfirm}
          disableActionButtons={printLetterLoading}
        />
      )}
      {printFieldSheetClicked && (
        <PrintFieldSheetModal
          onConfirm={onPrintFieldSheetConfirm}
          onClose={setPrintFieldSheetClicked}
          customerName={fullName}
        />
      )}
      {openTakeCommitmentModal && (
        <TakeCommitmentModal
          onSave={handleTakeCommitmentSave}
          onClose={() => setOpenTakeCommitmentModal(false)}
          onError={handleTakeCommitmentError}
          open={openTakeCommitmentModal}
        />
      )}
      <RACCard className={classes.card}>
        <div className={clsx(classes.cardBody)}>
          <div className={clsx(classes.row)}>
            <div className={classes.leftButtonsContainer}>
              <RACButton
                variant="outlined"
                color="secondary"
                onClick={() =>
                  isCustomerRedirect
                    ? history.push(
                        `/customer/update/${customerDetails?.customerId}/customer`
                      )
                    : history.push(AppRoute.PastDueList)
                }
              >
                Cancel
              </RACButton>
            </div>
            {openFieldVisitModal && (
              <FieldVisitModal
                onClose={setOpenFieldVisitModal}
                onSaveSuccess={handleFieldVisitSaveSuccess}
                onError={handleError}
              />
            )}
            {openPrintLetterModal && (
              <PrintLetterModal
                customerName={fullName}
                onClose={() => setOpenPrintLetterModal(false)}
                onConfirm={onPrintLetterConfirm}
                disableActionButtons={printLetterLoading}
              />
            )}
            {isPrintLetterDisplayed && (
              <HalfwayNoticeLetter
                onClose={() => {
                  togglePrintLetterPreview();
                  setReloadWorkedHistory(true);
                }}
                printLetterDetails={letters || ({} as PrintLetterDetails)}
              />
            )}
            {isPrintFieldSheetDisplayed && (
              <FieldSheet
                isLoading={isFieldSheetLoading}
                fieldSheets={fieldSheets}
                onSave={() => {
                  setIsPrintFieldSheetPreview(false);
                  setPrintFieldSheetClicked(false);
                }}
                onClose={togglePrintFieldSheetPreview}
              />
            )}
            <div className={classes.rightButtonsContainer}>
              <RACButton
                className={clsx(classes.button)}
                variant="contained"
                size="small"
                color="primary"
                key="custInfoFooterFieldVisit"
                onClick={() => setOpenFieldVisitModal(true)}
                disabled={disableActionButtons}
              >
                Field Visit
              </RACButton>
              <RACButton
                className={clsx(classes.button)}
                variant="contained"
                size="small"
                key="custInfoFooterPrintFieldSheets"
                color="primary"
                disabled={disableActionButtons}
                onClick={() => setPrintFieldSheetClicked(true)}
              >
                Print Field Sheet
              </RACButton>
              <RACButton
                className={clsx(classes.button)}
                variant="contained"
                size="small"
                key="custInfoFooterPrintLetter"
                color="primary"
                onClick={() => setOpenPrintLetterModal(true)}
                disabled={disableActionButtons}
              >
                Print Letter
              </RACButton>
              <RACButton
                className={clsx(classes.button)}
                variant="contained"
                size="small"
                key="custInfoFooterTakeCommitment"
                color="primary"
                onClick={() => setOpenTakeCommitmentModal(true)}
                disabled={disableActionButtons}
              >
                Take Commitment
              </RACButton>
              <Link
                style={{ color: 'inherit', textDecoration: 'unset' }}
                to={{
                  pathname: `${AppRoute.TakePayment}/${customerDetails?.customerId}/0`,
                  state: {
                    ...(location?.state || {}),
                    redirectSource: 'am',
                    accountManagementCustomerId: customerDetails?.customerId,
                  },
                }}
              >
                <RACButton
                  className={clsx(classes.button)}
                  variant="contained"
                  size="small"
                  key="custInfoFooterTakePayment"
                  color="primary"
                  onClick={() => {
                    //noop
                  }}
                  disabled={disableActionButtons}
                >
                  Take Payment
                </RACButton>
              </Link>

              <RACButton
                className={clsx(classes.button)}
                variant="contained"
                size="small"
                key="custInfoFooterPrevious"
                color="primary"
                disabled={!customerIndex || customerIndex <= 0 || isLoading}
                onClick={() =>
                  redirectCustomer(CustomerInformationFooterAction.PREVIOUS)
                }
              >
                Previous
              </RACButton>
              <RACButton
                className={clsx(classes.button)}
                variant="contained"
                size="small"
                key="custInfoFooterNext"
                color="primary"
                disabled={
                  customerIndex === -1 ||
                  (pastDue &&
                    pastDue?.length % PAST_DUE_LIST_API_LIMIT !== 0 &&
                    customerIndex === pastDue?.length - 1) ||
                  isLoading
                }
                onClick={() =>
                  redirectCustomer(CustomerInformationFooterAction.NEXT)
                }
              >
                Next
              </RACButton>
            </div>
          </div>
        </div>
      </RACCard>
    </div>
  );
};
