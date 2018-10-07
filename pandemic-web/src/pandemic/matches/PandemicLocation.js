import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

const PandemicLocation = ({ locationId }) => (
  <Container>
    <Circle color={getLocationColor(locationId)} />
    <span>{getLocationAbbreviation()}</span>
  </Container>
);
PandemicLocation.propTypes = {
  locationId: PropTypes.number.isRequired,
};

function getLocationColor() {
  return '#DA1C49';
}

function getLocationAbbreviation() {
  return 'AT';
}

export default PandemicLocation;
