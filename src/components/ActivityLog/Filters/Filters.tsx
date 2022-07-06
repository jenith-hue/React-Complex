import {
  RACButton,
  RACCard,
  makeStyles,
  RACCheckBox,
  RACDateRangePicker,
  RACTimeRangePicker,
  RACSelect,
  Divider,
  Grid,
  Typography,
} from '@rentacenter/racstrap';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useState } from 'react';
import {
  ALL_OPTION,
  API_ERROR_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from '../../../constants/constants';
import {
  useFilters,
  useFiltersActions,
} from '../../../context/ActivityLogSearchCriteria/ActivityLogSearchCriteriaProvider';
import {
  thirtyDaysBeforeToDate,
  thirtyDaysAfterFromDate,
  SIX_MONTHS_AFTER,
  SIX_MONTHS_AGO,
} from '../../../utils/utils';
export interface FiltersProps {
  isOpen: boolean;
  handleToggleFilterPanel: () => void;
}
const useStyles = makeStyles((theme: any) => ({
  filtersRoot: {
    width: '100%',
    marginBottom: '1rem',
    // hiding the filters from css, instead of adding conditional rendering, so we don't lose selected values
    display: ({ isOpen }: { isOpen: boolean }) => (isOpen ? 'block' : 'none'),
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.typography.pxToRem(24),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardBody: {
    flex: '1 1 auto',
    padding: '1rem 1rem',
  },
  column: {
    marginBottom: '1rem',
    height: theme.typography.pxToRem(69),
    display: 'flex',
    justifyContent: 'flex-start',
    flex: '0 0 auto',
    minWidth: 'fit-content',
    width: '16.6666666667%',
    maxWidth: theme.typography.pxToRem(180),
  },
  commitmentDate: {
    display: 'flex',
    gap: '0.5rem',
  },
  multipleElementsInGrid: {
    display: 'flex',
    flex: 1,
    gap: theme.typography.pxToRem(24),
    marginTop: theme.typography.pxToRem(16),
  },
  multipleElementsInGridTitle: {
    marginTop: theme.typography.pxToRem(-10),
    marginBottom: theme.typography.pxToRem(5),
  },
  multipleElementsInGridInputs: {
    marginTop: theme.typography.pxToRem(-7),
    width: '100%',
  },
  grid: {
    height: theme.typography.pxToRem(104),
    display: 'flex',
    justifyContent: 'flex-start',
    gap: theme.typography.pxToRem(24),
  },
  centerVertically: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.typography.pxToRem(24),
  },
  noPaddingLeft: {
    paddingLeft: '0 !important',
  },
  selectOptionsPaper: {
    maxHeight: theme.typography.pxToRem(200),
  },
  hideOnPrint: {
    '@media print': {
      display: 'none',
    },
  },
}));
export const Filters = ({ isOpen, handleToggleFilterPanel }: FiltersProps) => {
  const classes = useStyles({ isOpen });
  const [isSelectedDateRangeFromInvalid, setIsSelectedDateRangeFromInvalid] =
    useState(false);
  const [isSelectedDateRangeToInvalid, setIsSelectedDateRangeToInvalid] =
    useState(false);

  const [isSelectedTimeRangeFromInvalid, setIsSelectedTimeRangeFromInvalid] =
    useState(false);
  const [isSelectedTimeRangeToInvalid, setIsSelectedTimeRangeToInvalid] =
    useState(false);

  const {
    // all available options
    daysLateOptions,
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
  } = useFilters();

  const {
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
  } = useFiltersActions();

  const ondateRangeCheckboxChanged = () => {
    setIsSelectedDateRangeFromInvalid(false);
    setIsSelectedDateRangeToInvalid(false);
    onDateRangeCheckboxChanged();
  };

  const ontimeRangeCheckboxChanged = () => {
    setIsSelectedTimeRangeFromInvalid(false);
    setIsSelectedTimeRangeToInvalid(false);
    onTimeRangeCheckboxChanged();
  };

  const isFiltersValid = () => {
    const isDefaultDaysLateOptionSelected =
      selectedDaysLateOption.includes(ALL_OPTION) ||
      selectedDaysLateOption.length === 0;

    const isFromDueInvalid =
      isDefaultDaysLateOptionSelected &&
      !isAllDateRangeOptionSelected &&
      selectedDateRangeFromOption === '';

    const isToDueInvalid =
      isDefaultDaysLateOptionSelected &&
      !isAllDateRangeOptionSelected &&
      selectedDateRangeToOption === '';

    const isTimeRangeFromInvalid =
      isDefaultDaysLateOptionSelected &&
      !isAllTimeRangeOptionSelected &&
      selectedTimeRangeFromOption === '';

    const isTimeRangeToInvalid =
      isDefaultDaysLateOptionSelected &&
      !isAllTimeRangeOptionSelected &&
      selectedTimeRangeToOption === '';

    setIsSelectedDateRangeFromInvalid(isFromDueInvalid);
    setIsSelectedDateRangeToInvalid(isToDueInvalid);

    setIsSelectedTimeRangeFromInvalid(isTimeRangeFromInvalid);
    setIsSelectedTimeRangeToInvalid(isTimeRangeToInvalid);

    return (
      !isFromDueInvalid &&
      !isToDueInvalid &&
      !isTimeRangeFromInvalid &&
      !isTimeRangeToInvalid
    );
  };

  const validateAndApply = () => {
    if (isFiltersValid()) {
      onApplyFilters();
      handleToggleFilterPanel();
    }
  };

  const dateFormat = 'yyyy-MM-dd';

  return (
    <div className={clsx(classes.filtersRoot)}>
      <RACCard className={clsx(classes.card, classes.hideOnPrint)}>
        <div className={clsx(classes.cardBody)}>
          <div className={clsx(classes.row)}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={6}
                sm={3}
                md={3}
                lg={2}
                classes={{ root: classes.grid }}
              >
                <RACSelect
                  inputLabel="Days Late"
                  multiple
                  defaultValue={selectedDaysLateOption}
                  options={daysLateOptions}
                  onChange={(e: React.ChangeEvent<{ value: any }>) => {
                    onDaysLateOptionChanged(e.target.value);
                  }}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={3}
                md={3}
                lg={2}
                classes={{ root: classes.grid }}
              >
                <RACSelect
                  classes={{ paper: classes.selectOptionsPaper }}
                  inputLabel="Route"
                  multiple
                  defaultValue={selectedRouteOption}
                  options={routeOptions}
                  onChange={(e: React.ChangeEvent<{ value: any }>) => {
                    onRouteChanged(e.target.value);
                  }}
                  {...(hasRouteApiError && {
                    errorMessage: API_ERROR_MESSAGE,
                  })}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={3}
                md={3}
                lg={2}
                classes={{ root: classes.grid }}
              >
                <RACSelect
                  inputLabel="Coworker"
                  multiple
                  defaultValue={selectedCoworkerOption}
                  options={coworkerOptions}
                  onChange={(e: React.ChangeEvent<{ value: any }>) => {
                    onCoworkerChanged(e.target.value);
                  }}
                  {...(hasCoworkerApiError && {
                    errorMessage: API_ERROR_MESSAGE,
                  })}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={3}
                md={3}
                lg={2}
                classes={{ root: classes.grid }}
              >
                <RACSelect
                  inputLabel="A/M Activity"
                  multiple
                  defaultValue={selectedAmActivityOption}
                  options={amActivityOptions}
                  onChange={(e: React.ChangeEvent<{ value: any }>) => {
                    onAmActivityChanged(e.target.value);
                  }}
                  {...(hasApiError && {
                    errorMessage: API_ERROR_MESSAGE,
                  })}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={3}
                md={3}
                lg={2}
                classes={{ root: classes.grid }}
              >
                <RACSelect
                  inputLabel="Phone"
                  multiple
                  defaultValue={selectedPhoneTypeOption}
                  options={phoneTypeOptions}
                  onChange={(e: React.ChangeEvent<{ value: any }>) => {
                    onPhoneTypeChanged(e.target.value);
                  }}
                  {...(hasApiError && {
                    errorMessage: API_ERROR_MESSAGE,
                  })}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={3}
                md={3}
                lg={2}
                classes={{ root: classes.grid }}
              >
                <RACSelect
                  inputLabel="Language"
                  multiple
                  defaultValue={selectedLanguageOption}
                  options={languageOptions}
                  onChange={(e: React.ChangeEvent<{ value: any }>) => {
                    onLanguageChanged(e.target.value);
                  }}
                  {...(hasApiError && {
                    errorMessage: API_ERROR_MESSAGE,
                  })}
                />
              </Grid>
              <Grid item md={6} lg={5} classes={{ root: classes.grid }}>
                <Divider orientation="vertical" flexItem />
                <div className={classes.centerVertically}>
                  <Typography
                    className={clsx(classes.multipleElementsInGridTitle)}
                    variant="body1"
                  >
                    Date Range
                  </Typography>
                  <RACCheckBox
                    label="All"
                    size="medium"
                    checked={isAllDateRangeOptionSelected}
                    onChange={ondateRangeCheckboxChanged}
                    classes={{ checkbox: classes.noPaddingLeft }}
                  />
                </div>
                <div className={clsx(classes.multipleElementsInGrid)}>
                  <div className={clsx(classes.multipleElementsInGridInputs)}>
                    <RACDateRangePicker
                      name="dateRange"
                      fromLabel="From"
                      toLabel="To"
                      disabled={isAllDateRangeOptionSelected}
                      fromValue={selectedDateRangeFromOption}
                      toValue={selectedDateRangeToOption}
                      minFrom={format(
                        selectedDateRangeToOption !== ''
                          ? thirtyDaysBeforeToDate(
                              new Date(selectedDateRangeToOption)
                            )
                          : SIX_MONTHS_AGO,
                        dateFormat
                      )}
                      maxFrom={format(SIX_MONTHS_AFTER, dateFormat)}
                      minTo={format(SIX_MONTHS_AGO, dateFormat)}
                      maxTo={format(
                        selectedDateRangeFromOption !== ''
                          ? thirtyDaysAfterFromDate(
                              new Date(selectedDateRangeFromOption)
                            )
                          : SIX_MONTHS_AFTER,
                        dateFormat
                      )}
                      onFromChanged={(value) => {
                        setIsSelectedDateRangeFromInvalid(false);
                        onDateRangeFromOptionChanged(value);
                      }}
                      onToChanged={(value) => {
                        setIsSelectedDateRangeToInvalid(false);
                        onDateRangeToOptionChanged(value);
                      }}
                      fromErrorMessage={
                        !isAllDateRangeOptionSelected &&
                        isSelectedDateRangeFromInvalid
                          ? REQUIRED_FIELD_MESSAGE
                          : ''
                      }
                      toErrorMessage={
                        !isAllDateRangeOptionSelected &&
                        isSelectedDateRangeToInvalid
                          ? REQUIRED_FIELD_MESSAGE
                          : ''
                      }
                    />
                  </div>
                </div>
              </Grid>
              <Grid item md={6} lg={5} classes={{ root: classes.grid }}>
                <Divider orientation="vertical" flexItem />
                <div className={classes.centerVertically}>
                  <Typography
                    className={clsx(classes.multipleElementsInGridTitle)}
                    variant="body1"
                  >
                    Time Range
                  </Typography>
                  <RACCheckBox
                    label="All"
                    size="medium"
                    checked={isAllTimeRangeOptionSelected}
                    onChange={ontimeRangeCheckboxChanged}
                    classes={{ checkbox: classes.noPaddingLeft }}
                  />
                </div>
                <div className={clsx(classes.multipleElementsInGrid)}>
                  <div className={clsx(classes.multipleElementsInGridInputs)}>
                    <RACTimeRangePicker
                      fromLabel="From"
                      toLabel="To"
                      disabled={isAllTimeRangeOptionSelected}
                      fromValue={selectedTimeRangeFromOption}
                      toValue={selectedTimeRangeToOption}
                      onFromChanged={(value) => {
                        setIsSelectedTimeRangeFromInvalid(false);
                        onTimeRangeFromOptionChanged(value);
                      }}
                      onToChanged={(value) => {
                        setIsSelectedTimeRangeToInvalid(false);
                        onTimeRangeToOptionChanged(value);
                      }}
                      fromErrorMessage={
                        !isAllTimeRangeOptionSelected &&
                        isSelectedTimeRangeFromInvalid
                          ? REQUIRED_FIELD_MESSAGE
                          : ''
                      }
                      toErrorMessage={
                        !isAllTimeRangeOptionSelected &&
                        isSelectedTimeRangeToInvalid
                          ? REQUIRED_FIELD_MESSAGE
                          : ''
                      }
                    />
                  </div>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                classes={{ root: classes.buttonContainer }}
              >
                <RACButton
                  variant="text"
                  size="large"
                  color="primary"
                  onClick={() => {
                    onClearSelectedOptions();
                    handleToggleFilterPanel();
                  }}
                >
                  Clear
                </RACButton>
                <RACButton
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={validateAndApply}
                >
                  Apply
                </RACButton>
              </Grid>
            </Grid>
          </div>
        </div>
      </RACCard>
    </div>
  );
};
