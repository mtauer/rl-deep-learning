import range from 'lodash/range';

export default {
  predictP,
};

function predictP() {
  return range(200).map(() => Math.random());
}
