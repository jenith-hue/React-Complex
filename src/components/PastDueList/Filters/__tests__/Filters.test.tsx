/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-empty-function */

import React from 'react';
import renderer from 'react-test-renderer';

import { Filters } from '../Filters';
import * as Contexts from '../../../../context/PastDueListSearchCriteria/PastDueListSearchCriteriaProvider';
import { defaultFilter } from '../../../../domain/PastDueList/Filter';
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
describe('Filters', () => {
  const valueFromEvent = 'Value from event';
  const event = {
    target: {
      value: valueFromEvent,
      checked: true,
    },
  };

  const mockSetSelectedDaysLateOption = jest.fn();
  const mockSetSelectedBestTimeToCallOption = jest.fn();
  const mockSetSelectedCommitmentStatusOption = jest.fn();
  const mockSetSelectedLanguageOption = jest.fn();
  const mockSetSelectedRouteOption = jest.fn();
  const mockSetSelectedCommunicationTypeOption = jest.fn();
  const mockOnDueDateFromOptionChanged = jest.fn();
  const mockOnDueDateToOptionChanged = jest.fn();
  const mockSetIsAutopayCustomersOption = jest.fn();
  const mockOnDueDateCheckboxChanged = jest.fn();
  const mockOnCommitmentDateFromOptionChanged = jest.fn();
  const mockOnCommitmentDateToOptionChanged = jest.fn();
  const mockOnCustomersWithActivityChanged = jest.fn();
  const mockOnClearSelectedOptions = jest.fn();

  beforeEach(() => {
    jest.spyOn(Contexts, 'useFilters').mockImplementationOnce(() => ({
      daysLateOptions: [
        {
          label: 'Days late 1',
          value: 'Days late 1',
          referenceCode: '1',
          displaySeq: 1,
          defaultValue: '1',
          description: '1',
        },
      ],
      bestTimeToCallOptions: [
        {
          label: 'Best time to call 1',
          value: 'Best time to call 1',
          referenceCode: '1',
          displaySeq: 1,
          defaultValue: '1',
          description: '1',
        },
      ],
      commitmentStatusOptions: [
        {
          label: 'Commitment status 1',
          value: 'Commitment status 1',
          referenceCode: '1',
          displaySeq: 1,
          defaultValue: '1',
          description: '1',
        },
      ],
      communicationTypeOptions: [
        {
          label: 'Communication type 1',
          value: 'Communication type 1',
          referenceCode: '1',
          displaySeq: 1,
          defaultValue: '1',
          description: '1',
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
      customersWithActivityOptions: [
        {
          label: 'Customers with  activity 1',
          value: 'Customers with activity 1',
          referenceCode: '1',
          displaySeq: 1,
          defaultValue: '1',
          description: '1',
        },
      ],
      customersWithCallActivityToolTip: [
        {
          label: 'Customer with and without activity',
          value: 'All',
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
      selectedDaysLateOption: ['Days late 1'],
      selectedBestTimeToCallOption: ['Best time to call 1'],
      selectedCommitmentStatusOption: ['Commitment status 1'],
      selectedCommunicationTypeOption: ['Communication type 1'],
      selectedLanguageOption: ['Language option 1'],
      selectedCustomersWithActivityOption: 'Customers with no call activity 1',
      selectedRouteOption: 'Route 1',
      selectedCommitmentDateFromOption: 'Commitment date from 1',
      selectedCommitmentDateToOption: 'Commitment date to 1',
      selectedDueDateFromOption: 'Due date from 1',
      selectedDueDateToOption: 'Due date to 1',
      isAutopayCustomersOptionSelected: true,
      isAllCommitmentDateOptionSelected: true,
      isAllDueDateOptionSelected: true,
      filter: defaultFilter,
      hasRouteApiError: false,
      hasApiError: false,
      isLoading: false,
      isFetchRoutesLoading: false,
    }));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    jest.spyOn(Contexts, 'useFiltersActions').mockImplementationOnce(() => ({
      onBestTimeToCallChanged: mockSetSelectedBestTimeToCallOption,
      onCommitmentStatusChanged: mockSetSelectedCommitmentStatusOption,
      onCommunicationTypeChanged: mockSetSelectedCommunicationTypeOption,
      onDaysLateOptionChanged: mockSetSelectedDaysLateOption,
      onLanguageChanged: mockSetSelectedLanguageOption,
      setSelectedRouteOption: mockSetSelectedRouteOption,
      setIsAutopayCustomersOption: mockSetIsAutopayCustomersOption,
      onDueDateFromOptionChanged: mockOnDueDateFromOptionChanged,
      onDueDateToOptionChanged: mockOnDueDateToOptionChanged,
      onDueDateCheckboxChanged: mockOnDueDateCheckboxChanged,
      onCommitmentDateFromOptionChanged: mockOnCommitmentDateToOptionChanged,
      onCommitmentDateToOptionChanged: mockOnCommitmentDateFromOptionChanged,
      onCustomersWithActivityChanged: mockOnCustomersWithActivityChanged,
      onClearSelectedOptions: mockOnClearSelectedOptions,
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
      .findAllByProps({ inputLabel: 'Days late' })[0]
      .props.onChange(event);

    expect(mockSetSelectedDaysLateOption).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedDaysLateOption).toHaveBeenCalledWith(valueFromEvent);
  });
  it('calls correct callback for best time to call selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ inputLabel: 'Best Time to Call' })[0]
      .props.onChange(event);

    expect(mockSetSelectedBestTimeToCallOption).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedBestTimeToCallOption).toHaveBeenCalledWith(
      valueFromEvent
    );
  });
  it('calls correct callback for commitment status selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ inputLabel: 'Commitment Status' })[0]
      .props.onChange(event);

    expect(mockSetSelectedCommitmentStatusOption).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedCommitmentStatusOption).toHaveBeenCalledWith(
      valueFromEvent
    );
  });
  it('calls correct callback for language selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ inputLabel: 'Language' })[0]
      .props.onChange(event);

    expect(mockSetSelectedLanguageOption).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedLanguageOption).toHaveBeenCalledWith(valueFromEvent);
  });
  it('calls correct callback for route selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root.findAllByProps({ inputLabel: 'Route' })[0].props.onChange(event);

    expect(mockSetSelectedRouteOption).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedRouteOption).toHaveBeenCalledWith(valueFromEvent);
  });
  it('calls correct callback for auto pay customers checkbox', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ label: 'Autopay customers' })[0]
      .props.onChange(event);

    expect(mockSetIsAutopayCustomersOption).toHaveBeenCalledTimes(1);
    expect(mockSetIsAutopayCustomersOption).toHaveBeenCalledWith(true);
  });
  it('calls correct callback for communication type selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ inputLabel: 'Communication type' })[0]
      .props.onChange(event);

    expect(mockSetSelectedCommunicationTypeOption).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedCommunicationTypeOption).toHaveBeenCalledWith(
      valueFromEvent
    );
  });
  it('calls correct callback for due date all checkbox', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root.findAllByProps({ label: 'All' })[0].props.onChange(event);

    expect(mockOnDueDateCheckboxChanged).toHaveBeenCalledTimes(1);
    expect(mockOnDueDateCheckboxChanged).toHaveBeenCalledWith(event);
  });
  it('calls correct callback for due date from value change', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ fromLabel: 'From' })[0]
      .props.onFromChanged('new-from');

    expect(mockOnDueDateFromOptionChanged).toHaveBeenCalledTimes(1);
    expect(mockOnDueDateFromOptionChanged).toHaveBeenCalledWith('new-from');
  });
  it('calls correct callback for due date to value change', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root.findAllByProps({ toLabel: 'To' })[0].props.onToChanged('new-to');

    expect(mockOnDueDateToOptionChanged).toHaveBeenCalledTimes(1);
    expect(mockOnDueDateToOptionChanged).toHaveBeenCalledWith('new-to');
  });
  it('calls correct callback for Customers With No Call Activity selector', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root
      .findAllByProps({ inputLabel: 'Customer’s Activity' })[0]
      .props.onChange(event);

    expect(mockOnCustomersWithActivityChanged).toHaveBeenCalledTimes(1);
    expect(mockOnCustomersWithActivityChanged).toHaveBeenCalledWith(
      valueFromEvent
    );
  });
  it('calls correct callback for Clear button', () => {
    const tree = renderer.create(
      <Filters handleToggleFilterPanel={() => {}} isOpen />
    );

    tree.root.findAllByProps({ variant: 'text' })[0].props.onClick(event);

    expect(mockOnClearSelectedOptions).toHaveBeenCalledTimes(1);
  });
});
