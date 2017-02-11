import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import RecordButtonBar from '../../components/record/RecordButtonBar';
import { saveRecord } from '../../actions/record';

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    csid,
    recordTypeConfig,
    vocabularyConfig,
    router,
  } = ownProps;

  return {
    onSaveButtonClick: () => {
      dispatch(saveRecord(recordTypeConfig, vocabularyConfig, csid, router.replace));
    },
  };
};

export const ConnectedRecordButtonBar = connect(
  null,
  mapDispatchToProps
)(RecordButtonBar);

export default withRouter(ConnectedRecordButtonBar);
