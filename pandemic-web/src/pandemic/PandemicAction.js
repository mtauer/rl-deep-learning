import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FlightLand from '@material-ui/icons/FlightLand';

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
  <Container>
    {getActionIcon(action)}
    {getActionDescription(action)}
  </Container>
);
PandemicAction.propTypes = {
  action: PropTypes.shape().isRequired,
};

function getActionIcon(action) {
  switch (action.type) {
    case 'DIRECT_FLIGHT': return (<FlightLand />);
    default: return null;
  }
}

function getActionDescription(action) {
  switch (action.type) {
    case 'DIRECT_FLIGHT':
      return (<PandemicLocation locationId={action.to} />);
    default: return null;
  }
}

export default PandemicAction;
