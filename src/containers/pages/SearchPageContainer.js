import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import SearchPage from '../../components/pages/SearchPage';

import {
  setSearchPageAdvanced,
  setSearchPageKeyword,
  initiateSearch,
} from '../../actions/searchPage';

import {
  setSearchPageRecordType,
  setSearchPageVocabulary,
} from '../../actions/prefs';

import {
  getSearchPageAdvanced,
  getSearchPageKeyword,
  getSearchPageRecordType,
  getSearchPageVocabulary,
} from '../../reducers';

const mapStateToProps = (state) => {
  const recordType = getSearchPageRecordType(state);

  return {
    keywordValue: getSearchPageKeyword(state),
    recordTypeValue: recordType,
    vocabularyValue: getSearchPageVocabulary(state, recordType),
    advancedSearchCondition: getSearchPageAdvanced(state),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAdvancedSearchConditionCommit: (value) => {
    dispatch(setSearchPageAdvanced(value));
  },
  onKeywordCommit: (value) => {
    dispatch(setSearchPageKeyword(value));
  },
  onRecordTypeCommit: (value) => {
    dispatch(setSearchPageRecordType(value));
  },
  onVocabularyCommit: (value) => {
    dispatch(setSearchPageVocabulary(value));
  },
  onSearch: () => {
    dispatch(initiateSearch(ownProps.router.push));
  },
});

export const ConnectedSearchPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);

export default withRouter(ConnectedSearchPage);
