import { CancelToken } from 'axios';
import { appConfig } from '../config/app-config';
import { FilterPayload } from '../domain/PastDueList/Filter';
import { TextTemplate } from '../domain/TextConversation/TextTemplate';
import { LogWorkedHistoryPayload } from '../domain/WorkedHistory/WorkedHistory';
import {
  ActivityPayload,
  TakeCommitmentInput,
  AgreementInfoResponse,
  AssignRoutePayload,
  CustomerDetailsResponse,
  FieldSheetResponse,
  GetCustomerFieldSheetsPayload,
  StoreRouteResponse,
  WorkedHistoryResponse,
  CommunicationsDetailsResponse,
  CustomerPhoneInstructionPayload,
} from '../types/types';
import { client } from './client';

export const getPastDueList = async (
  payload: FilterPayload,
  offset: number,
  limit: number,
  cancelToken?: CancelToken
) =>
  client(`past-due-list?limit=${limit}&offset=${offset}`, {
    method: 'POST',
    body: payload,
    cancelToken,
  });

export const getCustomerDetails = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  customerId: string,
  cancelToken?: CancelToken
): Promise<CustomerDetailsResponse> => {
  return client(`customers/${customerId}/details`, {
    method: 'GET',
    cancelToken,
  });
};

export const getWorkedHistory = (
  storeNumber: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  customerId: string,
  cancelToken: CancelToken
): Promise<WorkedHistoryResponse> =>
  client(`stores/${storeNumber}/customers/${customerId}/work-history`, {
    method: 'GET',
    cancelToken,
  });

export const getStoreRoutes = (
  storeNumber: string,
  cancelToken?: CancelToken
): Promise<StoreRouteResponse> =>
  client(`store-routes/${storeNumber}`, {
    method: 'GET',
    cancelToken,
  });

export const logWorkedHistory = (
  payload: Partial<LogWorkedHistoryPayload>
): Promise<WorkedHistoryResponse> =>
  client('customer/logactivity', {
    method: 'POST',
    body: payload,
  });

export const getAgreementInfo = (
  customerId: string,
  cancelToken?: CancelToken
): Promise<AgreementInfoResponse> =>
  client(`customer/get-agr-pastdue/${customerId}`, {
    method: 'GET',
    cancelToken,
  });

export const getTextTemplates = (): Promise<TextTemplate[]> =>
  client('/text-message/get-text-templates', { method: 'GET' });

export const logActivity = (payload: ActivityPayload) =>
  client('/customer/logactivity', { method: 'POST', body: { ...payload } });

export const assignRoute = (payload: AssignRoutePayload) =>
  client('/customer/assignroute', { method: 'POST', body: { ...payload } });

export const getFieldSheets = (
  payload: GetCustomerFieldSheetsPayload
): Promise<FieldSheetResponse> =>
  client('customers/field-sheets', { method: 'POST', body: { ...payload } });

export const takeCommitment = (payload: TakeCommitmentInput) =>
  client('/customer/take-commitment', { method: 'POST', body: { ...payload } });

export const getCommunicationDetails = (
  customerId: string
): Promise<CommunicationsDetailsResponse> =>
  client(`/customers/${customerId}/communication-details`, { method: 'GET' });

export const addressValidator = (payload: any) =>
  client(
    'customer/address/validate',
    {
      method: 'POST',
      body: {
        ...payload,
      },
    },
    appConfig.apiUrls.customer
  );

export const updatePhoneInstructions = (
  payload: CustomerPhoneInstructionPayload
) => client('/customers', { method: 'PUT', body: { ...payload } });

export const updateCustomer = (payload: any) =>
  client('customers', {
    method: 'PUT',
    body: {
      ...payload,
    },
  });

export const getCustomerStatesList = () =>
  client('references/entity?referenceCode=state_province', {
    method: 'GET',
  });
