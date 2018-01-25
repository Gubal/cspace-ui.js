import createPluginContext from '../../../../../src/helpers/createPluginContext';
import advancedSearch from '../../../../../src/plugins/recordTypes/organization/advancedSearch';

chai.should();

describe('organization record advanced search', function suite() {
  const pluginContext = createPluginContext();

  it('should contain a top level property `op`', function test() {
    advancedSearch(pluginContext).should.have.property('op');
  });

  it('should contain a top level property `value` that is an array', function test() {
    advancedSearch(pluginContext).should.have.property('value').that.is.an('array');
  });
});
