import React from 'react';

import { Container, Title } from '../components/Page';
import WeightsChart from './WeightsChart';
import weightsA from './weights_0_3_2__17__layer_0.json';
import weightsB from './weights_0_3_2__18__layer_0.json';

const weightsShape = weightsA[0].shape;
const weightsData = weightsA[0].data.map((w, i) => weightsB[0].data[i] - w);

const NeuralNetworkPage = () => (
  <Container>
    <Title>Neural Network</Title>
    <WeightsChart
      shape={weightsShape}
      data={weightsData}
    />
  </Container>
);

export default NeuralNetworkPage;
