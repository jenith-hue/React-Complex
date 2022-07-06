/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-empty-function */

import React from 'react';
import renderer from 'react-test-renderer';

import { Filters } from '../Filters';
import * as Contexts from '../../../../context/ActivityLogSearchCriteria/ActivityLogSearchCriteriaProvider';
interface PropWithChildren {
  children: JSX.Element;
}
jest.mock('@rentacenter/racstrap', () => ({
  ...jest.requireActual('@rentacenter/racstrap'),
  RACButton: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACButton" {...rest}>
      {children}
    </div>
  ),
  RACCard: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACCard" {...rest}>
      {children}
    </div>
  ),
  RACCheckBox: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACCheckBox" {...rest}>
      {children}
    </div>
  ),
  RACDateRangePicker: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACDateRangePicker" {...rest}>
      {children}
    </div>
  ),
  RACTimeRangePicker: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACTimeRangePicker" {...rest}>
      {children}
    </div>
  ),
  RACSelect: ({ children, ...rest }: PropWithChildren) => {
    return (
      <div data-testid="RACSelect" {...rest}>
        {children}
      </div>
    );
  },
  Divider: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Divider" {...rest}>
      {children}
    </div>
  ),
  Grid: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Grid" {...rest}>
      {children}
    </div>
  ),
  Typography: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Typography" {...rest}>
      {children}
    </div>
  ),
  makeStyles: () => () => ({
    filtersRoot: 'filtersRoot',
    row: 'row',
    card: 'card',
    cardBody: 'cardBody',
    column: 'column',
    multipleElementsInGrid: 'multipleElementsInGrid',
    multipleElementsInGridTitle: 'multipleElementsInGridTitle',
    filtersmultipleElementsInGridInputsRoot: 'multipleElementsInGridInputs',
    grid: 'grid',
    centerVertically: 'centerVertically',
    buttonContainer: 'buttonContainer',
    noPaddingLeft: 'noPaddingLeft',
    selectOptionsPaper: 'selectOptionsPaper',
  }),
}));

jest.mock('date-fns', () => ({
  sub: (date: any) => date,
  add: (date: any) => date,
  format: () => '2024-08-07',
}));
describe('Activity Log Filters', () => {
  const valueFromEvent = 'Value from event';
  const event = {
    target: {
      value: valueFromEvent,
      checked: true,
    },
  };

  const mockOnDaysLateOptionChanged = jest.fn();
  const mockOnRouteChanged = jest.fn();
  const mockOnCoworkerChanged = jest.fn();
  const mockOnAmActivityChanged = jest.fn();
  const mockOnPhoneTypeChanged = jest.fn();
  const mockOnLanguageChanged = jest.fn();
  const mockOnDateRangeFromOptionChanged = jest.fn();
  const mockOnDateRangeToOptionChanged = jest.fn();
  const mockOnTimeRangeFromOptionChanged = jest.fn();
  const mockOnTimeRangeToOptionChanged = jest.fn();
  const mockOnDateRangeCheckboxChanged = jest.fn();
  const mockOnTimeRangeCheckboxChanged = jest.fn();
  const mockOnClearSelectedOptions = jest.fn();
  const mockOnApplyFilters = jest.fn();

  beforeEach(() => {
    jest.spyOn(Contexts, 'useFilters').mockImplementationOnce(() => ({
      daysLateOptions: [
        {
          label: 'Days late 1',
          value: 'Days late 1',
          referenceCode: '1',
          displaySeq: 1,
          defaultValue: '1',
          description: 'Days late 1',
        },
      ],
      routeOptions: [
        {
          label: 'Route 1',
          value: 'Route 1',
          routeCode: '1',
          routeDescription: '1',
        },
      ],
      coworkerOptions: [
        {
          label: 'Coworker 1',
          value: 'Coworker 1',
          roleCode: '1',
          roleDescription: 'Coworker 1',
        },
      ],
      amActivityOptions: [
        {
          label: 'A/M activity 1',
          value: 'A/M activity 1',
          referenceCode: '1',
          displaySeq: 1,
          defaultValue: '1',
          description: 'A/M activity 1',
        },
      ],
      phoneTypeOptions: [
        {
          label: 'Phone type 1',
          value: 'Phone type 1',
          referenceCode: '1',
          displaySeq: 1,
          defaultValue: '1',
          description: 'Phone type 1',
        },
      ],
      languageOptions: [
        {
          label: 'Language option 1',
          value: 'Language option 1',
          referenceCode: '1',
          displaySeq: 1,
          defaultValue: '1',
          description: '1',
        },
      ],

      selectedDaysLateOption: ['Days late 1'],
      selectedRouteOption: ['Route 1'],
      selectedCoworkerOption: ['Coworker 1'],
      selectedAmActivityOption: ['A/M activity 1'],
      selectedPhoneTypeOption: ['Phone type 1'],
      selectedLanguageOption: ['Language option 1'],

      selectedDateRangeFromOption: 'Date range from',
      selectedDateRangeToOption: 'Date range to',

      selectedTimeRangeFromOption: 'Time range from',
      selectedTimeRangeToOption: 'Time range to',

      isAllDateRangeOptionSelected: true,
      isAllTimeRangeOptionSelected: true,

      hasRouteApiError: false,
      hasCoworkerApiError: false,
      hasApiError: false,
      filter: {
        phoneType: [],
        route: [],
        coWorker: [],
        daysPastDue: [],
        language: [],
        accountActivityType: [],
      },
    }));

    jest.spyOn(Contexts, 'useFiltersActions').mockImplementationOnce(() => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      fetchFiltersOptions: () => {},
      onDaysLateOptionChanged: mockOnDaysLateOptionChanged,
      onRouteChanged: mockOnRouteChanged,
      onCoworkerChanged: mockOnCoworkerChanged,
      onAmActivityChanged: mockOnAmActivityChanged,
      onPhoneTypeChanged: mockOnPhoneTypeChanged,
      onLanguageChanged: mockOnLanguageChanged,
      onDateRangeFromOptionChanged: mockOnDateRangeFromOptionChanged,
      onDateRangeToOptionChanged: mockOnDateRangeToOptionChanged,
      onTimeRangeFromOptionChanged: mockOnTimeRangeFromOptionChanged,
      onTimeRangeToOptionChanged: mockOnTimeRangeToOptionChanged,
      onDateRangeCheckboxChanged: mockOnDateRangeCheckboxChanged,
      onTimeRangeCheckboxChanged: mockOnTimeRangeCheckboxChanged,
      onClearSelectedOptions: mockOnClearSelectedOptions,
      onApplyFilters: mockOnApplyFilters,
    }));
  });
  it('renders inputs with values from context', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders inputs with values from context, even when filters are not open', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen={false} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('calls correct callback for days late selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ inputLabel: 'Days Late' })[0]
      .props.onChange(event);

    expect(mockOnDaysLateOptionChanged).toHaveBeenCalledTimes(1);
    expect(mockOnDaysLateOptionChanged).toHaveBeenCalledWith(valueFromEvent);
  });
  it('calls correct callback for route selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root.findAllByProps({ inputLabel: 'Route' })[0].props.onChange(event);

    expect(mockOnRouteChanged).toHaveBeenCalledTimes(1);
    expect(mockOnRouteChanged).toHaveBeenCalledWith(valueFromEvent);
  });
  it('calls correct callback for coworker selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ inputLabel: 'Coworker' })[0]
      .props.onChange(event);

    expect(mockOnCoworkerChanged).toHaveBeenCalledTimes(1);
    expect(mockOnCoworkerChanged).toHaveBeenCalledWith(valueFromEvent);
  });
  it('calls correct callback for coworker selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ inputLabel: 'A/M Activity' })[0]
      .props.onChange(event);

    expect(mockOnAmActivityChanged).toHaveBeenCalledTimes(1);
    expect(mockOnAmActivityChanged).toHaveBeenCalledWith(valueFromEvent);
  });
  it('calls correct callback for phone type selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root.findAllByProps({ inputLabel: 'Phone' })[0].props.onChange(event);

    expect(mockOnPhoneTypeChanged).toHaveBeenCalledTimes(1);
    expect(mockOnPhoneTypeChanged).toHaveBeenCalledWith(valueFromEvent);
  });
  it('calls correct callback for language selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ inputLabel: 'Language' })[0]
      .props.onChange(event);

    expect(mockOnLanguageChanged).toHaveBeenCalledTimes(1);
    expect(mockOnLanguageChanged).toHaveBeenCalledWith(valueFromEvent);
  });
  it('calls correct callback for date range all checkbox', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root.findAllByProps({ label: 'All' })[0].props.onChange(event);

    expect(mockOnDateRangeCheckboxChanged).toHaveBeenCalledTimes(1);
    expect(mockOnDateRangeCheckboxChanged).toHaveBeenCalledWith();
  });
  it('calls correct callback for date range from value change', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ fromLabel: 'From' })[0]
      .props.onFromChanged('new-from');

    expect(mockOnDateRangeFromOptionChanged).toHaveBeenCalledTimes(1);
    expect(mockOnDateRangeFromOptionChanged).toHaveBeenCalledWith('new-from');
  });
  it('calls correct callback for time range all checkbox', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    // Don't know why it is on position 2, instead of 1
    tree.root.findAllByProps({ label: 'All' })[2].props.onChange(event);

    expect(mockOnTimeRangeCheckboxChanged).toHaveBeenCalledTimes(1);
    expect(mockOnTimeRangeCheckboxChanged).toHaveBeenCalledWith();
  });
  it('calls correct callback for time range from value change', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ fromLabel: 'From' })[2]
      .props.onFromChanged('new-from');

    expect(mockOnTimeRangeFromOptionChanged).toHaveBeenCalledTimes(1);
    expect(mockOnTimeRangeFromOptionChanged).toHaveBeenCalledWith('new-from');
  });
  it('calls correct callback for time range to value change', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root.findAllByProps({ toLabel: 'To' })[2].props.onToChanged('new-to');

    expect(mockOnTimeRangeToOptionChanged).toHaveBeenCalledTimes(1);
    expect(mockOnTimeRangeToOptionChanged).toHaveBeenCalledWith('new-to');
  });
  it('calls correct callback for Clear button', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root.findAllByProps({ variant: 'text' })[0].props.onClick(event);

    expect(mockOnClearSelectedOptions).toHaveBeenCalledTimes(1);
  });
});
