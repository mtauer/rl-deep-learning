import React from 'react';

import { Container, Title } from '../components/Page';
import WeightsChart from './WeightsChart';

const NeuralNetworkPage = () => (
  <Container>
    <Title>Neural Network</Title>
    <WeightsChart
      shape={[2, 3]}
      data={[
        0.041815385222435,
        0.08590273559093475,
        -0.014976942911744118,
        -0.03695298731327057,
        0.05402153730392456,
        -0.04255848377943039,
      ]}
    />
  </Container>
);

export default NeuralNetworkPage;
