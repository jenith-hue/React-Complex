/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import { ContactInformationReferencesContent } from '../ContactInformationReferencesContent';
import RouteData from 'react-router-dom';

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
  RACTooltip: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACTooltip" {...rest}>
      {children}
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
            relationshipTypeDesc: 'Friend',
            relationLengthYears: null,
            phoneNumber: '5431783478',
            bestTimeToCallDesc: null,
            verifiedDate: null,
            active: 'Y',
            doNotCall: 'N',
            note: null,
          },
          {
            personalReferenceId: '248491',
            firstName: 'Jean',
            lastName: 'Valjean',
            relationshipTypeDesc: 'Friend',
            relationLengthYears: null,
            phoneNumber: '5431783478',
            bestTimeToCallDesc: 'Afternoon',
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

// Notice that the below is required, even if there is an another
// jest.spyOn in the test.
// Otherwise, we'll get the following: TypeError: Cannot redefine property: useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '',
  }),
}));
describe('ContanctInformationReferencesContent', () => {
  it('renders correctly', () => {
    jest.spyOn(RouteData, 'useLocation').mockImplementationOnce(() => ({
      pathname: '/testroute',
      search: '',
      hash: '',
      state: {
        customer: {
          customerFirstName: 'First',
          customerLastName: 'Last',
        },
      },
    }));
    const tree = renderer.create(<ContactInformationReferencesContent />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
