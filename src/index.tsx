import { createBrowserHistory, History } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app/App';

import './index.css';

if (!HTMLElement.prototype.scrollTo) {
  HTMLElement.prototype.scrollTo = function (options: any) {
    this.scrollTop = options?.top || 0;
    this.scrollLeft = options?.left || 0;
  };
}

window.renderAccountManagement = (containerId: string, history: History) => {
  const elem = document.getElementById(containerId);

  if (elem) {
    ReactDOM.render(<App history={history} />, elem);
  }
};

window.unmountAccountManagement = (containerId: string) => {
  const elem = document.getElementById(containerId);

  if (elem) {
    ReactDOM.unmountComponentAtNode(elem);
  }
};

if (!window.isRenderedByContainer) {
  import('./bootstrap').then(() => {
    const defaultHistory = createBrowserHistory({
      basename: process.env.PUBLIC_URL,
    });
    window.renderAccountManagement('root', defaultHistory);
  });
}
