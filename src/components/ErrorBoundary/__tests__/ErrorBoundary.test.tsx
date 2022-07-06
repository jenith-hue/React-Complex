import React from 'react';
import { render, RenderResult } from '@testing-library/react';

import { ErrorBoundary } from '../ErrorBoundary';

describe('ErrorBoundary', () => {
  it('should render without crashing', async () => {
    const ComponentWhichThrows = () => {
      const sayHello = () => {
        throw Error('Something bad happened');
      };

      // eslint-disable-next-line
      return <div>{sayHello()}</div>;
    };

    const { queryByText }: RenderResult = render(
      <ErrorBoundary>
        <ComponentWhichThrows />
      </ErrorBoundary>
    );

    expect(
      queryByText('The application is temporarily unavailable')
    ).toBeInTheDocument();
  });
});
