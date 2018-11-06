import React from 'react';

import { Container, Title } from '../components/Page';
import WeightsChart from './WeightsChart';
import weightsA from './weights_0.4.2__8__layer_2.json';
// import weightsB from './weights_0.4.0__6__layer_2.json';

const weightsShape = weightsA[0].shape;
const weightsData = weightsA[0].data; // .map((w, i) => weightsB[0].data[i] - w);

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
