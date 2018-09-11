import Datastore from '@google-cloud/datastore';
import uuidv4 from 'uuid/v4';

import datastoreConfig from './datastoreConfig.json';
import packageJson from '../package.json';
import trainingEpisode from './v0.1.0_iteration_001_training_data/0a33abd9-094b-4a34-be44-7711adddd9a7.json';

export default class GoogleCloudStorage {
  constructor() {
    this.datastore = new Datastore(datastoreConfig);

    const kind = 'TrainingEpisode';
    const name = uuidv4();
    const key = this.datastore.key([kind, name]);
    const trainingEpisodeEntity = {
      key,
      data: {
        version: packageJson.version,
        iteration: 0,
        trainingEpisode,
      },
    };
    this.datastore
      .save(trainingEpisodeEntity)
      .then(() => {
        console.log('Saved entity');
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
  }
}
