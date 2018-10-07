import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PandemicCard from './PandemicCard';

const Container = styled.div`
  display: flex;

  & > * {
    margin: 0 2px 0 0;
  }
`;

const PandemicCards = ({ cardIds }) => (
  <Container>
    {cardIds.map(c => (<PandemicCard key={`pandemic-card-${c}`} cardId={c} />))}
  </Container>
);
PandemicCards.propTypes = {
  cardIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default PandemicCards;
