import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { AppRoute } from '../config/route-config';
import { UserProvider } from '../context/user/UserProvider';
import { PermissionsProvider } from '../context/permission/PermissionsProvider';
import { UserFetcher } from '../components/UserFetcher/UserFetcher';
import { PasDueList } from '../components/PastDueList/PastDueList';
import { ActivityLog } from '../components/ActivityLog/ActivityLog';
import { Customer } from '../components/Customer/Customer';
import { PastDueListSearchCriteriaProvider } from '../context/PastDueListSearchCriteria/PastDueListSearchCriteriaProvider';
import PastDueListCustomerProvider from '../context/PastDueListCustomer/PastDueListCustomerProvider';
import FieldSheetsProvider from '../context/FieldSheets/FieldSheetsProvider';
import { StoreProvider } from '../context/Store/StoreProvider';

export const routesTestId = 'routesTestId';

export const Routes = () => {
  return (
    <UserProvider>
      <PermissionsProvider>
        <UserFetcher />
        <StoreProvider>
          <PastDueListSearchCriteriaProvider>
            <PastDueListCustomerProvider>
              <FieldSheetsProvider>
                <div data-testid={routesTestId}>
                  <Switch>
                    <Route exact path={AppRoute.Root}>
                      <Redirect to={AppRoute.PastDueList} />
                    </Route>
                    <Route exact path={AppRoute.Index}>
                      <Redirect to={AppRoute.PastDueList} />
                    </Route>
                    <Route exact path={AppRoute.PastDueList}>
                      <PasDueList />
                    </Route>
                    <Route exact path={AppRoute.ActivityLog}>
                      <ActivityLog />
                    </Route>
                    <Route path={AppRoute.Customer}>
                      <Customer />
                    </Route>
                  </Switch>
                </div>
              </FieldSheetsProvider>
            </PastDueListCustomerProvider>
          </PastDueListSearchCriteriaProvider>
        </StoreProvider>
      </PermissionsProvider>
    </UserProvider>
  );
};
