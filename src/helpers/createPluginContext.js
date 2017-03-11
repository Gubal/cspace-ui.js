import React from 'react';
import Immutable from 'immutable';

import { components as inputComponents } from 'cspace-input';
import { Row } from 'cspace-layout';
import { getDisplayName } from 'cspace-refname';

import DateInputContainer from '../containers/input/DateInputContainer';
import IDGeneratorInputContainer from '../containers/input/IDGeneratorInputContainer';
import AuthorityControlledInputContainer from '../containers/input/AuthorityControlledInputContainer';
import OptionListControlledInputContainer from '../containers/input/OptionListControlledInputContainer';
import StructuredDateInputContainer from '../containers/input/StructuredDateInputContainer';
import VocabularyControlledInputContainer from '../containers/input/VocabularyControlledInputContainer';

import Panel from '../containers/layout/PanelContainer';
import Field from '../components/record/Field';
import InputTable from '../components/record/InputTable';

import * as dataTypes from '../constants/dataTypes';

import {
  configKey,
} from '../helpers/configHelpers';

import {
  deepGet,
  getPart,
  getPartPropertyName,
} from '../helpers/recordDataHelpers';

const {
  CompoundInput,
  TextInput,
} = inputComponents;

const AuthorityControlledInput = AuthorityControlledInputContainer;
const IDGeneratorInput = IDGeneratorInputContainer;
const DateInput = DateInputContainer;
const OptionListControlledInput = OptionListControlledInputContainer;
const StructuredDateInput = StructuredDateInputContainer;
const VocabularyControlledInput = VocabularyControlledInputContainer;

export default () => ({
  dataTypes,
  lib: {
    Immutable,
    React,
  },
  inputComponents: {
    AuthorityControlledInput,
    CompoundInput,
    DateInput,
    IDGeneratorInput,
    OptionListControlledInput,
    StructuredDateInput,
    TextInput,
    VocabularyControlledInput,
  },
  layoutComponents: {
    Panel,
    Row,
  },
  recordComponents: {
    Field,
    InputTable,
  },
  configHelpers: {
    configKey,
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
