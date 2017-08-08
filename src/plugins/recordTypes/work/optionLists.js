import { defineMessages } from 'react-intl';

// FIXME: Plugins shouldn't have to import react-intl, since this unnecessarily increases the size
// when built as a standalone package. Instead, defineMessages should be supplied in the
// pluginContext. But this means that messages won't be extracted by the Babel plugin, since it
// only operates on files that import react-intl.

export default {
  workTermStatus: {
    values: [
      'quick-added-but-needs-attention',
      'in-progress',
      'complete',
    ],
    messages: defineMessages({
      'quick-added-but-needs-attention': {
        id: 'option.workTermStatus.quick-added-but-needs-attention',
        defaultMessage: 'quick added but needs attention',
      },
      'in-progress': {
        id: 'option.workTermStatus.in-progress',
        defaultMessage: 'in progress',
      },
      complete: {
        id: 'option.workTermStatus.complete',
        defaultMessage: 'complete',
      },
    }),
  },
};
