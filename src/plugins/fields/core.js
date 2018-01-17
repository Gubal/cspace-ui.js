import { defineMessages } from 'react-intl';

export default () => (pluginContext) => {
  const {
    DATA_TYPE_DATETIME,
  } = pluginContext.dataTypes;

  const {
    configKey: config,
  } = pluginContext.configHelpers;

  const {
    TextInput,
    DateInput,
    DateTimeInput,
  } = pluginContext.inputComponents;

  return {
    fields: {
      core: {
        'ns2:collectionspace_core': {
          createdAt: {
            [config]: {
              dataType: DATA_TYPE_DATETIME,
              messages: defineMessages({
                name: {
                  id: 'field.collectionspace_core.createdAt.name',
                  defaultMessage: 'Created time',
                },
              }),
              searchView: {
                type: DateInput,
              },
              view: {
                type: DateTimeInput,
                props: {
                  readOnly: true,
                },
              },
            },
          },
          createdBy: {
            [config]: {
              view: {
                type: TextInput,
              },
            },
          },
          updatedAt: {
            [config]: {
              dataType: DATA_TYPE_DATETIME,
              messages: defineMessages({
                name: {
                  id: 'field.collectionspace_core.updatedAt.name',
                  defaultMessage: 'Last updated time',
                },
              }),
              searchView: {
                type: DateInput,
              },
              view: {
                type: DateTimeInput,
                props: {
                  readOnly: true,
                },
              },
            },
          },
          updatedBy: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.collectionspace_core.updatedBy.name',
                  defaultMessage: 'Last updated by',
                },
              }),
              view: {
                type: TextInput,
              },
            },
          },
        },
      },
    },
  };
};
