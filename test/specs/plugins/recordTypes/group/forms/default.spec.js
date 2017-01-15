import Field from '../../../../../../src/components/record/Field';
import formTemplate from '../../../../../../src/plugins/recordTypes/group/forms/default';
import createPluginContext from '../../../../../../src/helpers/createPluginContext';

chai.should();

describe('group record default form', function suite() {
  it('should be a Field', function test() {
    const pluginContext = createPluginContext();
    const template = formTemplate(pluginContext);

    template.type.should.equal(Field);
  });
});
