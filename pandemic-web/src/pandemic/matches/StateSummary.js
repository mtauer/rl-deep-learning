import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import { getCurrentStep } from './redux';
import { getMatches } from '../../data/redux';
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
const ResearchCentersPanel = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > * {
    margin: 0 16px 4px 0;
  }
`;

const StateSummary = ({ currentState }) => (
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
        <ResearchCentersPanel>
          {currentState.researchCenters && currentState.researchCenters.map(rc => (
            <PandemicLocation key={`research-center-${rc}`} locationId={rc} />
          ))}
        </ResearchCentersPanel>
      </Panel>
      <Panel>
        <Label>Played Cards</Label>
        <PandemicCards cardIds={currentState.playedPlayerCards} />
      </Panel>
    </Grid>
  </Grid>
);
StateSummary.propTypes = {
  currentState: PropTypes.shape().isRequired,
};

const mapStateToProps = (state) => {
  const matches = getMatches(state);
  const matchId = 'bbdea21a-cae8-402d-a1a1-f31a6692ebf5';
  const states = matches[matchId] ? matches[matchId].states : null;
  const currentStep = getCurrentStep(state);
  const currentState = states ? states[currentStep - 1] : {};
  return {
    currentState,
  };
};
export default connect(mapStateToProps)(StateSummary);
