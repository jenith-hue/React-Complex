import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AccountActivity } from '../../domain/ActivityLog/ActivityLogResult';

export interface ActivityLogResultState {
  activityLog: AccountActivity[];
  loading: boolean;
  hasApiError: boolean;
  hasMore: boolean;
}

export interface ActivityLogResultDispatchState {
  setFilteredActivityLog: (
    filteredPastDue: AccountActivity[],
    resetActivityLog?: boolean
  ) => void;
  setApiLoadingState: (value: boolean) => void;
  setApiHasError: (value: boolean) => void;
  clearActivityLog: () => void;
}

export const ActivityLogResultStateContext =
  createContext<ActivityLogResultState>({} as ActivityLogResultState);

export const useActivityLogResult = () =>
  useContext(ActivityLogResultStateContext);

export const ActivityLogResultDispatchStateContext =
  createContext<ActivityLogResultDispatchState>(
    {} as ActivityLogResultDispatchState
  );

export const useActivityLogResultDispatch = () =>
  useContext(ActivityLogResultDispatchStateContext);

const ActivityLogResultProvider = (props: { children: ReactNode }) => {
  const [activityLog, setActivityLog] = useState<AccountActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasApiError, setHasApiError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const setFilteredActivityLog = (
    filteredActivityLog: AccountActivity[],
    resetActivityLog?: boolean
  ) => {
    if (resetActivityLog) setActivityLog(filteredActivityLog);
    else setActivityLog([...activityLog, ...filteredActivityLog]);
    setHasMore(!!filteredActivityLog.length);
  };

  const clearActivityLog = () => {
    setActivityLog([]);
  };

  const setApiLoadingState = (state: boolean) => setLoading(state);

  const setApiHasError = (state: boolean) => setHasApiError(state);

  return (
    <ActivityLogResultStateContext.Provider
      value={{
        activityLog,
        loading,
        hasApiError,
        hasMore,
      }}
    >
      <ActivityLogResultDispatchStateContext.Provider
        value={{
          setFilteredActivityLog,
          setApiHasError,
          setApiLoadingState,
          clearActivityLog,
        }}
      >
        {props.children}
      </ActivityLogResultDispatchStateContext.Provider>
    </ActivityLogResultStateContext.Provider>
  );
};

export default ActivityLogResultProvider;
