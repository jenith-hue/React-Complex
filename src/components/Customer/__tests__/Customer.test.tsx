/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import { Customer } from '../Customer';

interface PropWithChildren {
  children: JSX.Element;
}

jest.mock('@rentacenter/racstrap', () => ({
  ...jest.requireActual('@rentacenter/racstrap'),
  Grid: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACGrid" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../ContactInformation/ContactInformation', () => ({
  ContactInformation: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="ContactInformation" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../CustomerBreadcrumb', () => ({
  CustomerBreadcrumb: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="CustomerBreadcrumb" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../CustomerInformation/CustomerInformation', () => ({
  CustomerInformation: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="CustomerInformation" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../../../context/CustomerDetails/CustomerDetailsProvider', () => ({
  CustomerDetailsProvider: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="CustomerDetailsProvider" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../CustomerInformation/CustomerHeader', () => ({
  CustomerHeader: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="CustomerHeader" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../History/History', () => ({
  History: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="History" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../TextConversation/TextConversation', () => ({
  TextConversation: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="TextConversation" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock(
  '../../../context/TextConversationProvider/TextConversationProvider',
  () => ({
    TextConversationProvider: ({ children, ...rest }: PropWithChildren) => (
      <div data-testid="TextConversationProvider" {...rest}>
        {children}
      </div>
    ),
  })
);

jest.mock('../../../common/Footer/Footer', () => ({
  Footer: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Footer" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../CustomerInformation/CustomerInformationFooter', () => ({
  CustomerInformationFooter: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="CustomerInformationFooter" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../../../context/PrintLetter/PrintLetterProvider', () => ({
  PrintLetterProvider: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="PrintLetterProvider" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../../../context/WorkedHistory/WorkedHistoryProvider', () => ({
  WorkedHistoryProvider: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="WorkedHistoryProvider" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../../../context/CustomerHeader/CustomerHeaderProvider', () => ({
  CustomerHeaderProvider: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="CustomerHeaderProvider" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../CustomerDetails/CustomerDetails', () => ({
  CustomerDetails: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="CustomerDetails" {...rest}>
      {children}
    </div>
  ),
}));

// Notice that the below is required, even if there is an another
// jest.spyOn in the test.
// Otherwise, we'll get the following: TypeError: Cannot redefine property: useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '',
    state: {
      customer: {
        customerFirstName: 'First',
        customerLastName: 'Last',
        customerId: '123ID',
      },
    },
  }),
}));
describe('Customer', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Customer />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
