import { Card, makeStyles, Typography } from '@rentacenter/racstrap';
import React, { useContext, useEffect } from 'react';
import { LegendItemList } from '../../../common/Legend/LegendItemList';
import {
  PastDueListCustomerStateContext,
  PastDueListCustomerDispatchStateContext,
} from '../../../context/PastDueListCustomer/PastDueListCustomerProvider';
import {
  getFilterByLabel,
  PastDueListStatusLegendNames,
} from '../../../domain/PastDueList/PastDueCustomerList';
import { CustomerList } from './CustomerList';

export const pastDueCustomerListTestId = 'pastDueCustomerListTestId';

const useClasses = makeStyles((theme: any) => ({
  pastDueListWrapper: {
    marginTop: '1rem',
    marginBottom: theme.typography.pxToRem(120),
  },
  pastDueCustomerList: {
    display: 'flex',
    flexDirection: 'row',
    boxSizing: 'border-box',
    borderRadius: '1rem',
  },
  header: {
    ...theme.typography.h4,
    fontSize: '1.125rem',
    fontFamily: 'OpenSans-bold',
    marginBottom: '.5rem',
  },
  cardBody: {
    padding: '0 0.5rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  legentItemsContainer: {
    // From design:
    // container has a height of 46px + 8px of padding on card body
    // dropped the padding top and add it to this height,
    // in order to make the legende to look vertically centered
    height: theme.typography.pxToRem(46 + 8),
  },
}));

export const PastDueCustomerList = () => {
  const classes = useClasses();
  const { filter, loading } = useContext(PastDueListCustomerStateContext);

  const { setSeletedFilter } = useContext(
    PastDueListCustomerDispatchStateContext
  );

  // Feature is currently deactivated, because we have introduced pagination on past due list.
  // The filtering should happen on the BE
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSelect = (selectedFilter: string) => {
    // noop
  };
  // filter === selectedFilter
  //   ? setSeletedFilter('')
  //   : setSeletedFilter(selectedFilter);

  useEffect(() => {
    setSeletedFilter('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.pastDueListWrapper}>
      <Typography component="h4" className={classes.header}>
        Past Due List
      </Typography>
      <Card
        className={classes.pastDueCustomerList}
        data-testid={pastDueCustomerListTestId}
      >
        <div className={classes.cardBody}>
          <div className={classes.legentItemsContainer}>
            <LegendItemList
              list={PastDueListStatusLegendNames}
              onSelect={onSelect}
              selectedItem={filter && getFilterByLabel(filter)}
              disabled={loading}
            />
          </div>
          <CustomerList />
        </div>
      </Card>
    </div>
  );
};
