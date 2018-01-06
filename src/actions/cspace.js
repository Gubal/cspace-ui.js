import cspaceClient from 'cspace-client';
import get from 'lodash/get';
import { resetLogin } from './login';
import { loadPrefs } from './prefs';
import { readAccountPerms } from './account';
import { openModal } from './notification';
import LoginModal from '../components/login/LoginModal';

export const CSPACE_CONFIGURED = 'CSPACE_CONFIGURED';

let client;
let session;

export const createSession = (username, password) => {
  if (typeof username === 'undefined' && typeof password === 'undefined') {
    return client.session();
  }

  return client.session({
    username,
    password,
  });
};

export const setSession = (newSession) => {
  session = newSession;

  return {
    type: CSPACE_CONFIGURED,
    payload: session.config(),
  };
};

export const configureCSpace = config => (dispatch) => {
  client = cspaceClient({
    url: get(config, 'serverUrl'),

    onError: (error) => {
      const status = get(error, ['response', 'status']);

      if (status === 401) {
        const internalError = get(error, ['response', 'data', 'error']);

        if (internalError === 'invalid_token') {
          // The stored token is no longer valid. Show the login modal.

          dispatch(resetLogin(session.config().username));
          dispatch(openModal(LoginModal.modalName));
        }
      }

      return Promise.reject(error);
    },
  });

  const newSession = createSession();

  dispatch(setSession(newSession));

  const { username } = newSession.config();

  return dispatch(readAccountPerms(config, username))
    .then(() => dispatch(loadPrefs(username)));
};

export default () => session;
