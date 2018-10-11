/* eslint-disable class-methods-use-this */
import http from 'http';
import express from 'express';
import cors from 'cors';

import GoogleCloudStorage from './pandemic-light/googleCloudStorage';

const googleCloudStorage = new GoogleCloudStorage();
const app = express();
const server = http.Server(app);
const port = process.env.PORT || 8080;

class VersionsController {
  async getAllVersions(req, res) {
    const versions = await googleCloudStorage.readVersions();
    if (versions) {
      res.json(versions);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  }
}
const versionsController = new VersionsController();

class IterationsController {
  async getIterations(req, res) {
    const { versionId } = req.params;
    const iterations = await googleCloudStorage.readIterations(versionId);
    if (iterations) {
      res.json(iterations);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  }
}
const iterationsController = new IterationsController();

class MatchesController {
  async getMatches(req, res) {
    const { iterationId } = req.params;
    const matches = await googleCloudStorage.readMatches(iterationId);
    if (matches) {
      res.json(matches);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  }
}
const matchesController = new MatchesController();

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

app.route('/versions')
  .get(versionsController.getAllVersions);

app.route('/versions/:versionId/iterations')
  .get(iterationsController.getIterations);

app.route('/iterations/:iterationId/matches')
  .get(matchesController.getMatches);

app.route('/matches/:matchId/details')
  .get(matchDetailsController.getMatchDetails);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('[INFO] Listening on *:', port);
});
