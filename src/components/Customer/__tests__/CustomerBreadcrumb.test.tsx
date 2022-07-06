/* eslint-disable react/display-name */

import { render } from '@testing-library/react';
import React from 'react';
import RouteData from 'react-router-dom';
import { CustomerBreadcrumb, initialLinks } from '../CustomerBreadcrumb';

interface PropWithChildren {
  children: JSX.Element;
}
jest.mock('@rentacenter/racstrap', () => ({
  RACBreadcrumb: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACButton" {...rest}>
      {children}
    </div>
  ),
  makeStyles: () => () => ({}),
}));

// Notice that the below is required, even if there is an another
// jest.spyOn in the test.
// Otherwise, we'll get the following: TypeError: Cannot redefine property: useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '',
  }),
}));

jest.mock('../../../context/CustomerDetails/CustomerDetailsProvider', () => ({
  useCustomerDetails: () => ({
    customerDetails: {
      firstName: 'firstName',
      lastName: 'lastName',
      customerId: 'customerId',
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
}));

describe('CustomerBreadcrumb', () => {
  it('appends customer name to the breadcrumb', () => {
    const mockSetLinks = jest.fn();
    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => [initialLinks, mockSetLinks]);
    jest.spyOn(RouteData, 'useLocation').mockImplementationOnce(() => ({
      pathname: '/testroute',
      search: '',
      hash: '',
      state: {
        customer: {
          customerFirstName: 'First',
          customerLastName: 'Last',
          customerId: '123ID',
        },
      },
    }));

    render(<CustomerBreadcrumb />);

    expect(mockSetLinks).toHaveBeenCalledTimes(1);
    expect(mockSetLinks).toHaveBeenCalledWith([
      ...initialLinks,
      {
        href: 'am/customer',
        label: 'firstName lastName - customerId',
      },
    ]);
  });
});
