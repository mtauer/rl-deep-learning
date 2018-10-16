import GoogleCloudStorage from './pandemic-light/googleCloudStorage';

const googleCloudStorage = new GoogleCloudStorage();

async function migrateMatchSteps() {
  const matches = await googleCloudStorage.readMatches('0.4.0-0');
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const { versionId, iterationId, matchId, resultValue } = match;
    // eslint-disable-next-line no-await-in-loop
    const matchDetails = await googleCloudStorage.readMatchDetails(match.matchId);
    const { states, simulations } = matchDetails;
    const steps = states.map((state, j) => {
      const { p2 } = simulations[j];
      return {
        state,
        p2,
      };
    });
    const matchSteps = {
      resultValue,
      steps,
    };
    console.log('+++ Migrate match steps', i);
    // eslint-disable-next-line no-await-in-loop
    await googleCloudStorage.writeMatchSteps(versionId, iterationId, matchId, matchSteps);
  }
}

migrateMatchSteps();
