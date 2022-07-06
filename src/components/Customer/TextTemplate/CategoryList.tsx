import { makeStyles } from '@rentacenter/racstrap';
import React from 'react';
import clsx from 'clsx';
import { RACCOLOR } from '@rentacenter/racstrap';

interface CategoryListProps {
  categories: string[];
  selectedCategory: string;
  onClick: (selected: string) => void;
}

const useStyles = makeStyles((theme: any) => ({
  categoryListContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: RACCOLOR.BRILLIANCE,
  },
  categoryListItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: theme.typography.pxToRem(315),
    overflowY: 'auto',
  },
  categoryListTitle: {
    ...theme.typography.h5,
    paddingLeft: '1rem !important',
    margin: '1rem 0 !important',
    color: RACCOLOR.POMPEII_ASH,
  },
  categoryListItem: {
    padding: '.5rem 1rem',
    cursor: 'pointer',
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  active: {
    color: RACCOLOR.BLUE_CRAYOLA,
    backgroundColor: RACCOLOR.HOARFROST,
  },
}));

export const CategoryList = ({
  categories,
  selectedCategory,
  onClick,
}: CategoryListProps) => {
  const classes = useStyles();

  return (
    <div className={classes.categoryListContainer}>
      <span className={classes.categoryListTitle}>CATEGORY</span>
      <div className={classes.categoryListItemContainer}>
        {categories.map((category) => (
          <span
            onClick={() => onClick(category)}
            className={clsx(
              classes.categoryListItem,
              selectedCategory === category && classes.active
            )}
            key={category}
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  );
};
