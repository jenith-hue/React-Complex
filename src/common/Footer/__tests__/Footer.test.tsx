import React from 'react';
import { render } from '@testing-library/react';

import { Footer, footerTestId } from '../Footer';

describe('Footer', () => {
  it('should render without errors', () => {
    const { getByTestId } = render(<Footer />);

    const footer = getByTestId(footerTestId);

    expect(footer).toBeInTheDocument();
  });
});
