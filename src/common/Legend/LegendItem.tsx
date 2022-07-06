import React from 'react';
import { makeStyles } from '@rentacenter/racstrap';
import clsx from 'clsx';

export const legendItemTestId = 'legendItemTestId';

interface LegendItemProps {
  label: string;
  color?: string;
  isSelected: boolean;
  disabled?: boolean;
  onSelect: (selectedFilter: string) => void;
}

const useClasses = makeStyles((theme: any) => ({
  legendItem: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: '1.5rem',
  },
  colorPallet: {
    display: 'flex',
    backgroundColor: (props: LegendItemProps) => props.color,
    margin: '0.125rem 0.25rem 0 0',
    minWidth: '0.813rem',
    height: '0.813rem',
    borderRadius: '0.125rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  selected: {
    border: (props: LegendItemProps) =>
      `${theme.typography.pxToRem(1)} solid ${props.color || 'black'}`,
    borderRadius: theme.typography.pxToRem(14),
    padding: theme.typography.pxToRem(5),
  },
  disabled: {
    pointerEvents: 'none',
    opacity: '.5',
  },
}));

export const LegendItem = (props: LegendItemProps) => {
  const classes = useClasses(props);
  const { label, color, onSelect, isSelected, disabled } = props;
  return (
    <div
      className={clsx(
        classes.legendItem,
        isSelected && classes.selected,
        disabled && classes.disabled
      )}
      data-testid={legendItemTestId}
      onClick={() => !disabled && onSelect(label)}
    >
      {color && <span className={classes.colorPallet} />}
      <span className={classes.label}>{label}</span>
    </div>
  );
};
