/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import { TextConversation } from '../TextConversation';

interface PropWithChildren {
  children: JSX.Element;
}

jest.mock('@rentacenter/racstrap', () => ({
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
  Icon: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Icon" {...rest}>
      {children}
    </div>
  ),
  RACCOLOR: {},
  makeStyles: () => () => ({
    textConversationRoot: 'textConversationRoot',
    row: 'row',
    cardContentContainer: 'cardContentContainer',
    appBar: 'appBar',
    tabPanel: 'tabPanel',
    icon: 'icon',
  }),
}));

jest.mock('../TextConversationContent', () => ({
  TextConversationContent: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="TextConversationContent" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock(
  '../../../../context/TextConversationProvider/TextConversationProvider',
  () => ({
    useTextConversationActions: () => ({
      onCustomerTabSelected: jest.fn(),
      onCoCustomerTabSelected: jest.fn(),
      onRefresh: jest.fn(),
    }),
    useTextConversation: () => ({
      disabledTabs: [],
      customerPhones: [
        {
          id: 'id1',
        },
      ],
      coCustomerPhones: [
        {
          id: 'id1',
        },
      ],
      isCommunicationAllowed: true,
      isCommunicationAllowedWithCoCustomer: true,
    }),
  })
);

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="FontAwesomeIcon" {...rest}>
      {children}
    </div>
  ),
}));
jest.mock(
  '../../../../context/CustomerDetails/CustomerDetailsProvider',
  () => ({
    useCustomerDetailsActions: () => ({
      fetchCommunicationDetailsForCustomer: jest.fn(),
    }),
    useCustomerDetails: () => ({
      customerDetails: {
        coCustomerPhones: [
          {
            id: 'id1',
          },
        ],
        personalReferences: [
          {
            id: 'id1',
          },
        ],
        employerReferences: [
          {
            id: 'id1',
          },
        ],
      },
      coCustomerDetails: {
        phones: [
          {
            id: 'id1',
          },
        ],
      },
    }),
  })
);
describe('TextConversation', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<TextConversation />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
