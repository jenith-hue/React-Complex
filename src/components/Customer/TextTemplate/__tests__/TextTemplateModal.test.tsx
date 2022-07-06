/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable sonarjs/no-identical-functions */

import React from 'react';
import renderer from 'react-test-renderer';
import { TextTemplateModal, TextTemplateContent } from '../TextTemplateModal';
import {
  QuickResponse,
  TextTemplate,
} from '../../../../domain/TextConversation/TextTemplate';

interface PropWithChildren {
  children: JSX.Element;
}

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
      sendMessage: jest.fn(),
    }),
    useCustomerDetails: () => ({
      customerDetails: { firstName: '', lastName: '', phones: [] },
      coCustomerDetails: { firstName: '', lastName: '', phones: [] },
    }),
  })
);
jest.mock('@rentacenter/racstrap', () => ({
  Typography: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="Typography" {...rest}>
      {children}
    </div>
  ),
  RACModal: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACModal" {...rest}>
      {children}
    </div>
  ),
  RACButton: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACModal" {...rest}>
      {children}
    </div>
  ),
  RACRadio: ({ children, ...rest }: PropWithChildren) => (
    <div data-testid="RACModal" {...rest}>
      {children}
    </div>
  ),
  makeStyles: () => () => ({
    dialogContent: 'dialogContent',
    dialogActions: 'dialogActions',
    dialogRoot: 'dialogRoot',
    textTemplateLeftPannel: 'textTemplateLeftPannel',
    textTemplateRightPannel: 'textTemplateRightPannel',
    contentContainer: 'contentContainer',
    quickPhaseContainer: 'quickPhaseContainer',
    quickPhaseHeader: 'quickPhaseHeader',
    quickPhaseInput: 'quickPhaseInput',
    quickPhaseInputLabel: 'quickPhaseInputLabel',
    generatedTextLabel: 'generatedTextLabel',
    generatedTextValue: 'generatedTextValue',
    categoryListContainer: 'categoryListContainer',
    categoryListTitle: 'categoryListTitle',
    categoryListItem: 'categoryListItem',
    active: 'active',
  }),
  RACCOLOR: {
    ALICE_BLUE: 'ALICE_BLUE',
    CULTURED: 'CULTURED',
    BRILLIANCE: 'BRILLIANCE',
    BLUE_CRAYOLA: 'BLUE_CRAYOLA',
    HOARFROST: 'HOARFROST',
    POMPEII_ASH: 'POMPEII_ASH',
  },
}));

describe('TextTemplateModal', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <TextTemplateModal
        isCommunicationAllowed
        preferredLanguageDesc=''
        open={true}
        onClose={() => jest.fn()}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('TextTemplateContent', () => {
  it('renders correctly', () => {
    const textTemplates: TextTemplate[] = [
      {
        category: 'category1',
        order: 1,
        quickresponse: [
          {
            title: 'title11',
            message: 'message11',
            spanishMessage: 'message11',
          },
          {
            title: 'title12',
            message: 'message12',
            spanishMessage: 'message12',
          },
        ],
      },
      {
        category: 'category2',
        order: 2,
        quickresponse: [
          {
            title: 'title21',
            message: 'message21',
            spanishMessage: 'message21',
          },
          {
            title: 'title22',
            message: 'message22',
            spanishMessage: 'message22',
          },
        ],
      },
    ];
    const selectedTextTemplate: TextTemplate = {
      category: 'category1',
      order: 1,
      quickresponse: [
        { title: 'title11', message: 'message11', spanishMessage: 'message11' },
        { title: 'title12', message: 'message12', spanishMessage: 'message12' },
      ],
    };

    const selectedQuickPhase: QuickResponse = {
      title: 'title11',
      message: 'message11',
      spanishMessage: 'message11',
    };

    const tree = renderer.create(
      <TextTemplateContent
        textTemplates={textTemplates}
        selectedTextTemplate={selectedTextTemplate}
        selectedQuickPhase={selectedQuickPhase}
        onCategoryChange={() => jest.fn()}
        onQuickPhaseChange={() => jest.fn()}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
