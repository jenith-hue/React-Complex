/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import { PrintLetterDetails } from '../../../types/types';
import HalfwayNoticeLetter from '../HalfwayNoticeLetter';

interface PropWithChildren {
  children: JSX.Element;
}

jest.mock('@rentacenter/racstrap', () => ({
  RACButton: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACButton" {...rest}>
      {children}
    </div>
  ),
  RACModal: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACModal" {...rest}>
      {children}
    </div>
  ),
  withStyles: () => (Component: any) => Component,
  RACCOLOR: {},
  makeStyles: () => () => ({
    halfwayNoticeContainer: 'halfwayNoticeContainer',
    section: 'section',
    paragraph: 'paragraph',
    headerMetadata: 'headerMetadata',
    underline: 'underline',
    dialogContent: 'dialogContent',
    dialogActions: 'dialogActions',
    dialogRoot: 'dialogRoot',
    radioLabel: 'radioLabel',
    previewContainer: 'previewContainer',
  }),
}));

jest.mock('react-to-print', () => {
  return {
    default: ({ children, ...rest }: PropWithChildren) => (
      <div data-testid="ReactToPrint" {...rest}>
        {children}
      </div>
    ),
  };
});

describe('HalfwayNoticeLetter', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <HalfwayNoticeLetter
        printLetterDetails={{} as PrintLetterDetails}
        onClose={jest.fn()}
        classes={{}}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
