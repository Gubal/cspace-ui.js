import createConfigContext from '../../../../../src/helpers/createConfigContext';
import advancedSearch from '../../../../../src/plugins/recordTypes/objectexit/advancedSearch';

chai.should();

describe('object exit record advanced search', function suite() {
  const configContext = createConfigContext();

  it('should contain a top level property `op`', function test() {
    advancedSearch(configContext).should.have.property('op');
  });

  it('should contain a top level property `value` that is an array', function test() {
    advancedSearch(configContext).should.have.property('value').that.is.an('array');
  });
});
