import { Grid, makeStyles, RACButton, RACCard } from '@rentacenter/racstrap';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { ApiErrorModal } from '../../../common/ApiError/ApiError';
import {
  FULL_API_ERROR_MESSAGE,
  LETTER_TYPE,
  NO_15_DAY_LETTER,
  NO_15_DAY_LETTER_MULTIPLE_CUSTOMERS,
} from '../../../constants/constants';
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
import FieldSheet from '../../FieldSheet/FieldSheet';
import HalfwayNoticeLetter from '../../HalfwayNoticeLetter/HalfwayNoticeLetter';
import { PrintFieldSheetModal } from './PrintFieldSheetModal';
import { PrintLetterModal } from './PrintLetterModal';
import { NoPrintLetterModal } from './NoPrintLetterModal';
import { getSelectedStore } from '../../../utils/utils';
import { PrintLetterCustomerDetails } from '../../../types/types';

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
    borderRadius: '0rem',
  },
  cardBody: {
    flex: '0 0 auto',
    padding: '1rem 1rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.typography.pxToRem(4),
    padding: '1rem',
  },
  button: {
    height: theme.typography.pxToRem(43),
  },
}));

export const getApiErrorMessage = (
  noLetter: boolean,
  selectedCustomerIds: string[]
) => {
  if (noLetter) {
    if (selectedCustomerIds?.length < 2) {
      return NO_15_DAY_LETTER;
    } else {
      return NO_15_DAY_LETTER_MULTIPLE_CUSTOMERS;
    }
  }
  return FULL_API_ERROR_MESSAGE;
};

export const PastDueFooter = () => {
  const classes = useStyles();
  const { user } = useUserStateContext();
  const { setReloadPastDueList, setSelectedCustomerIds } = useContext(
    PastDueListCustomerDispatchStateContext
  );

  const {
    isCustomerSelected,
    reloadPastDueList,
    customerName,
    selectedCustomerIds,
    loading,
  } = useContext(PastDueListCustomerStateContext);

  const [printFieldSheetClicked, setPrintFieldSheetClicked] =
    useState<boolean>(false);
  const [openPrintLetterModal, setOpenPrintLetterModal] =
    useState<boolean>(false);
  const [openNoPrintLetterModal, setOpenNoPrintLetterModal] =
    useState<boolean>(false);

  const [isPrintLetterPreview, setIsPrintLetterPreview] =
    useState<boolean>(false);

  const [isPrintFieldSheetPreview, setIsPrintFieldSheetPreview] =
    useState<boolean>(false);

  const [isApiErrorOpen, setIsApiErrorOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const { onFetchFieldSheets } = useFieldSheetsActions();
  const { fetchPrintLetter } = usePrintLetterActions();
  const {
    letters,
    loading: printLetterLoading,
    hasApiError: hasPrintLetterApiError,
    noLetter,
  } = usePrintLetter();

  const {
    fieldSheets,
    isLoading: isFieldSheetLoading,
    hasApiError: hasPrintFieldSheetApiError,
  } = useFieldSheets();

  const showPrintLetterPreview =
    isPrintLetterPreview && letters && letters.customer.length;

  const togglePrintLetterPreview = () => {
    setIsPrintLetterPreview(!isPrintLetterPreview);
  };

  const togglePrintFieldSheetPreview = () => {
    setIsPrintFieldSheetPreview(!isPrintFieldSheetPreview);
  };

  const onPrintFieldSheetConfirm = (selectedValue: string) => {
    setIsPrintFieldSheetPreview(true);
    onFetchFieldSheets(selectedValue, selectedCustomerIds);
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

  const onPrintLetterConfirm = async () => {
    const printLetterDetailPayload = {
      storeNumber: getSelectedStore(),
      customerId: selectedCustomerIds,
      coWorkerId: user?.employeeId || '',
      letterType: LETTER_TYPE.COL,
    };

    fetchPrintLetter(printLetterDetailPayload);
  };

  useEffect(() => {
    const hasValue = (currentCustomer: PrintLetterCustomerDetails) =>
      selectedCustomerIds.includes(String(currentCustomer?.customerId));

    if (letters && !printLetterLoading && !hasPrintLetterApiError) {
      if (
        letters?.customer?.length === selectedCustomerIds.length &&
        letters?.customer?.every(hasValue)
      ) {
        setIsPrintLetterPreview(true);
        setOpenPrintLetterModal(false);
      } else if (letters?.customer?.length) {
        setOpenNoPrintLetterModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letters, printLetterLoading, hasPrintLetterApiError]);

  useEffect(() => {
    if (hasPrintLetterApiError || noLetter) {
      setIsPrintLetterPreview(false);
      setOpenPrintLetterModal(false);
      setOpenNoPrintLetterModal(false);
      setIsApiErrorOpen(true);
      setApiErrorMessage(getApiErrorMessage(noLetter, selectedCustomerIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPrintLetterApiError, noLetter]);

  useEffect(() => {
    if (hasPrintFieldSheetApiError) {
      setIsPrintLetterPreview(false);
      setIsPrintFieldSheetPreview(false);
      setPrintFieldSheetClicked(false);
      setApiErrorMessage(FULL_API_ERROR_MESSAGE);
      setIsApiErrorOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPrintFieldSheetApiError]);

  const isPrintFieldSheetDisplayed =
    isPrintFieldSheetPreview && fieldSheets?.length;
  return (
    <div className={clsx(classes.footerRoot)}>
      <RACCard className={classes.card}>
        <div className={clsx(classes.cardBody)}>
          <div className={clsx(classes.row)}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                classes={{ root: classes.buttonContainer }}
              >
                {isApiErrorOpen && (
                  <ApiErrorModal
                    open={isApiErrorOpen}
                    message={apiErrorMessage}
                    onClose={() => {
                      setApiErrorMessage('');
                      setIsApiErrorOpen(false);
                    }}
                  />
                )}
                {printFieldSheetClicked && (
                  <PrintFieldSheetModal
                    onConfirm={onPrintFieldSheetConfirm}
                    onClose={setPrintFieldSheetClicked}
                    customerName={customerName}
                  />
                )}
                {openNoPrintLetterModal && (
                  <NoPrintLetterModal
                    onClose={handleNoPrintLetterClose}
                    onConfirm={handleNoPrintLetterConfirm}
                    disableActionButtons={printLetterLoading}
                  />
                )}
                {openPrintLetterModal && (
                  <PrintLetterModal
                    onClose={setOpenPrintLetterModal}
                    onConfirm={onPrintLetterConfirm}
                    customerName={customerName}
                    disableActionButtons={printLetterLoading}
                  />
                )}
                {showPrintLetterPreview && letters && (
                  <HalfwayNoticeLetter
                    onClose={() => {
                      togglePrintLetterPreview();
                      setSelectedCustomerIds([]);
                      setReloadPastDueList(true);
                    }}
                    printLetterDetails={letters}
                  />
                )}
                {isPrintFieldSheetDisplayed && (
                  <FieldSheet
                    isLoading={isFieldSheetLoading}
                    onSave={() => {
                      setIsPrintFieldSheetPreview(false);
                      setPrintFieldSheetClicked(false);
                      setSelectedCustomerIds([]);
                    }}
                    fieldSheets={fieldSheets}
                    onClose={togglePrintFieldSheetPreview}
                  />
                )}

                <RACButton
                  className={clsx(classes.button)}
                  disabled={reloadPastDueList || loading}
                  variant="contained"
                  size="small"
                  color="primary"
                  key="footerRefreshCallList"
                  onClick={() => setReloadPastDueList(true)}
                >
                  Refresh Call List
                </RACButton>
                <RACButton
                  className={clsx(classes.button)}
                  variant="contained"
                  disabled={!isCustomerSelected}
                  size="small"
                  key="footerPrintFieldSheets"
                  color="primary"
                  onClick={() => setPrintFieldSheetClicked(true)}
                >
                  Print Field Sheet
                </RACButton>
                <RACButton
                  className={clsx(classes.button)}
                  variant="contained"
                  disabled={!isCustomerSelected}
                  size="small"
                  key="footerPrintLetter"
                  color="primary"
                  onClick={() => setOpenPrintLetterModal(true)}
                >
                  Print Letters
                </RACButton>
              </Grid>
            </Grid>
          </div>
        </div>
      </RACCard>
    </div>
  );
};
