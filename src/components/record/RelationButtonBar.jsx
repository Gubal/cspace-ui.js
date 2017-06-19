import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import CancelButton from './CancelButton';
import CloseButton from './CloseButton';
import UnrelateButton from './UnrelateButton';
import styles from '../../../styles/cspace-ui/ButtonBar.css';

const messages = defineMessages({
  open: {
    id: 'relationButtonBar.open',
    description: 'Label of the open related record link.',
    defaultMessage: 'Open',
  },
});

const propTypes = {
  // TODO: These uses aren't properly detected. Try updating eslint-plugin-react.
  /* eslint-disable react/no-unused-prop-types */
  object: PropTypes.shape({
    csid: PropTypes.string,
    recordType: PropTypes.string,
  }),
  /* eslint-enable react/no-unused-prop-types */
  onCancelButtonClick: PropTypes.func,
  onCloseButtonClick: PropTypes.func,
  onUnrelateButtonClick: PropTypes.func,
};

export default function RelationButtonBar(props) {
  const {
    object,
    onCancelButtonClick,
    onCloseButtonClick,
    onUnrelateButtonClick,
  } = props;

  const objectCsid = object ? object.csid : undefined;

  const cancelButton = objectCsid ? null : <CancelButton onClick={onCancelButtonClick} />;
  const closeButton = objectCsid ? <CloseButton onClick={onCloseButtonClick} /> : null;
  const unrelateButton = objectCsid ? <UnrelateButton onClick={onUnrelateButtonClick} /> : null;

  let openLink;

  if (objectCsid) {
    openLink = (
      <Link to={`/record/${object.recordType}/${object.csid}`}>
        <FormattedMessage {...messages.open} />
      </Link>
    );
  }

  return (
    <div className={styles.common}>
      {openLink}
      {cancelButton}
      {unrelateButton}
      {closeButton}
    </div>
  );
}

RelationButtonBar.propTypes = propTypes;
