import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

import PandemicLocation from './PandemicLocation';
import PandemicCards from './PandemicCards';

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0 24px 0;
`;

const Label = styled.div`
  color: rgba(0, 0, 0, 0.54);
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
  padding: 0 0 4px 0;
`;

const StateSummary = () => (
  <Grid container spacing={24}>
    <Grid item xs={4}>
      Player 1
    </Grid>
    <Grid item xs={4}>
      Player 2
    </Grid>
    <Grid item xs={4}>
      <Panel>
        <Label>Research Centers</Label>
        <PandemicLocation locationId={3} />
      </Panel>
      <Panel>
        <Label>Played Cards</Label>
        <PandemicCards cardIds={[1, 2, 3]} />
      </Panel>
    </Grid>
  </Grid>
);

export default StateSummary;
