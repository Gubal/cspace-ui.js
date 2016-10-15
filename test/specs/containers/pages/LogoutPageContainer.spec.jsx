import React from 'react';
import configureMockStore from 'redux-mock-store';
import { createRenderer } from 'react-addons-test-utils';
import LogoutPage from '../../../../src/components/pages/LogoutPage';
import LogoutPageContainer from '../../../../src/containers/pages/LogoutPageContainer';

chai.should();

const mockStore = configureMockStore([]);

describe('LogoutPageContainer', function suite() {
  it('should set props on LogoutPage', function test() {
    const store = mockStore({});
    const context = { store };
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<LogoutPageContainer />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(LogoutPage);
    result.props.should.have.property('onMount').that.is.a('function');
  });
});
