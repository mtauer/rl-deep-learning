import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import Block from '@material-ui/icons/Block';
import Commute from '@material-ui/icons/Commute';
import FlightLand from '@material-ui/icons/FlightLand';
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import Flight from '@material-ui/icons/Flight';
import Home from '@material-ui/icons/Home';
import Opacity from '@material-ui/icons/Opacity';
import People from '@material-ui/icons/People';
import Delete from '@material-ui/icons/Delete';

import PandemicLocation from './PandemicLocation';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: nowrap;

  & > * {
    margin: 0 8px 0 0;
  }
`;

const PandemicAction = ({ action }) => (
  <Tooltip title={getActionTooltip(action)}>
    <Container>
      {getActionIcon(action)}
      {getActionDescription(action)}
    </Container>
  </Tooltip>
);
PandemicAction.propTypes = {
  action: PropTypes.shape().isRequired,
};

function getActionTooltip(action) {
  switch (action.type) {
    case 'DO_NOTHING': return 'Do nothing';
    case 'DRIVE_FERRY': return `Drive/ferry to ${action.to}`;
    case 'DIRECT_FLIGHT': return `Direct flight to ${action.to}`;
    case 'CHARTER_FLIGHT': return `Charter flight to ${action.to}`;
    case 'SHUTTLE_FLIGHT': return `Shuttle flight to ${action.to}`;
    case 'BUILD_RESEARCH_CENTER': return `Build research center at ${action.at}`;
    case 'DISCOVER_CURE': return 'Discuver cure for ...';
    case 'SHARE_KNOWLEDGE': return 'Share knowledre';
    case 'DISCARD_CARD': return 'Discard card';
    default: return null;
  }
}

function getActionIcon(action) {
  switch (action.type) {
    case 'DO_NOTHING': return (<Block />);
    case 'DRIVE_FERRY': return (<Commute />);
    case 'DIRECT_FLIGHT': return (<FlightLand />);
    case 'CHARTER_FLIGHT': return (<FlightTakeoff />);
    case 'SHUTTLE_FLIGHT': return (<Flight />);
    case 'BUILD_RESEARCH_CENTER': return (<Home />);
    case 'DISCOVER_CURE': return (<Opacity />);
    case 'SHARE_KNOWLEDGE': return (<People />);
    case 'DISCARD_CARD': return (<Delete />);
    default: return null;
  }
}

function getActionDescription(action) {
  switch (action.type) {
    case 'DRIVE_FERRY':
    case 'DIRECT_FLIGHT':
    case 'CHARTER_FLIGHT':
    case 'SHUTTLE_FLIGHT':
      return (<PandemicLocation locationId={action.to} />);
    case 'BUILD_RESEARCH_CENTER':
      return (<PandemicLocation locationId={action.at} />);
    default: return null;
  }
}

export default PandemicAction;
