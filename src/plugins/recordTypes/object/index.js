import columns from './columns';
import defaultForm from './forms/default';
import idGenerators from './idGenerators';
import messageDescriptors from './messageDescriptors';
import serviceConfig from './serviceConfig';
import title from './title';
import optionLists from './optionLists';

export default () => pluginContext => ({
  idGenerators,
  optionLists,
  recordTypes: {
    object: {
      columns,
      messageDescriptors,
      serviceConfig,
      defaultForSearch: true, // Is this the default in search dropdowns?
      forms: {
        default: defaultForm(pluginContext),
      },
      sortOrder: null, // Ordering among record types of the same type
      title: title(pluginContext),
    },
  },
});
