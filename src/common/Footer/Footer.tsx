import React, { PropsWithChildren } from 'react';

export const footerTestId = 'footerTestId';

export const Footer = ({
  children,
}: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <footer data-testid={footerTestId}>
      <div>{children}</div>
    </footer>
  );
};
