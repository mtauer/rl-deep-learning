import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  locationsMap, DISEASE_YELLOW, DISEASE_RED, DISEASE_BLUE, DISEASE_BLACK,
} from '../pandemic-shared/game';

const Container = styled.span`
  display: inline-block;
  font-size: 12px;
`;
const Disease = styled.span`
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: inline-block;
  height: 10px;
  margin: 0 0 0 6px;
  width: 10px;
  transform: translateY(1px);
`;

const Location = ({ locationId }) => (
  <Container>
    {formatLocationName(locationId)}{formatLocationDisease(locationId)}
  </Container>
);
Location.propTypes = {
  locationId: PropTypes.number.isRequired,
};

function formatLocationName(id) {
  return locationsMap[id] ? locationsMap[id].name : 'Unknown location';
}

function formatLocationDisease(id) {
  return locationsMap[id] ? formatDisease(locationsMap[id].disease) : null;
}

function formatDisease(disease) {
  const diseaseColors = {
    [DISEASE_YELLOW]: '#ffffbf',
    [DISEASE_RED]: '#d7191c',
    [DISEASE_BLUE]: '#2c7bb6',
    [DISEASE_BLACK]: '#404040',
  };
  const bgColor = diseaseColors[disease];
  return (<Disease style={{ backgroundColor: bgColor }} />);
}

export default Location;
