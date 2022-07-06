import clsx from 'clsx';
import React from 'react';

import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles, RACButton, Typography } from '@rentacenter/racstrap';

export interface SubNavigationProps {
  title?: string;
  onFilterClick: () => void;
}
const useStyles = makeStyles((theme: any) => ({
  subNavigationRoot: {
    width: '100%',
    height: theme.typography.pxToRem(45),
    display: 'flex',
    justifyContent: 'space-between',
  },
  header: {
    ...theme.typography.h4,
    fontSize: '1.125rem',
    fontFamily: 'OpenSans-bold',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 'unset !important',
  },
  buttonContainer: {
    alignSelf: 'flex-end',
  },
  hideOnPrint: {
    '@media print': {
      display: 'none',
    },
  },
}));
export const SubNavigation = ({ title, onFilterClick }: SubNavigationProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.subNavigationRoot, classes.hideOnPrint)}>
      <Typography align="center" component="h4" className={classes.header}>
        {title}
      </Typography>
      <div className={clsx(classes.buttonContainer)}>
        <RACButton
          variant="contained"
          color="primary"
          onClick={onFilterClick}
          startIcon={<FontAwesomeIcon icon={faSlidersH} />}
        >
          Filters
        </RACButton>
      </div>
    </div>
  );
};
