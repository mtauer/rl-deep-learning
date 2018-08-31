/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { scaleLinear } from 'd3-scale';
import { rgb } from 'd3-color';
import { interpolateHcl } from 'd3-interpolate';

import {
  DRIVE_FERRY, DIRECT_FLIGHT, CHARTER_FLIGHT, SHUTTLE_FLIGHT,
  BUILD_RESEARCH_CENTER, DISCOVER_CURE, SHARE_KNOWLEDGE, DO_NOTHING, DISCARD_CARD,
  DISEASE_YELLOW, DISEASE_RED, DISEASE_BLUE, DISEASE_BLACK,
} from '../pandemic-shared/game';
import Location from './Location';

const Container = styled.div`
`;
const Row = styled.div`
  display: flex;
  margin-bottom: 1px;
  height: 80px;

  &:hover {
    cursor: pointer;
  }
`;
const ValueContainer = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  width: 70px;
`;
const Value = styled.p`
  display: block;
  font-size: 12px;
`;
const ActionContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 12px 12px 10px 12px;
  overflow: hidden;
`;
const ActionTitle = styled.p`
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 21px;
  margin: 0;
  padding: 0 0 4px 0;
`;
const ActionDetails = styled.div`
  display: flex;
`;
const Property = styled.p`
  border-right: 1px solid rgba(255, 255, 255, 0.25);
  display: block;
  font-size: 12px;
  margin: 0;
  padding: 6px 10px 2px 10px;
  white-space: nowrap;
  overflow: hidden;

  &:first-child {
    padding-left: 0;
  }
`;
const PropertyName = styled.span`
  display: inline-block;
  opacity: 0.6;
`;
const PropertyValue = styled.span`
  display: inline-block;
`;
const Disease = styled.span`
  border-radius: 50%;
  display: inline-block;
  height: 10px;
  margin: 0 0 0 4px;
  width: 10px;
  transform: translateY(1px);
`;

const NextActions = ({ validActions, values }) => {
  console.log('validActions', validActions);
  return (
    <Container>
      { validActions.map((action, i) => {
        const nextActionValue = values[i];
        const cellBgColor = nextActionValue !== undefined ? getCellBgColor(nextActionValue) : '#e6e6e6';
        return (
          <Row
            key={i}
            onClick={() => console.log('On action click')}
          >
            <ValueContainer style={{ backgroundColor: cellBgColor }}>
              <Value>
                {nextActionValue !== undefined && !Number.isNaN(nextActionValue) ? nextActionValue.toFixed(3) : '-'}
              </Value>
            </ValueContainer>
            <ActionContainer style={{ backgroundColor: cellBgColor }}>
              <ActionTitle>
                {formatActionType(action.type)}
              </ActionTitle>
              <ActionDetails>
                {formatActionDetails(action)}
              </ActionDetails>
            </ActionContainer>
          </Row>
        );
      })}
    </Container>
  );
};
NextActions.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  validActions: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.array.isRequired,
};

function formatActionType(type) {
  switch (type) {
    case DRIVE_FERRY: return 'Drive / Ferry';
    case DIRECT_FLIGHT: return 'Direct Flight';
    case CHARTER_FLIGHT: return 'Charter Flight';
    case SHUTTLE_FLIGHT: return 'Shuttle Flight';
    case BUILD_RESEARCH_CENTER: return 'Build Research Center';
    case DISCOVER_CURE: return 'Discover Cure';
    case SHARE_KNOWLEDGE: return 'Share Knowledge';
    case DO_NOTHING: return 'Do Nothing';
    case DISCARD_CARD: return 'Discard Card';
    default: return type;
  }
}

function formatActionDetails(action) {
  switch (action.type) {
    case DRIVE_FERRY: {
      return [
        <Property key="from">
          <PropertyName>From:</PropertyName>
          <PropertyValue><Location locationId={action.from} /></PropertyValue>
        </Property>,
        <Property key="to">
          <PropertyName>To:</PropertyName>
          <PropertyValue><Location locationId={action.to} /></PropertyValue>
        </Property>,
      ];
    }
    case DIRECT_FLIGHT: {
      return [
        <Property key="from">
          <PropertyName>From:</PropertyName>
          <PropertyValue><Location locationId={action.from} /></PropertyValue>
        </Property>,
        <Property key="to">
          <PropertyName>To:</PropertyName>
          <PropertyValue><Location locationId={action.to} /></PropertyValue>
        </Property>,
        <Property key="card">
          <PropertyName>Card:</PropertyName>
          <PropertyValue><Location locationId={action.card} /></PropertyValue>
        </Property>,
      ];
    }
    case CHARTER_FLIGHT: {
      return [
        <Property key="from">
          <PropertyName>From:</PropertyName>
          <PropertyValue><Location locationId={action.from} /></PropertyValue>
        </Property>,
        <Property key="to">
          <PropertyName>To:</PropertyName>
          <PropertyValue><Location locationId={action.to} /></PropertyValue>
        </Property>,
        <Property key="card">
          <PropertyName>Card:</PropertyName>
          <PropertyValue><Location locationId={action.card} /></PropertyValue>
        </Property>,
      ];
    }
    case SHUTTLE_FLIGHT: {
      return [
        <Property key="from">
          <PropertyName>From:</PropertyName>
          <PropertyValue><Location locationId={action.from} /></PropertyValue>
        </Property>,
        <Property key="to">
          <PropertyName>To:</PropertyName>
          <PropertyValue><Location locationId={action.to} /></PropertyValue>
        </Property>,
      ];
    }
    case BUILD_RESEARCH_CENTER: {
      return [
        <Property key="at">
          <PropertyName>At:</PropertyName>
          <PropertyValue><Location locationId={action.at} /></PropertyValue>
        </Property>,
        <Property key="card">
          <PropertyName>Card:</PropertyName>
          <PropertyValue><Location locationId={action.card} /></PropertyValue>
        </Property>,
      ];
    }
    case DISCOVER_CURE: {
      return [
        <Property key="disease">
          <PropertyName>Disease:</PropertyName>
          <PropertyValue>
            {formatDisease(action.disease)}
          </PropertyValue>
        </Property>,
        <Property key="cards">
          <PropertyName>Cards:</PropertyName>
          <PropertyValue>
            { action.usedCards.map(id => (
              <Location key={id} locationId={id} />
            ))}
          </PropertyValue>
        </Property>,
      ];
    }
    case SHARE_KNOWLEDGE: {
      return [
        <Property key="card">
          <PropertyName>Card:</PropertyName>
          <PropertyValue><Location locationId={action.card} /></PropertyValue>
        </Property>,
        <Property key="from">
          <PropertyName>From Player:</PropertyName>
          <PropertyValue>{action.from}</PropertyValue>
        </Property>,
        <Property key="to">
          <PropertyName>To Player:</PropertyName>
          <PropertyValue>{action.to}</PropertyValue>
        </Property>,
      ];
    }
    case DISCARD_CARD: {
      return [
        <Property key="player">
          <PropertyName>Player:</PropertyName>
          <PropertyValue>{action.player}</PropertyValue>
        </Property>,
        <Property key="card">
          <PropertyName>Card:</PropertyName>
          <PropertyValue><Location locationId={action.card} /></PropertyValue>
        </Property>,
      ];
    }
    default: return null;
  }
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

function getCellBgColor(value) {
  if (!value) { return '#e6e6e6'; }
  const valueColor = scaleLinear().domain([-1.0, 0.0, 1.0])
    .interpolate(interpolateHcl)
    .range([rgb('#a50026'), rgb('#ffffff'), rgb('#1a9850')]);
  return valueColor(value);
}

export default NextActions;
