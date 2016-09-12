/* global document, window */

import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';
import script from 'scriptjs';
import warning from 'warning';

import reducer from './reducers';
import { configureCSpace } from './actions';
import App from './components/App';

import collectionobjectsRecordPlugin from './plugins/record/collectionobjects';

function loadPolyfills(locale, callback) {
  if (window.Intl) {
    window.setTimeout(callback, 0);
  } else {
    const url = `https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.${locale}`;

    script(url, callback);
  }
}

const defaultRecordConfig = {
  collectionobjects: collectionobjectsRecordPlugin,
};

const defaultConfig = {
  basename: '',
  container: 'main',
  cspaceUrl: '',
  index: undefined,
  locale: 'en',
  messages: undefined,
  prettyUrls: false,
  records: defaultRecordConfig,
};

export function init(uiConfig) {
  const config = Object.assign({}, defaultConfig, uiConfig);

  const {
    basename,
    container,
    cspaceUrl,
    index,
    locale,
    messages,
    prettyUrls,
    records,
  } = config;

  const mountNode = document.querySelector(container);

  warning(mountNode,
    `No container element was found using the selector '${container}'. ` +
    'The CollectionSpace UI will not be rendered.');

  if (mountNode) {
    warning(mountNode !== document.body,
      `The container element for the CollectionSpace UI found using the selector '${container}' ` +
      'is the document body. This may cause problems, and is not supported.');

    const store = createStore(reducer, applyMiddleware(thunk));

    const baseHistory = prettyUrls ? useRouterHistory(createHistory)({ basename }) : hashHistory;
    const history = syncHistoryWithStore(baseHistory, store);

    store.dispatch(configureCSpace({
      url: cspaceUrl,
    }));

    const props = {
      history,
      index,
      locale,
      messages,
      records,
      store,
    };

    loadPolyfills(locale, () => {
      render(<App {...props} />, mountNode);
    });
  }
}

export default {
  init,
};
