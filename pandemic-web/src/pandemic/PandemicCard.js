import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';

const Container = styled.div`
  align-items: center;
  border-radius: 2px;
  color: #ffffff;
  display: flex;
  height: 24px;
  justify-content: center;
  min-width: 32px;
  padding: 2px;
`;
const Text = styled.span`
  display: block;
`;

const PandemicCard = ({ cardId }) => (
  <Tooltip title={getCardName(cardId)}>
    <Container style={{ backgroundColor: getCardColor() }}>
      <Text>{getCardAbbreviation(cardId)}</Text>
    </Container>
  </Tooltip>
);
PandemicCard.propTypes = {
  cardId: PropTypes.number.isRequired,
};

function getCardColor() {
  return '#DA1C49';
}

function getCardName() {
  return 'Atlanta';
}

function getCardAbbreviation() {
  return 'AT';
}

export default PandemicCard;
