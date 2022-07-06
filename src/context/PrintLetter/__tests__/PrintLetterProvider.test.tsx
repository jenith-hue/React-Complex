import React from 'react';
import renderer from 'react-test-renderer';
import * as api from '../../../api/letter';
import { PrintLetterProvider } from '../PrintLetterProvider';

describe('PrintLetterProvider', () => {
  describe('PrintLetterProvider RFC', () => {
    it('renders correctly, without fetching letters', async () => {
      const getLettersMock = jest.fn();

      jest.spyOn(api, 'getLetters').mockImplementationOnce(getLettersMock);
      renderer.act(() => {
        renderer.create(
          <PrintLetterProvider>
            <div data-testid="test"></div>
          </PrintLetterProvider>
        );
      });

      // act is not enough, because of the promise from fetchPrintLetter
      await Promise.resolve();

      expect(getLettersMock).toHaveBeenCalledTimes(0);
    });
  });
});
