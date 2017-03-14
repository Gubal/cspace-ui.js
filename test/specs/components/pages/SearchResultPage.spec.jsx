/* global document */

import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import { IntlProvider } from 'react-intl';
import { Provider as StoreProvider } from 'react-redux';
import Immutable from 'immutable';
import chaiImmutable from 'chai-immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import merge from 'lodash/merge';
import createTestContainer from '../../../helpers/createTestContainer';
import mockRouter from '../../../helpers/mockRouter';
import RouterProvider from '../../../helpers/RouterProvider';
import ConfigProvider from '../../../../src/components/config/ConfigProvider';
import SearchResultPage, { searchName } from '../../../../src/components/pages/SearchResultPage';
import { searchKey } from '../../../../src/reducers/search';

const expect = chai.expect;

chai.use(chaiImmutable);
chai.should();

const mockStore = configureMockStore([thunk]);

const searchResult = Immutable.fromJS({
  'ns2:abstract-common-list': {
    pageNum: '0',
    pageSize: '2',
    totalItems: '39',
    'list-item': [
      {},
      {},
    ],
  },
});

const config = {
  listTypes: {
    common: {
      listNodeName: 'ns2:abstract-common-list',
      itemNodeName: 'list-item',
      messages: {
        resultCount: {
          id: 'list.common.resultCount',
          defaultMessage: `{totalItems, plural,
            =0 {No records}
            one {1 record}
            other {{startNum}–{endNum} of {totalItems} records}
          } found`,
        },
        searching: {
          id: 'list.common.searching',
          defaultMessage: 'Finding records...',
        },
      },
    },
  },
  recordTypes: {
    object: {
      messages: {
        record: {
          collectionName: {
            id: 'record.object.collectionName',
            defaultMessage: 'Objects',
          },
        },
      },
      columns: {
        default: [
          {
            name: 'objectNumber',
            messages: {
              label: {
                id: 'column.object.objectNumber',
                defaultMessage: 'Identification number',
              },
            },
            sortBy: 'collectionobjects_common:objectNumber',
            width: 200,
          },
          {
            name: 'title',
            messages: {
              label: {
                id: 'column.object.title',
                defaultMessage: 'Title',
              },
            },
            sortBy: 'collectionobjects_common:titleGroupList/0/title',
            width: 400,
          },
        ],
      },
    },
    person: {
      serviceConfig: {
        serviceType: 'authority',
      },
      vocabularies: {
        local: {
          messages: {
            collectionName: {
              id: 'vocab.person.local.collectionName',
              defaultMessage: 'Local Persons',
            },
          },
        },
      },
    },
  },
  subresources: {
    terms: {
      messages: {
        collectionName: {
          id: 'subresource.terms.collectionName',
          defaultMessage: 'Authority Terms Used by {record}',
        },
      },
    },
  },
};

const params = {
  recordType: 'object',
  // vocabulary: 'something',
};

const location = {
  action: '',
  pathname: '/search/collectionobject',
  search: '',
  query: {
    p: '1',
    size: '2',
  },
};

const searchDescriptor = {
  recordType: params.recordType,
  // vocabulary: params.vocabulary,
  searchQuery: {
    p: parseInt(location.query.p, 10) - 1,
    size: parseInt(location.query.size, 10),
  },
};

const store = mockStore({
  optionList: {
    searchResultPagePageSizes: [
      { value: '10' },
      { value: '20' },
      { value: '40' },
    ],
  },
  search: Immutable.fromJS({
    [searchName]: {
      byKey: {
        [searchKey(searchDescriptor)]: {
          result: searchResult,
        },
      },
    },
  }),
});

describe('SearchResultPage', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a div', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <SearchResultPage location={location} params={params} />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should not render a result table if the record type is unknown', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <SearchResultPage location={location} params={{ recordType: 'foo' }} />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    expect(this.container.querySelector('.cspace-ui-SearchResultTable--common')).to.equal(null);
  });

  it('should not render a result table if the vocabulary is unknown', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <SearchResultPage location={location} params={{ recordType: 'person', vocabulary: 'foo' }} />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    expect(this.container.querySelector('.cspace-ui-SearchResultTable--common')).to.equal(null);
  });

  it('should not render a result table if the subresource is unknown', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <SearchResultPage
              location={location}
              params={{ recordType: 'object', subresource: 'foo' }}
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    expect(this.container.querySelector('.cspace-ui-SearchResultTable--common')).to.equal(null);
  });

  it('should normalize query parameters', function test() {
    const testQuery = (query) => {
      let replacedLocation = null;

      const router = mockRouter({
        replace: (locationArg) => {
          replacedLocation = locationArg;
        },
      });

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              <RouterProvider router={router}>
                <SearchResultPage
                  location={{
                    action: '',
                    pathname: '',
                    search: '',
                    query,
                  }}
                  params={params}
                />
              </RouterProvider>
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, this.container);

      return (replacedLocation ? replacedLocation.query : null);
    };

    testQuery({}).should.deep.equal({ p: '1', size: '20' });
    testQuery({ p: '0' }).should.deep.equal({ p: '1', size: '20' });
    testQuery({ p: '-2' }).should.deep.equal({ p: '1', size: '20' });
    testQuery({ p: 'foo' }).should.deep.equal({ p: '1', size: '20' });
    testQuery({ p: '4foo' }).should.deep.equal({ p: '4', size: '20' });
    testQuery({ size: '-3' }).should.deep.equal({ p: '1', size: '20' });
    testQuery({ size: 'foo' }).should.deep.equal({ p: '1', size: '20' });
    testQuery({ size: '24foo' }).should.deep.equal({ p: '1', size: '24' });
    testQuery({ size: '3000' }).should.deep.equal({ p: '1', size: '2500' });

    expect(testQuery({ p: '1', size: '12' })).to.equal(null);
  });

  it('should call setPreferredPageSize with the normalized page size', function test() {
    let preferredPageSize = null;

    const setPreferredPageSize = (pageSizeArg) => {
      preferredPageSize = pageSizeArg;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <SearchResultPage
              location={location}
              params={params}
              setPreferredPageSize={setPreferredPageSize}
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    preferredPageSize.should.equal(2);

    preferredPageSize = null;

    const newLocation = merge({}, location, {
      query: {
        size: '34',
      },
    });

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <SearchResultPage
              location={newLocation}
              params={params}
              setPreferredPageSize={setPreferredPageSize}
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    preferredPageSize.should.equal(34);
  });

  it('should call search to perform a search', function test() {
    let searchedConfig = null;
    let searchedSearchName = null;
    let searchedSearchDescriptor = null;

    const search = (configArg, searchNameArg, searchDescriptorArg) => {
      searchedConfig = configArg;
      searchedSearchName = searchNameArg;
      searchedSearchDescriptor = searchDescriptorArg;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <SearchResultPage
              location={location}
              params={params}
              search={search}
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    searchedConfig.should.equal(config);
    searchedSearchName.should.equal(searchName);

    searchedSearchDescriptor.should.deep.equal({
      recordType: params.recordType,
      // vocabulary: params.vocabulary,

      // expect the page num searched to be 1 less than the page num in the URL
      searchQuery: Object.assign({}, location.query, {
        p: parseInt(location.query.p, 10) - 1,
        size: parseInt(location.query.size, 10),
      }),
    });
  });

  it('should handle table sort changes', function test() {
    let pushedLocation = null;

    const router = mockRouter({
      push: (locationArg) => {
        pushedLocation = locationArg;
      },
    });

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <RouterProvider router={router}>
              <SearchResultPage
                location={location}
                params={params}
              />
            </RouterProvider>
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    const col = this.container.querySelector('.ReactVirtualized__Table__sortableHeaderColumn');

    Simulate.click(col);

    pushedLocation.should.deep.equal({
      pathname: location.pathname,
      query: Object.assign({}, location.query, {
        sort: 'objectNumber',
      }),
    });
  });

  it('should render a related query title', function test() {
    const relLocation = merge({}, location, {
      query: {
        rel: '1234',
      },
    });

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <SearchResultPage
              location={relLocation}
              params={params}
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    this.container.querySelector('.cspace-ui-TitleBar--common').textContent.should.match(/related to/);
  });

  it('should render a vocabulary title', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <SearchResultPage
              location={location}
              params={{ recordType: 'person', vocabulary: 'local' }}
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    this.container.querySelector('.cspace-ui-TitleBar--common').textContent.should.match(/Local Persons/);
  });

  it('should render a subresource title', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <SearchResultPage
              location={location}
              params={{ recordType: 'object', csid: '1234', subresource: 'terms' }}
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    this.container.querySelector('.cspace-ui-TitleBar--common').textContent.should.match(/Authority Terms Used by/);
  });

  describe('renderHeader', function method() {
    it('should render the search result header', function test() {
      const pageContainer = document.createElement('div');

      document.body.appendChild(pageContainer);

      let searchResultPage;

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              <SearchResultPage
                location={location}
                params={params}
                ref={(ref) => { searchResultPage = ref; }}
              />
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, pageContainer);

      const headerContainer = document.createElement('div');

      document.body.appendChild(headerContainer);

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              {searchResultPage.renderHeader({ searchResult })}
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, headerContainer);

      headerContainer.querySelector('header').should.not.equal(null);

      headerContainer.querySelector('header > div > span').textContent.should
        .equal('1–2 of 39 records found');

      headerContainer.querySelector('header > div > a').textContent.should
        .equal('Revise search');

      const pageSizeChooser = headerContainer.querySelector('.cspace-ui-PageSizeChooser--common');

      pageSizeChooser.should.not.equal(null);

      const input = pageSizeChooser.querySelector('input');

      input.value.should.equal(location.query.size);

      Simulate.mouseDown(input);

      const items = pageSizeChooser.querySelectorAll('li');

      // items should match the searchResultPageSizes option values
      items[0].textContent.should.equal('10');
      items[1].textContent.should.equal('20');
      items[2].textContent.should.equal('40');
    });

    it('should render a pending message if the search result does not have a total items count', function test() {
      const pageContainer = document.createElement('div');

      document.body.appendChild(pageContainer);

      let searchResultPage;

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              <SearchResultPage
                location={location}
                params={params}
                ref={(ref) => { searchResultPage = ref; }}
              />
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, pageContainer);

      const headerContainer = document.createElement('div');

      document.body.appendChild(headerContainer);

      const noTotalItemsSearchResult = Immutable.fromJS({
        'ns2:abstract-common-list': {},
      });

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              { searchResultPage.renderHeader({ searchResult: noTotalItemsSearchResult }) }
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, headerContainer);

      headerContainer.querySelector('header').should.not.equal(null);

      headerContainer.querySelector('header > div > span').textContent.should
        .equal('Finding records...');
    });

    it('should render an error message if the search has an error', function test() {
      const searchError = Immutable.Map({
        code: 'ERROR_CODE',
      });

      const pageContainer = document.createElement('div');

      document.body.appendChild(pageContainer);

      let searchResultPage;

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              <SearchResultPage
                location={location}
                params={params}
                ref={(ref) => { searchResultPage = ref; }}
              />
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, pageContainer);

      const headerContainer = document.createElement('div');

      document.body.appendChild(headerContainer);

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              {searchResultPage.renderHeader({ searchError })}
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, headerContainer);

      headerContainer.querySelector('header').should.not.equal(null);

      headerContainer.querySelector('header').textContent.should.match(/^Error/);
    });

    it('should connect page size change events to a handler', function test() {
      let pushedLocation = null;

      const router = mockRouter({
        push: (locationArg) => {
          pushedLocation = locationArg;
        },
      });

      let preferredPageSize = null;

      const setPreferredPageSize = (pageSize) => {
        preferredPageSize = pageSize;
      };

      const pageContainer = document.createElement('div');

      document.body.appendChild(pageContainer);

      let searchResultPage;

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              <RouterProvider router={router}>
                <SearchResultPage
                  location={location}
                  params={params}
                  ref={(ref) => { searchResultPage = ref; }}
                  setPreferredPageSize={setPreferredPageSize}
                />
              </RouterProvider>
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, pageContainer);

      const headerContainer = document.createElement('div');

      document.body.appendChild(headerContainer);

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              {searchResultPage.renderHeader({ searchResult })}
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, headerContainer);

      const pageSizeChooser = headerContainer.querySelector('.cspace-ui-PageSizeChooser--common');

      pageSizeChooser.should.not.equal(null);

      const input = pageSizeChooser.querySelector('input');

      Simulate.mouseDown(input);

      const items = pageSizeChooser.querySelectorAll('li');

      Simulate.click(items[1]);

      pushedLocation.should.deep.equal({
        pathname: location.pathname,
        query: {
          p: '1',
          size: '20',
        },
      });

      preferredPageSize.should.equal(20);
    });

    it('should call setSearchPageKeyword when the edit link is clicked', function test() {
      let transferredKeyword = null;

      const setSearchPageKeyword = (keywordArg) => {
        transferredKeyword = keywordArg;
      };

      const keywordLocation = Object.assign({}, location, {
        query: {
          kw: 'foo',
        },
      });

      const router = mockRouter();
      const pageContainer = document.createElement('div');

      document.body.appendChild(pageContainer);

      let searchResultPage;

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              <SearchResultPage
                location={keywordLocation}
                params={params}
                ref={(ref) => { searchResultPage = ref; }}
                setSearchPageKeyword={setSearchPageKeyword}
              />
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, pageContainer);

      const headerContainer = document.createElement('div');

      document.body.appendChild(headerContainer);

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              <RouterProvider router={router}>
                {searchResultPage.renderHeader({ searchResult })}
              </RouterProvider>
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, headerContainer);

      const editLink = headerContainer.querySelector('header > div > a');

      editLink.should.not.equal(null);

      Simulate.click(editLink);

      transferredKeyword.should.equal('foo');
    });

    it('should call setSearchPageAdvanced when the edit link is clicked', function test() {
      let transferredCondition = null;

      const setSearchPageAdvanced = (conditionArg) => {
        transferredCondition = conditionArg;
      };

      const advancedLocation = Object.assign({}, location, {
        query: {
          as: '{"op": "eq", "path": "ns2:path/foo", "value": "bar"}',
        },
      });

      const router = mockRouter();
      const pageContainer = document.createElement('div');

      document.body.appendChild(pageContainer);

      let searchResultPage;

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              <SearchResultPage
                location={advancedLocation}
                params={params}
                ref={(ref) => { searchResultPage = ref; }}
                setSearchPageAdvanced={setSearchPageAdvanced}
              />
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, pageContainer);

      const headerContainer = document.createElement('div');

      document.body.appendChild(headerContainer);

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              <RouterProvider router={router}>
                {searchResultPage.renderHeader({ searchResult })}
              </RouterProvider>
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, headerContainer);

      const editLink = headerContainer.querySelector('header > div > a');

      editLink.should.not.equal(null);

      Simulate.click(editLink);

      transferredCondition.should.equal(Immutable.fromJS({
        op: 'eq',
        path: 'ns2:path/foo',
        value: 'bar',
      }));
    });
  });

  describe('renderFooter', function method() {
    it('should render the search result footer', function test() {
      const pageContainer = document.createElement('div');

      document.body.appendChild(pageContainer);

      let searchResultPage;

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              <SearchResultPage
                location={location}
                params={params}
                ref={(ref) => { searchResultPage = ref; }}
              />
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, pageContainer);

      const footerContainer = document.createElement('div');

      document.body.appendChild(footerContainer);

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              {searchResultPage.renderFooter({ searchResult })}
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, footerContainer);

      footerContainer.querySelector('footer').should.not.equal(null);

      const pager = footerContainer.querySelector('footer > .cspace-ui-Pager--common');

      pager.should.not.equal(null);

      const pages = pager.querySelectorAll('li');

      pages[0].textContent.should.equal('1');

      // searchResult has pageSize=2, totalItems=39, so expect 20 pages
      pages[pages.length - 1].textContent.should.equal('20');
    });

    it('should connect page select events to a handler', function test() {
      let pushedLocation = null;

      const router = mockRouter({
        push: (locationArg) => {
          pushedLocation = locationArg;
        },
      });

      const pageContainer = document.createElement('div');

      document.body.appendChild(pageContainer);

      let searchResultPage;

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              <RouterProvider router={router}>
                <SearchResultPage
                  location={location}
                  params={params}
                  ref={(ref) => { searchResultPage = ref; }}
                />
              </RouterProvider>
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, pageContainer);

      const footerContainer = document.createElement('div');

      document.body.appendChild(footerContainer);

      render(
        <IntlProvider locale="en">
          <StoreProvider store={store}>
            <ConfigProvider config={config}>
              {searchResultPage.renderFooter({ searchResult })}
            </ConfigProvider>
          </StoreProvider>
        </IntlProvider>, footerContainer);

      footerContainer.querySelector('footer').should.not.equal(null);

      const pager = footerContainer.querySelector('footer > .cspace-ui-Pager--common');

      pager.should.not.equal(null);

      const pages = pager.querySelectorAll('li');
      const lastPageButton = pages[pages.length - 1].querySelector('button');

      Simulate.click(lastPageButton);

      pushedLocation.should.deep.equal({
        pathname: location.pathname,
        query: {
          p: '20',
          size: location.query.size,
        },
      });
    });
  });
});
