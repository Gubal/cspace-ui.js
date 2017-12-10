import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router';
import Immutable from 'immutable';
import RecordButtonBar from './RecordButtonBar';
import RecordHeader from './RecordHeader';
import ConfirmRecordNavigationModal from './ConfirmRecordNavigationModal';
import ConfirmRecordDeleteModal from './ConfirmRecordDeleteModal';
import LockRecordModal from './LockRecordModal';
import RecordFormContainer from '../../containers/record/RecordFormContainer';
import { isLocked } from '../../helpers/recordDataHelpers';
import { canCreate, canDelete, canUpdate, canSoftDelete } from '../../helpers/permissionHelpers';
import styles from '../../../styles/cspace-ui/RecordEditor.css';

const propTypes = {
  config: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  vocabulary: PropTypes.string,
  csid: PropTypes.string,
  cloneCsid: PropTypes.string,
  data: PropTypes.instanceOf(Immutable.Map),
  dockTop: PropTypes.number,
  formName: PropTypes.string,
  perms: PropTypes.instanceOf(Immutable.Map),
  validationErrors: PropTypes.instanceOf(Immutable.Map),
  isModified: PropTypes.bool,
  isReadPending: PropTypes.bool,
  isSavePending: PropTypes.bool,
  isHardDelete: PropTypes.bool,
  // The workflow state of the related subject (aka primary) record when we're in a secondary tab.
  relatedSubjectWorkflowState: PropTypes.string,
  openModalName: PropTypes.string,
  createNewRecord: PropTypes.func,
  readRecord: PropTypes.func,
  onRecordCreated: PropTypes.func,
  onSaveCancelled: PropTypes.func,
  closeModal: PropTypes.func,
  openModal: PropTypes.func,
  deleteRecord: PropTypes.func,
  save: PropTypes.func,
  saveWithTransition: PropTypes.func,
  revert: PropTypes.func,
  clone: PropTypes.func,
  transitionRecord: PropTypes.func,
  removeValidationNotification: PropTypes.func,
  setForm: PropTypes.func,
  validateRecordData: PropTypes.func,
  onRecordDeleted: PropTypes.func,
  onRecordTransitioned: PropTypes.func,
};

const defaultProps = {
  data: Immutable.Map(),
};

export default class RecordEditor extends Component {
  constructor() {
    super();

    // Confirm delete modal button handlers.

    this.handleConfirmDeleteButtonClick = this.handleConfirmDeleteButtonClick.bind(this);

    // Confirm navigation modal button handlers.

    this.handleConfirmNavigationSaveButtonClick =
      this.handleConfirmNavigationSaveButtonClick.bind(this);

    this.handleConfirmNavigationRevertButtonClick =
      this.handleConfirmNavigationRevertButtonClick.bind(this);

    // Lock modal button handlers.

    this.handleSaveOnlyButtonClick = this.handleSaveOnlyButtonClick.bind(this);
    this.handleSaveLockButtonClick = this.handleSaveLockButtonClick.bind(this);

    // Shared modal handlers.

    this.handleModalCancelButtonClick = this.handleModalCancelButtonClick.bind(this);

    // Button bar handlers.

    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.handleSaveButtonErrorBadgeClick = this.handleSaveButtonErrorBadgeClick.bind(this);
    this.handleRevertButtonClick = this.handleRevertButtonClick.bind(this);
    this.handleCloneButtonClick = this.handleCloneButtonClick.bind(this);
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    this.handleRecordFormSelectorCommit = this.handleRecordFormSelectorCommit.bind(this);
  }

  componentDidMount() {
    this.initRecord();
  }

  componentDidUpdate(prevProps) {
    const {
      recordType,
      vocabulary,
      csid,
      cloneCsid,
    } = this.props;

    const {
      recordType: prevRecordType,
      vocabulary: prevVocabulary,
      csid: prevCsid,
      cloneCsid: prevCloneCsid,
    } = prevProps;

    if (
      recordType !== prevRecordType ||
      vocabulary !== prevVocabulary ||
      csid !== prevCsid ||
      cloneCsid !== prevCloneCsid
    ) {
      this.initRecord();
    }
  }

  componentWillUnmount() {
    const {
      removeValidationNotification,
    } = this.props;

    if (removeValidationNotification) {
      removeValidationNotification();
    }
  }

  initRecord() {
    const {
      csid,
      cloneCsid,
      createNewRecord,
      readRecord,
      removeValidationNotification,
    } = this.props;

    if (removeValidationNotification) {
      removeValidationNotification();
    }

    if (csid) {
      if (readRecord) {
        readRecord();
      }
    } else if (createNewRecord) {
      createNewRecord(cloneCsid);
    }
  }

  save(onRecordCreated) {
    const {
      config,
      recordType,
      openModal,
      save,
      saveWithTransition,
    } = this.props;

    const recordTypeConfig = config.recordTypes[recordType];
    const { lockOnSave } = recordTypeConfig;

    if (lockOnSave === 'prompt' && openModal) {
      openModal(LockRecordModal.name);

      return false;
    }

    if (lockOnSave === true && saveWithTransition) {
      saveWithTransition('lock', onRecordCreated);
    } else if (save) {
      save(onRecordCreated);
    }

    return true;
  }

  handleModalCancelButtonClick() {
    const {
      closeModal,
      onSaveCancelled,
    } = this.props;

    if (closeModal) {
      closeModal(false);
    }

    if (onSaveCancelled) {
      onSaveCancelled();
    }
  }

  handleConfirmDeleteButtonClick() {
    const {
      closeModal,
      isHardDelete,
      deleteRecord,
      onRecordDeleted,
      transitionRecord,
      onRecordTransitioned,
    } = this.props;

    if (isHardDelete) {
      if (deleteRecord) {
        deleteRecord()
          .then(() => {
            if (closeModal) {
              closeModal(true);
            }

            if (onRecordDeleted) {
              onRecordDeleted();
            }
          });
      }
    } else {
      const transitionName = 'delete';

      if (transitionRecord) {
        transitionRecord(transitionName)
          .then(() => {
            if (closeModal) {
              closeModal(true);
            }

            if (onRecordTransitioned) {
              onRecordTransitioned(transitionName);
            }
          });
      }
    }
  }

  handleConfirmNavigationSaveButtonClick() {
    const {
      closeModal,
      onRecordCreated,
    } = this.props;

    // Wrap the onRecordCreated callback in a function that sets isNavigating to true. This lets
    // the callback know that we're already navigating away, so it should not do any navigation
    // of its own.

    const callback = onRecordCreated
      ? (newRecordCsid) => { onRecordCreated(newRecordCsid, true); }
      : undefined;

    const saveCalled = this.save(callback);

    if (saveCalled && closeModal) {
      closeModal(true);
    }
  }

  handleConfirmNavigationRevertButtonClick() {
    const {
      closeModal,
      revert,
    } = this.props;

    if (revert) {
      revert();
    }

    if (closeModal) {
      closeModal(true);
    }
  }

  handleCloneButtonClick() {
    const {
      clone,
      csid,
    } = this.props;

    if (clone) {
      clone(csid);
    }
  }

  handleDeleteButtonClick() {
    const {
      openModal,
    } = this.props;

    if (openModal) {
      openModal(ConfirmRecordDeleteModal.modalName);
    }
  }

  handleRevertButtonClick() {
    const {
      revert,
    } = this.props;

    if (revert) {
      revert();
    }
  }

  handleSaveButtonClick() {
    const {
      onRecordCreated,
    } = this.props;

    this.save(onRecordCreated);
  }

  handleSaveButtonErrorBadgeClick() {
    const {
      validateRecordData,
    } = this.props;

    if (validateRecordData) {
      validateRecordData();
    }
  }

  handleSaveOnlyButtonClick() {
    const {
      save,
      closeModal,
      onRecordCreated,
    } = this.props;

    if (save) {
      save(onRecordCreated)
        .then(() => {
          if (closeModal) {
            closeModal(true);
          }
        });
    }
  }

  handleSaveLockButtonClick() {
    const {
      saveWithTransition,
      closeModal,
      onRecordCreated,
    } = this.props;

    if (saveWithTransition) {
      saveWithTransition('lock', onRecordCreated)
        .then(() => {
          if (closeModal) {
            closeModal(true);
          }
        });
    }
  }

  handleRecordFormSelectorCommit(path, value) {
    const {
      setForm,
    } = this.props;

    if (setForm) {
      setForm(value);
    }
  }

  renderConfirmNavigationModal() {
    const {
      isModified,
      isSavePending,
      openModalName,
      validationErrors,
    } = this.props;

    return (
      <ConfirmRecordNavigationModal
        isOpen={openModalName === ConfirmRecordNavigationModal.modalName}
        isModified={isModified}
        isSavePending={isSavePending}
        validationErrors={validationErrors}
        onCancelButtonClick={this.handleModalCancelButtonClick}
        onCloseButtonClick={this.handleModalCancelButtonClick}
        onSaveButtonClick={this.handleConfirmNavigationSaveButtonClick}
        onSaveButtonErrorBadgeClick={this.handleSaveButtonErrorBadgeClick}
        onRevertButtonClick={this.handleConfirmNavigationRevertButtonClick}
      />
    );
  }

  renderConfirmRecordDeleteModal() {
    const {
      csid,
      isSavePending,
      openModalName,
    } = this.props;

    return (
      <ConfirmRecordDeleteModal
        csid={csid}
        isOpen={openModalName === ConfirmRecordDeleteModal.modalName}
        isSavePending={isSavePending}
        onCancelButtonClick={this.handleModalCancelButtonClick}
        onCloseButtonClick={this.handleModalCancelButtonClick}
        onDeleteButtonClick={this.handleConfirmDeleteButtonClick}
      />
    );
  }

  renderLockRecordModal() {
    const {
      config,
      csid,
      isSavePending,
      openModalName,
      recordType,
    } = this.props;

    const recordTypeConfig = config.recordTypes[recordType];
    const { lockOnSave } = recordTypeConfig;

    if (lockOnSave !== 'prompt') {
      return null;
    }

    return (
      <LockRecordModal
        csid={csid}
        isOpen={openModalName === LockRecordModal.modalName}
        isSavePending={isSavePending}
        onCancelButtonClick={this.handleModalCancelButtonClick}
        onCloseButtonClick={this.handleModalCancelButtonClick}
        onSaveOnlyButtonClick={this.handleSaveOnlyButtonClick}
        onSaveLockButtonClick={this.handleSaveLockButtonClick}
      />
    );
  }

  render() {
    const {
      config,
      csid,
      data,
      dockTop,
      formName,
      isModified,
      isReadPending,
      isSavePending,
      perms,
      recordType,
      relatedSubjectWorkflowState,
      validationErrors,
      vocabulary,
    } = this.props;

    const recordTypeConfig = config.recordTypes[recordType];

    if (!recordTypeConfig) {
      return null;
    }

    const selectedFormName = formName || recordTypeConfig.defaultForm || 'default';
    const locked = isLocked(data);

    const readOnly = (
      locked ||
      isReadPending ||
      !(csid ? canUpdate(recordType, perms) : canCreate(recordType, perms))
    );

    const isCloneable = (
      // The record must be saved.
      !!csid &&
      // If we're editing an object record in a secondary tab, and the primary record is locked,
      // a new cloned record would not be able to be related to the primary, so the clone
      // button should not appear.
      relatedSubjectWorkflowState !== 'locked' &&
      // We must have permission to create a new record of the type.
      canCreate(recordType, perms)
    );

    const isDeletable = (
      !!csid &&
      !locked &&
      // Security resources don't have soft-delete, so need to check both.
      (canSoftDelete(recordType, perms) || canDelete(recordType, perms))
    );

    return (
      <form className={styles.common} autoComplete="off">
        <RecordHeader
          config={config}
          data={data}
          dockTop={dockTop}
          formName={selectedFormName}
          isCloneable={isCloneable}
          isDeletable={isDeletable}
          isModified={isModified}
          isReadPending={isReadPending}
          isSavePending={isSavePending}
          readOnly={readOnly}
          recordType={recordType}
          validationErrors={validationErrors}
          onCloneButtonClick={this.handleCloneButtonClick}
          onCommit={this.handleRecordFormSelectorCommit}
          onDeleteButtonClick={this.handleDeleteButtonClick}
          onSaveButtonClick={this.handleSaveButtonClick}
          onSaveButtonErrorBadgeClick={this.handleSaveButtonErrorBadgeClick}
          onRevertButtonClick={this.handleRevertButtonClick}
        />
        <RecordFormContainer
          config={config}
          csid={csid}
          data={data}
          formName={selectedFormName}
          readOnly={readOnly}
          recordType={recordType}
          vocabulary={vocabulary}
        />
        <footer>
          <RecordButtonBar
            isCloneable={isCloneable}
            isDeletable={isDeletable}
            isModified={isModified}
            isReadPending={isReadPending}
            isSavePending={isSavePending}
            readOnly={readOnly}
            validationErrors={validationErrors}
            onSaveButtonClick={this.handleSaveButtonClick}
            onSaveButtonErrorBadgeClick={this.handleSaveButtonErrorBadgeClick}
            onRevertButtonClick={this.handleRevertButtonClick}
            onCloneButtonClick={this.handleCloneButtonClick}
            onDeleteButtonClick={this.handleDeleteButtonClick}
          />
        </footer>
        <Prompt
          when={isModified && !isSavePending}
          message={ConfirmRecordNavigationModal.modalName}
        />
        {this.renderConfirmNavigationModal()}
        {this.renderConfirmRecordDeleteModal()}
        {this.renderLockRecordModal()}
      </form>
    );
  }
}

RecordEditor.propTypes = propTypes;
RecordEditor.defaultProps = defaultProps;

