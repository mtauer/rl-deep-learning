import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';

import data from './mnistData';

async function run() {
  await data.loadData();
  const { images: trainImages, labels: trainLabels } = data.getTrainData();
  const { images: testImages, labels: testLabels } = data.getTestData();

  const model = tf.sequential({
    layers: [
      tf.layers.flatten({ inputShape: [28, 28, 1] }),
      tf.layers.dense({ units: 512, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: 10, activation: 'softmax' })
    ],
  });
  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  await model.fit(trainImages, trainLabels, {
    epochs: 5,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log('onEpochEnd', epoch + 1, logs);
      },
    },
  });

  const res = model.evaluate(testImages, testLabels);
  console.log(res[0].dataSync()[0], res[1].dataSync()[0]);
}

run();
