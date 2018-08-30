import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getGameState, getGameNextActions } from './redux';
import NextActions from './NextActions';
import { Section, Label, SectionTitle } from '../components/Page';

const NextActionsSection = ({ gameState, gameNextActions }) => {
  console.log('gameState', gameState);
  return (
    <Section>
      <SectionTitle>
        Current State Value:
      </SectionTitle>
      <Label>
        Next actions (blue: probability from neural network, orange: number of
        visits and combined upper confidence bound)
      </Label>
      <NextActions
        gameNextActions={gameNextActions}
      />
    </Section>
  );
};
NextActionsSection.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  gameState: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  gameNextActions: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  gameState: getGameState(state),
  gameNextActions: getGameNextActions(state),
});
export default connect(mapStateToProps)(NextActionsSection);
