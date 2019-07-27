import FileStorage from './pandemic-light/fileStorage';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import Coach from './coach';
import packageJson from './package.json';

const storage = new FileStorage();
const config = {
  iterations: 2,
  trainingEpisodes: 1,
  playingEpisodes: 50,
  trainWithLatest: 1400,
  mcts: {
    playingSimulations: 400,
    trainingSimulationsPerAction: 80,
    cPuct: 1.0,
    cUcb1: 0.7,
    temperature: 1,
    explorationSteps: 20,
    rolloutThreshold: 0,
  },
  neuralNetwork: {
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 12,
  },
};
const coach = new Coach(config, storage, storage);

function start() {
  /* eslint-disable no-console */
  console.log('-----------------------------');
  console.log('App version', packageJson.version);
  console.log('-----------------------------');
  /* eslint-enable no-console */
  // eslint-disable-next-line no-unused-vars
  const [arg1, arg2, action, ...actionArgs] = process.argv;
  switch (action) {
    case 'summarizeVersion': {
      summarizeVersion(actionArgs);
      break;
    }
    case 'summarizeIteration': {
      summarizeIteration(actionArgs);
      break;
    }
    case 'showVersionSummary': {
      showVersionSummary(actionArgs);
      break;
    }
    case 'generateTrainingData': {
      generateTrainingData(actionArgs);
      break;
    }
    case 'train': {
      train(actionArgs);
      break;
    }
    case 'duplicateModel': {
      duplicateModel(actionArgs);
      break;
    }
    default: {
      // eslint-disable-next-line no-console
      console.log('Action not supported', action);
      break;
    }
  }
}

async function summarizeVersion(actionArgs) {
  const version = actionArgs[0];
  coach.summarizeVersion(version);
}

async function summarizeIteration(actionArgs) {
  const version = actionArgs[0];
  const iteration = actionArgs[1] ? Number(actionArgs[1]) : 0;
  coach.summarizeIteration(undefined, iteration, version);
}

async function showVersionSummary(actionArgs) {
  const version = actionArgs[0];
  const iterationSummaries = await storage.readIterationSummaries(version);
  const winRates = iterationSummaries.map((s) => {
    const winRate = s.trainingEpisodesStats.winRate * 100;
    return `${winRate.toFixed(2)}%`;
  });
  /* eslint-disable no-console */
  console.log();
  console.log(`Win rate (version ${version || 'default'})`);
  console.log('------------------------');
  console.log(winRates.join(' -> '));
  console.log();
  /* eslint-enable no-console */
}

async function generateTrainingData(actionArgs) {
  const version = actionArgs[0] ? actionArgs[0] : packageJson.version;
  const iteration = actionArgs[1] ? Number(actionArgs[1]) : 0;
  coach.generateTrainingData(undefined, iteration, version);
}

async function train(actionArgs) {
  const version = actionArgs[0];
  const iteration = actionArgs[1] ? Number(actionArgs[1]) : 0;
  coach.train(undefined, iteration, version);
}

async function duplicateModel(actionArgs) {
  const versionFrom = actionArgs[0];
  const iterationFrom = actionArgs[1];
  const versionTo = actionArgs[2];
  const iterationTo = actionArgs[3];
  const neuralNetwork = new PandemicNeuronalNetwork(config.neuralNetwork);
  await storage.readModel(neuralNetwork, iterationFrom, versionFrom);
  await storage.writeModel(neuralNetwork, iterationTo, versionTo);
}

start();
