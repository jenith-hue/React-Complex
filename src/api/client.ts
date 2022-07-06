import axios, { CancelTokenSource } from 'axios';
import { Auth } from '@aws-amplify/auth';

import { ApiUrls, appConfig } from '../config/app-config';
import { getSelectedStore } from '../utils/utils';

async function getJWToken() {
  try {
    const currentSession = await Auth.currentSession();

    return currentSession.getIdToken().getJwtToken();
  } catch (error) {
    throw new Error(`An error occurred: ${error}.`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getAccessToken() {
  try {
    const currentSession = await Auth.currentSession();

    return currentSession.getAccessToken().getJwtToken();
  } catch (error) {
    throw new Error(`An error occurred: ${error}.`);
  }
}

export async function client(
  endpoint: string,
  { requestType, body, ...customConfig }: any = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  apiUrl: ApiUrls[keyof ApiUrls] = appConfig.apiUrls.micro,
  // access token is required for accessing AM APIs, but not for general ones (e.g. user APIs)
  isAccessTokenRequired = true
) {
  const jwtToken = await getJWToken();

  const headers: any = {
    'Content-Type': 'application/json; charset=UTF-8',
  };

  if (isAccessTokenRequired) {
    // From devtools console you can window.localStorage.setItem('ac', 'replace-me-with-access-token')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    let accessToken;
    // this covers both local and localhost
    if (window.location.host.includes('local')) {
      accessToken = window.localStorage.getItem('ac') || '';
    } else {
      accessToken = await getAccessToken();
    }

    headers.AccessToken = accessToken;
  }
  if (jwtToken) {
    headers.Authorization = `Bearer ${jwtToken}`;
  }

  const storeNumber = getSelectedStore();
  if (storeNumber) {
    headers.storenumber = storeNumber;
  }

  const requestConfig: any = {
    method: requestType,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    requestConfig.data = JSON.stringify(body);
  }

  return axios(`${apiUrl}/${endpoint}`, requestConfig).then(
    (response) => response.data
  );
}
export const getCancelTokenSource = (): CancelTokenSource =>
  axios.CancelToken.source();
