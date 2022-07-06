import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as api from '../../api/reference';
import { getStoreCoworkers, getStoreRoutes } from '../../api/activityLog';
import {
  ALL_OPTION,
  CACHED_KEYS,
  PAST_DUE_LIST_SEARCH_COMMUNICATION_TYPE_OPTIONS,
  PAST_DUE_LIST_SEARCH_DAYS_LATE_OPTIONS,
  TEXT_OPTIONS,
} from '../../constants/constants';
import {
  ActivityLogSearchCriteriaCommitmentType,
  ActivityLogSearchCriteriaOption,
  ActivityLogSearchCriteriaResponse,
  ReferenceKeys,
  CoworkerOption,
  RouteOption,
  ActivityLogFilter,
  defaultActivityLogFilter,
  ReferenceResponse,
} from '../../types/types';
import {
  addAllOption,
  getSelectedStore,
  mapReferenceResponse,
  orderByField,
  pipe,
} from '../../utils/utils';

const ORDER_BY_FIELD = 'description';
const orderByDescField = orderByField.bind(null, ORDER_BY_FIELD);

export interface ActivityLogSearchCriteriaState {
  daysLateOptions: typeof PAST_DUE_LIST_SEARCH_DAYS_LATE_OPTIONS;
  routeOptions: RouteOption[];
  coworkerOptions: CoworkerOption[];
  amActivityOptions: ActivityLogSearchCriteriaOption[];
  phoneTypeOptions: ActivityLogSearchCriteriaOption[];
  languageOptions: ActivityLogSearchCriteriaOption[];

  // Selected options
  selectedDaysLateOption: string[];
  selectedRouteOption: string[];
  selectedCoworkerOption: string[];
  selectedAmActivityOption: string[];
  selectedPhoneTypeOption: string[];
  selectedLanguageOption: string[];

  // Selected dates
  selectedDateRangeFromOption: string;
  selectedDateRangeToOption: string;

  // Selected time
  selectedTimeRangeFromOption: string;
  selectedTimeRangeToOption: string;

  // checkboxes
  isAllDateRangeOptionSelected: boolean;
  isAllTimeRangeOptionSelected: boolean;

  hasRouteApiError: boolean;
  hasCoworkerApiError: boolean;
  hasApiError: boolean;

  filter: ActivityLogFilter;
}

export interface ActivityLogSearchCriteriaDispatchState {
  fetchFiltersOptions: (
    commitmentType: ActivityLogSearchCriteriaCommitmentType
  ) => Promise<void | ActivityLogSearchCriteriaResponse>;

  onDaysLateOptionChanged: (values: string[]) => void;
  onRouteChanged: (values: string[]) => void;
  onCoworkerChanged: (values: string[]) => void;
  onAmActivityChanged: (values: string[]) => void;
  onPhoneTypeChanged: (values: string[]) => void;
  onLanguageChanged: (values: string[]) => void;

  onDateRangeFromOptionChanged: (value: string) => void;
  onDateRangeToOptionChanged: (value: string) => void;
  onDateRangeCheckboxChanged: () => void;

  onTimeRangeFromOptionChanged: (value: string) => void;
  onTimeRangeToOptionChanged: (value: string) => void;
  onTimeRangeCheckboxChanged: () => void;

  onClearSelectedOptions: () => void;
  onApplyFilters: () => void;
}

export const ActivityLogSearchCriteriaStateContext =
  createContext<ActivityLogSearchCriteriaState>(
    {} as ActivityLogSearchCriteriaState
  );
export const ActivityLogSearchCriteriaDispatchContext =
  createContext<ActivityLogSearchCriteriaDispatchState>(
    {} as ActivityLogSearchCriteriaDispatchState
  );

/*
Patterns used by ActivityLogSearchCriteriaProvider:
-entityOptions, where entity represents a specific input, carries all the possible options that the respective
input can take as value (e.g.bestTimeToCallOptions, commitmentStatusOptions, etc)
-selectedEntityOptions, where entity represents a specific input, carries the current value for a given input
(e.g. selectedBestTimeToCallOption, etc)
-setEntity represents a function that directly sets the entity value
-onEntityChanged represents a function that eventually sets the entity value, but with side effect
(e.g. sets value for an another input also, like All checkbox)
*/
export const ActivityLogSearchCriteriaProvider = (props: {
  children: ReactNode;
}) => {
  // Options retrieved from API
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [filter, setFilter] = useState<ActivityLogFilter>(
    defaultActivityLogFilter
  );
  const [coworkerOptions, setCoworkerOptions] = useState<CoworkerOption[]>([]);
  const [amActivityOptions, setAmActivityOptions] = React.useState<
    ActivityLogSearchCriteriaOption[]
  >([]);
  const [phoneTypeOptions, setPhoneTypeOptions] = useState<
    ActivityLogSearchCriteriaOption[]
  >([]);
  const [languageOptions, setLanguageOptions] = useState<
    ActivityLogSearchCriteriaOption[]
  >([]);

  // Selected options
  const [selectedDaysLateOption, setSelectedDaysLateOption] = useState<
    string[]
  >([ALL_OPTION]);
  const [selectedRouteOption, setSelectedRouteOption] = useState<string[]>([
    ALL_OPTION,
  ]);
  const [selectedCoworkerOption, setSelectedCoworkerOption] = useState<
    string[]
  >([ALL_OPTION]);
  const [selectedAmActivityOption, setSelectedAmActivityOption] = useState<
    string[]
  >([ALL_OPTION]);
  const [selectedPhoneTypeOption, setSelectedPhoneTypeOption] = useState<
    string[]
  >([ALL_OPTION]);
  const [selectedLanguageOption, setSelectedLanguageOption] = useState<
    string[]
  >([ALL_OPTION]);

  // Dates
  const [selectedDateRangeFromOption, setSelectedDateRangeFromOption] =
    useState<string>('');
  const [selectedDateRangeToOption, setSelectedDateRangeToOption] =
    useState<string>('');

  // Time
  const [selectedTimeRangeFromOption, setSelectedTimeRangeFromOption] =
    useState<string>('');
  const [selectedTimeRangeToOption, setSelectedTimeRangeToOption] =
    useState<string>('');

  // Checkboxes
  const [isAllDateRangeOptionSelected, setIsAllDateRangeOptionSelected] =
    useState<boolean>(true);
  const [isAllTimeRangeOptionSelected, setIsAllTimeRangeOptionSelected] =
    useState<boolean>(true);

  // API errors
  const [hasRouteApiError, setHasRouteApiError] = useState<boolean>(false);
  const [hasCoworkerApiError, setHasCoworkerApiError] =
    useState<boolean>(false);
  const [hasApiError, setHasApiError] = useState<boolean>(false);

  const storeNumber = getSelectedStore();

  useEffect(() => {
    onClearSelectedOptions();
    fetchFiltersOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDaysLateOptionChanged = (values: string[]) => {
    handleMultipleSelect(
      values,
      PAST_DUE_LIST_SEARCH_DAYS_LATE_OPTIONS,
      (valuesToStore) => {
        setSelectedDaysLateOption(valuesToStore);
      }
    );
  };
  const onRouteChanged = (values: string[]) => {
    handleMultipleSelect(values, routeOptions, setSelectedRouteOption);
  };

  const onCoworkerChanged = (values: string[]) => {
    handleMultipleSelect(values, coworkerOptions, setSelectedCoworkerOption);
  };

  const onAmActivityChanged = (values: string[]) => {
    handleMultipleSelect(
      values,
      amActivityOptions,
      setSelectedAmActivityOption
    );
  };

  const onPhoneTypeChanged = (values: string[]) => {
    handleMultipleSelect(values, phoneTypeOptions, setSelectedPhoneTypeOption);
  };

  const onLanguageChanged = (values: string[]) => {
    handleMultipleSelect(values, languageOptions, setSelectedLanguageOption);
  };

  const onDateRangeFromOptionChanged = (value: string) => {
    setSelectedDateRangeFromOption(value);
  };

  const onDateRangeToOptionChanged = (value: string) => {
    setSelectedDateRangeToOption(value);
  };

  const onTimeRangeFromOptionChanged = (value: string) => {
    setSelectedTimeRangeFromOption(value);
  };

  const onTimeRangeToOptionChanged = (value: string) => {
    setSelectedTimeRangeToOption(value);
  };

  const onDateRangeCheckboxChanged = () => {
    setSelectedDateRangeFromOption('');
    setSelectedDateRangeToOption('');
    setIsAllDateRangeOptionSelected(!isAllDateRangeOptionSelected);
  };

  const onTimeRangeCheckboxChanged = () => {
    setSelectedTimeRangeFromOption('');
    setSelectedTimeRangeToOption('');
    setIsAllTimeRangeOptionSelected(!isAllTimeRangeOptionSelected);
  };

  const handleMultipleSelect = (
    values: string[],
    allOptions:
      | ActivityLogSearchCriteriaOption[]
      | CoworkerOption[]
      | RouteOption[]
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

  const onClearSelectedOptions = () => {
    setSelectedDaysLateOption([ALL_OPTION]);
    setSelectedRouteOption([ALL_OPTION]);
    setSelectedCoworkerOption([ALL_OPTION]);
    setSelectedAmActivityOption([ALL_OPTION]);
    setSelectedPhoneTypeOption([ALL_OPTION]);
    setSelectedLanguageOption([ALL_OPTION]);

    // checkboxes
    setIsAllDateRangeOptionSelected(true);
    setIsAllTimeRangeOptionSelected(true);
    // dates
    setSelectedDateRangeFromOption('');
    setSelectedDateRangeToOption('');
    setSelectedTimeRangeFromOption('');
    setSelectedTimeRangeToOption('');
    setFilter(defaultActivityLogFilter);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onApplyFilters = () => {
    const activityDateRange = {
      ...(!isAllDateRangeOptionSelected &&
        selectedDateRangeFromOption !== '' &&
        selectedDateRangeToOption !== '' && {
          activityDateRange: {
            startDate: selectedDateRangeFromOption,
            endDate: selectedDateRangeToOption,
          },
        }),
    };

    const activityTimeRange = {
      ...(!isAllTimeRangeOptionSelected &&
        selectedTimeRangeFromOption !== '' &&
        selectedTimeRangeToOption !== '' && {
          activityTimeRange: {
            startDate: selectedTimeRangeFromOption,
            endDate: selectedTimeRangeToOption,
          },
        }),
    };

    setFilter({
      daysPastDue: selectedDaysLateOption,
      coWorker: selectedCoworkerOption,
      language: selectedLanguageOption,
      phoneType: selectedPhoneTypeOption,
      route: selectedRouteOption,
      accountActivityType: selectedAmActivityOption,
      ...activityDateRange,
      ...activityTimeRange,
    });
  };

  const fetchStoreCoworkers = async () => {
    setHasCoworkerApiError(false);
    getStoreCoworkers(storeNumber)
      .then((response: any) => {
        const newCoworkerOptions: CoworkerOption[] = [
          {
            roleDescription: ALL_OPTION,
            label: ALL_OPTION,
            value: ALL_OPTION,
            roleCode: ALL_OPTION,
          },
        ];
        response.forEach((coworker: any) => {
          newCoworkerOptions.push({
            label: `${coworker.firstName} ${coworker.lastName}`,
            value: coworker.userId,
            roleCode: coworker.roleCode,
            roleDescription: coworker.roleDescription,
          });
        });
        orderByField('label', newCoworkerOptions);
        setCoworkerOptions(newCoworkerOptions);
      })
      .catch(() => setHasCoworkerApiError(true));
  };

  const fetchStoreRoutes = async () => {
    setHasRouteApiError(false);
    getStoreRoutes(storeNumber)
      .then((response) => {
        if (response?.routeIds) {
          const newRouteOption: RouteOption[] = [
            {
              routeDescription: ALL_OPTION,
              label: ALL_OPTION,
              value: ALL_OPTION,
              routeCode: ALL_OPTION,
            },
          ];
          response.routeIds.map((route) => {
            newRouteOption.push({
              label: route.description,
              value: String(route.routeRefCode),
              routeCode: String(route.routeId),
              routeDescription: route.description,
            });
          });

          orderByField('label', newRouteOption);
          setRouteOptions(newRouteOption);
        } else {
          setHasRouteApiError(true);
        }
      })
      .catch(() => {
        setHasRouteApiError(true);
      });
  };

  const extendAMActivityDropdownOptions = (
    optionsFromApi: ActivityLogSearchCriteriaOption[]
  ) => {
    setAmActivityOptions([...optionsFromApi, ...TEXT_OPTIONS]);
  };

  const fetchOption = (
    apiKey: ReferenceKeys[],
    setApiError: (state: boolean) => void
  ) => {
    setApiError(false);
    api
      .getReference(apiKey, CACHED_KEYS.AM_ACTIVITY_LOG_SEARCH_KEY)
      .then((response: any) => {
        const { references } = response;
        references?.map((reference: ReferenceResponse) => {
          if (reference?.referenceKey === ReferenceKeys.AM_ACTIVITY) {
            return pipe(
              orderByDescField,
              mapReferenceResponse,
              addAllOption,
              extendAMActivityDropdownOptions
            )(reference?.referenceDetails);
          } else if (reference.referenceKey === ReferenceKeys.PHONE_TYPE) {
            return pipe(
              orderByDescField,
              mapReferenceResponse,
              addAllOption,
              setPhoneTypeOptions
            )(reference?.referenceDetails);
          } else if (reference.referenceKey === ReferenceKeys.LANGUAGE) {
            return pipe(
              orderByDescField,
              mapReferenceResponse,
              addAllOption,
              setLanguageOptions
            )(reference?.referenceDetails);
          }
        });
      })
      .catch(() => {
        setApiError(true);
      });
  };

  const fetchFiltersOptions = async () => {
    fetchStoreCoworkers();
    fetchStoreRoutes();

    fetchOption(
      [
        ReferenceKeys.AM_ACTIVITY,
        ReferenceKeys.PHONE_TYPE,
        ReferenceKeys.LANGUAGE,
      ],
      setHasApiError
    );
  };

  return (
    <ActivityLogSearchCriteriaStateContext.Provider
      value={{
        //options
        daysLateOptions: PAST_DUE_LIST_SEARCH_DAYS_LATE_OPTIONS,
        routeOptions,
        coworkerOptions,
        amActivityOptions,
        phoneTypeOptions,
        languageOptions,

        // selected options
        selectedDaysLateOption,
        selectedRouteOption,
        selectedCoworkerOption,
        selectedAmActivityOption,
        selectedPhoneTypeOption,
        selectedLanguageOption,
        // selected dates
        selectedDateRangeFromOption,
        selectedDateRangeToOption,
        // selected time
        selectedTimeRangeFromOption,
        selectedTimeRangeToOption,
        // checkboxes
        isAllDateRangeOptionSelected,
        isAllTimeRangeOptionSelected,
        // api error
        hasRouteApiError,
        hasCoworkerApiError,
        hasApiError,
        filter,
      }}
    >
      <ActivityLogSearchCriteriaDispatchContext.Provider
        value={{
          fetchFiltersOptions,
          onDaysLateOptionChanged,
          onRouteChanged,
          onCoworkerChanged,
          onAmActivityChanged,
          onPhoneTypeChanged,
          onLanguageChanged,
          onDateRangeFromOptionChanged,
          onDateRangeToOptionChanged,
          onTimeRangeFromOptionChanged,
          onTimeRangeToOptionChanged,
          onDateRangeCheckboxChanged,
          onTimeRangeCheckboxChanged,
          onClearSelectedOptions,
          onApplyFilters,
        }}
      >
        {props.children}
      </ActivityLogSearchCriteriaDispatchContext.Provider>
    </ActivityLogSearchCriteriaStateContext.Provider>
  );
};

export const useFilters = () =>
  useContext(ActivityLogSearchCriteriaStateContext);

export const useFiltersActions = () =>
  useContext(ActivityLogSearchCriteriaDispatchContext);
