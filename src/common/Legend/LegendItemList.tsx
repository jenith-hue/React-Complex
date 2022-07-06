import { makeStyles } from '@rentacenter/racstrap';
import React from 'react';
import {
  PastDueListStatusLegend,
  PastDueListStatusLegendEntityProps,
} from '../../domain/PastDueList/PastDueCustomerList';
import {
  WorkedHistoryStatusLegend,
  WorkedHistoryStatusLegendEntityProps,
} from '../../domain/WorkedHistory/WorkedHistory';
import { LegendItem } from './LegendItem';

export interface LegendItemListProps {
  list:
    | Partial<
        Record<PastDueListStatusLegend, PastDueListStatusLegendEntityProps>
      >
    | Partial<
        Record<WorkedHistoryStatusLegend, WorkedHistoryStatusLegendEntityProps>
      >;
  onSelect: (selectedFilter: string) => void;
  selectedItem?: string;
  disabled?: boolean;
}
export const legendItemListTestId = 'legendItemListTestId';

const useClasses = makeStyles(() => ({
  legendItemList: {
    display: 'flex',
    flexDirection: 'row',
    padding: '0 24px 0 24px',
    borderBottom: '1px solid #EFEFEF',
    boxSizing: 'border-box',
    marginRight: '-0.438rem',
    marginLeft: '-0.438rem',
    flexWrap: 'wrap',
    height: '100%',
    alignItems: 'center',
  },
}));

export const LegendItemList = ({
  list,
  onSelect,
  selectedItem,
  disabled,
}: LegendItemListProps) => {
  const classes = useClasses();

  return (
    <div className={classes.legendItemList} data-testid={legendItemListTestId}>
      {Object.entries(list).map(
        (item, index) =>
          item[1] &&
          item[0] && (
            <LegendItem
              key={index}
              label={item[1]?.label}
              color={item[1]?.color}
              onSelect={onSelect}
              isSelected={item[0] === selectedItem}
              disabled={disabled}
            />
          )
      )}
    </div>
  );
};
