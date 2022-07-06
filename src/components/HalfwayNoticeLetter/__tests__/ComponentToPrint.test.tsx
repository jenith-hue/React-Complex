/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */
import React from 'react';

import renderer from 'react-test-renderer';
import ComponentToPrint from '../ComponentToPrint';

interface PropWithChildren {
  children: JSX.Element;
}

jest.mock('@rentacenter/racstrap', () => ({
  Typography: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Typography" {...rest}>
      {children}
    </div>
  ),
  RACCOLOR: {
    ALICE_BLUE: 'ALICE_BLUE',
  },
  makeStyles: () => () => ({
    allLettersContainer: 'allLettersContainer',
    breakPage: 'breakPage',
    halfwayNoticeContainer: 'halfwayNoticeContainer',
    section: 'section',
    paragraph: 'paragraph',
    headerMetadata: 'headerMetadata',
    underline: 'underline',
    alignLeft: 'alignLeft',
  }),
  withStyles: () => (Component: any) => Component,
}));

const classes = {
  allLettersContainer: 'allLettersContainer',
  breakPage: 'breakPage',
  halfwayNoticeContainer: 'halfwayNoticeContainer',
  section: 'section',
  paragraph: 'paragraph',
  headerMetadata: 'headerMetadata',
  underline: 'underline',
  alignLeft: 'alignLeft',
};
describe('ComponentToPrint', () => {
  it('renders correctly, when multiple letters are present', () => {
    const tree = renderer.create(
      <ComponentToPrint
        classes={classes}
        printLetterDetails={{
          letterType: 'COL',
          dateOfNotice: '2021-08-22',
          customer: [
            {
              customerId: 123456,
              globalCustomerId: '1fc287ca-b2e8-4829-aed4-8a5552f7d048',
              firstName: 'Marissa',
              lastName: 'Horn',
              address: {
                addressLine1: '18777 Midway RD',
                addressLine2: 'APT 401',
                city: 'DALLAS',
                state: 'TX',
                zipCode: '75287-2715',
              },
              rentalAgreementExpiration: '2021-08-12',
              deadlineToReturnProperty: '2021-08-27',
            },
          ],
          store: {
            storeNumber: '04744',
            name: 'DALLAS-BUCKNER BLVD',
            address: {
              addressLine1: '1322 S BUCKNER BLVD',
              addressLine2: '',
              city: 'DALLAS',
              state: 'TX',
              zipCode: '75217-1701',
            },
            phoneNumber: '2143985174',
          },
        }}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders correctly, when letter array is empty', () => {
    const tree = renderer.create(
      <ComponentToPrint
        printLetterDetails={{
          letterType: 'COL',
          dateOfNotice: '2021-08-22',
          customer: [],
          store: {
            storeNumber: '04744',
            name: 'DALLAS-BUCKNER BLVD',
            address: {
              addressLine1: '1322 S BUCKNER BLVD',
              addressLine2: '',
              city: 'DALLAS',
              state: 'TX',
              zipCode: '75217-1701',
            },
            phoneNumber: '2143985174',
          },
        }}
        classes={classes}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
