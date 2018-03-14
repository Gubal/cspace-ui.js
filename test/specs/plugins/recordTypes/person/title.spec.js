import Immutable from 'immutable';
import createTitleGetter from '../../../../../src/plugins/recordTypes/person/title';
import createConfigContext from '../../../../../src/helpers/createConfigContext';

chai.should();

describe('person record title', function suite() {
  const configContext = createConfigContext();
  const title = createTitleGetter(configContext);

  it('should return the primary display name', function test() {
    const data = Immutable.fromJS({
      document: {
        'ns2:persons_common': {
          personTermGroupList: {
            personTermGroup: [{
              termDisplayName: 'Primary Display Name',
            }, {
              termDisplayName: 'Alternate Display Name',
            }],
          },
        },
      },
    });

    title(data).should.equal('Primary Display Name');
  });

  it('should return empty string if no data is passed', function test() {
    title(null).should.equal('');
    title(undefined).should.equal('');
  });

  it('should return empty string if the common part is not present', function test() {
    const data = Immutable.fromJS({
      document: {
        'ns2:persons_extension': {
          foo: 'bar',
        },
      },
    });

    title(data).should.equal('');
  });
});
