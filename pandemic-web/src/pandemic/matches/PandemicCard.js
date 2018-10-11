import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';

import { getLocationName, getLocationAbbreviation, getLocationColor } from '../../utils/formatHelpers';

const Container = styled.div`
  align-items: center;
  border-radius: 2px;
  color: #ffffff;
  cursor: help;
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
    <Container style={{ backgroundColor: getCardColor(cardId) }}>
      <Text>{getCardAbbreviation(cardId)}</Text>
    </Container>
  </Tooltip>
);
PandemicCard.propTypes = {
  cardId: PropTypes.number.isRequired,
};

function getCardColor(cardId) {
  return getLocationColor(cardId);
}

function getCardName(cardId) {
  return getLocationName(cardId);
}

function getCardAbbreviation(cardId) {
  return getLocationAbbreviation(cardId);
}

export default PandemicCard;
