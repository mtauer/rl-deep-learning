
export function randomChoice(p) {
  let random = Math.random();
  return p.findIndex((a) => {
    random -= a;
    return random < 0;
  });
}

export function diffuseProbabilities(p, actions) {
  const actionTypes = actions.map(a => a.type);
  console.log('diffuseProbabilities', p, actionTypes);
}

export function condenseProbabilities(p, actions) {
  const actionTypes = actions.map(a => a.type);
  console.log('condenseProbabilities', p, actionTypes);
}
