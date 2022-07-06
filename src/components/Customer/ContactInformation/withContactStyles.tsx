/* eslint-disable react/display-name */
import { makeStyles, RACCOLOR } from '@rentacenter/racstrap';
import React from 'react';
import { StyleClasses } from '../../../types/types';

export type WrappedComponentClassKey =
  | 'tableContentColor'
  | 'logButtonContainer'
  | 'underline'
  | 'logButton'
  | 'center'
  | 'listWrapper'
  | 'editButton'
  | 'tabContentLoader';

export interface WrappedComponentProps {
  classes: StyleClasses<WrappedComponentClassKey>;
  onLogClicked: (personId: string, phoneNo?: string) => void;
  onError?: (message: string) => void;
}

const useStyles = makeStyles((theme: any) => ({
  tableContentColor: {
    color: RACCOLOR.INDEPENDENCE,
  },
  logButtonContainer: {
    width: theme.typography.pxToRem(72),
    height: theme.typography.pxToRem(29),
  },
  logButton: {
    backgroundColor: RACCOLOR.LAVENDER_MIST,
    height: theme.typography.pxToRem(29),
  },
  editButton: {
    marginLeft: theme.typography.pxToRem(5),
    height: theme.typography.pxToRem(29),
  },
  underline: {
    textDecoration: 'underline',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  listWrapper: {
    overflowX: 'auto',
    height: theme.typography.pxToRem(405),
  },
  tabContentLoader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const withContactStyles =
  (props: any) =>
  (WrappedComponent: React.ComponentType<WrappedComponentProps>) => {
    const classes = useStyles();
    return <WrappedComponent classes={classes} {...props} />;
  };
