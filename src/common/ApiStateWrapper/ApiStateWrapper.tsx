/* eslint-disable react/display-name */
import { CircularProgress, makeStyles } from '@rentacenter/racstrap';
import clsx from 'clsx';
import React from 'react';
import { FULL_API_ERROR_MESSAGE } from '../../constants/constants';
import { StyleClasses } from '../../types/types';
import { ComponentStateProps, getComponentState } from '../../utils/utils';
import { NoItems } from '../NoItems/NoItems';
import { ReactComponent as ApiErrorIcon } from '../../assets/img/apiErrorIcon.svg';

type ApiStateWrapperClassKey =
  | 'loader'
  | 'apiError'
  | 'noRecordFound'
  | 'noItems';

const useStyles = makeStyles((theme: any) => ({
  apiError: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.typography.body2,
    fontSize: '1rem',
    lineHeight: theme.typography.pxToRem(24),
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  apiErrorIcon: {
    marginRight: theme.typography.pxToRem(5),
    height: theme.typography.pxToRem(26),
  },
}));

export interface divProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
  className?: string;
  message?: string;
}

export const Loader = (props: divProps) => {
  const classes = useStyles();
  const { className, ...rest } = props;
  return (
    <div className={clsx(classes.loader, className)} {...rest}>
      {<CircularProgress />}
    </div>
  );
};

export const ApiError1 = (props: divProps) => {
  const classes = useStyles();
  const { className, message, ...rest } = props;
  return (
    <div className={clsx(classes.apiError, className)} {...rest}>
      <ApiErrorIcon className={classes.apiErrorIcon} />
      {message || FULL_API_ERROR_MESSAGE}
    </div>
  );
};

interface ApiStateWrapperProps extends ComponentStateProps {
  classes?: StyleClasses<ApiStateWrapperClassKey>;
  successContent: React.ReactElement;
  apiErrorMessage?: string;
  noItemAdditionalText?: string;
}

export const ApiStateWrapper = ({
  loading,
  hasApiError,
  response,
  successContent,
  apiErrorMessage,
  classes,
  noItemAdditionalText = '',
}: ApiStateWrapperProps) => {
  return {
    initial: null,
    loading: <Loader className={clsx(classes?.loader)} />,
    apiError: (
      <ApiError1
        className={clsx(classes?.apiError)}
        message={apiErrorMessage}
      />
    ),
    empty: (
      <NoItems
        className={clsx(classes?.noItems)}
      >{`No record found${noItemAdditionalText}`}</NoItems>
    ),
    success: successContent,
  }[
    getComponentState({
      loading,
      hasApiError,
      response,
    })
  ];
};
