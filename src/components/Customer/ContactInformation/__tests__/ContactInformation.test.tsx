/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import { ContactInformation } from '../ContactInformation';
import * as WorkedHistoryProvider from '../../../../context/WorkedHistory/WorkedHistoryProvider';

interface PropWithChildren {
  children: JSX.Element;
}

jest.mock('@rentacenter/racstrap', () => ({
  ...jest.requireActual('@rentacenter/racstrap'),
  Typography: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Typography" {...rest}>
      {children}
    </div>
  ),
  RACCard: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACCard" {...rest}>
      {children}
    </div>
  ),
  RACTabs: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACTabs" {...rest}>
      {children}
    </div>
  ),
  RACSelect: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACSelect" {...rest}>
      {children}
    </div>
  ),
  RACModal: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACModal" {...rest}>
      {children}
    </div>
  ),
  makeStyles: () => () => ({
    contactInformationRoot: 'contactInformationRoot',
    row: 'row',
    cardContentContainer: 'cardContentContainer',
    tabPanel: 'tabPanel',
  }),
  RACCOLOR: {
    ALICE_BLUE: 'ALICE_BLUE',
  },
}));

jest.mock('../ContactInformationReferencesContent', () => ({
  ContactInformationReferencesContent: ({
    children,
    ...rest
  }: PropWithChildren) => (
    <div data-testid="ReferencesContent" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../LogActivityModal', () => ({
  LogActivityModal: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="LogActivityModal" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock(
  '../../../../context/CustomerDetails/CustomerDetailsProvider',
  () => ({
    useCustomerDetails: () => ({
      customerDetails: {},
    }),
    useCustomerDetailsActions: () => ({
      fetchCommunicationDetailsForCustomer: jest.fn(),
      fetchCommunicationDetailsForCoCustomer: jest.fn(),
    }),
  })
);

/*
Observations:
- you cannot mock ContactInformationCustomerContent, ContactInformationCoCustomerContent, etc
(maybe because those are passed as props to RACTabs).

- if you add values to customerDetails mock, the tests will hang
*/
describe('ContactInformation', () => {
  it('renders correctly', async () => {
    const tree = renderer.create(<ContactInformation />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders with log activity modal', async () => {
    jest
      .spyOn(WorkedHistoryProvider, 'useWorkedHistoryActions')
      .mockImplementation(() => ({
        fetchWorkedHistory: jest.fn(),
        setReloadWorkedHistory: jest.fn(),
        onLogWorkedHistory: (
          callResult: string,
          note: string,
          daysPastDue: string,
          personId: string,
          callType: string,
          phoneNo: string,
          onSuccess: () => void,
          onError: () => void
        ): Promise<void> => {
          onError();
          return new Promise(jest.fn());
        },
      }));
    const tree = renderer.create(<ContactInformation />);

    renderer.act(() => {
      tree.root
        .findByProps({ 'data-testid': 'RACTabs' })
        .props.contentForTabs[0].props.onLogClicked('id');
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders with api error modal', async () => {
    jest
      .spyOn(WorkedHistoryProvider, 'useWorkedHistoryActions')
      .mockImplementation(() => ({
        fetchWorkedHistory: jest.fn(),
        setReloadWorkedHistory: jest.fn(),
        onLogWorkedHistory: (
          callResult: string,
          note: string,
          daysPastDue: string,
          personId: string,
          callType: string,
          phoneNo: string,
          onSuccess: () => void,
          onError: () => void
        ): Promise<void> => {
          onError();
          return new Promise(jest.fn());
        },
      }));
    const tree = renderer.create(<ContactInformation />);

    renderer.act(() => {
      tree.root
        .findByProps({ 'data-testid': 'RACTabs' })
        .props.contentForTabs[0].props.onLogClicked('id');
    });

    renderer.act(() => {
      tree.root
        .findByProps({ 'data-testid': 'LogActivityModal' })
        .props.onSave();
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
