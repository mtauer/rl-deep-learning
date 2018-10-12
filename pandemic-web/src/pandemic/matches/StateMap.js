import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getCurrentStep } from './redux';
import { getMatches } from '../../data/redux';
import { PageSection } from '../../components/Page';
import PandemicMap from './PandemicMap';

const Container = styled.div`
  background-color: #f7f7f7;
  height: 400px;
  margin: 0 -32px;
`;

const StateMap = ({ currentState }) => (
  <PageSection>
    <Container>
      <PandemicMap currentState={currentState} />
    </Container>
  </PageSection>
);
StateMap.propTypes = {
  currentState: PropTypes.shape(),
};
StateMap.defaultProps = {
  currentState: null,
};

const mapStateToProps = (state) => {
  const matches = getMatches(state);
  const matchId = 'bbdea21a-cae8-402d-a1a1-f31a6692ebf5';
  const states = matches[matchId] ? matches[matchId].states : null;
  const currentStep = getCurrentStep(state);
  const currentState = states ? states[currentStep - 1] : null;
  return {
    currentState,
  };
};
export default connect(mapStateToProps)(StateMap);
