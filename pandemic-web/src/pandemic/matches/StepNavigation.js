import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import PlayArrow from '@material-ui/icons/PlayArrow';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';

import { getCurrentStep, previousStepAction, nextStepAction } from './redux';
import { getMatches } from '../../data/redux';
import { PageSection } from '../../components/Page';
import LabeledValue from '../../components/LabeledValue';

const Container = styled.div`
  align-items: center;
  display: flex;
`;
const NavItem = styled.div`
  padding: 0 32px 0 0;
`;

const StepNavigation = ({
  currentStep,
  stepsCount,
  onPreviousStepClick,
  onNextStepClick,
}) => (
  <PageSection>
    <Container>
      <NavItem>
        <IconButton
          color="primary"
          aria-label="Previous Step"
          onClick={onPreviousStepClick}
          disabled={currentStep <= 1}
        >
          <SkipPrevious />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="Play"
          disabled
        >
          <PlayArrow />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="Next Step"
          onClick={onNextStepClick}
          disabled={currentStep >= stepsCount}
        >
          <SkipNext />
        </IconButton>
      </NavItem>
      <NavItem>
        <LabeledValue label="Step" value={`${currentStep} / ${stepsCount}`} />
      </NavItem>
      <NavItem>
        <LabeledValue label="Player" value="1" />
      </NavItem>
      <NavItem>
        <LabeledValue label="Moves Left" value="4" />
      </NavItem>
      <NavItem>
        <LabeledValue label="Location" value="Atlanta" />
      </NavItem>
    </Container>
  </PageSection>
);
StepNavigation.propTypes = {
  currentStep: PropTypes.number.isRequired,
  stepsCount: PropTypes.number.isRequired,
  onPreviousStepClick: PropTypes.func.isRequired,
  onNextStepClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const currentStep = getCurrentStep(state);
  const matches = getMatches(state);
  const matchId = 'a09c3e2c-65fa-47b4-9110-6d9ef04207d6';
  const simulations = matches[matchId] ? matches[matchId].simulations : [];
  const stepsCount = simulations.length;
  return {
    currentStep,
    stepsCount,
  };
};
const mapDispatchToProps = dispatch => ({
  onPreviousStepClick: () => {
    dispatch(previousStepAction());
  },
  onNextStepClick: () => {
    dispatch(nextStepAction());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(StepNavigation);
