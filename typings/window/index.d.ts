import { History } from 'history';

declare global {
  interface Window {
    renderAccountManagement(containerId: string, history: History): void;

    unmountAccountManagement(containerId: string): void;

    isRenderedByContainer: boolean;
  }
}
