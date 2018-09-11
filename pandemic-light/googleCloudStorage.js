import Datastore from '@google-cloud/datastore';
import uuidv4 from 'uuid/v4';

import datastoreConfig from './datastoreConfig.json';
import packageJson from '../package.json';

const TRAINING_EPISODE = 'TrainingEpisode';

export default class GoogleCloudStorage {
  constructor() {
    this.datastore = new Datastore(datastoreConfig);
  }

  async readTrainingEpisodes(iteration) {
    const query = this.datastore.createQuery(TRAINING_EPISODE)
      .filter('version', '=', packageJson.version)
      .filter('iteration', '=', iteration);
    return this.datastore
      .runQuery(query)
      .then(results => results[0].map(entity => entity.trainingEpisode));
  }

  async writeTrainingEpisode(trainingEpisode, iteration) {
    const name = uuidv4();
    const key = this.datastore.key([TRAINING_EPISODE, name]);
    const trainingEpisodeEntity = {
      key,
      data: {
        createdAt: new Date().toISOString(),
        version: packageJson.version,
        iteration,
        trainingEpisode,
      },
    };
    return this.datastore.save(trainingEpisodeEntity);
  }
}
