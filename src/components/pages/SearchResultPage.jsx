import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { locationShape, routerShape } from 'react-router/lib/PropTypes';
import classNames from 'classnames';
import TitleBar from '../sections/TitleBar';
import PageSizeChooser from '../search/PageSizeChooser';
import Pager from '../search/Pager';
import SearchResultTableContainer from '../../containers/search/SearchResultTableContainer';
import styles from '../../../styles/cspace-ui/SearchResultPage.css';
import headerStyles from '../../../styles/cspace-ui/Header.css';

const propTypes = {
  location: locationShape,
  params: PropTypes.objectOf(PropTypes.string),
  preferredPageSize: PropTypes.number,
  search: PropTypes.func,
  setPreferredPageSize: PropTypes.func,
};

const contextTypes = {
  config: PropTypes.object.isRequired,
  router: routerShape,
};

const messages = defineMessages({
  keywordParams: {
    id: 'searchResultPage.keywordParams',
    defaultMessage: '"{keywords}"',
  },
  resultCount: {
    id: 'searchResultPage.resultCount',
    defaultMessage: `{totalItems, plural,
      =0 {No records}
      one {1 record}
      other {{startNum}–{endNum} of {totalItems} records}
    } found`,
  },
  searching: {
    id: 'searchResultPage.searching',
    defaultMessage: 'Searching...',
  },
});

export default class SearchResultPage extends Component {
  constructor() {
    super();

    this.renderFooter = this.renderFooter.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  componentDidMount() {
    if (!this.normalizeQuery()) {
      this.search();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.params.recordType !== prevProps.params.recordType ||
      this.props.params.vocabulary !== prevProps.params.vocabulary ||
      this.props.location.query !== prevProps.location.query
    ) {
      if (!this.normalizeQuery()) {
        this.search();
      }
    }
  }

  getSearchDescriptor() {
    const {
      location,
      params,
    } = this.props;

    const {
      recordType,
      vocabulary,
    } = params;

    const searchQuery = Object.assign({}, location.query, {
      p: location.query.p - 1,
    });

    return {
      recordType,
      vocabulary,
      searchQuery,
    };
  }

  normalizeQuery() {
    const {
      location,
      preferredPageSize,
    } = this.props;

    const {
      query,
    } = location;

    const {
      router,
    } = this.context;

    if (router) {
      const normalizedQueryParams = {};

      const pageSize = parseInt(query.size, 10);

      if (isNaN(pageSize) || pageSize < 1) {
        // FIXME: Make default page size configurable
        const defaultPageSize = 20;
        const normalizedPageSize = preferredPageSize || defaultPageSize;

        normalizedQueryParams.size = normalizedPageSize.toString();
      } else if (pageSize > 2500) {
        // Services layer max is 2500
        normalizedQueryParams.size = '2500';
      } else if (pageSize.toString() !== query.size) {
        normalizedQueryParams.size = pageSize.toString();
      }

      const pageNum = parseInt(query.p, 10);

      if (isNaN(pageNum) || pageNum < 1) {
        normalizedQueryParams.p = '1';
      } else if (pageNum.toString() !== query.p) {
        normalizedQueryParams.p = pageNum.toString();
      }

      if (Object.keys(normalizedQueryParams).length > 0) {
        const newQuery = Object.assign({}, query, normalizedQueryParams);

        router.replace({
          pathname: location.pathname,
          query: newQuery,
        });

        return true;
      }
    }

    return false;
  }

  handlePageSelect(pageNum) {
    const {
      location,
    } = this.props;

    const {
      router,
    } = this.context;

    if (router) {
      router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, {
          p: (pageNum + 1).toString(),
        }),
      });
    }
  }

  handlePageSizeChange(pageSize) {
    const {
      location,
      setPreferredPageSize,
    } = this.props;

    const {
      router,
    } = this.context;

    if (setPreferredPageSize) {
      setPreferredPageSize(pageSize);
    }

    if (router) {
      router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, {
          p: '1',
          size: pageSize.toString(),
        }),
      });
    }
  }

  handleSortChange(sort) {
    const {
      location,
    } = this.props;

    const {
      router,
    } = this.context;

    if (router) {
      router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, {
          sort,
        }),
      });
    }
  }

  search() {
    const {
      search,
    } = this.props;

    const {
      config,
    } = this.context;

    if (search) {
      search(config, this.getSearchDescriptor());
    }
  }

  renderHeader({ isSearchPending, searchError, searchResult }) {
    if (searchError) {
      // FIXME: Make a proper error page
      const errorMessage = searchError.get('code') || '';

      return (
        <header className={headerStyles.common}>Error: {errorMessage}</header>
      );
    }

    const {
      location,
    } = this.props;

    let message = null;
    let pageSizeChooser = null;

    const pageSizeQueryParam = parseInt(location.query.size, 10);

    pageSizeChooser = (
      <PageSizeChooser
        pageSize={pageSizeQueryParam}
        onPageSizeChange={this.handlePageSizeChange}
      />
    );

    if (isSearchPending) {
      message = (
        <FormattedMessage {...messages.searching} />
      );
    } else if (searchResult) {
      const list = searchResult.get('ns2:abstract-common-list');

      const totalItems = parseInt(list.get('totalItems'), 10);
      const pageNum = parseInt(list.get('pageNum'), 10);
      const pageSize = parseInt(list.get('pageSize'), 10);

      const startNum = (pageNum * pageSize) + 1;
      const endNum = Math.min((pageNum * pageSize) + pageSize, totalItems);

      message = (
        <FormattedMessage
          {...messages.resultCount}
          values={{
            totalItems,
            startNum,
            endNum,
          }}
        />
      );
    }

    const classes = classNames({
      [headerStyles.common]: true,
      [headerStyles.pending]: isSearchPending,
    });

    return (
      <header className={classes}>
        {message}
        {pageSizeChooser}
      </header>
    );
  }

  renderFooter({ searchResult }) {
    if (searchResult) {
      const list = searchResult.get('ns2:abstract-common-list');

      const totalItems = parseInt(list.get('totalItems'), 10);
      const pageNum = parseInt(list.get('pageNum'), 10);
      const pageSize = parseInt(list.get('pageSize'), 10);

      if (totalItems > 0) {
        return (
          <footer>
            <Pager
              currentPage={pageNum}
              lastPage={Math.ceil(totalItems / pageSize) - 1}
              onPageSelect={this.handlePageSelect}
            />
          </footer>
        );
      }
    }

    return null;
  }

  render() {
    const {
      config,
    } = this.context;

    const searchDescriptor = this.getSearchDescriptor();
    const recordTypeConfig = config.recordTypes[searchDescriptor.recordType];

    if (!recordTypeConfig) {
      // FIXME: Make a proper error page
      return (
        <div className={styles.common}>
          <TitleBar title="Error: Unknown record type" />
        </div>
      );
    }

    const keywords = searchDescriptor.searchQuery.kw;

    const keywordParamsTitle = keywords
      ? <FormattedMessage {...messages.keywordParams} values={{ keywords }} />
      : null;

    const title = (
      <span>
        <FormattedMessage {...recordTypeConfig.messages.resultsTitle} />
        {keywords ? ': ' : null}
        {keywordParamsTitle}
      </span>
    );

    return (
      <div className={styles.common}>
        <TitleBar title={title} />
        <SearchResultTableContainer
          searchDescriptor={searchDescriptor}
          renderHeader={this.renderHeader}
          renderFooter={this.renderFooter}
          onSortChange={this.handleSortChange}
        />
      </div>
    );
  }
}

SearchResultPage.propTypes = propTypes;
SearchResultPage.contextTypes = contextTypes;
