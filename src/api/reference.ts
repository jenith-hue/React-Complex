import { ReferenceKeys, ReferenceResponse } from '../types/types';
import { client } from './client';

export const getReference = (
  referenceKey: ReferenceKeys[],
  cacheKey: string
): Promise<ReferenceResponse[]> => {
  return client(`references`, {
    method: 'POST',
    body: { references: referenceKey, cacheKey },
  });
};
