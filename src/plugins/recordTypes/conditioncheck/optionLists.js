import { defineMessages } from 'react-intl';

// FIXME: Plugins shouldn't have to import react-intl, since this unnecessarily increases the size
// when built as a standalone package. Instead, defineMessages should be supplied in the
// pluginContext. But this means that messages won't be extracted by the Babel plugin, since it
// only operates on files that import react-intl.

export default {
  objectAuditCategories: {
    values: [
      'low',
      'medium',
      'high',
    ],
    messages: defineMessages({
      low: {
        id: 'option.objectAuditCategories.low',
        defaultMessage: 'low',
      },
      medium: {
        id: 'option.objectAuditCategories.medium',
        defaultMessage: 'medium',
      },
      high: {
        id: 'option.objectAuditCategories.high',
        defaultMessage: 'high',
      },
    }),
  },
  completenessLevels: {
    values: [
      'complete',
      'fragmented',
      'incomplete',
    ],
    messages: defineMessages({
      complete: {
        id: 'option.completenessLevels.complete',
        defaultMessage: 'complete',
      },
      fragmented: {
        id: 'option.completenessLevels.fragmented',
        defaultMessage: 'fragmented',
      },
      incomplete: {
        id: 'option.completenessLevels.incomplete',
        defaultMessage: 'incomplete',
      },
    }),
  },
  conditions: {
    values: [
      'needs-no-work',
      'exhibitable-needs-work',
      'not-exhibitable-stable',
      'in-jeopardy',
    ],
    messages: defineMessages({
      'needs-no-work': {
        id: 'option.conditions.needs-no-work',
        defaultMessage: 'needs no work',
      },
      'exhibitable-needs-work': {
        id: 'option.conditions.exhibitable-needs-work',
        defaultMessage: 'exhibitable / needs work',
      },
      'not-exhibitable-stable': {
        id: 'option.conditions.not-exhibitable-stable',
        defaultMessage: 'not exhibitable / stable',
      },
      'in-jeopardy': {
        id: 'option.conditions.in-jeopardy',
        defaultMessage: 'in jeopardy',
      },
    }),
  },
  conservationTreatmentPriorities: {
    values: [
      'low',
      'medium',
      'high',
    ],
    messages: defineMessages({
      low: {
        id: 'option.conservationTreatmentPriorities.low',
        defaultMessage: 'low',
      },
      medium: {
        id: 'option.conservationTreatmentPriorities.medium',
        defaultMessage: 'medium',
      },
      high: {
        id: 'option.conservationTreatmentPriorities.high',
        defaultMessage: 'high',
      },
    }),
  },
  hazards: {
    values: [
      'poisonous',
      'radioactive',
    ],
    messages: defineMessages({
      poisonous: {
        id: 'option.hazards.poisonous',
        defaultMessage: 'poisonous',
      },
      radioactive: {
        id: 'option.hazards.radioactive',
        defaultMessage: 'radioactive',
      },
    }),
  },
  conditionCheckMethods: {
    values: [
      'observed',
      'x-rayed',
    ],
    messages: defineMessages({
      observed: {
        id: 'option.conditionCheckMethods.observed',
        defaultMessage: 'observed',
      },
      'x-rayed': {
        id: 'option.conditionCheckMethods.x-rayed',
        defaultMessage: 'x-rayed',
      },
    }),
  },
  conditionCheckReasons: {
    values: [
      'conservation',
      'damaged-in-transit',
      'loan-in',
      'new-acquisition',
    ],
    messages: defineMessages({
      conservation: {
        id: 'option.conditionCheckReasons.conservation',
        defaultMessage: 'conservation',
      },
      'damaged-in-transit': {
        id: 'option.conditionCheckReasons.damaged-in-transit',
        defaultMessage: 'damaged in transit',
      },
      'loan-in': {
        id: 'option.conditionCheckReasons.loan-in',
        defaultMessage: 'loan in',
      },
      'new-acquisition': {
        id: 'option.conditionCheckReasons.new-acquisition',
        defaultMessage: 'new acquisition',
      },
    }),
  },
  salvagePriorityCodes: {
    values: [
      'low',
      'medium',
      'high',
    ],
    messages: defineMessages({
      low: {
        id: 'option.salvagePriorityCodes.low',
        defaultMessage: 'low',
      },
      medium: {
        id: 'option.salvagePriorityCodes.medium',
        defaultMessage: 'medium',
      },
      high: {
        id: 'option.salvagePriorityCodes.high',
        defaultMessage: 'high',
      },
    }),
  },
};
