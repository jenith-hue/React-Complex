import { Grid, makeStyles } from '@rentacenter/racstrap';
import React from 'react';
import { ApiStateWrapper } from '../../../common/ApiStateWrapper/ApiStateWrapper';
import { Footer } from '../../../common/Footer/Footer';
import { CustomerAlertsProvider } from '../../../context/CustomerAlert/CustomerAlertsProvider';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import { CustomerHeaderProvider } from '../../../context/CustomerHeader/CustomerHeaderProvider';
import { CustomerPaymentSummaryProvider } from '../../../context/CustomerPaymentSummary/CustomerPaymentSummaryProvider';
import { useUserPermissions } from '../../../context/permission/PermissionsProvider';
import { PrintLetterProvider } from '../../../context/PrintLetter/PrintLetterProvider';
import { TextConversationProvider } from '../../../context/TextConversationProvider/TextConversationProvider';
import { WorkedHistoryProvider } from '../../../context/WorkedHistory/WorkedHistoryProvider';
import { ContactInformation } from '../ContactInformation/ContactInformation';
import { CustomerHeader } from '../CustomerInformation/CustomerHeader';
import { CustomerInformation } from '../CustomerInformation/CustomerInformation';
import { CustomerInformationFooter } from '../CustomerInformation/CustomerInformationFooter';
import { History } from '../History/History';
import { TextConversation } from '../TextConversation/TextConversation';

export const useStyles = makeStyles(() => ({
  contentHeight: {
    position: 'absolute',
    height: '100vh',
    width: '100%',
  },
}));

export const CustomerDetails = () => {
  const ownClasses = useStyles();
  const { loading, hasApiError } = useCustomerDetails();
  const { hasAccessToTextConversation } = useUserPermissions();
  const customerDetailLoaded =
    loading !== undefined && !loading && !hasApiError;

  return (
    <>
      <ApiStateWrapper
        loading={loading}
        hasApiError={hasApiError}
        successContent={<></>}
        classes={{
          loader: ownClasses.contentHeight,
          apiError: ownClasses.contentHeight,
        }}
      />
      {customerDetailLoaded && (
        <WorkedHistoryProvider>
          <CustomerHeaderProvider>
            <CustomerPaymentSummaryProvider>
              <CustomerAlertsProvider>
                <CustomerHeader />
              </CustomerAlertsProvider>
              <CustomerInformation />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={8}>
                  <TextConversationProvider>
                    <ContactInformation />
                  </TextConversationProvider>
                </Grid>
                {hasAccessToTextConversation && (
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <TextConversationProvider>
                      <TextConversation />
                    </TextConversationProvider>
                  </Grid>
                )}
              </Grid>

              <History />
              <Footer>
                <PrintLetterProvider>
                  <CustomerInformationFooter />
                </PrintLetterProvider>
              </Footer>
            </CustomerPaymentSummaryProvider>
          </CustomerHeaderProvider>
        </WorkedHistoryProvider>
      )}
      {(hasApiError || loading) && (
        <Footer>
          <PrintLetterProvider>
            <CustomerInformationFooter />
          </PrintLetterProvider>
        </Footer>
      )}
    </>
  );
};
