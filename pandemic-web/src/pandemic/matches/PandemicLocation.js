import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';

import { getLocationName, getLocationAbbreviation, getLocationColor } from '../../utils/formatHelpers';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
`;
const Circle = styled.span`
  background-color: ${({ color }) => color};
  border-radius: 4px;
  display: block;
  height: 8px;
  margin: 0 8px 0 0;
  width: 8px;
`;

const PandemicLocation = ({ locationId, hideTooltip }) => {
  if (!locationId) { return null; }
  const location = (
    <Container>
      <Circle color={getLocationColor(locationId)} />
      <span>{getLocationAbbreviation(locationId)}</span>
    </Container>
  );
  if (hideTooltip) {
    return location;
  }
  return (
    <Tooltip title={getLocationName(locationId)}>
      {location}
    </Tooltip>
  );
};
PandemicLocation.propTypes = {
  locationId: PropTypes.number,
  hideTooltip: PropTypes.bool,
};
PandemicLocation.defaultProps = {
  locationId: null,
  hideTooltip: false,
};

export default PandemicLocation;
