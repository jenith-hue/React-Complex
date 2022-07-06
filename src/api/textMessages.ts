import { CancelToken } from 'axios';
import { appConfig } from '../config/app-config';
import { DATE_FORMAT_API } from '../constants/constants';
import { GetMessagesDTO, SendFreeTextMessageDTO } from '../types/types';
import { formatDate } from '../utils/utils';
import { client } from './client';

export const getTextMessages = (
  customerId: string | number,
  entPartyId: string | number,
  cancelToken?: CancelToken
): Promise<GetMessagesDTO> => {
  const date = new Date();
  date.setDate(new Date().getDate() - 60);
  const startDate = formatDate(date, DATE_FORMAT_API);
  const queryStringCustomerId =
    entPartyId && entPartyId !== 'null' && entPartyId !== 'undefined'
      ? `${customerId},${entPartyId}`
      : `${customerId}`;

  return client(
    `text-message/get-customer-messages?customerId=${queryStringCustomerId}&startDate=${startDate}`,
    { method: 'GET', cancelToken },
    appConfig.apiUrls.micro
  );
};

export const sendTextMessage = (
  textMessage: SendFreeTextMessageDTO
): Promise<void> => {
  return client('text-message/send-message', {
    method: 'POST',
    body: { ...textMessage },
  });
};
