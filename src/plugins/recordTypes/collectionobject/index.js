import advancedSearch from './advancedSearch';
import columns from './columns';
import fields from './fields';
import forms from './forms';
import idGenerators from './idGenerators';
import messages from './messages';
import optionLists from './optionLists';
import serviceConfig from './serviceConfig';
import title from './title';

export default () => pluginContext => ({
  idGenerators,
  optionLists,
  recordTypes: {
    collectionobject: {
      advancedSearch,
      columns,
      messages,
      serviceConfig,
      defaultForSearch: true, // Is this the default in search dropdowns?
      fields: fields(pluginContext),
      forms: forms(pluginContext),
      title: title(pluginContext),
    },
  },
});
