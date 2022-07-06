import { makeStyles, RACCard, RACTabs } from '@rentacenter/racstrap';
import React from 'react';
import { AgreementInfoProvider } from '../../../context/AgreementInfo/AgreementInfoProvider';
import { AgreementInfo } from './AgreementInfo';
import { WorkedHistory } from './WorkedHistory';
import { CurrentPaymentHistory } from './CurrentPaymentHistory';
import { PaymentHistoryProvider } from '../../../context/PaymentHistory/PaymentHistoryProvider';

export const historyDatatestId = 'historyDatatestId';

const useClasses = makeStyles(() => ({
  historyCard: {
    boxSizing: 'border-box',
    borderRadius: '1rem',
    marginTop: '1rem',
    marginBottom: '9rem',
  },
  cardBody: {
    padding: '.5rem',
    width: '100%',
    boxSizing: 'border-box',
  },
}));

const AVAILABLE_TABS = [
  'Worked History',
  'Payment History',
  'Agreement Information',
];

export const History = () => {
  const classes = useClasses();

  return (
    <RACCard className={classes.historyCard} data-testid={historyDatatestId}>
      <div className={classes.cardBody}>
        <RACTabs
          loadAllTabContentOnMount
          defaultValue={0}
          tabs={AVAILABLE_TABS}
          contentForTabs={[
            <WorkedHistory key="worked-history" />,
            <PaymentHistoryProvider key="current-payment-history">
              <CurrentPaymentHistory />
            </PaymentHistoryProvider>,
            <AgreementInfoProvider key="agreement-info">
              <AgreementInfo />
            </AgreementInfoProvider>,
          ]}
        />
      </div>
    </RACCard>
  );
};
