import { Component, Children } from 'react';
import PropTypes from 'prop-types';

export default class RecordTypesProvider extends Component {
  getChildContext() {
    return {
      recordTypes: this.props.recordTypes,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

RecordTypesProvider.propTypes = {
  children: PropTypes.node.isRequired,
  recordTypes: PropTypes.object.isRequired,
};

RecordTypesProvider.childContextTypes = {
  recordTypes: PropTypes.object,
};
