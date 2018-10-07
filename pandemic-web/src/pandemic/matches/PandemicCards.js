import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isArray from 'lodash/isArray';

import PandemicCard from './PandemicCard';

const Container = styled.div`
  display: flex;

  & > * {
    margin: 0 2px 0 0;
  }
`;

const PandemicCards = ({ cardIds }) => {
  const cardIdsArray = isArray(cardIds) ? cardIds : [cardIds];
  return (
    <Container>
      {cardIdsArray.map(c => (<PandemicCard key={`pandemic-card-${c}`} cardId={c} />))}
    </Container>
  );
};
PandemicCards.propTypes = {
  cardIds: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.number,
  ]),
};
PandemicCards.defaultProps = {
  cardIds: [],
};

export default PandemicCards;
