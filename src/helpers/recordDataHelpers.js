import Immutable from 'immutable';
import get from 'lodash/get';

import {
  ERR_DATA_TYPE,
  ERR_MISSING_REQ_FIELD,
} from '../constants/errorCodes';

import {
  configKey,
  getDefaults,
  getDefaultValue,
  getFieldCustomValidator,
  getFieldDataType,
  isFieldCloneable,
  isFieldRepeating,
  isFieldRequired,
} from './configHelpers';

const numericPattern = /^[0-9]$/;

export const NS_PREFIX = 'ns2';
export const DOCUMENT_PROPERTY_NAME = 'document';
export const ERROR_KEY = '[error]';

export const getPartPropertyName = partName =>
  `${NS_PREFIX}:${partName}`;

export const getPart = (cspaceDocument, partName) =>
  cspaceDocument.get(getPartPropertyName(partName));

export const getPartNSPropertyName = () =>
  `@xmlns:${NS_PREFIX}`;

/**
 * Deeply get a value in an Immutable.Map. This is similar to Immutable.Map.getIn, but differs in
 * one way:
 *
 * When a key of '0' is encountered, and that key is used to index a data item that is not a List,
 * the data item itself is returned. This accommodates data in which a list containing a single
 * item may be represented by that one item.
 */
export const deepGet = (data, path) => {
  if (!Array.isArray(path) || path.length === 0) {
    throw new Error('path must be a non-empty array');
  }

  if (!data) {
    return undefined;
  }

  const [key, ...rest] = path;

  let value;

  if ((key === '0' || key === 0) && !Immutable.List.isList(data)) {
    // Allow a key of 0 to refer to a single non-list value.
    value = data;
  } else {
    value = data.get(key);
  }

  if (!value || rest.length === 0) {
    return value;
  }

  return deepGet(value, rest);
};

/**
 * Deeply set a value in an Immutable.Map. This is similar to Immutable.Map.setIn, but differs in
 * two ways:
 *
 * When a non-existent key is encountered in the middle of a path, this function may create a List
 * or a Map at that location, depending on the key. If the key is a numeric string, a List is
 * created. Otherwise, a Map is created. Immutable.Map.setIn always creates a Map.
 *
 * This function also promotes an existing singular (non-List) item to a List, if any numeric key
 * is applied to it.
 */
export const deepSet = (data, path, value) => {
  if (!Array.isArray(path) || path.length === 0) {
    throw new Error('path must be a non-empty array');
  }

  const [key, ...rest] = path;
  const isKeyNumeric = numericPattern.test(key);

  let normalizedData;

  if (data) {
    if (isKeyNumeric && !Immutable.List.isList(data)) {
      // Promote a single (non-list) value into a list when a numeric key is supplied.
      normalizedData = Immutable.List.of(data);
    } else {
      normalizedData = data;
    }
  } else if (isKeyNumeric) {
    normalizedData = Immutable.List();
  } else {
    normalizedData = Immutable.Map();
  }

  const resolvedValue = (rest.length === 0) ? value : deepSet(normalizedData.get(key), rest, value);

  return normalizedData.set(key, resolvedValue);
};

/**
 * Deeply delete a value in an Immutable.Map. This is similar to Immutable.Map.deleteIn, but differs
 * in two ways:
 *
 * When a non-existent key is encountered in the middle of a path, this function may create a List
 * or a Map at that location, depending on the key. If the key is a numeric string, a List is
 * created. Otherwise, a Map is created. Immutable.Map.deleteIn makes no change when a key in the
 * path does not exist.
 *
 * This function also promotes an existing singular (non-List) item to a List, if any numeric key
 * is applied to it.
 */
export const deepDelete = (data, path) =>
  // First call deepSet with undefined value to ensure the path exists. Then call deleteIn.
  deepSet(data, path).deleteIn(path);

/**
 * Create a blank data record for a given CollectionSpace record type.
 */
export const createBlankRecord = (recordTypeConfig) => {
  const {
    fields,
    serviceConfig,
  } = recordTypeConfig;

  const documentKey = (Object.keys(fields))[0];
  const documentDescriptor = fields[documentKey];
  const partKeys = Object.keys(documentDescriptor);

  const document = {
    '@name': serviceConfig.documentName,
  };

  partKeys.forEach((partKey) => {
    const partDescriptor = documentDescriptor[partKey];
    const nsUri = get(partDescriptor, [configKey, 'service', 'ns']);

    if (nsUri) {
      document[partKey] = {
        [getPartNSPropertyName()]: nsUri,
      };
    }
  });

  return Immutable.fromJS({
    [documentKey]: document,
  });
};

/**
 * Set a default value into record data. When declared on a repeating field, a default value will
 * be set on all instances of that field existing in the record data. If a repeating field has no
 * instances, a single instance will be created.
 */
export const spreadDefaultValue = (value, fieldDescriptorPath, data) => {
  if (!fieldDescriptorPath || fieldDescriptorPath.length === 0) {
    return (typeof data === 'undefined' ? value : data);
  }

  let map;

  if (typeof data === 'undefined') {
    map = Immutable.Map();
  } else if (Immutable.Map.isMap(data)) {
    map = data;
  } else {
    return data;
  }

  const [key, ...rest] = fieldDescriptorPath;
  const child = map.get(key);

  if (Immutable.List.isList(child)) {
    return (
      child.reduce((updatedData, instance, index) =>
        updatedData.setIn([key, index], spreadDefaultValue(value, rest, instance)), map)
    );
  }

  return map.set(key, spreadDefaultValue(value, rest, child));
};

/**
 * Set default values in record data.
 */
export const applyDefaults = (fieldDescriptor, data) =>
  getDefaults(fieldDescriptor).reduce((updatedData, defaultDescriptor) =>
    spreadDefaultValue(defaultDescriptor.value, defaultDescriptor.path, updatedData), data);

/**
 * Create a skeletal data record for a given CollectionSpace service.
 */
export const createRecordData = recordTypeConfig =>
  applyDefaults(recordTypeConfig.fields, createBlankRecord(recordTypeConfig));

/**
 * Clear uncloneable fields from record data. Existing (not undefined) values in fields that are
 * not cloneable are set to the default value if one exists, or undefined otherwise.
 */
export const clearUncloneable = (fieldDescriptor, data) => {
  if (!fieldDescriptor) {
    return data;
  }

  if (typeof data !== 'undefined' && !isFieldCloneable(fieldDescriptor)) {
    // If the field has been configured as not cloneable and there is an existing value, replace
    // the existing value with the default value if there is one, or undefined otherwise. The old
    // UI did not set uncloneable fields to the default value, but I think this was an oversight.

    return getDefaultValue(fieldDescriptor);
  }

  if (Immutable.Map.isMap(data)) {
    return data.reduce((updatedData, child, name) =>
      updatedData.set(name, clearUncloneable(fieldDescriptor[name], child)), data);
  }

  if (Immutable.List.isList(data)) {
    return data.reduce((updatedData, child, index) =>
      updatedData.set(index, clearUncloneable(fieldDescriptor, child)), data);
  }

  return data;
};

/**
 * Create a new record as a clone of a given record.
 */
export const cloneRecordData = (recordTypeConfig, data) => {
  if (!data) {
    return data;
  }

  let clone = data;

  // Delete parts that should not exist in new records.

  clone = clone.deleteIn(['document', `${NS_PREFIX}:collectionspace_core`]);
  clone = clone.deleteIn(['document', `${NS_PREFIX}:account_permission`]);

  // Reset fields that are configured as not cloneable.

  clone = clearUncloneable(recordTypeConfig.fields, clone);

  return clone;
};

/**
 * Get the document from the data record.
 */
export const getDocument = data =>
  data.get(DOCUMENT_PROPERTY_NAME);

/**
 * Comparator function to sort properties that represent XML attributes and namespace declarations
 * (those that start with '@') to the top.
 */
export const attributePropertiesToTop = (propertyNameA, propertyNameB) => {
  const firstCharA = propertyNameA.charAt(0);
  const firstCharB = propertyNameB.charAt(0);

  if (firstCharA === firstCharB) {
    return 0;
  }

  if (firstCharA === '@') {
    return -1;
  }

  if (firstCharB === '@') {
    return 1;
  }

  return 0;
};

/**
 * Prepare record data for POST or PUT to the CollectionSpace REST API. Document parts that may
 * be present in data retrieved from the REST API, but that do not need to be present in data sent
 * to the API, are removed. In the remaining parts, properties beginning with '@', which represent
 * XML attributes and namespace declarations, are moved to the top. This is required by the REST
 * API in order to properly translate the payload to XML.
 */
export const prepareForSending = (data) => {
  // Filter out the core schema and account information parts.

  let cspaceDocument = data.get(DOCUMENT_PROPERTY_NAME)
    .filter((value, key) =>
      (key !== `${NS_PREFIX}:collectionspace_core` && key !== `${NS_PREFIX}:account_permission`));

  // For each remaining part, move XML attribute and namespace declaration properties (those
  // that start with @) to the top, since the REST API requires this.

  for (const key of cspaceDocument.keys()) {
    if (key.charAt(0) !== '@') {
      const part = cspaceDocument.get(key);
      const sortedPart = part.sortBy((value, name) => name, attributePropertiesToTop);

      cspaceDocument = cspaceDocument.set(key, sortedPart);
    }
  }

  // Filter out hierarchy relations that don't have both a subject and an object, since the REST
  // API will error. These will occur when hierarchy autocomplete fields are emptied, or new
  // child instances are created but not filled in.

  // TODO: Move this to a computation in the HierarchyInput, when a computed field infrastructure
  // exists.

  const relations = cspaceDocument.getIn(['ns2:relations-common-list', 'relation-list-item']);

  if (relations && Immutable.List.isList(relations)) {
    const filteredRelations = relations.filter(relation => (
      (relation.getIn(['object', 'refName']) || relation.getIn(['object', 'csid'])) &&
      (relation.getIn(['subject', 'refName']) || relation.getIn(['subject', 'csid']))
    ));

    cspaceDocument = cspaceDocument.setIn(
      ['ns2:relations-common-list', 'relation-list-item'], filteredRelations
    );
  }

  return data.set(DOCUMENT_PROPERTY_NAME, cspaceDocument);
};

export const getCoreFieldValue = (data, fieldName) => {
  if (data) {
    const document = getDocument(data);

    if (document) {
      const corePart = getPart(document, 'collectionspace_core');

      if (corePart) {
        return corePart.get(fieldName);
      }
    }
  }

  return undefined;
};

export const getUpdatedTimestamp = data =>
  getCoreFieldValue(data, 'updatedAt');

export const getUpdatedUser = data =>
  getCoreFieldValue(data, 'updatedBy');

export const getCreatedTimestamp = data =>
  getCoreFieldValue(data, 'createdAt');

export const getCreatedUser = data =>
  getCoreFieldValue(data, 'createdBy');

const intPattern = /^-?\d+$/;
const floatPattern = /^-?\d+(\.\d+)?$/;
const datePattern = /^\d{4}-\d{2}-\d{2}(T00:00:00.000Z)?$/;
const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const dataTypeValidators = {
  DATA_TYPE_MAP: value => Immutable.Map.isMap(value),
  DATA_TYPE_STRING: () => true,
  DATA_TYPE_INT: value => intPattern.test(value),
  DATA_TYPE_FLOAT: value => floatPattern.test(value),
  DATA_TYPE_BOOL: value => (typeof value === 'boolean'),
  DATA_TYPE_DATE: value => datePattern.test(value),
  DATA_TYPE_DATETIME: value => dateTimePattern.test(value),
};

const validateDataType = (value, dataType) => {
  const validator = dataTypeValidators[dataType];

  return (validator ? validator(value) : true);
};

export const validateField = (fieldDescriptor, data, expandRepeating = true) => {
  if (!fieldDescriptor) {
    return null;
  }

  let errors = Immutable.Map();

  if (expandRepeating && isFieldRepeating(fieldDescriptor)) {
    // This is a repeating field, and the expand flag is true. Validate each instance against the
    // current field descriptor.

    const instances = Immutable.List.isList(data) ? data : Immutable.List.of(data);

    instances.forEach((instance, index) => {
      const instanceErrors = validateField(fieldDescriptor, instances.get(index), false);

      if (instanceErrors) {
        errors = errors.set(index, instanceErrors);
      }
    });

    return (errors.size > 0 ? errors : null);
  }

  const dataType = getFieldDataType(fieldDescriptor);

  if (dataType === 'DATA_TYPE_MAP' && Immutable.Map.isMap(data)) {
    // Validate this field's children, and add any child errors to the errors map.

    const childKeys = Object.keys(fieldDescriptor).filter(key => key !== configKey);

    childKeys.forEach((childKey) => {
      const childData = data ? data.get(childKey) : undefined;
      const childErrors = validateField(fieldDescriptor[childKey], childData);

      if (childErrors) {
        errors = errors.set(childKey, childErrors);
      }
    });
  }

  let error;

  // Check required.

  const required = isFieldRequired(fieldDescriptor);

  // TODO: Does this make sense for compound fields?

  if (required && (typeof data === 'undefined' || data === null || data === '')) {
    error = Immutable.Map({
      code: ERR_MISSING_REQ_FIELD,
    });
  }

  if (!error && typeof data !== 'undefined' && data !== null && data !== '') {
    // Check data type.

    if (!validateDataType(data, dataType)) {
      error = Immutable.Map({
        dataType,
        code: ERR_DATA_TYPE,
        value: data,
      });
    }

    if (!error) {
      // Custom validation.

      const customValidator = getFieldCustomValidator(fieldDescriptor);

      if (customValidator) {
        // TODO: Run custom validator.
      }
    }
  }

  if (error) {
    errors = errors.set(ERROR_KEY, error);
  }

  return (errors.size > 0 ? errors : null);
};

export const validateRecordData = (recordTypeConfig, data) =>
  validateField(get(recordTypeConfig, 'fields'), data);
