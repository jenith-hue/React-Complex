import { PrintLetterRequestPayload, PrintLetterResponse } from '../types/types';
import { client } from './client';

export const getLetters = (
  payload: PrintLetterRequestPayload
): Promise<PrintLetterResponse> =>
  client('customer/letter', { method: 'POST', body: { ...payload } });
