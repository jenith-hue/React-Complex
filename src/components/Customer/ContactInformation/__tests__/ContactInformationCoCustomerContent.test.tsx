/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import { ContactInformationCoCustomerContent } from '../ContactInformationCoCustomerContent';

interface PropWithChildren {
  children: JSX.Element;
}

interface MockRACTableProps {
  renderTableHead: () => JSX.Element;
  renderTableContent: () => JSX.Element;
}

jest.mock('@rentacenter/racstrap', () => ({
  ...jest.requireActual('@rentacenter/racstrap'),
  Typography: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Typography" {...rest}>
      {children}
    </div>
  ),
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
  RACTableCell: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACTableCell" {...rest}>
      {children}
    </div>
  ),
  RACTableRow: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACTableRow" {...rest}>
      {children}
    </div>
  ),
  RACTable: ({ renderTableHead, renderTableContent }: MockRACTableProps) => (
    <div data-testid="RACTable">
      <div id="table-head">{renderTableHead()}</div>
      <div id="table-content">{renderTableContent()}</div>
    </div>
  ),
  makeStyles: () => () => ({}),
}));

jest.mock(
  '../../../../context/CustomerDetails/CustomerDetailsProvider',
  () => ({
    useCustomerDetails: () => ({
      customerDetails: {
        personalReferences: [
          {
            personalReferenceId: '24849',
            firstName: 'Alan',
            lastName: 'Hamel',
            relationshipType: 'Friend',
            relationLengthYears: null,
            phoneNumber: '(543)178-3478',
            bestTimeToCall: null,
            verifiedDate: null,
            active: 'Y',
            doNotCall: 'N',
            note: null,
          },
          {
            personalReferenceId: '248491',
            firstName: 'Jean',
            lastName: 'Valjean',
            relationshipType: 'Friend',
            relationLengthYears: null,
            phoneNumber: '(543)178-3478',
            bestTimeToCall: 'Afternoon',
            verifiedDate: null,
            active: 'Y',
            doNotCall: 'N',
            note: 'Customer not available',
          },
        ],
      },
    }),
  })
);

describe('ContactInformationCoCustomerContent', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ContactInformationCoCustomerContent />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
