/* global window */

import React from 'react';
import { render } from 'react-dom';
import { createRenderer } from 'react-test-renderer/shallow';
import { findWithType } from 'react-shallow-testutils';
import Immutable from 'immutable';
import createTestContainer from '../../../helpers/createTestContainer';
import RecordEditorContainer from '../../../../src/containers/record/RecordEditorContainer';
import RelationEditor from '../../../../src/components/record/RelationEditor';
import RelationButtonBar from '../../../../src/components/record/RelationButtonBar';

const expect = chai.expect;

chai.should();

const config = {
  recordTypes: {
    group: {
      messages: {
        record: {
          name: {
            id: 'record.group.name',
            defaultMessage: 'Group',
          },
        },
      },
      title: () => 'Title',
    },
  },
};

describe('RelationEditor', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render a record editor if the relation is found', function test() {
    const subject = {
      csid: '1234',
      recordType: 'collectionobject',
    };

    const object = {
      csid: '5678',
      recordType: 'group',
    };

    const findResult = Immutable.fromJS({
      'ns2:relations-common-list': {
        totalItems: '1',
      },
    });

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RelationEditor
        config={config}
        subject={subject}
        object={object}
        findResult={findResult}
      />);

    const result = shallowRenderer.getRenderOutput();
    const recordEditorContainer = findWithType(result, RecordEditorContainer);

    recordEditorContainer.should.not.equal(null);

    recordEditorContainer.props.csid.should.equal(object.csid);
    recordEditorContainer.props.recordType.should.equal(object.recordType);
    recordEditorContainer.props.relatedSubjectCsid.should.equal(subject.csid);
  });

  it('should render nothing if there is no relation find result', function test() {
    const subject = {
      csid: '1234',
      recordType: 'collectionobject',
    };

    const object = {
      csid: '5678',
      recordType: 'group',
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RelationEditor
        config={config}
        subject={subject}
        object={object}
      />);

    const result = shallowRenderer.getRenderOutput();

    expect(result).to.equal(null);
  });

  it('should render an error message div if the relation find result contains no items', function test() {
    const subject = {
      csid: '1234',
      recordType: 'collectionobject',
    };

    const object = {
      csid: '5678',
      recordType: 'group',
    };

    const findResult = Immutable.fromJS({
      'ns2:relations-common-list': {
        totalItems: '0',
      },
    });

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RelationEditor
        config={config}
        subject={subject}
        object={object}
        findResult={findResult}
      />);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal('div');
  });

  it('should call createRelation followed by onRecordCreated when a new record is created', function test() {
    const subject = {
      csid: '1234',
      recordType: 'collectionobject',
    };

    const object = {
      csid: '5678',
      recordType: 'group',
    };

    const predicate = 'affects';

    const findResult = Immutable.fromJS({
      'ns2:relations-common-list': {
        totalItems: '1',
      },
    });

    const newRecordCsid = '9999';

    let createSubject = null;
    let createObject = null;
    let createPredicate = null;

    const createRelation = (subjectArg, objectArg, predicateArg) => {
      createSubject = subjectArg;
      createObject = objectArg;
      createPredicate = predicateArg;

      return Promise.resolve();
    };

    let createdCsid = null;

    const handleRecordCreated = (csidArg) => {
      createdCsid = csidArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RelationEditor
        config={config}
        subject={subject}
        object={object}
        predicate={predicate}
        findResult={findResult}
        createRelation={createRelation}
        onRecordCreated={handleRecordCreated}
      />);

    const result = shallowRenderer.getRenderOutput();
    const recordEditorContainer = findWithType(result, RecordEditorContainer);

    recordEditorContainer.props.onRecordCreated(newRecordCsid);

    createSubject.should.equal(subject);
    createObject.should.deep.equal({ csid: newRecordCsid });
    createPredicate.should.equal(predicate);

    return new Promise((resolve) => {
      window.setTimeout(() => {
        createdCsid.should.equal(newRecordCsid);

        resolve();
      }, 0);
    });
  });

  it('should call findRelation when mounted', function test() {
    const subject = {
      csid: '1234',
      recordType: 'collectionobject',
    };

    const object = {
      csid: '5678',
      recordType: 'group',
    };

    const predicate = 'affects';

    let findConfig = null;
    let findSubject = null;
    let findObject = null;
    let findPredicate = null;

    const findRelation = (configArg, subjectArg, objectArg, predicateArg) => {
      findConfig = configArg;
      findSubject = subjectArg;
      findObject = objectArg;
      findPredicate = predicateArg;
    };

    render(
      <RelationEditor
        config={config}
        subject={subject}
        object={object}
        predicate={predicate}
        findRelation={findRelation}
      />, this.container);

    findConfig.should.equal(config);
    findSubject.should.equal(subject);
    findObject.should.deep.equal(object);
    findPredicate.should.equal(predicate);
  });

  it('should call findRelation when subject, object, or predicate changes', function test() {
    const subject = {
      csid: '1234',
      recordType: 'collectionobject',
    };

    const object = {
      csid: '5678',
      recordType: 'group',
    };

    const predicate = 'affects';

    let findConfig = null;
    let findSubject = null;
    let findObject = null;
    let findPredicate = null;

    const findRelation = (configArg, subjectArg, objectArg, predicateArg) => {
      findConfig = configArg;
      findSubject = subjectArg;
      findObject = objectArg;
      findPredicate = predicateArg;
    };

    render(
      <RelationEditor
        config={config}
        subject={subject}
        object={object}
        predicate={predicate}
      />, this.container);

    const newObject = {
      csid: 'abcd',
      recordType: 'group',
    };

    render(
      <RelationEditor
        config={config}
        subject={subject}
        object={newObject}
        predicate={predicate}
        findRelation={findRelation}
      />, this.container);

    findConfig.should.equal(config);
    findSubject.should.equal(subject);
    findObject.should.deep.equal(newObject);
    findPredicate.should.equal(predicate);

    const newSubject = {
      csid: '1111',
      recordType: 'collectionobject',
    };

    render(
      <RelationEditor
        config={config}
        subject={newSubject}
        object={object}
        predicate={predicate}
        findRelation={findRelation}
      />, this.container);

    findConfig.should.equal(config);
    findSubject.should.equal(newSubject);
    findObject.should.deep.equal(object);
    findPredicate.should.equal(predicate);

    const newPredicate = 'pred';

    render(
      <RelationEditor
        config={config}
        subject={subject}
        object={object}
        predicate={newPredicate}
        findRelation={findRelation}
      />, this.container);

    findConfig.should.equal(config);
    findSubject.should.equal(subject);
    findObject.should.deep.equal(object);
    findPredicate.should.equal(newPredicate);
  });

  it('should call onUnmount when unmounted', function test() {
    const subject = {
      csid: '1234',
      recordType: 'collectionobject',
    };

    const object = {
      csid: '5678',
      recordType: 'group',
    };

    const predicate = 'affects';

    let handlerCalled = false;

    const handleUnmount = () => {
      handlerCalled = true;
    };

    handlerCalled.should.equal(false);

    render(
      <RelationEditor
        config={config}
        subject={subject}
        object={object}
        predicate={predicate}
        onUnmount={handleUnmount}
      />, this.container);

    render(
      <div />, this.container);

    handlerCalled.should.equal(true);
  });

  it('should call onClose when the cancel button is clicked in the button bar', function test() {
    const subject = {
      csid: '1234',
      recordType: 'collectionobject',
    };

    const object = {
      csid: '5678',
      recordType: 'group',
    };

    const findResult = Immutable.fromJS({
      'ns2:relations-common-list': {
        totalItems: '1',
      },
    });

    let handlerCalled = false;

    const handleClose = () => {
      handlerCalled = true;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RelationEditor
        config={config}
        subject={subject}
        object={object}
        findResult={findResult}
        onClose={handleClose}
      />);

    const result = shallowRenderer.getRenderOutput();
    const buttonBar = findWithType(result, RelationButtonBar);

    buttonBar.props.onCancelButtonClick();

    handlerCalled.should.equal(true);
  });

  it('should call onClose when the close button is clicked in the button bar', function test() {
    const subject = {
      csid: '1234',
      recordType: 'collectionobject',
    };

    const object = {
      csid: '5678',
      recordType: 'group',
    };

    const findResult = Immutable.fromJS({
      'ns2:relations-common-list': {
        totalItems: '1',
      },
    });

    let handlerCalled = false;

    const handleClose = () => {
      handlerCalled = true;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RelationEditor
        config={config}
        subject={subject}
        object={object}
        findResult={findResult}
        onClose={handleClose}
      />);

    const result = shallowRenderer.getRenderOutput();
    const buttonBar = findWithType(result, RelationButtonBar);

    buttonBar.props.onCloseButtonClick();

    handlerCalled.should.equal(true);
  });

  it('should call onClose, then unrelate and onUnrelated when unmounted when the unrelate button is clicked in the button bar', function test() {
    const subject = {
      csid: '1234',
      recordType: 'collectionobject',
    };

    const object = {
      csid: '5678',
      recordType: 'group',
    };

    const predicate = 'affects';

    const findResult = Immutable.fromJS({
      'ns2:relations-common-list': {
        totalItems: '1',
      },
    });

    let handleCloseCalled = false;

    const handleClose = () => {
      handleCloseCalled = true;
    };

    let unrelateConfig = null;
    let unrelateSubject = null;
    let unrelateObject = null;
    let unrelatePredicate = null;

    const unrelate = (configArg, subjectArg, objectArg, predicateArg) => {
      unrelateConfig = configArg;
      unrelateSubject = subjectArg;
      unrelateObject = objectArg;
      unrelatePredicate = predicateArg;

      return Promise.resolve();
    };

    let handleUnrelatedSubject = null;
    let handleUnrelatedObject = null;
    let handleUnrelatedPredicate = null;

    const handleUnrelated = (subjectArg, objectArg, predicateArg) => {
      handleUnrelatedSubject = subjectArg;
      handleUnrelatedObject = objectArg;
      handleUnrelatedPredicate = predicateArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RelationEditor
        config={config}
        subject={subject}
        object={object}
        predicate={predicate}
        findResult={findResult}
        onClose={handleClose}
        unrelate={unrelate}
        onUnrelated={handleUnrelated}
      />);

    const result = shallowRenderer.getRenderOutput();
    const buttonBar = findWithType(result, RelationButtonBar);

    buttonBar.props.onUnrelateButtonClick();

    handleCloseCalled.should.equal(true);

    expect(unrelateConfig).to.equal(null);

    shallowRenderer.unmount();

    unrelateConfig.should.equal(config);
    unrelateSubject.should.equal(subject);
    unrelateObject.should.equal(object);
    unrelatePredicate.should.equal(predicate);

    return new Promise((resolve) => {
      window.setTimeout(() => {
        handleUnrelatedSubject.should.equal(subject);
        handleUnrelatedObject.should.equal(object);
        handleUnrelatedPredicate.should.equal(predicate);

        resolve();
      }, 0);
    });
  });
});
