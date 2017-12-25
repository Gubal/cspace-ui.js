import { defineMessages } from 'react-intl';

export default (pluginContext) => {
  const {
    formatOption,
    formatRefNameAsVocabularyName,
    formatTimestamp,
  } = pluginContext.formatHelpers;

  return {
    default: [
      {
        name: 'termDisplayName',
        messages: defineMessages({
          label: {
            id: 'column.location.default.termDisplayName',
            defaultMessage: 'Display name',
          },
        }),
        sortBy: 'locations_common:locTermGroupList/0/termDisplayName',
        width: 250,
      },
      {
        name: 'termStatus',
        messages: defineMessages({
          label: {
            id: 'column.location.default.termStatus',
            defaultMessage: 'Term status',
          },
        }),
        sortBy: 'locations_common:locTermGroupList/0/termStatus',
        formatValue: (data, formatterContext) =>
          formatOption('locationTermStatuses', data, formatterContext),
        width: 250,
      },
      {
        name: 'vocabulary',
        dataKey: 'refName',
        messages: defineMessages({
          label: {
            id: 'column.location.default.vocabulary',
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
            id: 'column.location.search.updatedAt',
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
