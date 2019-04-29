import { defineMessages } from 'react-intl';

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
      'needsnowork',
      'exhibitableneedswork',
      'notexhibitablestable',
      'injeopardy',
    ],
    messages: defineMessages({
      needsnowork: {
        id: 'option.conditions.needsnowork',
        defaultMessage: 'needs no work',
      },
      exhibitableneedswork: {
        id: 'option.conditions.exhibitableneedswork',
        defaultMessage: 'exhibitable / needs work',
      },
      notexhibitablestable: {
        id: 'option.conditions.notexhibitablestable',
        defaultMessage: 'not exhibitable / stable',
      },
      injeopardy: {
        id: 'option.conditions.injeopardy',
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
      'xrayed',
    ],
    messages: defineMessages({
      observed: {
        id: 'option.conditionCheckMethods.observed',
        defaultMessage: 'observed',
      },
      xrayed: {
        id: 'option.conditionCheckMethods.xrayed',
        defaultMessage: 'x-rayed',
      },
    }),
  },
  conditionCheckReasons: {
    values: [
      'conservation',
      'damagedintransit',
      'exhibition',
      'loanin',
      'newacquisition',
    ],
    messages: defineMessages({
      conservation: {
        id: 'option.conditionCheckReasons.conservation',
        defaultMessage: 'conservation',
      },
      damagedintransit: {
        id: 'option.conditionCheckReasons.damagedintransit',
        defaultMessage: 'damaged in transit',
      },
      exhibition: {
        id: 'option.conditionCheckReasons.exhibition',
        defaultMessage: 'exhibition',
      },
      loanin: {
        id: 'option.conditionCheckReasons.loanin',
        defaultMessage: 'loan in',
      },
      newacquisition: {
        id: 'option.conditionCheckReasons.newacquisition',
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
