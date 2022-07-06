/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */
import React from 'react';
import renderer from 'react-test-renderer';

import { WorkedHistoryNotesModal } from '../WorkedHistoryNotesModal';

interface PropWithChildren {
  children: JSX.Element;
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
  RACModal: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACModal" {...rest}>
      {children}
    </div>
  ),
  RACCOLOR: {
    CULTURED: 'CULTURED',
  },
  makeStyles: () => () => ({
    dialogContent: 'dialogContent',
    dialogRoot: 'dialogRoot',
    dialogActions: 'dialogActions',
    text: 'text',
    generatedTextValue: 'generatedTextValue',
  }),
}));
describe('WorkedHistoryNotesModal', () => {
  it('should render correctly', async () => {
    const tree = renderer.create(
      <WorkedHistoryNotesModal
        workedResultText="WRTXT"
        noteText="NTXT"
        open
        onClose={jest.fn()}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
