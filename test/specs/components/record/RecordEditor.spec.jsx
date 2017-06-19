/* global window, document */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { createRenderer } from 'react-test-renderer/shallow';
import { findWithType } from 'react-shallow-testutils';
import { IntlProvider } from 'react-intl';
import { Provider as StoreProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router';
import Immutable from 'immutable';
import { components as inputComponents } from 'cspace-input';

import createTestContainer from '../../../helpers/createTestContainer';

import Panel from '../../../../src/containers/layout/PanelContainer';
import RecordEditor from '../../../../src/components/record/RecordEditor';
import ConfirmRecordNavigationModal from '../../../../src/components/record/ConfirmRecordNavigationModal';

const expect = chai.expect;

chai.should();

const {
  CompoundInput,
  TextInput,
} = inputComponents;

const mockStore = configureMockStore();

const store = mockStore({
  prefs: Immutable.Map(),
  record: Immutable.Map(),
});

const config = {
  recordTypes: {
    object: {
      forms: {
        default: (
          <CompoundInput>
            <Panel name="id">
              <TextInput name="objectNumber" />
              <TextInput name="desc" msgkey="foo" />
              <TextInput name="color" label="Color" />
              <TextInput name="bar" />
            </Panel>
          </CompoundInput>
        ),
      },
      messages: {
        record: {
          name: {
            id: 'name',
            defaultMessage: 'Object',
          },
        },
        panel: {
          id: {
            id: 'panel.id.label',
            defaultMessage: 'Object Identification Information',
          },
        },
        field: {
          objectNumber: {
            id: 'field.objectNumber.label',
            defaultMessage: 'Identification number',
          },
          foo: {
            id: 'field.foo.label',
            defaultMessage: 'Some label',
          },
        },
      },
      title: () => 'Title',
    },
  },
};

const expectedClassName = 'cspace-ui-RecordEditor--common';

describe('RecordEditor', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a form', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor config={config} recordType="object" />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    this.container.firstElementChild.nodeName.should.equal('FORM');
  });


  it('should render with correct class', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor config={config} recordType="object" />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should render nothing for an unknown record type', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <RecordEditor config={config} recordType="foo" />
        </StoreProvider>
      </IntlProvider>, this.container);

    expect(this.container.firstElementChild).to.equal(null);
  });

  it('should call readRecord when mounted if a csid is provided', function test() {
    let readRecordCalled = false;

    const readRecord = () => {
      readRecordCalled = true;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              csid="1234"
              recordType="object"
              readRecord={readRecord}
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    readRecordCalled.should.equal(true);
  });

  it('should call createNewRecord when mounted if a csid is not provided', function test() {
    let createNewRecordCalled = false;

    const createNewRecord = () => {
      createNewRecordCalled = true;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              recordType="object"
              createNewRecord={createNewRecord}
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    createNewRecordCalled.should.equal(true);
  });

  it('should call readRecord when the csid is changed', function test() {
    let readRecordCalled = false;

    const readRecord = () => {
      readRecordCalled = true;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              csid="1234"
              recordType="object"
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              csid="5678"
              recordType="object"
              readRecord={readRecord}
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    readRecordCalled.should.equal(true);
  });

  it('should call removeValidationNotification when unmounted', function test() {
    let removeValidationNotificationCalled = false;

    const removeValidationNotification = () => {
      removeValidationNotificationCalled = true;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              csid="1234"
              recordType="object"
              removeValidationNotification={removeValidationNotification}
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    unmountComponentAtNode(this.container);

    removeValidationNotificationCalled.should.equal(true);
  });

  it('should call removeValidationNotification when the csid is changed', function test() {
    let removeValidationNotificationCalled = false;

    const removeValidationNotification = () => {
      removeValidationNotificationCalled = true;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              csid="1234"
              recordType="object"
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              csid="5678"
              recordType="object"
              removeValidationNotification={removeValidationNotification}
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    removeValidationNotificationCalled.should.equal(true);
  });

  it('should call save when the save button is clicked', function test() {
    const handleRecordCreated = () => null;

    let saveCallback = null;

    const save = (callbackArg) => {
      saveCallback = callbackArg;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              recordType="object"
              save={save}
              onRecordCreated={handleRecordCreated}
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    const saveButton = this.container.querySelector('button[name=save]');

    Simulate.click(saveButton);

    saveCallback.should.equal(handleRecordCreated);
  });

  it('should call revert when the revert button is clicked', function test() {
    let revertCalled = false;

    const revert = () => {
      revertCalled = true;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              isModified
              recordType="object"
              revert={revert}
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    const revertButton = this.container.querySelector('button[name=revert]');

    Simulate.click(revertButton);

    revertCalled.should.equal(true);
  });

  it('should call clone when the clone button is clicked', function test() {
    let cloneCalled = false;

    const clone = () => {
      cloneCalled = true;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              csid="1234"
              recordType="object"
              clone={clone}
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    const cloneButton = this.container.querySelector('button[name=clone]');

    Simulate.click(cloneButton);

    cloneCalled.should.equal(true);
  });

  it('should call validateRecordData when the save button error badge is clicked', function test() {
    let validateCalled = false;

    const validateRecordData = () => {
      validateCalled = true;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              csid="1234"
              recordType="object"
              validateRecordData={validateRecordData}
              validationErrors={Immutable.Map()}
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    const errorBadge = this.container.querySelector('button.cspace-ui-Badge--common');

    Simulate.click(errorBadge);

    validateCalled.should.equal(true);
  });

  it('should call validateRecordData when the save button error badge is clicked', function test() {
    let validateCalled = false;

    const validateRecordData = () => {
      validateCalled = true;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <Router>
            <RecordEditor
              config={config}
              csid="1234"
              recordType="object"
              validateRecordData={validateRecordData}
              validationErrors={Immutable.Map()}
            />
          </Router>
        </StoreProvider>
      </IntlProvider>, this.container);

    const errorBadge = this.container.querySelector('button.cspace-ui-Badge--common');

    Simulate.click(errorBadge);

    validateCalled.should.equal(true);
  });

  it('should call save and closeModal when the confirmation modal save button is clicked', function test() {
    let saveCallback = null;

    const save = (callbackArg) => {
      saveCallback = callbackArg;
    };

    let recordCreatedNewCsid = null;
    let recordCreatedIsNavigating = null;

    const handleRecordCreated = (newRecordCsidArg, isNavigatingArg) => {
      recordCreatedNewCsid = newRecordCsidArg;
      recordCreatedIsNavigating = isNavigatingArg;
    };

    let closeModalCalled = false;

    const closeModal = () => {
      closeModalCalled = true;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <RecordEditor
            config={config}
            csid="1234"
            recordType="object"
            openModalName={ConfirmRecordNavigationModal.name}
            save={save}
            closeModal={closeModal}
            onRecordCreated={handleRecordCreated}
          />
        </StoreProvider>
      </IntlProvider>);

    const result = shallowRenderer.getRenderOutput();
    const recordEditor = findWithType(result, RecordEditor);
    const recordEditorRenderer = createRenderer();

    recordEditorRenderer.render(recordEditor);

    const recordEditorResult = recordEditorRenderer.getRenderOutput();
    const modal = findWithType(recordEditorResult, ConfirmRecordNavigationModal);

    modal.props.onSaveButtonClick();

    saveCallback.should.not.equal(null);
    closeModalCalled.should.equal(true);

    // The save callback should call the onRecordCreated function, passing in true for
    // isNavigating.

    const newCsid = '1234';

    saveCallback(newCsid);

    recordCreatedNewCsid.should.equal(newCsid);
    recordCreatedIsNavigating.should.equal(true);
  });

  it('should call revert and closeModal when the confirmation modal revert button is clicked', function test() {
    let revertCalled = false;

    const revert = () => {
      revertCalled = true;
    };

    let closeModalCalled = false;

    const closeModal = () => {
      closeModalCalled = true;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <RecordEditor
            config={config}
            csid="1234"
            recordType="object"
            openModalName={ConfirmRecordNavigationModal.name}
            revert={revert}
            closeModal={closeModal}
          />
        </StoreProvider>
      </IntlProvider>);

    const result = shallowRenderer.getRenderOutput();
    const recordEditor = findWithType(result, RecordEditor);
    const recordEditorRenderer = createRenderer();

    recordEditorRenderer.render(recordEditor);

    const recordEditorResult = recordEditorRenderer.getRenderOutput();
    const modal = findWithType(recordEditorResult, ConfirmRecordNavigationModal);

    modal.props.onRevertButtonClick();

    revertCalled.should.equal(true);
    closeModalCalled.should.equal(true);
  });

  it('should call closeModal and onSaveCancelled when the confirmation modal cancel button is clicked', function test() {
    let saveCancelledCalled = false;

    const handleSaveCancelled = () => {
      saveCancelledCalled = true;
    };

    let closeModalCalled = false;

    const closeModal = () => {
      closeModalCalled = true;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <RecordEditor
            config={config}
            csid="1234"
            recordType="object"
            openModalName={ConfirmRecordNavigationModal.name}
            onSaveCancelled={handleSaveCancelled}
            closeModal={closeModal}
          />
        </StoreProvider>
      </IntlProvider>);

    const result = shallowRenderer.getRenderOutput();
    const recordEditor = findWithType(result, RecordEditor);
    const recordEditorRenderer = createRenderer();

    recordEditorRenderer.render(recordEditor);

    const recordEditorResult = recordEditorRenderer.getRenderOutput();
    const modal = findWithType(recordEditorResult, ConfirmRecordNavigationModal);

    modal.props.onCancelButtonClick();

    saveCancelledCalled.should.equal(true);
    closeModalCalled.should.equal(true);
  });
});
