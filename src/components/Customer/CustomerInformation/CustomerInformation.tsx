import React from 'react';
import { RACAccordion, makeStyles } from '@rentacenter/racstrap';
import { CustomerInformationDetails } from './CustomerInformationDetails';

const useStyles = makeStyles(() => ({
  customerInformationRoot: {
    width: 'calc(100% + 1.5rem)',
    left: '-0.75rem',
    margin: '0 !important',
  },
  accordionSummaryRoot: {
    width: '10px',
    position: 'absolute',
    right: 10,
    top: '-70px',
  },
  accordionSummaryContent: {
    margin: '0 !important',
  },
}));

export const CustomerInformation = () => {
  const classes = useStyles();

  return (
    <>
      <RACAccordion
        details={<CustomerInformationDetails />}
        accordionProps={{
          classes: {
            root: classes.customerInformationRoot,
          },
        }}
        summaryProps={{
          classes: {
            root: classes.accordionSummaryRoot,
            content: classes.accordionSummaryContent,
          },
        }}
      />
    </>
  );
};
