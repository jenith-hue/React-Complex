/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import { ContactInformationCustomerContent } from '../ContactInformationCustomerContent';
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
  RACTooltip: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACTooltip" {...rest}>
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
      coCustomerPhones: {
        firstName: 'First',
        lastName: 'Last',
        phones: [
          {
            phoneId: '15202',
            phoneNumber: '6122964586.000000',
            phoneType: 'CELL',
            phoneTypeDesc: 'Cell Phone',
            phoneExtension: null,
            primary: 'Y',
            callTimeType: 'EVEN',
            callTimeTypeDesc: 'Evening',
            note: null,
          },
          {
            phoneId: '9547',
            phoneNumber: '7122964587.000000',
            phoneType: 'HOME',
            phoneTypeDesc: 'Home Phone',
            phoneExtension: '(521)',
            primary: 'N',
            callTimeType: 'EVEN',
            callTimeTypeDesc: 'Evening',
            note: 'Customer not available',
          },
        ],
      },
      customerDetails: {
        firstName: 'First',
        lastName: 'Last',
        phones: [
          {
            phoneId: '15202',
            phoneNumber: '6122964587.000000',
            phoneType: 'CELL',
            phoneTypeDesc: 'Cell Phone',
            phoneExtension: null,
            primary: 'Y',
            callTimeType: 'EVEN',
            callTimeTypeDesc: 'Evening',
            note: null,
          },
          {
            phoneId: '9547',
            phoneNumber: '6122964587.000000',
            phoneType: 'HOME',
            phoneTypeDesc: 'Home Phone',
            phoneExtension: '(521)',
            primary: 'N',
            callTimeType: 'EVEN',
            callTimeTypeDesc: 'Evening',
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

describe('ContactInformationCustomerContent', () => {
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
    const tree = renderer.create(<ContactInformationCustomerContent />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
