import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as api from '../../api/reference';
import {
  ALL_OPTION,
  CACHED_KEYS,
  PAST_DUE_LIST_SEARCH_COMMUNICATION_TYPE_OPTIONS,
  PAST_DUE_LIST_SEARCH_DAYS_LATE_OPTIONS,
  PAST_DUE_LIST_SEARCH_ACTIVITY_OPTIONS,
  PAST_DUE_LIST_SEARCH_CALL_ACTIVITY_TOOLTIP,
} from '../../constants/constants';
import {
  ReferenceKeys,
  ReferenceOption,
  RouteOption,
  ReferenceResponse,
} from '../../types/types';
import {
  addAllOption,
  getSelectedStore,
  mapReferenceResponse,
  orderByField,
  pipe,
} from '../../utils/utils';
import { defaultFilter, Filter } from '../../domain/PastDueList/Filter';
import { getStoreRoutes } from '../../api/Customer';
import { format } from 'date-fns';

const ORDER_BY_FIELD = 'displaySeq';
const ORDER_BY_DESC_FIELD = 'description';
export const orderByDisplaySeqField = orderByField.bind(null, ORDER_BY_FIELD);
export const orderByDescField = orderByField.bind(null, ORDER_BY_DESC_FIELD);

export interface PastDueListSearchCriteriaState {
  daysLateOptions: typeof PAST_DUE_LIST_SEARCH_DAYS_LATE_OPTIONS;
  bestTimeToCallOptions: ReferenceOption[];
  commitmentStatusOptions: ReferenceOption[];
  communicationTypeOptions: typeof PAST_DUE_LIST_SEARCH_COMMUNICATION_TYPE_OPTIONS;
  languageOptions: ReferenceOption[];
  customersWithActivityOptions: typeof PAST_DUE_LIST_SEARCH_ACTIVITY_OPTIONS;
  customersWithCallActivityToolTip: typeof PAST_DUE_LIST_SEARCH_CALL_ACTIVITY_TOOLTIP;
  routeOptions: RouteOption[];
  // Selected options
  selectedDaysLateOption: string[];
  selectedBestTimeToCallOption: string[];
  selectedCommitmentStatusOption: string[];
  selectedCommunicationTypeOption: string[];
  selectedLanguageOption: string[];
  selectedCustomersWithActivityOption: string;
  selectedRouteOption: string;
  // Selected dates
  selectedCommitmentDateFromOption: string;
  selectedCommitmentDateToOption: string;

  selectedDueDateFromOption: string;
  selectedDueDateToOption: string;
  // checkboxes
  isAutopayCustomersOptionSelected: boolean;
  isAllCommitmentDateOptionSelected: boolean;
  isAllDueDateOptionSelected: boolean;
  // Selected filters
  filter: Filter;
  hasApiError: boolean;
  hasRouteApiError: boolean;
  //loading
  isLoading: boolean;
  isFetchRoutesLoading: boolean;
}

export interface PastDueListSearchCriteriaDispatchState {
  onBestTimeToCallChanged: (values: string[]) => void;
  onCommitmentStatusChanged: (values: string[]) => void;
  onCommunicationTypeChanged: (values: string[]) => void;
  onDaysLateOptionChanged: (values: string[]) => void;
  onLanguageChanged: (values: string[]) => void;
  setSelectedRouteOption: (value: string) => void;
  setIsAutopayCustomersOption: (value: boolean) => void;
  setSelectedDueDateFromOption: (value: string) => void;
  setSelectedDueDateToOption: (value: string) => void;
  onCommitmentDateToOptionChanged: (value: string) => void;
  onCommitmentDateFromOptionChanged: (value: string) => void;
  onDueDateFromOptionChanged: (value: string) => void;
  onDueDateToOptionChanged: (value: string) => void;
  onDueDateCheckboxChanged: () => void;
  onCommitmentDateCheckboxChanged: () => void;
  onCustomersWithActivityChanged: (value: string) => void;
  onClearSelectedOptions: () => void;
  onApplyFilters: () => void;
}

export const PastDueListSearchCriteriaStateContext =
  createContext<PastDueListSearchCriteriaState>(
    {} as PastDueListSearchCriteriaState
  );
export const PastDueListSearchCriteriaDispatchContext =
  createContext<PastDueListSearchCriteriaDispatchState>(
    {} as PastDueListSearchCriteriaDispatchState
  );

/*
Patterns used by PastDueListSearchCriteriaProvider:
-entityOptions, where entity represents a specific input, carries all the possible options that the respective
input can take as value (e.g.bestTimeToCallOptions, commitmentStatusOptions, etc)
-selectedEntityOptions, where entity represents a specific input, carries the current value for a given input
(e.g. selectedBestTimeToCallOption, etc)
-setEntity represents a function that directly sets the entity value
-onEntityChanged represents a function that eventually sets the entity value, but with side effect
(e.g. sets value for an another input also, like All checkbox)
*/
export const PastDueListSearchCriteriaProvider = (props: {
  children: ReactNode;
}) => {
  // Options retrieved from API
  const [bestTimeToCallOptions, setBestTimeToCallOptions] = useState<
    ReferenceOption[]
  >([]);
  const [commitmentStatusOptions, setCommitmentStatusOptions] = useState<
    ReferenceOption[]
  >([]);
  const [languageOptions, setLanguageOptions] = useState<ReferenceOption[]>([]);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);

  // Selected options
  const [selectedBestTimeToCallOption, setSelectedBestTimeToCallOption] =
    useState<string[]>([ALL_OPTION]);
  const [selectedCommitmentStatusOption, setSelectedCommitmentStatusOption] =
    useState<string[]>([ALL_OPTION]);
  const [selectedCommunicationTypeOption, setSelectedCommunicationTypeOption] =
    useState<string[]>([ALL_OPTION]);
  const [
    selectedCustomersWithActivityOption,
    setSelectedCustomersWithActivityOption,
  ] = useState<string>(ALL_OPTION);
  const [selectedDaysLateOption, setSelectedDaysLateOption] = useState<
    string[]
  >([ALL_OPTION]);
  const [selectedLanguageOption, setSelectedLanguageOption] = useState<
    string[]
  >([ALL_OPTION]);
  const [selectedRouteOption, setSelectedRouteOption] =
    useState<string>(ALL_OPTION);
  // Dates
  const [
    selectedCommitmentDateFromOption,
    setSelectedCommitmentDateFromOption,
  ] = useState<string>('');
  const [selectedCommitmentDateToOption, setSelectedCommitmentDateToOption] =
    useState<string>('');

  const [selectedDueDateFromOption, setSelectedDueDateFromOption] =
    useState<string>('');
  const [selectedDueDateToOption, setSelectedDueDateToOption] =
    useState<string>('');

  // Checkboxes
  const [isAutopayCustomersOptionSelected, setIsAutopayCustomersOption] =
    useState<boolean>(true);
  const [isAllDueDateOptionSelected, setIsAllDueDateOptionSelected] =
    useState<boolean>(true);
  // If is selected, then commitmentDateOption will be set to default
  const [
    isAllCommitmentDateOptionSelected,
    setIsAllCommitmentDateOptionSelected,
  ] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isFetchRoutesLoading, setIsFetchRoutesLoading] =
    useState<boolean>(false);

  const [hasApiError, setHasApiError] = useState<boolean>(false);

  const [hasRouteApiError, setHasRouteApiError] = useState<boolean>(false);

  const [filter, setFilter] = useState<Filter>(defaultFilter);

  const dateFormat = 'yyyy-MM-dd';

  useEffect(() => {
    onClearSelectedOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDueDateFromOptionChanged = (value: string) => {
    if (value) setIsAllDueDateOptionSelected(false);
    setSelectedDaysLateOption([ALL_OPTION]);

    setSelectedDueDateFromOption(value);
  };

  const onDueDateToOptionChanged = (value: string) => {
    if (value) setIsAllDueDateOptionSelected(false);
    setSelectedDaysLateOption([ALL_OPTION]);

    setSelectedDueDateToOption(value);
  };

  const onDueDateCheckboxChanged = () => {
    if (isAllDueDateOptionSelected) {
      setSelectedDueDateFromOption(format(new Date(), dateFormat));
    } else {
      setSelectedDueDateFromOption('');
    }
    setSelectedDueDateToOption('');
    setIsAllDueDateOptionSelected(!isAllDueDateOptionSelected);

    setSelectedDaysLateOption([ALL_OPTION]);
  };

  const onCustomersWithActivityChanged = (value: string) => {
    setSelectedCustomersWithActivityOption(value);
  };

  const onCommitmentDateCheckboxChanged = () => {
    setSelectedCommitmentDateToOption('');
    setSelectedCommitmentDateFromOption('');
    setIsAllCommitmentDateOptionSelected(!isAllCommitmentDateOptionSelected);
  };

  const onCommitmentDateToOptionChanged = (value: string) => {
    setSelectedCommitmentDateToOption(value);
    setIsAllCommitmentDateOptionSelected(false);
  };

  const onCommitmentDateFromOptionChanged = (value: string) => {
    setSelectedCommitmentDateFromOption(value);
    setIsAllCommitmentDateOptionSelected(false);
  };

  const handleMultipleSelect = (
    values: string[],
    allOptions:
      | ReferenceOption[]
      | typeof PAST_DUE_LIST_SEARCH_COMMUNICATION_TYPE_OPTIONS
      | typeof PAST_DUE_LIST_SEARCH_DAYS_LATE_OPTIONS,
    callback: (values: string[]) => void
  ) => {
    if (!values || values.length === 0) {
      callback([ALL_OPTION]);
      return;
    }

    if (values[0] === ALL_OPTION && values.length === 2) {
      callback(values.splice(1));
      return;
    }
    if (values.includes(ALL_OPTION)) {
      callback([ALL_OPTION]);
      return;
    }
    // - 1, because ALL_OPTION is included into allOptions
    if (values.length === allOptions.length - 1) {
      callback([ALL_OPTION]);
      return;
    }
    callback(values);
  };

  const onDaysLateOptionChanged = (values: string[]) => {
    handleMultipleSelect(
      values,
      PAST_DUE_LIST_SEARCH_DAYS_LATE_OPTIONS,
      (valuesToStore) => {
        const isAllTheNewValue =
          valuesToStore.length === 1 && valuesToStore[0] === ALL_OPTION;
        if (
          isAllTheNewValue &&
          selectedDaysLateOption.length === 1 &&
          selectedDaysLateOption[0] === ALL_OPTION
        ) {
          return;
        }

        if (isAllTheNewValue) {
          setIsAllDueDateOptionSelected(true);
        } else {
          setIsAllDueDateOptionSelected(false);
        }
        setSelectedDueDateFromOption('');
        setSelectedDueDateToOption('');

        setSelectedDaysLateOption(valuesToStore);
      }
    );
  };

  const onBestTimeToCallChanged = (values: string[]) => {
    handleMultipleSelect(
      values,
      bestTimeToCallOptions,
      setSelectedBestTimeToCallOption
    );
  };

  const onCommitmentStatusChanged = (values: string[]) => {
    handleMultipleSelect(
      values,
      commitmentStatusOptions,
      setSelectedCommitmentStatusOption
    );
  };

  const onCommunicationTypeChanged = (values: string[]) => {
    handleMultipleSelect(
      values,
      PAST_DUE_LIST_SEARCH_COMMUNICATION_TYPE_OPTIONS,
      setSelectedCommunicationTypeOption
    );
  };

  const onLanguageChanged = (values: string[]) => {
    handleMultipleSelect(values, languageOptions, setSelectedLanguageOption);
  };

  const onClearSelectedOptions = () => {
    setSelectedBestTimeToCallOption([ALL_OPTION]);
    setSelectedCommitmentStatusOption([ALL_OPTION]);
    setSelectedCommunicationTypeOption([ALL_OPTION]);
    setSelectedCustomersWithActivityOption(ALL_OPTION);
    setSelectedDaysLateOption([ALL_OPTION]);
    setSelectedLanguageOption([ALL_OPTION]);
    setSelectedRouteOption(ALL_OPTION);
    // checkboxes
    setIsAllDueDateOptionSelected(true);
    setIsAllCommitmentDateOptionSelected(true);
    setIsAutopayCustomersOption(true);
    // dates
    setSelectedDueDateFromOption('');
    setSelectedDueDateToOption('');
    setSelectedCommitmentDateFromOption('');
    setSelectedCommitmentDateToOption('');
    setFilter(defaultFilter);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onApplyFilters = () => {
    const duedateRange = {
      ...(!isAllDueDateOptionSelected &&
        selectedDueDateFromOption !== '' &&
        selectedDueDateToOption !== '' && {
          pastDueDateRange: {
            startDate: selectedDueDateFromOption,
            endDate: selectedDueDateToOption,
          },
        }),
    };
    const commitmentDate = {
      ...(!isAllCommitmentDateOptionSelected && {
        commitmentDateRange: {
          startDate: selectedCommitmentDateFromOption,
          endDate: selectedCommitmentDateToOption,
        },
      }),
    };

    const customersWithActivity = {
      ...(selectedCustomersWithActivityOption !== ALL_OPTION && {
        customersWithActivity: selectedCustomersWithActivityOption,
      }),
    };

    const route = {
      ...(selectedRouteOption !== ALL_OPTION && {
        route: selectedRouteOption,
      }),
    };

    setFilter({
      daysPastDue: selectedDaysLateOption,
      bestTimeToCall: selectedBestTimeToCallOption,
      includeAutoPay: isAutopayCustomersOptionSelected ? 'Y' : 'N',
      commitmentStatus: selectedCommitmentStatusOption,
      language: selectedLanguageOption,
      communicationType: selectedCommunicationTypeOption,
      ...route,
      ...duedateRange,
      ...commitmentDate,
      ...customersWithActivity,
    });
  };

  const fetchStoreRoutes = async () => {
    setHasRouteApiError(false);
    setIsFetchRoutesLoading(true);
    getStoreRoutes(getSelectedStore())
      .then((response: any) => {
        const newRouteOptions: RouteOption[] = [
          {
            routeDescription: ALL_OPTION,
            label: ALL_OPTION,
            value: ALL_OPTION,
            routeCode: ALL_OPTION,
          },
        ];
        response.routeIds.forEach((route: any) => {
          newRouteOptions.push({
            label: route.description,
            value: route.routeRefCode,
            routeCode: route.routeRefCode,
            routeDescription: route.description,
          });
        });
        orderByField('label', newRouteOptions);
        setRouteOptions(newRouteOptions);
      })
      .catch(() => setHasRouteApiError(true))
      .finally(() => setIsFetchRoutesLoading(false));
  };

  const fetchOption = (
    apiKeys: ReferenceKeys[],
    setApiError: (state: boolean) => void
  ) => {
    setApiError(false);
    setIsLoading(true);
    api
      .getReference(apiKeys, CACHED_KEYS.PAST_DUE_SEARCH_KEY)
      .then((response: any) => {
        const { references } = response;
        references?.map((reference: ReferenceResponse) => {
          if (reference?.referenceKey === ReferenceKeys.LANGUAGE) {
            return pipe(
              orderByDisplaySeqField,
              mapReferenceResponse,
              addAllOption,
              setLanguageOptions
            )(reference?.referenceDetails);
          } else if (
            reference.referenceKey === ReferenceKeys.BEST_TIME_TO_CALL
          ) {
            return pipe(
              orderByDisplaySeqField,
              mapReferenceResponse,
              addAllOption,
              setBestTimeToCallOptions
            )(reference?.referenceDetails);
          } else if (
            reference.referenceKey === ReferenceKeys.COMMITMENT_STATUS
          ) {
            return pipe(
              orderByDisplaySeqField,
              mapReferenceResponse,
              addAllOption,
              setCommitmentStatusOptions
            )(reference?.referenceDetails);
          }
        });
      })
      .catch(() => {
        setApiError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchFiltersOptions = async () => {
    fetchOption(
      [
        ReferenceKeys.LANGUAGE,
        ReferenceKeys.BEST_TIME_TO_CALL,
        ReferenceKeys.COMMITMENT_STATUS,
      ],
      setHasApiError
    );

    fetchStoreRoutes();
  };

  useEffect(() => {
    fetchFiltersOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PastDueListSearchCriteriaStateContext.Provider
      value={{
        //options
        daysLateOptions: PAST_DUE_LIST_SEARCH_DAYS_LATE_OPTIONS,
        bestTimeToCallOptions,
        commitmentStatusOptions,
        languageOptions,
        customersWithActivityOptions: PAST_DUE_LIST_SEARCH_ACTIVITY_OPTIONS,
        customersWithCallActivityToolTip:
          PAST_DUE_LIST_SEARCH_CALL_ACTIVITY_TOOLTIP,
        communicationTypeOptions:
          PAST_DUE_LIST_SEARCH_COMMUNICATION_TYPE_OPTIONS,
        routeOptions,
        // selected options
        selectedDaysLateOption,
        selectedBestTimeToCallOption,
        selectedCommitmentStatusOption,
        selectedLanguageOption,
        selectedCustomersWithActivityOption,
        selectedCommunicationTypeOption,
        selectedRouteOption,
        // selected dates
        selectedCommitmentDateFromOption,
        selectedCommitmentDateToOption,

        selectedDueDateFromOption,
        selectedDueDateToOption,
        // checkboxes
        isAutopayCustomersOptionSelected,
        isAllCommitmentDateOptionSelected,
        isAllDueDateOptionSelected,
        // selected filters
        filter,
        // api error
        hasApiError,
        hasRouteApiError,
        //loading
        isLoading,
        isFetchRoutesLoading,
      }}
    >
      <PastDueListSearchCriteriaDispatchContext.Provider
        value={{
          onBestTimeToCallChanged,
          onCommitmentStatusChanged,
          onCommunicationTypeChanged,
          onDaysLateOptionChanged,
          onLanguageChanged,
          setSelectedRouteOption,
          onCommitmentDateToOptionChanged,
          onCommitmentDateFromOptionChanged,
          setSelectedDueDateFromOption,
          setSelectedDueDateToOption,
          setIsAutopayCustomersOption,
          onDueDateFromOptionChanged,
          onDueDateToOptionChanged,
          onDueDateCheckboxChanged,
          onCommitmentDateCheckboxChanged,
          onCustomersWithActivityChanged,
          onClearSelectedOptions,
          onApplyFilters,
        }}
      >
        {props.children}
      </PastDueListSearchCriteriaDispatchContext.Provider>
    </PastDueListSearchCriteriaStateContext.Provider>
  );
};

export const useFilters = () =>
  useContext(PastDueListSearchCriteriaStateContext);

export const useFiltersActions = () =>
  useContext(PastDueListSearchCriteriaDispatchContext);
