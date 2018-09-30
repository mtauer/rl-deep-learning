/* eslint-disable class-methods-use-this */
import http from 'http';
import express from 'express';
import cors from 'cors';

import GoogleCloudStorage from './pandemic-light/googleCloudStorage';
import { forceGC } from './utils';

const googleCloudStorage = new GoogleCloudStorage();
const app = express();
const server = http.Server(app);
const port = process.env.PORT || 8080;

class IterationController {
  async getAllIterations(req, res) {
    const { versionId } = req.params;
    const iterations = await googleCloudStorage.readIterationSummaries(versionId);
    res.json(iterations);
    forceGC();
  }
}
const iterationController = new IterationController();

app.options('*', cors());
app.use(cors());

app.route('/versions/:versionId/iterations')
  .get(iterationController.getAllIterations);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('[INFO] Listening on *:', port);
});
