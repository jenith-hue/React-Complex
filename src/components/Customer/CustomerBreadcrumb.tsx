import {
  makeStyles,
  RACBreadcrumb,
  RACBreadcrumbLinkType,
} from '@rentacenter/racstrap';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { AppRoute } from '../../config/route-config';
import { useCustomerDetails } from '../../context/CustomerDetails/CustomerDetailsProvider';
import { PastDueCustomerResponse } from '../../domain/PastDueList/PastDueCustomerList';
export interface CustomerProps {
  customer?: PastDueCustomerResponse;
}

const useStyles = makeStyles((theme: any) => ({
  breadcrumbContainer: {
    width: '100%',
    height: theme.typography.pxToRem(45),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
}));

export const initialLinks = [
  {
    href: `/am${AppRoute.Index}`,
    label: 'Dashboard',
  },
  {
    href: `/am${AppRoute.PastDueList}`,
    label: 'Past Due List',
  },
];

export const initialLinksM = [
  {
    href: `/menu${AppRoute.Dashboard}`,
    label: 'Dashboard',
  },
  {
    href: `/menu${AppRoute.PastDueList}`,
    label: 'Past Due List',
  },
];

const getLinks = () => {
  if (window.location.pathname.includes('menu')) {
    return initialLinksM;
  }
  return initialLinks;
};
const getCustomerPath = (customerId: any) => {
  if (window.location.pathname.includes('menu')) {
    return `/menu/customer/update/${customerId}/customer`;
  }
  return 'am/customer';
};

export const CustomerBreadcrumb = () => {
  const [links, setLinks] =
    React.useState<RACBreadcrumbLinkType[]>(initialLinks);
  const { customerDetails } = useCustomerDetails();
  const { firstName, lastName, customerId } = customerDetails || {};
  const classes = useStyles();

  useEffect(() => {
    if (!customerDetails) return;
    const links = getLinks();
    const label =
      firstName && lastName && customerId
        ? `${firstName || ''} ${lastName || ''} - ${customerId || ''}`
        : '';
    setLinks([
      ...links,
      {
        href: `${getCustomerPath(customerId)}`,
        label: label,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerDetails]);

  return (
    <div className={clsx(classes.breadcrumbContainer)}>
      <RACBreadcrumb links={links} />
    </div>
  );
};
