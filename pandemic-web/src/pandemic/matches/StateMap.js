import React from 'react';
import styled from 'styled-components';

import { PageSection } from '../../components/Page';
import PandemicMap from './PandemicMap';

const Container = styled.div`
  background-color: #f7f7f7;
  height: 400px;
  margin: 0 -32px;
`;

const StateMap = () => (
  <PageSection>
    <Container>
      <PandemicMap />
    </Container>
  </PageSection>
);

export default StateMap;
