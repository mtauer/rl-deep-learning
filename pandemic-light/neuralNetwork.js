import range from 'lodash/range';

export default {
  predictP,
  predictV,
};

function predictP() {
  return range(200).map(() => Math.random());
}

function predictV() {
  return (Math.random() * 2.0) - 1.0;
}
