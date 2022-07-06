import { urlOpener } from './app-config';

describe('app-config', () => {
  describe('urlOpener', () => {
    const url = 'http://example.com';
    it('should open URL', () => {
      window.open = jest.fn();
      urlOpener(url);
      expect(window.open).toHaveBeenCalledWith('http://example.com', '_self');
    });
  });
});
