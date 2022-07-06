/* eslint-disable react/display-name */

import React from 'react';
import renderer from 'react-test-renderer';
import { CustomerInformation } from '../CustomerInformation';

interface PropWithChildren {
  children: JSX.Element;
}
jest.mock('@rentacenter/racstrap', () => ({
  RACAccordion: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACAccordion" {...rest}>
      {children}
    </div>
  ),
  makeStyles: () => () => ({}),
}));

jest.mock('../CustomerInformationDetails', () => ({
  CustomerInformationDetails: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="CustomerInformationDetails" {...rest}>
      {children}
    </div>
  ),
  makeStyles: () => () => ({}),
}));

describe('CustomerInformation', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<CustomerInformation />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
