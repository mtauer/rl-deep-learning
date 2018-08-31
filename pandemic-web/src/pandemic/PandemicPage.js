import React from 'react';

import { Container, Title } from '../components/Page';
import ValidActionsSection from './ValidActionsSection';
import PlayersSection from './PlayersSection';

const PandemicPage = () => (
  <Container>
    <Title>Deep reinforcement learning for Pandemic</Title>
    <ValidActionsSection />
    <PlayersSection />
  </Container>
);

export default PandemicPage;
