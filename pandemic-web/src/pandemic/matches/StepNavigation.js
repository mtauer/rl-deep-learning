import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import PlayArrow from '@material-ui/icons/PlayArrow';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';

import { getMatches } from '../../data/redux';
import { getCurrentStep, previousStepAction, nextStepAction, getSelectedMatchId } from './redux';
import { getLocationName } from '../../utils/formatHelpers';
import { PageSection } from '../../components/Page';
import LabeledValue from '../../components/LabeledValue';

const Container = styled.div`
  align-items: center;
  display: flex;

  &:focus {
    background-color: #f7f7f7;
    outline: 0;
  }
`;
const NavItem = styled.div`
  padding: 0 32px 0 0;
`;

const StepNavigation = ({
  currentState,
  currentStep,
  stepsCount,
  onPreviousStepClick,
  onNextStepClick,
  onLeftKeyDown,
  onRightKeyDown,
}) => (
  <PageSection>
    <Container
      onKeyDown={(event) => {
        const { keyCode } = event;
        if (keyCode === 37 && currentStep > 1) {
          onLeftKeyDown();
        }
        if (keyCode === 39 && currentStep < stepsCount) {
          onRightKeyDown();
        }
      }}
      role="navigation"
      tabIndex="0"
    >
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
        <LabeledValue label="Step" value={currentState ? `${currentStep} / ${stepsCount}` : null} />
      </NavItem>
      <NavItem>
        <LabeledValue label="Player" value={currentState ? currentState.currentPlayer + 1 : null} />
      </NavItem>
      <NavItem>
        <LabeledValue label="Moves Left" value={currentState ? currentState.currentMovesLeft : null} />
      </NavItem>
      <NavItem>
        <LabeledValue
          label="Location"
          value={currentState
            ? getLocationName(currentState.playerPosition[currentState.currentPlayer])
            : null
          }
        />
      </NavItem>
    </Container>
  </PageSection>
);
StepNavigation.propTypes = {
  currentState: PropTypes.shape(),
  currentStep: PropTypes.number.isRequired,
  stepsCount: PropTypes.number.isRequired,
  onPreviousStepClick: PropTypes.func.isRequired,
  onNextStepClick: PropTypes.func.isRequired,
  onLeftKeyDown: PropTypes.func.isRequired,
  onRightKeyDown: PropTypes.func.isRequired,
};
StepNavigation.defaultProps = {
  currentState: null,
};

const mapStateToProps = (state) => {
  const currentStep = getCurrentStep(state);
  const matches = getMatches(state);
  const matchId = getSelectedMatchId(state);
  const simulations = matches[matchId] ? matches[matchId].simulations : [];
  const states = matches[matchId] ? matches[matchId].states : [];
  const currentState = states[currentStep - 1];
  const stepsCount = simulations.length;
  return {
    currentState,
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
  onLeftKeyDown: () => {
    dispatch(previousStepAction());
  },
  onRightKeyDown: () => {
    dispatch(nextStepAction());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(StepNavigation);
