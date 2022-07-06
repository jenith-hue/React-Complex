import {
  Divider,
  Grid,
  makeStyles,
  RACButton,
  RACCard,
  RACCheckBox,
  RACDateRangePicker,
  RACSelect,
  Typography,
} from '@rentacenter/racstrap';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  ALL_OPTION,
  API_ERROR_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from '../../../constants/constants';
import {
  useFilters,
  useFiltersActions,
} from '../../../context/PastDueListSearchCriteria/PastDueListSearchCriteriaProvider';

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
}));
export const Filters = ({ isOpen, handleToggleFilterPanel }: FiltersProps) => {
  const {
    // all available options
    daysLateOptions,
    bestTimeToCallOptions,
    commitmentStatusOptions,
    languageOptions,
    customersWithActivityOptions,
    customersWithCallActivityToolTip,
    communicationTypeOptions,
    routeOptions,
    // selected options
    selectedBestTimeToCallOption,
    selectedCommitmentStatusOption,
    selectedCommunicationTypeOption,
    selectedDaysLateOption,
    selectedRouteOption,
    selectedLanguageOption,
    selectedCustomersWithActivityOption,
    // selected dates
    selectedDueDateFromOption,
    selectedDueDateToOption,
    selectedCommitmentDateFromOption,
    selectedCommitmentDateToOption,
    // checkboxes
    isAutopayCustomersOptionSelected,
    isAllDueDateOptionSelected,
    isAllCommitmentDateOptionSelected,
    hasApiError,
    hasRouteApiError,
    isLoading,
  } = useFilters();

  const {
    onBestTimeToCallChanged,
    onCommitmentStatusChanged,
    onCommunicationTypeChanged,
    onDaysLateOptionChanged,
    onLanguageChanged,
    setSelectedRouteOption,
    setIsAutopayCustomersOption,
    onDueDateFromOptionChanged,
    onDueDateToOptionChanged,
    onDueDateCheckboxChanged,
    onCommitmentDateCheckboxChanged,
    onCommitmentDateFromOptionChanged,
    onCommitmentDateToOptionChanged,
    onCustomersWithActivityChanged,
    onClearSelectedOptions,
    onApplyFilters,
  } = useFiltersActions();

  const [isSelectedDueDateFromInvalid, setIsSelectedDueDateFromInvalid] =
    useState(false);
  const [isSelectedDueDateToInvalid, setIsSelectedDueDateToInvalid] =
    useState(false);

  const dateFormat = 'yyyy-MM-dd';

  const [
    isSelectedCommitmentDateFromInvalid,
    setIsSelectedCommitmentDateFromInvalid,
  ] = useState(false);

  const [
    isSelectedCommitmentDateToInvalid,
    setIsSelectedCommitmentDateToInvalid,
  ] = useState(false);

  const isFiltersValid = () => {
    const isDefaultDaysLateOptionSelected =
      selectedDaysLateOption.includes(ALL_OPTION) ||
      selectedDaysLateOption.length === 0;

    const isFromDueInvalid =
      isDefaultDaysLateOptionSelected &&
      !isAllDueDateOptionSelected &&
      selectedDueDateFromOption === '';

    const isToDueInvalid =
      isDefaultDaysLateOptionSelected &&
      !isAllDueDateOptionSelected &&
      selectedDueDateToOption === '';

    const isCommitmentDateFromInvalid =
      !isAllCommitmentDateOptionSelected &&
      selectedCommitmentDateFromOption === '';
    const isCommitmentDateToInvalid =
      !isAllCommitmentDateOptionSelected &&
      selectedCommitmentDateToOption === '';

    setIsSelectedDueDateFromInvalid(isFromDueInvalid);
    setIsSelectedDueDateToInvalid(isToDueInvalid);

    setIsSelectedCommitmentDateFromInvalid(isCommitmentDateFromInvalid);
    setIsSelectedCommitmentDateToInvalid(isCommitmentDateToInvalid);

    return (
      !isFromDueInvalid &&
      !isToDueInvalid &&
      !isCommitmentDateFromInvalid &&
      !isCommitmentDateToInvalid
    );
  };

  const classes = useStyles({ isOpen });

  const validateAndApply = () => {
    if (isFiltersValid()) {
      onApplyFilters();
      handleToggleFilterPanel();
    }
  };

  useEffect(() => {
    setIsSelectedDueDateFromInvalid(false);
    setIsSelectedDueDateToInvalid(false);
  }, [isAllDueDateOptionSelected, selectedDaysLateOption]);

  useEffect(() => {
    setIsSelectedCommitmentDateFromInvalid(false);
    setIsSelectedCommitmentDateToInvalid(false);
  }, [isAllCommitmentDateOptionSelected]);

  return (
    <div className={clsx(classes.filtersRoot)}>
      <RACCard className={classes.card}>
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
                  inputLabel="Days late"
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
                  inputLabel="Best Time to Call"
                  multiple
                  options={bestTimeToCallOptions}
                  loading={isLoading}
                  defaultValue={selectedBestTimeToCallOption}
                  onChange={(e: React.ChangeEvent<{ value: any }>) =>
                    onBestTimeToCallChanged(e.target.value)
                  }
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
                  inputLabel="Commitment Status"
                  multiple
                  defaultValue={selectedCommitmentStatusOption}
                  options={commitmentStatusOptions}
                  loading={isLoading}
                  onChange={(e: React.ChangeEvent<{ value: any }>) =>
                    onCommitmentStatusChanged(e.target.value)
                  }
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
                  loading={isLoading}
                  onChange={(e: React.ChangeEvent<{ value: any }>) =>
                    onLanguageChanged(e.target.value)
                  }
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
                  classes={{ paper: classes.selectOptionsPaper }}
                  inputLabel="Route"
                  defaultValue={selectedRouteOption}
                  options={routeOptions}
                  loading={isLoading}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedRouteOption(e.target.value)
                  }
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
                <RACCheckBox
                  label="Autopay customers"
                  size="medium"
                  checked={isAutopayCustomersOptionSelected}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setIsAutopayCustomersOption(e.target.checked)
                  }
                  classes={{ checkbox: classes.noPaddingLeft }}
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
                  inputLabel="Communication type"
                  multiple
                  defaultValue={selectedCommunicationTypeOption}
                  options={communicationTypeOptions}
                  onChange={(e: React.ChangeEvent<{ value: any }>) =>
                    onCommunicationTypeChanged(e.target.value)
                  }
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={3}
                md={3}
                lg={2}
                classes={{ root: clsx(classes.grid) }}
              >
                <RACSelect
                  inputLabel="Customer’s Activity"
                  defaultValue={selectedCustomersWithActivityOption}
                  options={customersWithActivityOptions}
                  infoTitle={selectedCustomersWithActivityOption}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onCustomersWithActivityChanged(e.target.value)
                  }
                  optionsToolTips={customersWithCallActivityToolTip}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={7}
                lg={6}
                classes={{ root: classes.grid }}
              >
                <Divider orientation="vertical" flexItem />
                <div className={classes.centerVertically}>
                  <Typography
                    className={clsx(classes.multipleElementsInGridTitle)}
                    variant="body1"
                  >
                    Due date
                  </Typography>
                  <RACCheckBox
                    label="All"
                    size="medium"
                    checked={isAllDueDateOptionSelected}
                    onChange={onDueDateCheckboxChanged}
                    classes={{ checkbox: classes.noPaddingLeft }}
                  />
                </div>
                <div className={clsx(classes.multipleElementsInGrid)}>
                  <div className={clsx(classes.multipleElementsInGridInputs)}>
                    <RACDateRangePicker
                      name="dueDate"
                      fromLabel="From"
                      toLabel="To"
                      disabled={isAllDueDateOptionSelected}
                      fromValue={selectedDueDateFromOption}
                      toValue={selectedDueDateToOption}
                      minTo={
                        selectedDueDateFromOption ||
                        format(new Date(), dateFormat)
                      }
                      onFromChanged={(value) => {
                        setIsSelectedDueDateFromInvalid(false);
                        onDueDateFromOptionChanged(value);
                      }}
                      onToChanged={(value) => {
                        setIsSelectedDueDateToInvalid(false);
                        onDueDateToOptionChanged(value);
                      }}
                      fromErrorMessage={
                        isSelectedDueDateFromInvalid
                          ? REQUIRED_FIELD_MESSAGE
                          : ''
                      }
                      toErrorMessage={
                        isSelectedDueDateToInvalid ? REQUIRED_FIELD_MESSAGE : ''
                      }
                    />
                  </div>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                classes={{ root: classes.grid }}
              >
                <Divider orientation="vertical" flexItem />
                <div className={classes.centerVertically}>
                  <Typography
                    className={clsx(classes.multipleElementsInGridTitle)}
                    variant="body1"
                  >
                    Commitment date
                  </Typography>
                  <RACCheckBox
                    label="All"
                    size="medium"
                    checked={isAllCommitmentDateOptionSelected}
                    onChange={onCommitmentDateCheckboxChanged}
                    classes={{ checkbox: classes.noPaddingLeft }}
                  />
                </div>
                <div className={classes.multipleElementsInGrid}>
                  <div className={classes.multipleElementsInGridInputs}>
                    <RACDateRangePicker
                      name="commitmentDateRange"
                      fromLabel="From"
                      toLabel="To"
                      disabled={isAllCommitmentDateOptionSelected}
                      fromValue={selectedCommitmentDateFromOption}
                      toValue={selectedCommitmentDateToOption}
                      onFromChanged={(value) => {
                        setIsSelectedCommitmentDateFromInvalid(false);
                        onCommitmentDateFromOptionChanged(value);
                      }}
                      onToChanged={(value) => {
                        setIsSelectedCommitmentDateToInvalid(false);
                        onCommitmentDateToOptionChanged(value);
                      }}
                      fromErrorMessage={
                        isSelectedCommitmentDateFromInvalid
                          ? REQUIRED_FIELD_MESSAGE
                          : ''
                      }
                      toErrorMessage={
                        isSelectedCommitmentDateToInvalid
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
