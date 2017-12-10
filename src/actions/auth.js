import getSession from './cspace';
import { ERR_API } from '../constants/errorCodes';

import {
  getAuthResourceNames,
  isAuthPermsReadPending,
} from '../reducers';

export const PERMS_READ_STARTED = 'PERMS_READ_STARTED';
export const PERMS_READ_FULFILLED = 'PERMS_READ_FULFILLED';
export const PERMS_READ_REJECTED = 'PERMS_READ_REJECTED';

export const readPerms = config => (dispatch, getState) => {
  if (
    isAuthPermsReadPending(getState()) ||
    getAuthResourceNames(getState())
  ) {
    // We've already read the perms, or a request is already pending. Do nothing.

    return Promise.resolve();
  }

  const requestConfig = {
    params: {
      pgSz: 0,
      actGrp: 'CRUDL',
    },
  };

  dispatch({
    type: PERMS_READ_STARTED,
  });

  return getSession().read('authorization/permissions', requestConfig)
    .then((response) => {
      dispatch({
        type: PERMS_READ_FULFILLED,
        payload: response,
        meta: {
          config,
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: PERMS_READ_REJECTED,
        payload: {
          code: ERR_API,
          error,
        },
      });
    });
};
