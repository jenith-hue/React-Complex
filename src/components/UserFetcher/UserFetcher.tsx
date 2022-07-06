import { useEffect } from 'react';

import { useUserThunksContext } from '../../context/user/user-contexts';

export const UserFetcher = () => {
  const { getCurrentUser } = useUserThunksContext();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return null;
};
