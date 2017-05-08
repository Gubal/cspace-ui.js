import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { findAllWithType } from 'react-shallow-testutils';
import Immutable from 'immutable';
import chaiImmutable from 'chai-immutable';
import AutocompleteInputContainer from '../../../../src/containers/input/AutocompleteInputContainer';
import { BaseUntypedHierarchyEditor as UntypedHierarchyEditor } from '../../../../src/components/record/UntypedHierarchyEditor';

chai.use(chaiImmutable);
chai.should();

const intl = {
  formatDate: () => null,
  formatTime: () => null,
  formatRelative: () => null,
  formatNumber: () => null,
  formatPlural: () => null,
  formatMessage: () => null,
  formatHTMLMessage: () => null,
  now: () => null,
};

const messages = {
};

const hierarchy = Immutable.fromJS({
  parent: {
    refName: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(Parent)\'Parent\'',
  },
  children: [
    {
      refName: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(Child1)\'Child 1\'',
    },
    {
      refName: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(Child2)\'Child 2\'',
    },
  ],
});

describe('UntypedHierarchyEditor', function suite() {
  it('should render an input for the parent and a repeating input for the children', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <UntypedHierarchyEditor
        intl={intl}
        messages={messages}
        value={hierarchy}
      />
    );

    const result = shallowRenderer.getRenderOutput();
    const inputs = findAllWithType(result, AutocompleteInputContainer);

    inputs.should.have.lengthOf(2);

    inputs[0].props.value.should.equal(hierarchy.getIn(['parent', 'refName']));
    inputs[1].props.repeating.should.equal(true);
  });

  it('should filter the current record out of term matches', function test() {
    const csid = '1111';

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <UntypedHierarchyEditor
        csid={csid}
        intl={intl}
        messages={messages}
        value={hierarchy}
      />
    );

    const result = shallowRenderer.getRenderOutput();
    const inputs = findAllWithType(result, AutocompleteInputContainer);

    inputs.should.have.lengthOf(2);

    const matchFilter = inputs[0].props.matchFilter;

    inputs[1].props.matchFilter.should.equal(matchFilter);

    matchFilter({ csid }).should.equal(false);
    matchFilter({ csid: '1234' }).should.equal(true);
  });

  it('should call onCommit when a parent value is committed', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <UntypedHierarchyEditor
        intl={intl}
        messages={messages}
        value={hierarchy}
        onCommit={handleCommit}
      />
    );

    const result = shallowRenderer.getRenderOutput();
    const inputs = findAllWithType(result, AutocompleteInputContainer);

    const newValue = 'newValue';
    const newCsid = '1111';

    inputs[0].props.onCommit(undefined, newValue, newCsid);

    committedPath.should.deep.equal(['parent']);

    committedValue.should.equal(Immutable.fromJS({
      csid: newCsid,
      refName: newValue,
    }));
  });

  it('should call onCommit when a child value is committed', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <UntypedHierarchyEditor
        intl={intl}
        messages={messages}
        value={hierarchy}
        onCommit={handleCommit}
      />
    );

    const result = shallowRenderer.getRenderOutput();
    const inputs = findAllWithType(result, AutocompleteInputContainer);

    const newValue = 'newValue';

    inputs[1].props.onCommit(['1'], newValue);

    committedPath.should.deep.equal(['children', '1', 'refName']);
    committedValue.should.equal(newValue);
  });

  it('should call onAddChild when a child value is added', function test() {
    let handlerCalled = null;

    const handleAddChild = () => {
      handlerCalled = true;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <UntypedHierarchyEditor
        intl={intl}
        messages={messages}
        value={hierarchy}
        onAddChild={handleAddChild}
      />
    );

    const result = shallowRenderer.getRenderOutput();
    const inputs = findAllWithType(result, AutocompleteInputContainer);

    inputs[1].props.onAddInstance();

    handlerCalled.should.equal(true);
  });

  it('should call onRemoveChild when a child value is removed', function test() {
    let removedPosition = null;

    const handleRemoveChild = (positionArg) => {
      removedPosition = positionArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <UntypedHierarchyEditor
        intl={intl}
        messages={messages}
        value={hierarchy}
        onRemoveChild={handleRemoveChild}
      />
    );

    const result = shallowRenderer.getRenderOutput();
    const inputs = findAllWithType(result, AutocompleteInputContainer);

    inputs[1].props.onRemoveInstance(['1']);

    removedPosition.should.equal(1);
  });
});
