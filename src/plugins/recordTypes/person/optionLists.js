import { defineMessages } from 'react-intl';

export default {
  personTermStatuses: {
    values: [
      'provisional',
      'under review',
      'accepted',
      'rejected',
    ],
    messages: defineMessages({
      provisional: {
        id: 'option.personTermStatuses.provisional',
        defaultMessage: 'provisional',
      },
      'under review': {
        id: 'option.personTermStatuses.under review',
        defaultMessage: 'under review',
      },
      accepted: {
        id: 'option.personTermStatuses.accepted',
        defaultMessage: 'accepted',
      },
      rejected: {
        id: 'option.personTermStatuses.rejected',
        defaultMessage: 'rejected',
      },
    }),
  },
  personTermTypes: {
    values: [
      'descriptor',
      'alternate descriptor',
      'used for term',
    ],
    messages: defineMessages({
      descriptor: {
        id: 'option.personTermTypes.descriptor',
        defaultMessage: 'descriptor',
      },
      'alternate descriptor': {
        id: 'option.personTermTypes.alternate descriptor',
        defaultMessage: 'alternate descriptor',
      },
      'used for term': {
        id: 'option.personTermTypes.used for term',
        defaultMessage: 'used for term',
      },
    }),
  },
  salutations: {
    values: [
      'dear',
      'hello',
      'to',
    ],
    messages: defineMessages({
      dear: {
        id: 'option.salutations.dear',
        defaultMessage: 'Dear',
      },
      hello: {
        id: 'option.salutations.hello',
        defaultMessage: 'Hello',
      },
      to: {
        id: 'option.salutations.to',
        defaultMessage: 'To',
      },
    }),
  },
  personTitles: {
    values: [
      'Mr',
      'Mrs',
      'Ms',
      'Miss',
      'Dr',
      'Professor',
      'Sir',
      'Dame',
      'Baron',
      'Baroness',
      'Lord',
      'Lady',
    ],
    messages: defineMessages({
      Mr: {
        id: 'option.personTitles.Mr',
        defaultMessage: 'Mr',
      },
      Mrs: {
        id: 'option.personTitles.Mrs',
        defaultMessage: 'Mrs',
      },
      Ms: {
        id: 'option.personTitles.Ms',
        defaultMessage: 'Ms',
      },
      Miss: {
        id: 'option.personTitles.Miss',
        defaultMessage: 'Miss',
      },
      Dr: {
        id: 'option.personTitles.Dr',
        defaultMessage: 'Dr',
      },
      Professor: {
        id: 'option.personTitles.Professor',
        defaultMessage: 'Professor',
      },
      Sir: {
        id: 'option.personTitles.Sir',
        defaultMessage: 'Sir',
      },
      Dame: {
        id: 'option.personTitles.Dame',
        defaultMessage: 'Dame',
      },
      Baron: {
        id: 'option.personTitles.Baron',
        defaultMessage: 'Baron',
      },
      Baroness: {
        id: 'option.personTitles.Baroness',
        defaultMessage: 'Baroness',
      },
      Lord: {
        id: 'option.personTitles.Lord',
        defaultMessage: 'Lord',
      },
      Lady: {
        id: 'option.personTitles.Lady',
        defaultMessage: 'Lady',
      },
    }),
  },
  genders: {
    values: [
      'female',
      'male',
    ],
    messages: defineMessages({
      female: {
        id: 'option.genders.female',
        defaultMessage: 'female',
      },
      male: {
        id: 'option.genders.male',
        defaultMessage: 'male',
      },
    }),
  },
};
