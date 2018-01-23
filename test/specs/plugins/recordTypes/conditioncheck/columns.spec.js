import createColumns from '../../../../../src/plugins/recordTypes/conditioncheck/columns';
import createPluginContext from '../../../../../src/helpers/createPluginContext';

chai.should();

describe('condition check record columns', function suite() {
  const pluginContext = createPluginContext();
  const columns = createColumns(pluginContext);

  const config = {
    optionLists: {
      conditions: {
        messages: {
          value1: {
            id: 'option.conditions.value1',
            defaultMessage: 'Value 1',
          },
        },
      },
    },
  };

  const intl = {
    formatMessage: message => `formatted ${message.id}`,
  };

  it('should have the correct shape', function test() {
    columns.should.have.property('default').that.is.an('object');
  });

  it('should have condition column that is formatted as an option list value', function test() {
    const conditionColumn = columns.default.condition;

    conditionColumn.should.have.property('formatValue').that.is.a('function');

    conditionColumn.formatValue('value1', { intl, config }).should
      .equal('formatted option.conditions.value1');
  });
});
