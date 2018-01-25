export default (pluginContext) => {
  const {
    OP_OR,
    OP_EQ,
    OP_CONTAIN,
  } = pluginContext.searchOperators;

  const {
    extensions,
  } = pluginContext.config;

  return {
    op: OP_OR,
    value: [
      {
        op: OP_EQ,
        path: 'ns2:pottags_common/family',
      },
      {
        op: OP_CONTAIN,
        path: 'ns2:pottags_common/commonName',
      },
      {
        op: OP_CONTAIN,
        path: 'ns2:pottags_common/locale',
      },
      {
        op: OP_EQ,
        path: 'ns2:pottags_common/taxonName',
      },
      {
        op: OP_EQ,
        path: 'ns2:pottags_common/printLabels',
      },
      ...extensions.core.advancedSearch,
    ],
  };
};
