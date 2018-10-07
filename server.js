/* eslint-disable class-methods-use-this */
import http from 'http';
import express from 'express';
import cors from 'cors';

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

class MatchDetailsController {
  async getMatchDetails(req, res) {
    const { matchId } = req.params;
    const matchDetails = await googleCloudStorage.readMatchDetails(matchId);
    if (matchDetails) {
      res.json(matchDetails);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  }
}
const matchDetailsController = new MatchDetailsController();

app.options('*', cors());
app.use(cors());

app.route('/versions/:versionId/iterations')
  .get(iterationController.getAllIterations);

app.route('/matches/:matchId/details')
  .get(matchDetailsController.getMatchDetails);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('[INFO] Listening on *:', port);
});
