import React from 'react';
import Immutable from 'immutable';

import {
  components as inputComponents,
} from 'cspace-input';

import AuthorityControlledInputContainer from '../containers/input/AuthorityControlledInputContainer';
import OptionControlledInputContainer from '../containers/input/OptionControlledInputContainer';
import VocabularyControlledInputContainer from '../containers/input/VocabularyControlledInputContainer';

import Panel from '../containers/layout/PanelContainer';
import Row from '../components/layout/Row';

import {
  deepGet,
  getPart,
  getPartPropertyName,
} from '../helpers/recordDataHelpers';

import {
  getDisplayName,
} from '../helpers/refNameHelpers';

const {
  CompoundInput,
  DateInput,
  IDGeneratorInput,
  StructuredDateInput,
  TextInput,
} = inputComponents;

const AuthorityControlledInput = AuthorityControlledInputContainer;
const OptionControlledInput = OptionControlledInputContainer;
const VocabularyControlledInput = VocabularyControlledInputContainer;

export default () => ({
  lib: {
    Immutable,
    React,
  },
  inputComponents: {
    AuthorityControlledInput,
    CompoundInput,
    DateInput,
    IDGeneratorInput,
    OptionControlledInput,
    StructuredDateInput,
    TextInput,
    VocabularyControlledInput,
  },
  layoutComponents: {
    Panel,
    Row,
  },
  recordDataHelpers: {
    deepGet,
    getPart,
    getPartPropertyName,
  },
  refNameHelpers: {
    getDisplayName,
  },
});
