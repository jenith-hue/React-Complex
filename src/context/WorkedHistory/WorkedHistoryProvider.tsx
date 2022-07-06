import axios, { CancelTokenSource } from 'axios';
import React, { createContext, ReactNode, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getActivityLogs } from '../../api/activityLog';
import { logWorkedHistory } from '../../api/Customer';
import {
  AUTO_SYSTEM_TEXT,
  TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY,
  WORKED_HISTORY_ACTIVITY_TYPE_CODES,
  WORKED_HISTORY_API_LIMIT,
  WORKED_HISTORY_CALL_RESULT_CODES,
  WORKED_HISTORY_COLORS,
  WORKED_HISTORY_COMMITMENT_STATUS_CODES,
} from '../../constants/constants';
import { ActivityLogResponse } from '../../domain/ActivityLog/ActivityLogResult';
import { LogWorkedHistoryPayload } from '../../domain/WorkedHistory/WorkedHistory';
import {
  CustomerLocationState,
  WorkedHistoryItemType,
  WorkedHistoryLabel,
  WorkedHistoryResponse,
} from '../../types/types';
import { getSelectedStore } from '../../utils/utils';
import { useCustomerDetails } from '../CustomerDetails/CustomerDetailsProvider';
import { useUserStateContext } from '../user/user-contexts';

export const EMPTY_WORKED_HISTORY = {
  text: '',
  background: '',
};

export const getRowColor = (
  accountActivityTypeCode?: string,
  callResultTypeCode?: string,
  commitmentStatusCode?: string
) => {
  if (!accountActivityTypeCode) return WORKED_HISTORY_COLORS.NO_COLOR;

  const { CALL_CUSTOMER, COMMITMENT, TEXT_RECEIVED, TEXT_SENT } =
    WORKED_HISTORY_ACTIVITY_TYPE_CODES;

  const { LMAL, LMCE, LMWK, LMR1, LMR2, LMR3, LMR4, NO_ANSWER } =
    WORKED_HISTORY_CALL_RESULT_CODES;

  const { BROKEN } = WORKED_HISTORY_COMMITMENT_STATUS_CODES;

  if (accountActivityTypeCode === CALL_CUSTOMER) {
    if (callResultTypeCode === NO_ANSWER) {
      return WORKED_HISTORY_COLORS.NO_ANSWER;
    }

    if (
      [LMAL, LMCE, LMWK, LMR1, LMR2, LMR3, LMR4].includes(
        callResultTypeCode as WORKED_HISTORY_CALL_RESULT_CODES
      )
    ) {
      return WORKED_HISTORY_COLORS.LEFT_MESSAGE;
    }
    return WORKED_HISTORY_COLORS.NO_COLOR;
  }

  if (accountActivityTypeCode === COMMITMENT) {
    if (commitmentStatusCode === BROKEN) {
      return WORKED_HISTORY_COLORS.BROKEN_COMMITMENT;
    }
    return WORKED_HISTORY_COLORS.COMMITMENT;
  }

  if (accountActivityTypeCode === TEXT_SENT)
    return WORKED_HISTORY_COLORS.TEXT_SENT;
  if (accountActivityTypeCode === TEXT_RECEIVED)
    return WORKED_HISTORY_COLORS.TEXT_RECEIVED;

  return WORKED_HISTORY_COLORS.NO_COLOR;
};

export interface WorkedHistoryState {
  workedHistory: Partial<WorkedHistoryItemType>[];
  workedHistoryLabel: WorkedHistoryLabel;
  hasMore: boolean;
  hasApiError: boolean;
  loading: boolean;
  reloadWorkedHistory: boolean;
}

export interface WorkedHistoryDispatchState {
  fetchWorkedHistory: (
    offset: number,
    Limit: number
  ) => Promise<void | WorkedHistoryResponse>;
  setReloadWorkedHistory: (state: boolean) => void;
  onLogWorkedHistory: (
    callResult: string,
    note: string,
    daysPastDue: string,
    personId: string,
    callType: string,
    phoneNo: string,
    onSuccess: () => void,
    onError: () => void
  ) => Promise<void>;
}

export const WorkedHistoryStateContext = createContext<WorkedHistoryState>(
  {} as WorkedHistoryState
);
export const WorkedHistoryDispatchContext =
  createContext<WorkedHistoryDispatchState>({} as WorkedHistoryDispatchState);

export const WorkedHistoryProvider = (props: { children: ReactNode }) => {
  const [workedHistory, setWorkedHistory] = React.useState<
    Partial<WorkedHistoryItemType>[]
  >([]);
  const [workedHistoryLabel, setWorkedHistoryLabel] =
    React.useState<WorkedHistoryLabel>(EMPTY_WORKED_HISTORY);

  const location = useLocation<CustomerLocationState>();
  const [hasApiError, setHasApiError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [reloadWorkedHistory, setReloadWorkedHistory] = React.useState(false);
  const [hasMore, setHasMore] = React.useState<boolean>(false);
  const initialCallToken = useRef<CancelTokenSource>();

  const { user } = useUserStateContext();
  const storeNumber = getSelectedStore();

  const resetData = (reset: boolean) => {
    if (reset) {
      setHasMore(false);
      setWorkedHistory([]);
    }
    setReloadWorkedHistory(reset);
  };

  const filterPayload = {
    storeNumber: getSelectedStore(),
    daysPastDue: [],
    language: [],
    coWorker: [],
    phoneType: [],
    route: [],
    callResult: [],
  };

  const { customerDetails } = useCustomerDetails();

  const coCustomerId = customerDetails?.coCustomerId;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const fetchWorkedHistory = async (offset: number, Limit: number) => {
    if (initialCallToken?.current) {
      initialCallToken.current?.cancel();
    }
    initialCallToken.current = axios.CancelToken.source();

    setHasApiError(false);
    setLoading(true);
    const customerId =
      location?.state?.customer?.customerId ||
      location?.pathname?.split('/')[3];
    getActivityLogs(
      filterPayload,
      offset,
      Limit,
      customerId,
      coCustomerId,
      initialCallToken.current?.token
    )
      .then((response: ActivityLogResponse) => {
        setLoading(false);
        const responseToUse = {} as ActivityLogResponse;
        if (response?.accountActivities?.length) {
          responseToUse.accountActivities = response.accountActivities.map(
            (accountActivity) => {
              if (!accountActivity.commitment) {
                return accountActivity;
              }
              return {
                ...accountActivity,
                commitment: {
                  ...accountActivity.commitment,
                  commitmentStatus:
                    accountActivity.commitment.commitmentActualStatus,
                },
              };
            }
          );
        }
        const workedHistoryWithCoworkersAndColors =
          responseToUse?.accountActivities?.map((wh: any) => {
            if (wh?.customerId?.toString() !== customerId) {
              return {
                ...wh,
                phoneContact: {
                  relationshipType: {
                    ...wh?.phoneContact?.relationshipType,
                    description: 'Co-Customer',
                  },
                },
                color: getRowColor(
                  wh?.accountActivityType?.code,
                  wh?.callResultType?.code,
                  wh?.commitment?.commitmentStatus?.code
                ),
              };
            }
            return {
              ...wh,
              color: getRowColor(
                wh?.accountActivityType?.code,
                wh?.callResultType?.code,
                wh?.commitment?.commitmentStatus?.code
              ),
            };
          });

        const workedHistoryWithAutoSystemText =
          workedHistoryWithCoworkersAndColors?.map((wh: any) => {
            if (
              wh?.coWorker?.firstName ===
                TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY ||
              wh?.coWorker?.lastName ===
                TEXT_CONVERSATION_SYSTEM_MESSAGE_AUTO_REPLY
            ) {
              return {
                ...wh,
                coWorker: {
                  ...wh?.coWorker,
                  firstName: AUTO_SYSTEM_TEXT,
                  lastName: '',
                },
              };
            }
            return wh;
          });
        if (
          responseToUse?.accountActivities?.length === WORKED_HISTORY_API_LIMIT
        ) {
          setHasMore(true);
        }
        const workedHistoryToSaveInState = [
          ...workedHistory,
          ...(workedHistoryWithAutoSystemText || []),
        ];
        setWorkedHistory(workedHistoryToSaveInState);
        const workedHistoryLabelToSaveInState = {
          text:
            workedHistoryToSaveInState?.[0]?.accountActivityType?.description ||
            '',
          background: workedHistoryToSaveInState?.[0]?.color?.tip || '',
        };
        setWorkedHistoryLabel(workedHistoryLabelToSaveInState);
        setReloadWorkedHistory(false);
      })
      .catch((err) => {
        if (!err.__CANCEL__) {
          setLoading(false);
          setHasApiError(true);
        }
      });
  };

  const onLogWorkedHistory = async (
    callResult: string,
    note: string,
    daysPastDue: string,
    personId: string,
    callType: string,
    phoneNo: string,
    onSuccess: () => void,
    onError: () => void
  ) => {
    const payload = {
      storeNumber,
      acctActivityRefCode: callType,
      callResultRefCode: callResult,
      notes: note,
      daysPastDue: daysPastDue,
      customerId: Number(personId),
      coWorkerId: user?.employeeId || ' ',
      activityDate: new Date().toISOString(),
      phoneNumberDialed: phoneNo,
    } as Partial<LogWorkedHistoryPayload>;
    return logWorkedHistory(payload)
      .then(async () => {
        onSuccess();
        resetData(true);
      })
      .catch(onError);
  };

  return (
    <WorkedHistoryStateContext.Provider
      value={{
        workedHistory,
        workedHistoryLabel,
        hasMore,
        hasApiError,
        loading,
        reloadWorkedHistory,
      }}
    >
      <WorkedHistoryDispatchContext.Provider
        value={{
          fetchWorkedHistory,
          setReloadWorkedHistory: resetData,
          onLogWorkedHistory,
        }}
      >
        {props.children}
      </WorkedHistoryDispatchContext.Provider>
    </WorkedHistoryStateContext.Provider>
  );
};

export const useWorkedHistory = () => useContext(WorkedHistoryStateContext);

export const useWorkedHistoryActions = () =>
  useContext(WorkedHistoryDispatchContext);
