import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import { components as inputComponents } from 'cspace-input';
import styles from '../../../styles/cspace-ui/DeleteButton.css';

const { Button } = inputComponents;

const messages = defineMessages({
  label: {
    id: 'deleteButton.label',
    description: 'Label of the delete button.',
    defaultMessage: 'Delete',
  },
});

const propTypes = {
  csid: PropTypes.string,
  isSavePending: PropTypes.bool,
  workflowState: PropTypes.string,
  onClick: PropTypes.func,
};

export default function DeleteButton(props) {
  const {
    csid,
    isSavePending,
    workflowState,
    onClick,
  } = props;

  if (!csid || workflowState === 'locked') {
    return null;
  }

  return (
    <Button
      className={styles.common}
      disabled={isSavePending}
      icon
      name="delete"
      onClick={onClick}
    >
      <FormattedMessage {...messages.label} />
    </Button>
  );
}

DeleteButton.propTypes = propTypes;
