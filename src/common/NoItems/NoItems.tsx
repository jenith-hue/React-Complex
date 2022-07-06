import React, { HTMLProps } from 'react';
import { makeStyles } from '@rentacenter/racstrap';
import clsx from 'clsx';

export const noItemsTestId = 'noItemsTestId';

const useStyles = makeStyles(() => ({
  noItems: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export const NoItems = (props: HTMLProps<HTMLDivElement>) => {
  const { children, className, ...rest } = props;
  const ownClasses = useStyles();
  return (
    <div
      className={clsx(ownClasses.noItems, className)}
      data-testid={noItemsTestId}
      {...rest}
    >
      {children}
    </div>
  );
};
