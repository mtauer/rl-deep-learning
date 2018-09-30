import React from 'react';

import { Container, Title } from '../components/Page';
import IterationsStats from './IterationsStats';

const PandemicPage = () => (
  <Container>
    <Title>Deep reinforcement learning for Pandemic</Title>
    <IterationsStats />
  </Container>
);

export default PandemicPage;
