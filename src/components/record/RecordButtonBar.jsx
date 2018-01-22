import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import CloneButton from './CloneButton';
import DeleteButton from './DeleteButton';
import DeprecateButton from './DeprecateButton';
import SaveButton from './SaveButton';
import RevertButton from './RevertButton';
import UndeprecateButton from './UndeprecateButton';
import styles from '../../../styles/cspace-ui/ButtonBar.css';

const propTypes = {
  isCloneable: PropTypes.bool,
  isDeletable: PropTypes.bool,
  isDeprecated: PropTypes.bool,
  isModified: PropTypes.bool,
  isReadPending: PropTypes.bool,
  isSavePending: PropTypes.bool,
  readOnly: PropTypes.bool,
  showDeprecationButtons: PropTypes.bool,
  validationErrors: PropTypes.instanceOf(Immutable.Map),
  onUndeprecateButtonClick: PropTypes.func,
  onCloneButtonClick: PropTypes.func,
  onDeprecateButtonClick: PropTypes.func,
  onDeleteButtonClick: PropTypes.func,
  onRevertButtonClick: PropTypes.func,
  onSaveButtonClick: PropTypes.func,
  onSaveButtonErrorBadgeClick: PropTypes.func,
};

export default function RecordButtonBar(props) {
  const {
    isCloneable,
    isDeletable,
    isDeprecated,
    isModified,
    isReadPending,
    isSavePending,
    readOnly,
    showDeprecationButtons,
    validationErrors,
    onUndeprecateButtonClick,
    onCloneButtonClick,
    onDeprecateButtonClick,
    onDeleteButtonClick,
    onRevertButtonClick,
    onSaveButtonClick,
    onSaveButtonErrorBadgeClick,
  } = props;

  const className = isReadPending ? styles.loading : styles.common;

  return (
    <div className={className}>
      <SaveButton
        isModified={isModified}
        isSavePending={isSavePending}
        readOnly={readOnly}
        validationErrors={validationErrors}
        onClick={onSaveButtonClick}
        onErrorBadgeClick={onSaveButtonErrorBadgeClick}
      />
      <CloneButton
        isCloneable={isCloneable}
        isModified={isModified}
        isSavePending={isSavePending}
        onClick={onCloneButtonClick}
      />
      <RevertButton
        isModified={isModified}
        isSavePending={isSavePending}
        readOnly={readOnly}
        onClick={onRevertButtonClick}
      />
      <DeprecateButton
        isDeprecated={isDeprecated}
        isModified={isModified}
        isSavePending={isSavePending}
        readOnly={readOnly}
        showDeprecationButtons={showDeprecationButtons}
        onClick={onDeprecateButtonClick}
      />
      <UndeprecateButton
        isDeprecated={isDeprecated}
        isModified={isModified}
        isSavePending={isSavePending}
        readOnly={readOnly}
        showDeprecationButtons={showDeprecationButtons}
        onClick={onUndeprecateButtonClick}
      />
      <DeleteButton
        isDeletable={isDeletable}
        isSavePending={isSavePending}
        onClick={onDeleteButtonClick}
      />
    </div>
  );
}

RecordButtonBar.propTypes = propTypes;
