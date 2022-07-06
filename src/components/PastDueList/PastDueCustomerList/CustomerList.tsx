/* eslint-disable react-hooks/exhaustive-deps */

import {
  makeStyles,
  RACCheckBox,
  RACCOLOR,
  RACRowTip,
  RACTable,
  RACTableCell,
  RACTableRow,
} from '@rentacenter/racstrap';
import { CancelTokenSource } from 'axios';
import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { getCancelTokenSource } from '../../../api/client';
import { getPastDueList } from '../../../api/Customer';
import {
  ApiStateWrapper,
  Loader,
} from '../../../common/ApiStateWrapper/ApiStateWrapper';
import { AppRoute } from '../../../config/route-config';
import {
  ALL_OPTION,
  INITIAL_OFFSET,
  PAST_DUE_LIST_API_LIMIT,
  WORKED_HISTORY_ACTIVITY_TYPE_CODES,
  WORKED_HISTORY_CALL_RESULT_CODES,
  WORKED_HISTORY_COMMITMENT_STATUS_CODES,
} from '../../../constants/constants';
import {
  PastDueListCustomerDispatchStateContext,
  PastDueListCustomerStateContext,
} from '../../../context/PastDueListCustomer/PastDueListCustomerProvider';
import { useFilters } from '../../../context/PastDueListSearchCriteria/PastDueListSearchCriteriaProvider';
import { getRowColor } from '../../../context/WorkedHistory/WorkedHistoryProvider';
import { Filter } from '../../../domain/PastDueList/Filter';
import {
  Commitment,
  getFilterByLabel,
  PastDueCustomerResponse,
  PastDueListStatusLegend,
} from '../../../domain/PastDueList/PastDueCustomerList';
import { formatDateString, getSelectedStore } from '../../../utils/utils';
import { CommitmentNotesModal } from '../../Customer/History/CommitmentNotesModal';
export const customerListWrapperTestId = 'customerListWrapperTestId';

const useClasses = makeStyles((theme: any) => ({
  customerListWrapper: {
    overflowX: 'auto',
    height: theme.typography.pxToRem(500),
  },
  header: {
    fontSize: '1rem',
    marginBottom: '.5rem',
  },
  cardBody: {
    padding: '.5rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  checkbox: {
    padding: '0',
  },
  noLeftPadding: {
    paddingLeft: 0,
  },
  selected: {
    backgroundColor: 'none !important',
  },
  leftPadding21: {
    paddingLeft: theme.typography.pxToRem(21),
  },
  paddingTopBottom8: {
    paddingTop: '.5rem',
    paddingBottom: '.5rem',
  },
  link: {
    color: RACCOLOR.BLUE_CRAYOLA,
    cursor: 'pointer',
  },
  contentHeight: {
    height: theme.typography.pxToRem(500),
  },
  tipRoot: {
    borderLeftWidth: theme.typography.pxToRem(6),
  },
}));

const tableHeaderList = [
  '',
  "Customer's Name",
  'Days Past Due',
  'Route',
  'Worked',
  'Due Date',
  'Commitment',
  'Active Agr.',
  'My Store Agr',
  'AP',
  'NSF/CCCB $',
  'Letter',
  '# Contacts Total',
  '# Contacts Today',
];

const applySubFilter = (
  pastDue: PastDueCustomerResponse[] | undefined,
  subFilter: string
) => {
  let filteredPastDueList: PastDueCustomerResponse[] | undefined = pastDue && [
    ...pastDue,
  ];

  if (pastDue && subFilter) {
    const filterName = getFilterByLabel(subFilter) as PastDueListStatusLegend;
    const { CALL_CUSTOMER, COMMITMENT, TEXT_RECEIVED, TEXT_SENT } =
      WORKED_HISTORY_ACTIVITY_TYPE_CODES;

    const { LMAL, LMCE, LMWK, LMR1, LMR2, LMR3, LMR4, NO_ANSWER } =
      WORKED_HISTORY_CALL_RESULT_CODES;

    const { BROKEN } = WORKED_HISTORY_COMMITMENT_STATUS_CODES;

    switch (filterName) {
      case PastDueListStatusLegend.FirstPaymentDefault:
        filteredPastDueList = pastDue.filter(
          (pastDueItem) => pastDueItem.firstPaymentDefault.toUpperCase() === 'Y'
        );
        break;
      case PastDueListStatusLegend.SecondPaymentDefault:
        filteredPastDueList = pastDue.filter(
          (pastDueItem) =>
            pastDueItem.secondPaymentDefault.toUpperCase() === 'Y'
        );
        break;
      case PastDueListStatusLegend.BrokenCommitment:
        filteredPastDueList = pastDue.filter(
          (pastDueItem) =>
            pastDueItem?.accountActivityType?.code === COMMITMENT &&
            pastDueItem?.commitment?.commitmentStatus?.code === BROKEN
        );
        break;
      case PastDueListStatusLegend.Commitment:
        filteredPastDueList = pastDue.filter(
          (pastDueItem) =>
            pastDueItem?.accountActivityType?.code === COMMITMENT &&
            pastDueItem?.commitment?.commitmentStatus?.code !== BROKEN
        );
        break;
      case PastDueListStatusLegend.LeftMessage:
        filteredPastDueList = pastDue.filter(
          (pastDueItem) =>
            pastDueItem?.accountActivityType?.code === CALL_CUSTOMER &&
            [LMAL, LMCE, LMWK, LMR1, LMR2, LMR3, LMR4].includes(
              pastDueItem?.callResultType
                ?.code as WORKED_HISTORY_CALL_RESULT_CODES
            )
        );
        break;
      case PastDueListStatusLegend.NoContact:
        filteredPastDueList = pastDue.filter(
          (pastDueItem) =>
            pastDueItem?.accountActivityType?.code === CALL_CUSTOMER &&
            pastDueItem?.callResultType?.code === NO_ANSWER
        );
        break;
      case PastDueListStatusLegend.TextReceived:
        filteredPastDueList = pastDue.filter(
          (pastDueItem) =>
            pastDueItem?.accountActivityType?.code === TEXT_RECEIVED
        );
        break;
      case PastDueListStatusLegend.TextSent:
        filteredPastDueList = pastDue.filter(
          (pastDueItem) => pastDueItem?.accountActivityType?.code === TEXT_SENT
        );
        break;
    }
  }
  return filteredPastDueList;
};

export const getCustomerFullName = (
  firstName: string,
  lastName: string,
  isFirstPaymentDefault: string,
  isSecondPaymentDefault: string
) => {
  const fullName = `${firstName} ${lastName}`;

  if (isFirstPaymentDefault?.toUpperCase() === 'Y') {
    return `*${fullName}`;
  }

  if (isSecondPaymentDefault?.toUpperCase() === 'Y') {
    return `**${fullName}`;
  }

  return fullName;
};

const validateFieldValue = (value: string) => (value ? value : '-');

export const CustomerList = () => {
  const initialCallToken = useRef<CancelTokenSource>();
  const [offset, setOffset] = useState<number>(INITIAL_OFFSET);
  const [isFirstFetch, setIsFirstFetch] = useState<boolean>(true);

  const classes = useClasses();
  const { filter } = useFilters();
  const {
    pastDue,
    selectedCustomerIds,
    filter: subFilter,
    loading,
    hasMore,
    reloadPastDueList,
  } = useContext(PastDueListCustomerStateContext);

  const [selected, setSelected] = useState<string[]>([]);
  const [filterName, setFilterName] = useState<string>('');
  const [hasApiError, setHasApiError] = useState<boolean>(false);
  const [filteredPastDue, setFilteredPastdue] = useState<
    PastDueCustomerResponse[]
  >([]);
  const [isCommitmentNotesModalOpen, setIsCommitmentNotesModalOpen] =
    useState(false);
  const [selectedCommitment, setSelectedCommitment] =
    useState<Commitment | null>();
  const isPastDueListEmpty = !filteredPastDue || filteredPastDue?.length === 0;

  const {
    onCustomerSelectChanged,
    setSelectCustomerName,
    setFilteredPastDueList,
    setSelectedCustomerIds,
    setPastDueListLoading,
    clearPastDueList,
    setReloadPastDueList,
  } = useContext(PastDueListCustomerDispatchStateContext);

  // const handleSelectAllClick = (event: any) => {
  //   if (pastDue) {
  //     setSelectCustomerName('');
  //     if (event.target.checked) {
  //       const newSelectedItems = filteredPastDue?.map((n) => n.customerId);
  //       if (newSelectedItems) {
  //         setSelected(newSelectedItems);

  //         onCustomerSelectChanged(true);
  //         setSelectedCustomerIds(newSelectedItems);
  //       }
  //       return;
  //     }
  //     onCustomerSelectChanged(false);

  //     setSelected([]);
  //     setSelectedCustomerIds([]);
  //   }
  // };

  const handleCommitmentNotesModalClose = () => {
    setIsCommitmentNotesModalOpen(false);
    setSelectedCommitment(null);
  };

  const handleRowSelectionChange = (item: string) => {
    let newSelected: string[] = [];

    if (selected.includes(item)) {
      newSelected = selected.filter((selectedItem) => selectedItem !== item);
    } else {
      newSelected = newSelected.concat(selected, item);
    }

    setSelected(newSelected);
    setSelectCustomerName('');

    if (newSelected.length > 0) {
      onCustomerSelectChanged(true);
      if (newSelected.length == 1) {
        setSelectCustomerName(findSelectedName(newSelected[0]));
      }
    } else {
      onCustomerSelectChanged(false);
    }
    setSelectedCustomerIds(newSelected);
  };

  const findSelectedName = (itemSelected: string) => {
    const selectedCustomer = filteredPastDue?.find(
      (pastDueCustomer) => pastDueCustomer.customerId === itemSelected
    );
    if (!selectedCustomer) return '';

    return getCustomerFullName(
      selectedCustomer.customerFirstName,
      selectedCustomer.customerLastName,
      selectedCustomer.firstPaymentDefault,
      selectedCustomer.secondPaymentDefault
    );
  };

  const isSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item);

  const renderTableHead = () => (
    <>
      {tableHeaderList.map((col, index) => {
        if (index === 0) {
          return (
            !isPastDueListEmpty && (
              <RACTableCell
                key={index}
                padding="checkbox"
                classes={{
                  root: clsx(classes.leftPadding21, classes.paddingTopBottom8),
                }}
              >
                {/* Currently removed, because API supports only 8 items
                
                <RACCheckBox
                  color="primary"
                  indeterminate={
                    filteredPastDue &&
                    selected.length > 0 &&
                    selected.length < filteredPastDue.length
                  }
                  checked={
                    filteredPastDue &&
                    filteredPastDue.length > 0 &&
                    selected.length === filteredPastDue.length
                  }
                  onChange={handleSelectAllClick}
                  classes={{ checkbox: classes.checkbox }}
                /> */}
              </RACTableCell>
            )
          );
        } else {
          return (
            <RACTableCell
              key={index}
              classes={{
                root: classes.paddingTopBottom8,
              }}
            >
              {col}
            </RACTableCell>
          );
        }
      })}
    </>
  );

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const renderTableContentFilled = () => (
    <>
      {filteredPastDue?.map((pastDueCustomer, index) => {
        const commitmentStatusCode =
          pastDueCustomer.commitment?.commitmentStatus?.code;
        const hasCommitment =
          pastDueCustomer.accountActivityType?.code?.toUpperCase() === 'CMT';
        const commitment: string | undefined = hasCommitment
          ? pastDueCustomer.commitment?.commitmentStatus?.description
          : '';
        const isCommitmentBrokenOrOpen =
          (hasCommitment &&
            commitmentStatusCode ===
              WORKED_HISTORY_COMMITMENT_STATUS_CODES.OPEN) ||
          commitmentStatusCode ===
            WORKED_HISTORY_COMMITMENT_STATUS_CODES.BROKEN;
        const showCommitmentAsLink = commitment && isCommitmentBrokenOrOpen;
        const commitmentFieldValue = validateFieldValue(commitment);
        return (
          <RACTableRow
            key={pastDueCustomer.customerId}
            selected={isSelected(selected, pastDueCustomer.customerId)}
            hover
            backgroundColor={
              getRowColor(
                pastDueCustomer?.accountActivityType?.code,
                pastDueCustomer?.callResultType?.code,
                pastDueCustomer?.commitment?.commitmentStatus?.code
              ).row
            }
            classes={{ selected: classes.selected }}
          >
            <>
              <RACTableCell>
                <RACRowTip
                  classes={{ root: classes.tipRoot }}
                  tipColor={
                    getRowColor(
                      pastDueCustomer?.accountActivityType?.code,
                      pastDueCustomer?.callResultType?.code,
                      pastDueCustomer?.commitment?.commitmentStatus?.code
                    ).tip
                  }
                />
                <RACCheckBox
                  id={pastDueCustomer.customerId}
                  color="primary"
                  onChange={() =>
                    handleRowSelectionChange(pastDueCustomer.customerId)
                  }
                  checked={isSelected(
                    selectedCustomerIds,
                    pastDueCustomer.customerId
                  )}
                  classes={{ checkbox: classes.checkbox }}
                />
              </RACTableCell>
              <RACTableCell classes={{ root: classes.link }}>
                <Link
                  style={{ color: 'inherit', textDecoration: 'unset' }}
                  to={{
                    pathname: `${AppRoute.Customer}/${pastDueCustomer.customerId}`,
                    state: {
                      customer: pastDueCustomer,
                      customerIndex: index,
                    },
                  }}
                >
                  {getCustomerFullName(
                    pastDueCustomer.customerFirstName,
                    pastDueCustomer.customerLastName,
                    pastDueCustomer.firstPaymentDefault,
                    pastDueCustomer.secondPaymentDefault
                  )}
                </Link>
              </RACTableCell>
              <RACTableCell>{pastDueCustomer.daysPastDue}</RACTableCell>
              <RACTableCell>{pastDueCustomer.route?.description}</RACTableCell>
              <RACTableCell>
                {pastDueCustomer.accountActivityType?.code?.toUpperCase() ===
                  'TXTS' ||
                pastDueCustomer.accountActivityType?.code?.toUpperCase() ===
                  'TXTR' ||
                pastDueCustomer.accountActivityType?.code?.toUpperCase() ===
                  'LP' ||
                pastDueCustomer.accountActivityType?.code?.toUpperCase() ===
                  'CMT' ||
                pastDueCustomer.accountActivityType?.code?.toUpperCase() ===
                  'TXTSF'
                  ? pastDueCustomer.accountActivityType?.description
                  : ['CALLC', 'CALLA', 'CALLR', 'CALLE'].includes(
                      pastDueCustomer.accountActivityType?.code?.toUpperCase()
                    )
                  ? pastDueCustomer.callResultType?.description
                  : '-'}
              </RACTableCell>
              <RACTableCell>
                {formatDateString(pastDueCustomer.pastDueDate)}
              </RACTableCell>
              <RACTableCell classes={{ root: classes.link }}>
                {showCommitmentAsLink ? (
                  <span
                    onClick={() => {
                      setSelectedCommitment(pastDueCustomer.commitment);
                      setIsCommitmentNotesModalOpen(true);
                    }}
                  >
                    {commitmentFieldValue}
                  </span>
                ) : (
                  commitmentFieldValue
                )}
              </RACTableCell>
              <RACTableCell>
                {pastDueCustomer.activeAgreementCount}
              </RACTableCell>
              <RACTableCell>
                {pastDueCustomer.myStoreAgreementCount}
              </RACTableCell>
              <RACTableCell>
                {pastDueCustomer?.autoPayFlag?.toUpperCase() === 'Y'
                  ? pastDueCustomer?.autoPayFlag
                  : ''}
              </RACTableCell>
              <RACTableCell>
                ${pastDueCustomer.nsfChargebackAmount}
              </RACTableCell>
              <RACTableCell>
                {validateFieldValue(
                  pastDueCustomer.sentLetterFlag?.toUpperCase() === 'Y'
                    ? pastDueCustomer.letterType?.description
                    : ''
                )}
              </RACTableCell>
              <RACTableCell>{pastDueCustomer.communicationsTotal}</RACTableCell>
              <RACTableCell>{pastDueCustomer.communicationsToday}</RACTableCell>
            </>
          </RACTableRow>
        );
      })}
    </>
  );

  const renderTableContent = () => {
    if (isPastDueListEmpty) return <></>;

    return renderTableContentFilled();
  };

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

  const fetchPastDueList = (resetPastDueList: boolean) => {
    if (initialCallToken?.current) {
      initialCallToken.current?.cancel();
    }
    initialCallToken.current = getCancelTokenSource();

    setHasApiError(false);
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
          setHasApiError(true);
          setFilteredPastDueList([], resetPastDueList);
          setPastDueListLoading(false);
          setReloadPastDueList(false);
        }
      });
  };

  useEffect(() => {
    onCustomerSelectChanged(false);
  }, []);

  useEffect(() => {
    if (!reloadPastDueList) return;
    setFilteredPastdue([]);
    setFilteredPastDueList([], true);

    if (offset === INITIAL_OFFSET) {
      fetchPastDueList(true);
    } else {
      setOffset(INITIAL_OFFSET);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadPastDueList]);

  useEffect(() => {
    const filteredData = applySubFilter(pastDue, subFilter);
    setFilteredPastdue(filteredData || []);
    if (!filteredData || !filteredData.length) {
      setFilterName(subFilter);
    } else {
      setFilterName('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subFilter, pastDue]);

  useEffect(() => {
    setSelected([]);
    setSelectedCustomerIds([]);
    setSelectCustomerName('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subFilter]);

  useEffect(() => {
    if (!selectedCustomerIds.length) {
      setSelected(selectedCustomerIds);
    }
  }, [selectedCustomerIds]);

  useEffect(() => {
    clearPastDueList();
    if (offset === INITIAL_OFFSET && !isFirstFetch) {
      fetchPastDueList(true);
      setIsFirstFetch(false);
    }
    setOffset(INITIAL_OFFSET);
  }, [filter]);

  useEffect(() => {
    const reloadPastDueList = offset === INITIAL_OFFSET;
    fetchPastDueList(reloadPastDueList);
    setIsFirstFetch(false);
  }, [offset]);

  /*
  Increment the offset.
  Fetch is handled in the useEffect that listens on the offset.
  */
  const fetchNextPage = () => {
    /*
    fetchNextPage is used by infinite scroll component
    the first fetch is handled by our component, therefore we are not letting the
    infinite scroll to trigger the first request.
    Handles the case when you apply the filters
    (offset set to 0 -> request is triggered, but infinite scroll is also triggering a request, because its data length is 0)
    */
    if (!filteredPastDue || filteredPastDue.length < 1) return;
    setOffset(offset + PAST_DUE_LIST_API_LIMIT);
  };

  return (
    <div
      className={clsx(classes.customerListWrapper)}
      data-testid={customerListWrapperTestId}
    >
      {isCommitmentNotesModalOpen && selectedCommitment && (
        <CommitmentNotesModal
          commitment={selectedCommitment}
          onClose={handleCommitmentNotesModalClose}
        />
      )}
      <InfiniteScroll
        next={fetchNextPage}
        dataLength={filteredPastDue?.length || 0}
        hasMore={hasMore}
        height={500}
        loader={loading && filteredPastDue?.length ? <Loader /> : null}
      >
        <ApiStateWrapper
          // show loading only for the first request
          loading={loading && filteredPastDue?.length === 0}
          // show error only if the first request fails
          hasApiError={hasApiError && filteredPastDue.length === 0}
          response={filteredPastDue}
          noItemAdditionalText={filterName ? ` for '${filterName}' filter` : ''}
          successContent={
            <RACTable
              renderTableHead={renderTableHead}
              renderTableContent={renderTableContent}
              stickyHeader
            />
          }
          classes={{
            loader: classes.contentHeight,
            apiError: classes.contentHeight,
            noItems: classes.contentHeight,
          }}
        />
      </InfiniteScroll>
    </div>
  );
};
