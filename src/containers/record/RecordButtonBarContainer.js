import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import RecordButtonBar from '../../components/record/RecordButtonBar';
import { revertRecord, saveRecord } from '../../actions/record';

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    csid,
    recordTypeConfig,
    vocabularyConfig,
    router,
  } = ownProps;

  return {
    clone: () => {
      const vocabPath = vocabularyConfig
        ? `/${vocabularyConfig.name}`
        : '';

      router.push({
        pathname: `/record/${recordTypeConfig.name}${vocabPath}`,
        query: {
          clone: csid,
        },
      });
    },
    revert: () => {
      dispatch(revertRecord(csid));
    },
    save: () => {
      dispatch(saveRecord(recordTypeConfig, vocabularyConfig, csid, router.replace));
    },
  };
};

export const ConnectedRecordButtonBar = connect(
  null,
  mapDispatchToProps
)(RecordButtonBar);

export default withRouter(ConnectedRecordButtonBar);
