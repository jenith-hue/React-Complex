/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import { TextConversationContent } from '../TextConversationContent';

interface PropWithChildren {
  children: JSX.Element;
}

jest.mock('@rentacenter/racstrap', () => ({
  Typography: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Typography" {...rest}>
      {children}
    </div>
  ),
  RACTextMessageInput: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACTextMessageInput" {...rest}>
      {children}
    </div>
  ),
  RACTextConversationMessage: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACTextConversationMessage" {...rest}>
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
    root: 'root',
    header: 'header',
    body: 'body',
    footer: 'footer',
    headerItem: 'headerItem',
    headerItemValue: 'headerItemValue',
    message: 'message',
    mirror: 'mirror',
    avatarContainer: 'avatarContainer',
    contentContainer: 'contentContainer',
  }),
  RACCOLOR: {
    INDEPENDENCE: 'INDEPENDENCE',
  },
}));

jest.mock(
  '../../../../context/CustomerDetails/CustomerDetailsProvider',
  () => ({
    useCustomerDetails: () => ({
      customerDetails: { firstName: '', lastName: '', phones: [] },
      coCustomerDetails: { firstName: '', lastName: '', phones: [] },
    }),
  })
);

jest.mock(
  '../../../../context/TextConversationProvider/TextConversationProvider',
  () => ({
    useTextConversationActions: () => ({
      onPhoneOptionChanged: jest.fn(),
      sendMessage: jest.fn(),
    }),
    useCustomerDetails: () => ({
      customerDetails: { firstName: '', lastName: '', phones: [] },
      coCustomerDetails: { firstName: '', lastName: '', phones: [] },
    }),
    useTextConversation: () => ({
      isCommunicationAllowed: true,
      phoneOptions: [
        {
          label: 'label1',
          value: 'value1',
        },
        {
          label: 'label2',
          value: 'value2',
        },
      ],
      selectedPhoneOption: {
        label: 'label1',
        value: 'value1',
      },
      fullName: 'Full name',
      phoneType: 'CELL',
      messages: [
        {
          textMessageId: 'textMessageId1',
          isSentByRAC: true,
          phoneNumber: '555-555-555',
          messageDate: '10/10/2010 11:00',
          initials: 'AB',
          fullName: 'Abraham Bahamas',
          message: 'Hi',
        },
        {
          textMessageId: 'textMessageId2',
          isSentByRAC: false,
          phoneNumber: '33-2222-551115',
          messageDate: '10/10/2010 11:50',
          initials: 'JD',
          fullName: 'Jane Doe',
          message: 'Hi 2',
        },
      ],
    }),
    useUserPermissions: () => ({
      hasAccessToTextTemplate: true,
      hasAccessToFreeFormText: true,
    }),
  })
);

describe('TextConversationContent', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <TextConversationContent
        onComponentDidMount={() => {
          // noop
        }}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('calls onComponentDidMount after first mount ', () => {
    const mockOnComponentDidMount = jest.fn();

    renderer.act(() => {
      renderer.create(
        <TextConversationContent
          onComponentDidMount={mockOnComponentDidMount}
        />
      );
    });

    expect(mockOnComponentDidMount).toHaveBeenCalledTimes(1);
  });
});
