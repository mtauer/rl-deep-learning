import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { locationsMap, DISEASE_YELLOW, DISEASE_RED, DISEASE_BLUE,
  DISEASE_BLACK } from '../pandemic-shared/game';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap
`;
const Card = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 0 rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  margin: 0 4px 6px 0;
  padding: 8px;
  width: 80px;
`;
const CardContent = styled.div`
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  display: flex;
  flex: 1;
  justify-content: center;
  margin: 0 0 8px 0;
  height: 72px;
`;
const CardDisease = styled.span`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  display: block;
  height: 32px;
  width: 32px;
`;
const CardLocation = styled.p`
  display: block;
  font-size: 12px;
  margin: 0;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Cards = ({ cardIds }) => (
  <Container>
    { cardIds.map(id => (
      <Card key={id}>
        <CardContent>
          {formatLocationDisease(id)}
        </CardContent>
        <CardLocation>{formatLocationName(id)}</CardLocation>
      </Card>
    ))}
  </Container>
);
Cards.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  cardIds: PropTypes.array.isRequired,
};

function formatLocationName(id) {
  return locationsMap[id] ? locationsMap[id].name : 'Unknown location';
}

function formatLocationDisease(id) {
  const disease = locationsMap[id] ? locationsMap[id].disease : 'unknown';
  const diseaseColors = {
    [DISEASE_YELLOW]: '#ffffbf',
    [DISEASE_RED]: '#d7191c',
    [DISEASE_BLUE]: '#2c7bb6',
    [DISEASE_BLACK]: '#404040',
    unknown: '#e6e6e6',
  };
  const bgColor = diseaseColors[disease];
  return (<CardDisease style={{ backgroundColor: bgColor }} />);
}

export default Cards;
