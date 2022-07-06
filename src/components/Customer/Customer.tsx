import React from 'react';
import { PastDueCustomerResponse } from '../../domain/PastDueList/PastDueCustomerList';
import { CustomerBreadcrumb } from './CustomerBreadcrumb';
import { CustomerDetailsProvider } from '../../context/CustomerDetails/CustomerDetailsProvider';
import { CustomerDetails } from './CustomerDetails/CustomerDetails';
import { Redirect, useLocation } from 'react-router-dom';
import { CustomerLocationState } from '../../types/types';
import { AppRoute } from '../../config/route-config';

export interface CustomerProps {
  customer?: PastDueCustomerResponse;
}
export const Customer = () => {
  const location = useLocation<CustomerLocationState>();

  const customerId = location?.pathname?.split('/')[3];

  if (!location?.state?.customer?.customerId && !customerId) {
    return <Redirect to={AppRoute.PastDueList} />;
  }
  return (
    <>
      <CustomerDetailsProvider>
        <CustomerBreadcrumb />
        <CustomerDetails />
      </CustomerDetailsProvider>
    </>
  );
};
