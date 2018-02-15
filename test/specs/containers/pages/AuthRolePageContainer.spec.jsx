import React from 'react';
import configureMockStore from 'redux-mock-store';
import { createRenderer } from 'react-test-renderer/shallow';
import Immutable from 'immutable';
import AuthRolePage from '../../../../src/components/pages/AuthRolePage';
import AuthRolePageContainer from '../../../../src/containers/pages/AuthRolePageContainer';

chai.should();

const mockStore = configureMockStore();

const perms = Immutable.fromJS({
  collectionobject: {
    data: 'CRUDL',
  },
  group: {
    data: 'CRUDL',
  },
});

const store = mockStore({
  user: Immutable.Map({
    perms,
  }),
});

describe('AuthRolePageContainer', function suite() {
  it('should set props on AuthRolePage', function test() {
    const context = { store };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(<AuthRolePageContainer />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(AuthRolePage);
    result.props.should.have.property('perms', perms);
    result.props.should.have.property('setAdminTab').that.is.a('function');
  });
});