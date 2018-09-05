// eslint-disable-next-line import/prefer-default-export
export function randomChoice(p) {
  let random = Math.random();
  return p.findIndex((a) => {
    random -= a;
    return random < 0;
  });
}
