import Immutable from 'immutable';
import createTitleGetter from '../../../../../src/plugins/recordTypes/group/title';
import createPluginContext from '../../../../../src/helpers/createPluginContext';

chai.should();

describe('group record title', function suite() {
  const pluginContext = createPluginContext();
  const title = createTitleGetter(pluginContext);

  it('should concat the title and owner', function test() {
    const data = Immutable.fromJS({
      document: {
        'ns2:groups_common': {
          title: 'Group 1',
          owner: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(DavidBowie1480570017652)\'David Bowie\'',
        },
      },
    });

    title(data).should.equal('Group 1 – David Bowie');
  });

  it('should return the title when owner is empty', function test() {
    const data = Immutable.fromJS({
      document: {
        'ns2:groups_common': {
          title: 'Group 1',
          owner: '',
        },
      },
    });

    title(data).should.equal('Group 1');
  });

  it('should return the owner when title is empty', function test() {
    const data = Immutable.fromJS({
      document: {
        'ns2:groups_common': {
          title: '',
          owner: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(DavidBowie1480570017652)\'David Bowie\'',
        },
      },
    });

    title(data).should.equal('David Bowie');
  });

  it('should return empty string if no data is passed', function test() {
    title(null).should.equal('');
    title(undefined).should.equal('');
  });

  it('should return empty string if the common part is not present', function test() {
    const data = Immutable.fromJS({
      document: {
        'ns2:groups_extension': {
          title: 'Something',
        },
      },
    });

    title(data).should.equal('');
  });
});
