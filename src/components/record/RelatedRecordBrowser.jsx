import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { routerShape } from 'react-router/lib/PropTypes';
import RelatedRecordButtonBar from './RelatedRecordButtonBar';
import RelatedRecordPanelContainer from '../../containers/record/RelatedRecordPanelContainer';
import RelationEditorContainer from '../../containers/record/RelationEditorContainer';
import SearchToRelateModalContainer from '../../containers/search/SearchToRelateModalContainer';
import styles from '../../../styles/cspace-ui/RelatedRecordBrowser.css';

const propTypes = {
  cloneCsid: PropTypes.string,
  config: PropTypes.object,
  recordType: PropTypes.string,
  vocabulary: PropTypes.string,
  csid: PropTypes.string,
  relatedCsid: PropTypes.string,
  relatedRecordType: PropTypes.string,
  router: routerShape,
  deselectItem: PropTypes.func,
  onShowRelated: PropTypes.func,
};

class RelatedRecordBrowser extends Component {
  constructor() {
    super();

    this.cloneRelatedRecord = this.cloneRelatedRecord.bind(this);
    this.handleCreateButtonClick = this.handleCreateButtonClick.bind(this);
    this.handleRelateButtonClick = this.handleRelateButtonClick.bind(this);
    this.handleRelatedRecordCreated = this.handleRelatedRecordCreated.bind(this);
    this.handleRelatedRecordClick = this.handleRelatedRecordClick.bind(this);
    this.handleRelatedRecordPanelUnrelated = this.handleRelatedRecordPanelUnrelated.bind(this);
    this.handleModalCancelButtonClick = this.handleModalCancelButtonClick.bind(this);
    this.handleModalCloseButtonClick = this.handleModalCloseButtonClick.bind(this);
    this.handleRelationEditorClose = this.handleRelationEditorClose.bind(this);
    this.handleRelationEditorUnrelated = this.handleRelationEditorUnrelated.bind(this);
    this.handleRelationsCreated = this.handleRelationsCreated.bind(this);

    this.state = {
      isSearchToRelateModalOpen: false,
    };
  }

  getRelatedRecordPanelName() {
    const {
      relatedRecordType,
    } = this.props;

    return `relatedRecordBrowser-${relatedRecordType}`;
  }

  cloneRelatedRecord(relatedRecordCsid) {
    const {
      recordType,
      vocabulary,
      csid,
      relatedRecordType,
      router,
    } = this.props;

    const path =
      [recordType, vocabulary, csid, relatedRecordType]
        .filter(part => !!part)
        .join('/');

    router.replace({
      pathname: `/record/${path}/new`,
      query: {
        clone: relatedRecordCsid,
      },
    });
  }

  closeModal() {
    this.setState({
      isSearchToRelateModalOpen: false,
    });
  }

  handleCreateButtonClick() {
    const {
      recordType,
      vocabulary,
      csid,
      relatedRecordType,
      router,
    } = this.props;

    const path =
      [recordType, vocabulary, csid, relatedRecordType, 'new']
        .filter(part => !!part)
        .join('/');

    router.replace(`/record/${path}`);
  }

  handleRelateButtonClick() {
    this.setState({
      isSearchToRelateModalOpen: true,
    });
  }

  handleModalCancelButtonClick() {
    this.closeModal();
  }

  handleModalCloseButtonClick() {
    this.closeModal();
  }

  handleRelationEditorClose() {
    const {
      recordType,
      vocabulary,
      csid,
      relatedRecordType,
      router,
    } = this.props;

    const path =
      [recordType, vocabulary, csid, relatedRecordType]
        .filter(part => !!part)
        .join('/');

    router.replace(`/record/${path}`);
  }

  handleRelationEditorUnrelated(subject, object) {
    const {
      deselectItem,
    } = this.props;

    // If a record is unrelated in the editor, deselect it in the store, since it will no longer
    // appear in the related records list.

    if (deselectItem) {
      deselectItem(this.getRelatedRecordPanelName(), object.csid);
    }
  }

  handleRelationsCreated() {
    this.closeModal();
  }

  handleRelatedRecordClick(item) {
    const {
      relatedRecordType,
      onShowRelated,
    } = this.props;

    if (onShowRelated) {
      const relatedCsid = item.get('csid');

      onShowRelated(relatedRecordType, relatedCsid);
    }

    // Prevent the default action.

    return false;
  }

  handleRelatedRecordCreated(newRecordCsid) {
    const {
      recordType,
      vocabulary,
      csid,
      relatedRecordType,
      router,
    } = this.props;

    const path =
      [recordType, vocabulary, csid, relatedRecordType, newRecordCsid]
        .filter(part => !!part)
        .join('/');

    router.replace(`/record/${path}`);
  }

  handleRelatedRecordPanelUnrelated(objects) {
    const {
      relatedCsid,
    } = this.props;

    let isRelatedCsidUnrelated = false;

    for (let i = 0; i < objects.length; i += 1) {
      if (objects[i].csid === relatedCsid) {
        isRelatedCsidUnrelated = true;
        break;
      }
    }

    if (isRelatedCsidUnrelated) {
      const {
        recordType,
        vocabulary,
        csid,
        relatedRecordType,
        router,
      } = this.props;

      const path =
        [recordType, vocabulary, csid, relatedRecordType]
          .filter(part => !!part)
          .join('/');

      router.replace(`/record/${path}`);
    }
  }

  render() {
    const {
      cloneCsid,
      config,
      recordType,
      csid,
      relatedCsid,
      relatedRecordType,
    } = this.props;

    const {
      isSearchToRelateModalOpen,
    } = this.state;

    let relationEditor;

    if (typeof relatedCsid !== 'undefined' && relatedCsid !== null) {
      relationEditor = (
        <RelationEditorContainer
          cloneCsid={cloneCsid}
          config={config}
          subject={{
            csid,
            recordType,
          }}
          object={{
            csid: relatedCsid,
            recordType: relatedRecordType,
          }}
          predicate="affects"
          cloneRecord={this.cloneRelatedRecord}
          onClose={this.handleRelationEditorClose}
          onRecordCreated={this.handleRelatedRecordCreated}
          onUnrelated={this.handleRelationEditorUnrelated}
        />
      );
    }

    // TODO: Vary the name of the RelatedRecordPanelContainer depending on the object record type?
    // This would allow selected items to be remembered when switching back and forth between
    // secondary tabs, instead of being cleared.

    return (
      <div className={styles.common}>
        <header>
          <RelatedRecordButtonBar
            onCreateButtonClick={this.handleCreateButtonClick}
            onRelateButtonClick={this.handleRelateButtonClick}
          />
        </header>
        <RelatedRecordPanelContainer
          csid={csid}
          config={config}
          name={this.getRelatedRecordPanelName()}
          recordType={recordType}
          relatedRecordType={relatedRecordType}
          showCheckboxColumn
          onItemClick={this.handleRelatedRecordClick}
          onUnrelated={this.handleRelatedRecordPanelUnrelated}
        />
        {relationEditor}
        <SearchToRelateModalContainer
          subjectCsid={csid}
          subjectRecordType={recordType}
          config={config}
          isOpen={isSearchToRelateModalOpen}
          defaultRecordTypeValue={relatedRecordType}
          onCancelButtonClick={this.handleModalCancelButtonClick}
          onCloseButtonClick={this.handleModalCloseButtonClick}
          onRelationsCreated={this.handleRelationsCreated}
        />
      </div>
    );
  }
}

RelatedRecordBrowser.propTypes = propTypes;

export default withRouter(RelatedRecordBrowser);
