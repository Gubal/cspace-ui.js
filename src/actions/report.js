/* global window */

import { defineMessages } from 'react-intl';
import get from 'lodash/get';
import getSession from './cspace';
import getErrorDescription from '../helpers/getErrorDescription';
import getNotificationID from '../helpers/notificationHelpers';
import { createInvocationData, getReportName } from '../helpers/invocationHelpers';
import { getReportViewerPath, VIEWER_WINDOW_NAME } from '../helpers/reportHelpers';

import {
  validateRecordData,
} from './record';

import {
  showNotification,
} from './notification';

import {
  STATUS_ERROR,
} from '../constants/notificationStatusCodes';

import {
  getNewRecordData,
  getRecordValidationErrors,
} from '../reducers';

const messages = defineMessages({
  error: {
    id: 'report.error',
    description: 'Notification message shown when a report fails.',
    defaultMessage: 'Error running report: {error}',
  },
});

export const openReport = (reportItem, config, recordType, csid) => (dispatch, getState) => {
  const reportName = getReportName(reportItem);
  const recordTypeConfig = get(config, ['invocables', 'report', reportName]);
  const paramsRecordCsid = '';

  let params;
  let validateParams;

  if (recordTypeConfig) {
    validateParams = dispatch(validateRecordData(recordTypeConfig, paramsRecordCsid))
      .then(() => {
        if (getRecordValidationErrors(getState(), paramsRecordCsid)) {
          return Promise.reject();
        }

        const data = getNewRecordData(getState());

        params = data && data.first().toJS();

        return Promise.resolve();
      });
  } else {
    validateParams = Promise.resolve();
  }

  return validateParams.then(() => {
    const viewerPath = getReportViewerPath(reportItem, config, recordType, csid, params);

    window.open(viewerPath, VIEWER_WINDOW_NAME);
  });
};

export const invoke = (config, csid, invocationDescriptor) => dispatch =>
  getSession().read(`reports/${csid}`)
    .then((response) => {
      const filename = get(response, ['data', 'document', 'ns2:reports_common', 'filename']);
      const reportName = filename && filename.substring(0, filename.lastIndexOf('.'));

      const requestConfig = {
        data: createInvocationData(config, invocationDescriptor, 'report', reportName),
        responseType: 'blob',
      };

      return getSession().create(`reports/${csid}`, requestConfig)
        .catch((error) => {
          const notificationID = getNotificationID();

          dispatch(showNotification({
            items: [{
              message: messages.error,
              values: {
                error: getErrorDescription(error),
              },
            }],
            date: new Date(),
            status: STATUS_ERROR,
          }, notificationID));

          throw error;
        });
    });

export default {};
