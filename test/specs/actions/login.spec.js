import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import Immutable from 'immutable';

import getSession, {
  configureCSpace,
  CSPACE_CONFIGURED,
} from '../../../src/actions/cspace';

import {
  RESET_LOGIN,
  LOGIN_STARTED,
  LOGIN_FULFILLED,
  LOGIN_REJECTED,
  resetLogin,
  login,
} from '../../../src/actions/login';

import {
  PREFS_LOADED,
} from '../../../src/actions/prefs';

chai.should();

describe('login action creator', function suite() {
  describe('resetLogin', function actionSuite() {
    it('should create a RESET_LOGIN action', function test() {
      resetLogin().should.deep.equal({
        type: RESET_LOGIN,
      });
    });
  });

  describe('login', function actionSuite() {
    const mockStore = configureMockStore([thunk]);
    const tokenUrl = '/cspace-services/oauth/token';
    const username = 'user@collectionspace.org';
    const password = 'pw';

    const store = mockStore({
      login: Immutable.Map(),
    });

    const tokenGrantPayload = {
      access_token: 'abcd',
      token_type: 'bearer',
      refresh_token: 'efgh',
      scope: 'full',
      jti: '1234',
    };

    before(() => {
      store.dispatch(configureCSpace());
      store.clearActions();
    });

    beforeEach(() => {
      moxios.install();
    });

    afterEach(() => {
      store.clearActions();
      moxios.uninstall();
    });

    it('should create a session as a side effect', function test() {
      moxios.stubRequest(tokenUrl, {
        status: 200,
        response: tokenGrantPayload,
      });

      return store.dispatch(login(username, password))
        .then(() => {
          getSession().should.be.an('object');
          getSession().config().should.have.property('username', username);
        });
    });

    it('should dispatch LOGIN_FULFILLED on success', function test() {
      moxios.stubRequest(tokenUrl, {
        status: 200,
        response: tokenGrantPayload,
      });

      return store.dispatch(login(username, password))
        .then(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(4);

          actions[0].should.deep.equal({
            type: LOGIN_STARTED,
            meta: {
              username,
            },
          });

          actions[1].should.have.property('type', CSPACE_CONFIGURED);

          actions[2].should.deep.equal({
            type: LOGIN_FULFILLED,
            payload: {
              status: 200,
              statusText: undefined,
              headers: undefined,
              data: tokenGrantPayload,
            },
            meta: {
              username,
            },
          });

          actions[3].should.have.property('type', PREFS_LOADED);
        });
    });

    it('should dispatch LOGIN_REJECTED on error', function test() {
      moxios.stubRequest(tokenUrl, {
        status: 400,
      });

      return store.dispatch(login(username, password))
        .then(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(3);

          actions[0].should.deep.equal({
            type: LOGIN_STARTED,
            meta: {
              username,
            },
          });

          actions[1].should.have.property('type', CSPACE_CONFIGURED);

          actions[2].should.have.property('type', LOGIN_REJECTED);
          actions[2].should.have.deep.property('meta.username', username);
        });
    });
  });
});
