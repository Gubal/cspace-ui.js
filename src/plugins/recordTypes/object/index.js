import defaultForm from './forms/default';
import messageDescriptors from './messageDescriptors';
import serviceConfig from './serviceConfig';
import title from './title';
import optionLists from './optionLists';

export default () => pluginContext => ({
  optionLists,
  recordTypes: {
    object: {
      messageDescriptors,
      serviceConfig,
      forms: {
        default: defaultForm(pluginContext),
      },
      title: title(pluginContext),
    },
  },
});
