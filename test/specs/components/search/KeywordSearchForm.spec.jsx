import React from 'react';
import { render } from 'react-dom';
import createTestContainer from '../../../helpers/createTestContainer';
import KeywordSearchForm from '../../../../src/components/search/KeywordSearchForm';

chai.should();

const intl = {
  formatDate: () => null,
  formatTime: () => null,
  formatRelative: () => null,
  formatNumber: () => null,
  formatPlural: () => null,
  formatMessage: message => `formatted ${message.id}`,
  formatHTMLMessage: () => null,
  now: () => null,
};

const config = {
  recordTypes: {
    person: {
      messages: {
        record: {
          collectionName: {
            id: 'record.person.collectionName',
            defaultMessage: 'Persons',
          },
        },
      },
      serviceConfig: {
        serviceType: 'authority',
      },
      vocabularies: {
        local: {
          messages: {
            name: {
              id: 'vocab.person.local.name',
              defaultMessage: 'Local',
            },
          },
        },
      },
    },
  },
};

describe('KeywordSearchForm', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a fieldset', function test() {
    render(<KeywordSearchForm config={config} intl={intl} />, this.container);

    this.container.firstElementChild.nodeName.should.equal('FIELDSET');
  });

  it('should render a KeywordSearchInput', function test() {
    render(<KeywordSearchForm config={config} intl={intl} />, this.container);

    this.container.querySelector('.cspace-input-KeywordSearchInput--common').should.not.equal(null);
  });

  it('should use intl to format the record type and vocabulary names', function test() {
    render(
      <KeywordSearchForm
        config={config}
        intl={intl}
        recordTypeValue="person"
      />, this.container);

    const [recordTypeInput, vocabularyInput] = this.container.querySelectorAll('input');

    recordTypeInput.value.should.equal('formatted record.person.collectionName');
    vocabularyInput.value.should.equal('formatted vocab.person.local.name');
  });
});
