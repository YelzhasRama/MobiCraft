export const recursiveResourceTraversing = (
  resource: any,
  cb: (resource: any, key: string) => any,
) => {
  for (const key in resource) {
    if (typeof resource[key] === 'object') {
      recursiveResourceTraversing(resource[key], cb);
    }

    cb(resource, key);
  }
};
