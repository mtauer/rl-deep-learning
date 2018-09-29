/* eslint-disable class-methods-use-this */
import http from 'http';
import express from 'express';

import GoogleCloudStorage from './pandemic-light/googleCloudStorage';

const googleCloudStorage = new GoogleCloudStorage();
const app = express();
const server = http.Server(app);
const port = 8080 || process.env.PORT;

class IterationController {
  async getAllIterations(req, res) {
    const { versionId } = req.params;
    const iterations = await googleCloudStorage.readIterationSummaries(versionId)
      .map(iteration => ({ ...iteration }));
    res.json(iterations);
  }
}
const iterationController = new IterationController();

// todoList Routes
app.route('/versions/:versionId/iterations')
  .get(iterationController.getAllIterations);

server.listen(port, () => {
  console.log('[INFO] Listening on *:', port);
});
