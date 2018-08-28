import fs from 'fs';
import { PNG } from 'pngjs';
import slice from 'lodash/slice';
import groupBy from 'lodash/groupBy';
import toPairs from 'lodash/toPairs';

export function printStatistics(trainingExamples) {
  const actionGroups = groupBy(trainingExamples, e => e[2].type);
  const actionStats = toPairs(actionGroups).map(pair => [pair[0], pair[1].length]);
  actionStats.forEach((s) => {
    console.log('  ', s[0], (s[1] / trainingExamples.length * 100).toFixed(2));
  });
}

export function saveTrainingExamplesAsImage(trainingExamples, path, iteration, episode) {
  const decodedExamples = trainingExamples.map(examples => ({
    player0Position: slice(examples[0], 6, 6 + 48),
    player0Cards: slice(examples[0], 54, 54 + 48),
    player1Position: slice(examples[0], 102, 102 + 48),
    player1Cards: slice(examples[0], 150, 150 + 48),
    researchCenters: slice(examples[0], 198, 198 + 48),
    playedPlayerCards: slice(examples[0], 246, 246 + 48),
    pi: examples[1],
  }));
  const w = 55;
  const h = 1080;
  const dstBuffer = new PNG({ width: w, height: h });
  for (let y = 0; y < dstBuffer.height; y += 1) {
    for (let x = 0; x < dstBuffer.width; x += 1) {
      const idx = (dstBuffer.width * y + x) * 4;
      dstBuffer.data[idx + 0] = 0;
      dstBuffer.data[idx + 1] = 0;
      dstBuffer.data[idx + 2] = 0;
      dstBuffer.data[idx + 3] = 255;
    }
  }

  decodedExamples.forEach((examples, i) => {
    const yOffset = 12 * i;
    const xOffset = 5;
    // player0Position
    for (let x = 0; x < 48; x += 1) {
      const idx = (dstBuffer.width * (yOffset + 0) + x + xOffset) * 4;
      if (examples.player0Position[x] === 1) {
        dstBuffer.data[idx + 0] = 43;
        dstBuffer.data[idx + 1] = 140;
        dstBuffer.data[idx + 2] = 190;
      }
    }
    // player0Cards
    for (let x = 0; x < 48; x += 1) {
      const idx = (dstBuffer.width * (yOffset + 1) + x + xOffset) * 4;
      if (examples.player0Cards[x] === 1) {
        dstBuffer.data[idx + 0] = 43 / 2;
        dstBuffer.data[idx + 1] = 140 / 2;
        dstBuffer.data[idx + 2] = 190 / 2;
      }
    }
    // player1Position
    for (let x = 0; x < 48; x += 1) {
      const idx = (dstBuffer.width * (yOffset + 2) + x + xOffset) * 4;
      if (examples.player1Position[x] === 1) {
        dstBuffer.data[idx + 0] = 227;
        dstBuffer.data[idx + 1] = 74;
        dstBuffer.data[idx + 2] = 51;
      }
    }
    // player1Cards
    for (let x = 0; x < 48; x += 1) {
      const idx = (dstBuffer.width * (yOffset + 3) + x + xOffset) * 4;
      if (examples.player1Cards[x] === 1) {
        dstBuffer.data[idx + 0] = 227 / 2;
        dstBuffer.data[idx + 1] = 74 / 2;
        dstBuffer.data[idx + 2] = 51 / 2;
      }
    }
    // researchCenters
    for (let x = 0; x < 48; x += 1) {
      const idx = (dstBuffer.width * (yOffset + 4) + x + xOffset) * 4;
      if (examples.researchCenters[x] === 1) {
        dstBuffer.data[idx + 0] = 200;
        dstBuffer.data[idx + 1] = 200;
        dstBuffer.data[idx + 2] = 200;
      }
    }
    // playedPlayerCards
    for (let x = 0; x < 48; x += 1) {
      const idx = (dstBuffer.width * (yOffset + 5) + x + xOffset) * 4;
      if (examples.playedPlayerCards[x] === 1) {
        dstBuffer.data[idx + 0] = 50;
        dstBuffer.data[idx + 1] = 50;
        dstBuffer.data[idx + 2] = 50;
      }
    }
    // pi (line 1)
    for (let x = 0; x < 50; x += 1) {
      const idx = (dstBuffer.width * (yOffset + 8) + x + xOffset) * 4;
      const p = examples.pi[x];
      dstBuffer.data[idx + 0] = p * 153;
      dstBuffer.data[idx + 1] = p * 216;
      dstBuffer.data[idx + 2] = p * 201;
    }
  });

  const buff = PNG.sync.write(dstBuffer);
  fs.writeFileSync(`${path}training-${iteration}-${episode}.png`, buff);
}
