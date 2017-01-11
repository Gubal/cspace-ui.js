import React, { PropTypes } from 'react';
import RecordButtonBarContainer from '../../containers/record/RecordButtonBarContainer';
import RecordEditorContainer from '../../containers/record/RecordEditorContainer';
import RecordTitleBarContainer from '../../containers/record/RecordTitleBarContainer';
import styles from '../../../styles/cspace-ui/RecordPage.css';

export default function RecordPage(props, context) {
  let csid = props.params.csid;
  const recordType = props.params.recordType;

  const {
    config,
  } = context;

  const recordTypeConfig = config.recordTypes[recordType];

  if (csid === null || typeof csid === 'undefined') {
    csid = '';
  }

  return (
    <div className={styles.common}>
      <RecordTitleBarContainer csid={csid} recordType={recordType} />
      <RecordButtonBarContainer csid={csid} recordTypeConfig={recordTypeConfig} />
      <RecordEditorContainer csid={csid} recordType={recordType} />
    </div>
  );
}

RecordPage.propTypes = {
  params: PropTypes.shape({
    csid: PropTypes.string,
    recordType: PropTypes.string.isRequired,
  }).isRequired,
};

RecordPage.contextTypes = {
  config: PropTypes.object.isRequired,
};
