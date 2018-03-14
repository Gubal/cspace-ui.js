import { defineMessages } from 'react-intl';

// FIXME: Plugins shouldn't have to import react-intl, since this unnecessarily increases the size
// when built as a standalone package. Instead, defineMessages should be supplied in the
// configContext. But this means that messages won't be extracted by the Babel plugin, since it
// only operates on files that import react-intl.

export default {
  locationFitnesses: {
    values: [
      'dangerous',
      'suitable',
      'temporary',
      'unsuitable',
    ],
    messages: defineMessages({
      dangerous: {
        id: 'option.locationFitnesses.dangerous',
        defaultMessage: 'dangerous',
      },
      suitable: {
        id: 'option.locationFitnesses.suitable',
        defaultMessage: 'suitable',
      },
      temporary: {
        id: 'option.locationFitnesses.temporary',
        defaultMessage: 'temporary',
      },
      unsuitable: {
        id: 'option.locationFitnesses.unsuitable',
        defaultMessage: 'unsuitable',
      },
    }),
  },
  moveReasons: {
    values: [
      'conservation',
      'exhibition',
      'inventory',
      'loan',
      'newstoragelocation',
      'photography',
      'research',
    ],
    messages: defineMessages({
      conservation: {
        id: 'option.moveReasons.conservation',
        defaultMessage: 'conservation',
      },
      exhibition: {
        id: 'option.moveReasons.exhibition',
        defaultMessage: 'exhibition',
      },
      inventory: {
        id: 'option.moveReasons.inventory',
        defaultMessage: 'inventory',
      },
      loan: {
        id: 'option.moveReasons.loan',
        defaultMessage: 'loan',
      },
      newstoragelocation: {
        id: 'option.moveReasons.newstoragelocation',
        defaultMessage: 'new storage location',
      },
      photography: {
        id: 'option.moveReasons.photography',
        defaultMessage: 'photography',
      },
      research: {
        id: 'option.moveReasons.research',
        defaultMessage: 'research',
      },
    }),
  },
  moveMethods: {
    values: [
      'forklift',
      'handcarried',
      'trolley',
    ],
    messages: defineMessages({
      forklift: {
        id: 'option.moveMethods.forklift',
        defaultMessage: 'forklift',
      },
      handcarried: {
        id: 'option.moveMethods.handcarried',
        defaultMessage: 'handcarried',
      },
      trolley: {
        id: 'option.moveMethods.trolley',
        defaultMessage: 'trolley',
      },
    }),
  },
  invActions: {
    values: [
      'conservation',
      'preservation',
      're-housing',
    ],
    messages: defineMessages({
      conservation: {
        id: 'option.invActions.conservation',
        defaultMessage: 'conservation',
      },
      preservation: {
        id: 'option.invActions.preservation',
        defaultMessage: 'preservation',
      },
      're-housing': {
        id: 'option.invActions.re-housing',
        defaultMessage: 're-housing',
      },
    }),
  },
  invFreqs: {
    values: [
      'daily',
      'weekly',
      'monthly',
      'semi-annually',
      'annually',
    ],
    messages: defineMessages({
      daily: {
        id: 'option.invFreqs.daily',
        defaultMessage: 'daily',
      },
      weekly: {
        id: 'option.invFreqs.weekly',
        defaultMessage: 'weekly',
      },
      monthly: {
        id: 'option.invFreqs.monthly',
        defaultMessage: 'monthly',
      },
      'semi-annually': {
        id: 'option.invFreqs.semi-annually',
        defaultMessage: 'semi-annually',
      },
      annually: {
        id: 'option.invFreqs.annually',
        defaultMessage: 'annually',
      },
    }),
  },
};
