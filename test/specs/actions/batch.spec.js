import Immutable from 'immutable';
import chaiImmutable from 'chai-immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import {
  configureCSpace,
} from '../../../src/actions/cspace';

import {
  BATCH_INVOKE_STARTED,
  BATCH_INVOKE_FULFILLED,
  BATCH_INVOKE_REJECTED,
  invoke,
} from '../../../src/actions/batch';

import {
  SHOW_NOTIFICATION,
} from '../../../src/actions/notification';

import {
  STATUS_ERROR,
  STATUS_PENDING,
  STATUS_SUCCESS,
} from '../../../src/constants/notificationStatusCodes';

chai.use(chaiImmutable);
chai.should();

const config = {
  recordTypes: {
    group: {
      serviceConfig: {
        objectName: 'Group',
      },
    },
  },
};

const mockStore = configureMockStore([thunk]);

describe('batch action creator', function suite() {
  describe('invoke', function actionSuite() {
    const store = mockStore({
      user: Immutable.Map(),
    });

    before(() =>
      store.dispatch(configureCSpace())
        .then(() => store.clearActions())
    );

    beforeEach(() => {
      moxios.install();
    });

    afterEach(() => {
      store.clearActions();
      moxios.uninstall();
    });

    it('should invoke a batch job for a single csid', function test() {
      moxios.stubRequest(/./, {
        status: 200,
        response: {},
      });

      const batchCsid = 'abcd';

      const batchItem = Immutable.Map({
        csid: batchCsid,
      });

      const recordCsid = '1234';
      const recordType = 'group';

      const invocationDescriptor = {
        recordType,
        csid: recordCsid,
      };

      return store.dispatch(invoke(config, batchItem, invocationDescriptor))
        .then(() => {
          const request = moxios.requests.mostRecent();

          request.url.should.equal(`/cspace-services/batch/${batchCsid}`);

          const data = JSON.parse(request.config.data);

          data.should.deep.equal({
            'ns2:invocationContext': {
              '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
              docType: 'Group',
              mode: 'single',
              singleCSID: recordCsid,
            },
          });
        });
    });

    it('should invoke a batch job for list csids', function test() {
      moxios.stubRequest(/./, {
        status: 200,
        response: {},
      });

      const batchCsid = 'abcd';

      const batchItem = Immutable.Map({
        csid: batchCsid,
      });

      const recordCsid = '1234';
      const recordType = 'group';

      const invocationDescriptor = {
        recordType,
        csid: [
          recordCsid,
        ],
      };

      return store.dispatch(invoke(config, batchItem, invocationDescriptor))
        .then(() => {
          const request = moxios.requests.mostRecent();

          request.url.should.equal(`/cspace-services/batch/${batchCsid}`);

          const data = JSON.parse(request.config.data);

          data.should.deep.equal({
            'ns2:invocationContext': {
              '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
              docType: 'Group',
              mode: 'list',
              listCSIDs: {
                csid: [
                  '1234',
                ],
              },
            },
          });
        });
    });

    it('should invoke a batch job for no csid', function test() {
      moxios.stubRequest(/./, {
        status: 200,
        response: {},
      });

      const batchCsid = 'abcd';

      const batchItem = Immutable.Map({
        csid: batchCsid,
      });

      const recordType = 'group';

      const invocationDescriptor = {
        recordType,
      };

      return store.dispatch(invoke(config, batchItem, invocationDescriptor))
        .then(() => {
          const request = moxios.requests.mostRecent();

          request.url.should.equal(`/cspace-services/batch/${batchCsid}`);

          const data = JSON.parse(request.config.data);

          data.should.deep.equal({
            'ns2:invocationContext': {
              '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
              docType: 'Group',
              mode: 'nocontext',
            },
          });
        });
    });

    it('should dispatch BATCH_INVOKE_FULFILLED when an invocation completes successfully', function test() {
      moxios.stubRequest(/./, {
        status: 200,
        response: {},
      });

      const batchCsid = 'abcd';

      const batchItem = Immutable.Map({
        csid: batchCsid,
      });

      const recordCsid = '1234';
      const recordType = 'group';

      const invocationDescriptor = {
        recordType,
        csid: recordCsid,
      };

      return store.dispatch(invoke(config, batchItem, invocationDescriptor))
        .then(() => {
          const actions = store.getActions();
          actions.should.have.lengthOf(4);

          actions[0].type.should.equal(BATCH_INVOKE_STARTED);
          actions[0].meta.should.deep.equal({
            csid: batchCsid,
          });

          actions[1].type.should.equal(SHOW_NOTIFICATION);
          actions[1].payload.status.should.equal(STATUS_PENDING);

          actions[2].type.should.equal(BATCH_INVOKE_FULFILLED);
          actions[2].meta.should.deep.equal({
            csid: batchCsid,
            numAffected: undefined,
          });

          actions[3].type.should.equal(SHOW_NOTIFICATION);
          actions[3].payload.status.should.equal(STATUS_SUCCESS);
        });
    });

    it('should dispatch BATCH_INVOKE_REJECTED when an invocation fails', function test() {
      moxios.stubRequest(/./, {
        status: 400,
      });

      const batchCsid = 'abcd';

      const batchItem = Immutable.Map({
        csid: batchCsid,
      });

      const recordCsid = '1234';
      const recordType = 'group';

      const invocationDescriptor = {
        recordType,
        csid: recordCsid,
      };

      return store.dispatch(invoke(config, batchItem, invocationDescriptor))
        .then(() => {
          const actions = store.getActions();
          actions.should.have.lengthOf(4);

          actions[0].type.should.equal(BATCH_INVOKE_STARTED);
          actions[0].meta.should.deep.equal({
            csid: batchCsid,
          });

          actions[1].type.should.equal(SHOW_NOTIFICATION);
          actions[1].payload.status.should.equal(STATUS_PENDING);

          actions[2].type.should.equal(BATCH_INVOKE_REJECTED);
          actions[2].meta.should.deep.equal({
            csid: batchCsid,
          });

          actions[3].type.should.equal(SHOW_NOTIFICATION);
          actions[3].payload.status.should.equal(STATUS_ERROR);
        });
    });
  });
});
