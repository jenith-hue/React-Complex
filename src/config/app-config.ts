import { sanitizeURL } from '../utils/utils';

export interface ApiUrls {
  readonly container: string;
  readonly micro: string;
  readonly customer: string;
  readonly mock: string;
}

export interface AppConfigItem {
  readonly apiUrls: ApiUrls;
  readonly microUrl: string;
  readonly auth: {
    readonly region: string;
    readonly userPoolId: string;
    readonly userPoolWebClientId: string;
    readonly oauth: {
      readonly domain: string;
      readonly scope?: string[];
      readonly redirectSignIn: string;
      readonly redirectSignOut: string;
      readonly responseType: string;
      readonly urlOpener: (url: string) => void;
    };
  };
}

const microUrl = {
  localhost: 'http://localhost:3006',
  local: 'https://local-am-racpad.rentacenter.com',
  dev: 'https://dev-am-racpad.rentacenter.com',
  qa: 'https://qa-am-racpad.rentacenter.com',
  uat: 'https://uat-am-racpad.rentacenter.com',
  prod: 'https://racpad-am.rentacenter.com',
};

export interface AppConfig extends AppConfigItem {
  readonly appName: string;
  readonly appConfigDev: AppConfigItem;
}

export const urlOpener = (url: string): void => {
  const urlToOpen = sanitizeURL(url);

  if (urlToOpen) {
    window.open(urlToOpen, '_self');
  }
};

export const localhost: AppConfigItem = {
  apiUrls: {
    container: 'https://local-racpad.rentacenter.com/api',
    micro: 'https://local-am-racpad.rentacenter.com/api',
    customer: 'https://local-customer-racpad.rentacenter.com/api',
    mock: 'http://localhost:3006/',
  },
  microUrl: microUrl.localhost,
  auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_FPWut7aB',
    userPoolWebClientId: '608s8dso4aecka8omjpukssq3n',
    oauth: {
      domain: 'auth-local-racpad.auth.us-east-1.amazoncognito.com',
      redirectSignIn: microUrl.localhost,
      redirectSignOut: microUrl.localhost,
      responseType: 'token',
      urlOpener,
    },
  },
};

export const localhostIE11: AppConfigItem = { ...localhost };

export const local: AppConfigItem = {
  apiUrls: {
    container: 'https://local-racpad.rentacenter.com/api',
    micro: 'https://local-am-racpad.rentacenter.com/api',
    customer: 'https://local-customer-racpad.rentacenter.com/api',
    mock: 'https://local-am-racpad.rentacenter.com/am',
  },
  microUrl: microUrl.local,
  auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_FPWut7aB',
    userPoolWebClientId: '608s8dso4aecka8omjpukssq3n',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    oauth: {
      domain: 'auth-local-racpad.auth.us-east-1.amazoncognito.com',
      redirectSignIn: microUrl.local,
      redirectSignOut: microUrl.local,
      responseType: 'token',
      urlOpener,
    },
  },
};

export const dev: AppConfigItem = {
  apiUrls: {
    container: 'https://dev-racpad.rentacenter.com/api',
    micro: 'https://dev-am-racpad.rentacenter.com/api',
    customer: 'https://dev-customer-racpad.rentacenter.com/api',
    mock: 'https://dev-am-racpad.rentacenter.com/am',
  },
  microUrl: microUrl.dev,
  auth: {
    region: 'us-east-1',
    // userPoolId: 'us-east-1_IX7X5lZqL',
    // userPoolWebClientId: '4o7nqktg06c45g59dqhd51gik5',
    userPoolId: 'us-east-1_8MbOyEYG6',
    userPoolWebClientId: '47r2ihk9fehcpn9t64thdbu2tl',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    oauth: {
      // domain: 'auth-dev-racpad.auth.us-east-1.amazoncognito.com',
      domain: 'auth-qa-racpad.auth.us-east-1.amazoncognito.com',
      redirectSignIn: microUrl.dev,
      redirectSignOut: microUrl.dev,
      responseType: 'token',
      urlOpener,
    },
  },
};

export const qa: AppConfigItem = {
  apiUrls: {
    container: 'https://qa-racpad.rentacenter.com/api',
    micro: 'https://qa-am-racpad.rentacenter.com/api',
    customer: 'https://qa-customer-racpad.rentacenter.com/api',
    mock: 'https://qa-am-racpad.rentacenter.com/am',
  },
  microUrl: microUrl.qa,
  auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_8MbOyEYG6',
    userPoolWebClientId: '47r2ihk9fehcpn9t64thdbu2tl',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    oauth: {
      domain: 'auth-qa-racpad.auth.us-east-1.amazoncognito.com',
      redirectSignIn: microUrl.qa,
      redirectSignOut: microUrl.qa,
      responseType: 'token',
      urlOpener,
    },
  },
};

export const uat: AppConfigItem = {
  apiUrls: {
    container: 'https://uat-racpad.rentacenter.com/api',
    micro: 'https://uat-am-racpad.rentacenter.com/api',
    customer: 'https://uat-customer-racpad.rentacenter.com/api',
    mock: 'https://uat-am-racpad.rentacenter.com/am',
  },
  microUrl: microUrl.uat,
  auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_FBmCthpda',
    userPoolWebClientId: '1d8vgr67fr7gli9abpv9j1cb3n',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    oauth: {
      domain: 'auth-uat-racpad.auth.us-east-1.amazoncognito.com',
      redirectSignIn: microUrl.uat,
      redirectSignOut: microUrl.uat,
      responseType: 'token',
      urlOpener,
    },
  },
};

export const prod: AppConfigItem = {
  apiUrls: {
    container: 'https://racpad.rentacenter.com/api',
    micro: 'https://racpad-am.rentacenter.com/api',
    customer: 'https://racpad-customer.rentacenter.com/api',
    mock: 'https://racpad-am.rentacenter.com/am',
  },
  microUrl: microUrl.prod,
  auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_so5RR57Of',
    userPoolWebClientId: '50nk6ibf5lru47hesk4j0cfuu4',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    oauth: {
      domain: 'auth-racpad.auth.us-east-1.amazoncognito.com',
      redirectSignIn: microUrl.prod,
      redirectSignOut: microUrl.prod,
      responseType: 'token',
      urlOpener,
    },
  },
};

const apiUrlMicro = '_apiUrls.micro';
export const artifact: AppConfigItem = {
  apiUrls: {
    container: '_apiUrls.container',
    micro: apiUrlMicro,
    customer: '_apiUrls.customer',
    // only used for mock integration
    mock: apiUrlMicro,
  },
  microUrl: '_microUrl',
  auth: {
    region: '_auth.region',
    userPoolId: '_auth.userPoolId',
    userPoolWebClientId: '_auth.userPoolWebClientId',
    oauth: {
      domain: '_auth.oauth.domain',
      redirectSignIn: '_auth.oauth.redirectSignIn',
      redirectSignOut: '_auth.oauth.redirectSignOut',
      responseType: '_auth.oauth.responseType',
      urlOpener,
    },
  },
};

let appConfigItem: AppConfigItem;

switch (process.env.REACT_APP_STAGE) {
  case 'localhost':
    appConfigItem = localhost;
    break;
  case 'localhost-ie11':
    appConfigItem = localhostIE11;
    break;
  case 'local':
    appConfigItem = local;
    break;
  case 'dev':
    appConfigItem = dev;
    break;
  case 'qa':
    appConfigItem = qa;
    break;
  case 'uat':
    appConfigItem = uat;
    break;
  case 'prod':
    appConfigItem = prod;
    break;
  case 'artifact':
    appConfigItem = artifact;
    break;
  default:
    appConfigItem = localhost;
    break;
}

export const appConfig: AppConfig = {
  appName: 'AM',
  appConfigDev: {
    ...dev,
  },
  ...appConfigItem,
};
