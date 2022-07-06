import React from 'react';
import useKeyboardShortcut from '../../common/userKeyboardShortcut/useKeyboardShortcut';

export const SignOut = ({ logout }: { logout: () => void }) => {
  useKeyboardShortcut(['Control', 'q'], () => logout && logout());

  return <></>;
};
