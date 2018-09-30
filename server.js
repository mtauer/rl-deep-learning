/* eslint-disable class-methods-use-this */
import http from 'http';
import express from 'express';

import GoogleCloudStorage from './pandemic-light/googleCloudStorage';

const googleCloudStorage = new GoogleCloudStorage();
const app = express();
const server = http.Server(app);
const port = process.env.PORT || 8080;

class IterationController {
  async getAllIterations(req, res) {
    const { versionId } = req.params;
    const iterations = await googleCloudStorage.readIterationSummaries(versionId);
    res.json(iterations);
  }
}
const iterationController = new IterationController();

app.route('/versions/:versionId/iterations')
  .get(iterationController.getAllIterations);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('[INFO] Listening on *:', port);
});
