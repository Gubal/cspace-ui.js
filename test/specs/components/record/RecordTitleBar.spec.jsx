/* global window, document */

import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import Immutable from 'immutable';

import createTestContainer from '../../../helpers/createTestContainer';

import RecordPluginProvider from '../../../../src/components/record/RecordPluginProvider';
import RecordTitleBar from '../../../../src/components/record/RecordTitleBar';

const expect = chai.expect;

chai.should();

const expectedClassName = 'cspace-ui-RecordTitleBar--common';

const recordPlugins = {
  object: {
    title: () => 'Title',
    messageDescriptors: {
      recordNameTitle: {
        id: 'recordNameTitle',
        defaultMessage: 'Object',
      },
    },
  },
};

const data = Immutable.Map();

// Make sure there's enough on the page to scroll, so that docking can be tested.
document.body.style.paddingBottom = '1200px';

describe('RecordTitleBar', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a header', function test() {
    render(
      <IntlProvider locale="en">
        <RecordPluginProvider recordPlugins={recordPlugins}>
          <RecordTitleBar data={data} recordType="object" />
        </RecordPluginProvider>
      </IntlProvider>, this.container);

    this.container.firstElementChild.nodeName.should.equal('HEADER');
  });

  it('should render with correct class', function test() {
    render(
      <IntlProvider locale="en">
        <RecordPluginProvider recordPlugins={recordPlugins}>
          <RecordTitleBar data={data} recordType="object" />
        </RecordPluginProvider>
      </IntlProvider>, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should render nothing if a plugin is not found for the record type', function test() {
    render(
      <IntlProvider locale="en">
        <RecordPluginProvider recordPlugins={recordPlugins}>
          <RecordTitleBar data={data} recordType="foo" />
        </RecordPluginProvider>
      </IntlProvider>, this.container);

    expect(this.container.firstElementChild).to.equal(null);
  });

  it('should dock and undock when scrolled', function test() {
    render(
      <IntlProvider locale="en">
        <RecordPluginProvider recordPlugins={recordPlugins}>
          <RecordTitleBar data={data} recordType="object" />
        </RecordPluginProvider>
      </IntlProvider>, this.container);

    const container = this.container.firstElementChild.querySelector('div');
    const initialRect = container.getBoundingClientRect();

    initialRect.top.should.be.above(0);

    window.scrollTo(0, initialRect.top + initialRect.height + 10);

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 100);
    })
    .then(() => {
      const scrolledRect = container.getBoundingClientRect();

      scrolledRect.top.should.equal(0);

      window.scrollTo(0, 0);

      return new Promise((resolve) => {
        window.setTimeout(() => {
          resolve();
        }, 100);
      });
    })
    .then(() => {
      const scrolledRect = container.getBoundingClientRect();

      scrolledRect.top.should.equal(initialRect.top);
    });
  });

  // This test must be the last, since it replaces methods on the window object.

  it('should add and remove window scroll listeners when mounted and unmounted', function test() {
    let addEventListenerCalled = null;

    window.addEventListener = (eventName) => {
      addEventListenerCalled = eventName;
    };

    let removeEventListenerCalled = null;

    window.removeEventListener = (eventName) => {
      removeEventListenerCalled = eventName;
    };

    render(
      <IntlProvider locale="en">
        <RecordPluginProvider recordPlugins={recordPlugins}>
          <RecordTitleBar data={data} recordType="object" />
        </RecordPluginProvider>
      </IntlProvider>, this.container);

    ReactDOM.unmountComponentAtNode(this.container);

    addEventListenerCalled.should.equal('scroll');
    removeEventListenerCalled.should.equal('scroll');
  });
});
