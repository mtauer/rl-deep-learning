import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import { getCurrentStep } from './redux';
import { getMatches } from '../../data/redux';
import PandemicLocation from './PandemicLocation';
import PandemicCards from './PandemicCards';
import { SectionTitle } from '../../components/Page';

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
const LocationsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > * {
    margin: 0 16px 4px 0;
  }
`;
const Note = styled.div`
  background-color: #F3F7ED;
  border-radius: 2px;
  color: #82AD4A;
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 8px 16px;

  strong {
    color: #4F8D00;
  }
`;

const StateSummary = ({ currentState }) => (
  <Grid container spacing={24}>
    <Grid item xs={4}>
      <Panel>
        <SectionTitle>Player 1</SectionTitle>
        <Note style={{ visibility: currentState !== undefined && currentState.currentPlayer === 0 ? 'visible' : 'hidden' }}>
          Current player – <strong>{currentState.currentMovesLeft}</strong> moves left
        </Note>
      </Panel>
      <Panel>
        <Label>Location</Label>
        <LocationsContainer>
          <PandemicLocation
            locationId={currentState.playerPosition ? currentState.playerPosition[0] : null}
          />
        </LocationsContainer>
      </Panel>
      <Panel>
        <Label>Cards</Label>
        <PandemicCards cardIds={currentState.playerCards ? currentState.playerCards[0] : []} />
      </Panel>
    </Grid>
    <Grid item xs={4}>
      <Panel>
        <SectionTitle>Player 2</SectionTitle>
        <Note style={{ visibility: currentState !== undefined && currentState.currentPlayer === 1 ? 'visible' : 'hidden' }}>
          Current player – <strong>{currentState.currentMovesLeft}</strong> moves left
        </Note>
      </Panel>
      <Panel>
        <Label>Location</Label>
        <LocationsContainer>
          <PandemicLocation
            locationId={currentState.playerPosition ? currentState.playerPosition[1] : null}
          />
        </LocationsContainer>
      </Panel>
      <Panel>
        <Label>Cards</Label>
        <PandemicCards cardIds={currentState.playerCards ? currentState.playerCards[1] : []} />
      </Panel>
    </Grid>
    <Grid item xs={4}>
      <Panel>
        <Label>Research Centers</Label>
        <LocationsContainer>
          {currentState.researchCenters && currentState.researchCenters.map(rc => (
            <PandemicLocation key={`research-center-${rc}`} locationId={rc} />
          ))}
        </LocationsContainer>
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
