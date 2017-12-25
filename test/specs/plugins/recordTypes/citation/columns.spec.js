import createColumns from '../../../../../src/plugins/recordTypes/citation/columns';
import createPluginContext from '../../../../../src/helpers/createPluginContext';

chai.should();

describe('citation record columns', function suite() {
  const pluginContext = createPluginContext();
  const columns = createColumns(pluginContext);

  const config = {
    optionLists: {
      citationTermStatuses: {
        messages: {
          value1: {
            id: 'option.citationTermStatuses.value1',
            defaultMessage: 'Value 1',
          },
        },
      },
    },
    recordTypes: {
      citation: {
        serviceConfig: {
          servicePath: 'citationauthorities',
        },
        vocabularies: {
          local: {
            messages: {
              name: {
                id: 'vocab.citation.local.name',
              },
            },
            serviceConfig: {
              servicePath: 'urn:cspace:name(citation)',
            },
          },
          worldcat: {
            messages: {
              name: {
                id: 'vocab.citation.worldcat.name',
              },
            },
            serviceConfig: {
              servicePath: 'urn:cspace:name(worldcat)',
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

    const refName = 'urn:cspace:core.collectionspace.org:citationauthorities:name(citation):item:name(NIH1484001439799)\'NIH\'';

    vocabularyColumn.formatValue(refName, { intl, config }).should
      .equal('formatted vocab.citation.local.name');
  });

  it('should have term status column that is formatted as an option list value', function test() {
    const termStatusColumn = columns.default.find(column => column.name === 'termStatus');

    termStatusColumn.should.have.property('formatValue').that.is.a('function');

    termStatusColumn.formatValue('value1', { intl, config }).should
      .equal('formatted option.citationTermStatuses.value1');
  });
});
