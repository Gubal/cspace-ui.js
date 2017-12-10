import Immutable from 'immutable';
import createTitleGetter from '../../../../../src/plugins/recordTypes/loanin/title';
import createPluginContext from '../../../../../src/helpers/createPluginContext';

chai.should();

describe('loan-in record title', function suite() {
  const pluginContext = createPluginContext();
  const title = createTitleGetter(pluginContext);

  it('should concat the loan-in number and lender', function test() {
    const data = Immutable.fromJS({
      document: {
        'ns2:loansin_common': {
          loanInNumber: 'LI.2017.2',
          lenderGroupList: {
            lenderGroup: [{
              lender: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(DavidBowie1480570017652)\'David Bowie\'',
            }, {
              lender: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(BruceSpringsteen1480570017652)\'Bruce Springsteen\'',
            }],
          },
        },
      },
    });

    title(data).should.equal('LI.2017.2 – David Bowie');
  });

  it('should return the loan-in number when lender is empty', function test() {
    const data = Immutable.fromJS({
      document: {
        'ns2:loansin_common': {
          loanInNumber: 'LI.2017.2',
          lenderGroupList: {},
        },
      },
    });

    title(data).should.equal('LI.2017.2');
  });

  it('should return the lender when loan-in number is empty', function test() {
    const data = Immutable.fromJS({
      document: {
        'ns2:loansin_common': {
          loanInNumber: '',
          lenderGroupList: {
            lenderGroup: [{
              lender: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(DavidBowie1480570017652)\'David Bowie\'',
            }, {
              lender: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(BruceSpringsteen1480570017652)\'Bruce Springsteen\'',
            }],
          },
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
        'ns2:loansout_extension': {
          loanInNumber: 'Something',
          lenderGroupList: {},
        },
      },
    });

    title(data).should.equal('');
  });
});
