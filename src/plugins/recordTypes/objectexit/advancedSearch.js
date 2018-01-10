import {
  OP_OR,
  OP_EQ,
  OP_CONTAIN,
  OP_RANGE,
} from '../../../constants/searchOperators';

export default {
  op: OP_OR,
  value: [
    {
      op: OP_CONTAIN,
      path: 'ns2:objectexit_common/exitNumber',
    },
    // {
    //   op: OP_RANGE,
    //   path: 'ns2:objectexit_common/exitDateGroup',
    // },
    {
      op: OP_EQ,
      path: 'ns2:objectexit_common/exitReason',
    },
    {
      op: OP_EQ,
      path: 'ns2:objectexit_common/exitMethods/exitMethod',
    },
    {
      op: OP_EQ,
      path: 'ns2:objectexit_common/currentOwner',
    },
    {
      op: OP_EQ,
      path: 'ns2:objectexit_common/depositor',
    },
    {
      op: OP_CONTAIN,
      path: 'ns2:objectexit_common/exitNote',
    },
    {
      op: OP_CONTAIN,
      path: 'ns2:collectionspace_core/updatedBy',
    },
    {
      op: OP_RANGE,
      path: 'ns2:collectionspace_core/updatedAt',
    },
  ],
};
