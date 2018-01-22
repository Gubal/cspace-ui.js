import { defineMessages } from 'react-intl';

export default (pluginContext) => {
  const {
    formatOption,
    formatRefNameAsVocabularyName,
    formatTimestamp,
    formatWorkflowStateIcon,
  } = pluginContext.formatHelpers;

  return {
    default: [
      {
        name: 'workflowState',
        formatValue: formatWorkflowStateIcon,
        width: 32,
        flexGrow: 0,
        flexShrink: 0,
      },
      {
        name: 'termDisplayName',
        messages: defineMessages({
          label: {
            id: 'column.work.default.termDisplayName',
            defaultMessage: 'Display name',
          },
        }),
        sortBy: 'works_common:workTermGroupList/0/termDisplayName',
        width: 250,
      },
      {
        name: 'termStatus',
        messages: defineMessages({
          label: {
            id: 'column.work.default.termStatus',
            defaultMessage: 'Term status',
          },
        }),
        sortBy: 'works_common:workTermGroupList/0/termStatus',
        formatValue: (data, formatterContext) =>
          formatOption('workTermStatuses', data, formatterContext),
        width: 250,
      },
      {
        name: 'vocabulary',
        dataKey: 'refName',
        messages: defineMessages({
          label: {
            id: 'column.work.default.vocabulary',
            defaultMessage: 'Vocabulary',
          },
        }),
        formatValue: (value, formatterContext) =>
          formatRefNameAsVocabularyName(value, formatterContext),
        width: 150,
      },
      {
        name: 'updatedAt',
        messages: defineMessages({
          label: {
            id: 'column.work.search.updatedAt',
            defaultMessage: 'Updated',
          },
        }),
        formatValue: formatTimestamp,
        sortBy: 'collectionspace_core:updatedAt',
        width: 150,
      },
    ],
  };
};
