import Field from '../../../../../../src/components/record/Field';
import form from '../../../../../../src/plugins/recordTypes/place/forms/default';
import createConfigContext from '../../../../../../src/helpers/createConfigContext';

chai.should();

describe('place record default form', function suite() {
  it('should be a Field', function test() {
    const configContext = createConfigContext();
    const { template } = form(configContext);

    template.type.should.equal(Field);
  });
});
