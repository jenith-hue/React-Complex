import { CancelToken } from 'axios';
import { client } from './client';

export const getDocument = (
  documentId: string,
  typeId?: string,
  cancelToken?: CancelToken
) => {
  return client(`documents/${documentId}?type=${typeId}`, {
    method: 'GET',
    cancelToken,
  });
};
