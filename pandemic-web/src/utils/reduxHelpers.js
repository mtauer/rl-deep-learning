/* eslint-disable import/prefer-default-export */
import mergeWith from 'lodash/mergeWith';
import fromPairs from 'lodash/fromPairs';
import isArray from 'lodash/isArray';

export function mergeArrayIntoObject(object, arrayOrItem, getKeyFunc) {
  // Note: This method mutates object.
  //
  // Note: According to https://github.com/lodash/lodash/pull/2802
  // the array merging strategy of `_.defaultsDeep` in Lodash is similar to jQuery.
  // With this strategy, arrays are merged like the following:
  // _.defaultsDeep({ a: [2, 3] }, { a: [1, 2, 3] }); // => { a: [2, 3, 3] }
  // which leads to an unwanted behavior for our method. That's why the
  // `mergeWith` method is used here as it allows to customize the merging
  // strategy of arrays.
  const customizer = (objValue, srcValue) => {
    if (isArray(objValue)) {
      return srcValue || objValue;
    }
    return undefined;
  };

  const array = isArray(arrayOrItem) ? arrayOrItem : [arrayOrItem];
  return mergeWith(
    object,
    fromPairs(array.map(r => [getKeyFunc(r), r])),
    customizer,
  );
}
