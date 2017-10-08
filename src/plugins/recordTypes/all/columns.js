import { defineMessages } from 'react-intl';
import { getDisplayName } from 'cspace-refname';

import {
  formatTimestamp,
  formatServiceObjectName,
  formatWorkflowStateIcon,
} from '../../../helpers/formatHelpers';

export default {
  default: [
    {
      name: 'workflowState',
      formatValue: formatWorkflowStateIcon,
      width: 16,
      flexGrow: 0,
      flexShrink: 0,
    },
    {
      name: 'docNumber',
      messages: defineMessages({
        label: {
          id: 'column.all.default.docNumber',
          defaultMessage: 'Record',
        },
      }),
      // The value -might- be a refname.
      // FIXME: It could also be an option list value. How to tell?
      formatValue: value => getDisplayName(value) || value,
      width: 200,
    },
    {
      name: 'docName',
      messages: defineMessages({
        label: {
          id: 'column.all.default.docName',
          defaultMessage: 'Summary',
        },
      }),
      // The value -might- be a refname.
      // FIXME: It could also be an option list value. How to tell?
      formatValue: value => getDisplayName(value) || value,
      width: 300,
    },
    {
      name: 'docType',
      messages: defineMessages({
        label: {
          id: 'column.all.default.docType',
          defaultMessage: 'Type',
        },
      }),
      formatValue: (value, formatterContext) =>
        formatServiceObjectName(value, formatterContext),
      width: 150,
    },
    {
      name: 'updatedAt',
      messages: defineMessages({
        label: {
          id: 'column.all.default.updatedAt',
          defaultMessage: 'Updated',
        },
      }),
      formatValue: formatTimestamp,
      sortBy: 'collectionspace_core:updatedAt',
      width: 150,
    },
  ],
};
