import columns from '../../../../../src/plugins/recordTypes/taxon/columns';

chai.should();

describe('taxon record columns', function suite() {
  const config = {
    recordTypes: {
      taxon: {
        serviceConfig: {
          servicePath: 'taxonomyauthority',
        },
        vocabularies: {
          local: {
            messages: {
              name: {
                id: 'vocab.taxon.local.name',
              },
            },
            serviceConfig: {
              servicePath: 'urn:cspace:name(taxon)',
            },
          },
        },
      },
    },
  };

  const intl = {
    formatMessage: message => `formatted ${message.id}`,
  };

  it('should have correct shape', function test() {
    columns.should.have.property('default').that.is.an('array');
  });

  it('should have vocabulary column that is formatted as a vocabulary name from a short id in a ref name', function test() {
    const vocabularyColumn = columns.default.find(column => column.name === 'vocabulary');

    vocabularyColumn.should.have.property('formatValue').that.is.a('function');

    const refName = 'urn:cspace:botgarden.collectionspace.org:taxonomyauthority:name(taxon):item:name(Dendrobiumdelacourii1500604130694)\'Dendrobium delacourii\'';

    vocabularyColumn.formatValue(refName, { intl, config }).should
      .equal('formatted vocab.taxon.local.name');
  });
});
