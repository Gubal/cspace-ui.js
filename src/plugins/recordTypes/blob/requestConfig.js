// Override the default cspace-client requestConfig, since we need to do a multipart/form-data file
// upload instead of sending the usual JSON payload.

export default (requestType, data) => {
  if (requestType === 'save') {
    const value = data.getIn(['document', 'ns2:blobs_common', 'file']);

    if (value instanceof Array) {
      if (value.length > 0) {
        return {
          type: 'multipart/form-data',
          data: {
            document: null,
            file: value[0],
          },
        };
      }
    } else if (typeof value === 'string') {
      return {
        params: {
          blobUri: value,
        },
      };
    }
  }

  return undefined;
};
