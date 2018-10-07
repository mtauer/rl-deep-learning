import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  height: 40px;
  margin: 0;
  position: relative;
`;
const Bar = styled.div`
  background-color: ${({ color }) => color};
  bottom: 0;
  position: absolute;
  top: 0;
`;
const Label = styled.span`
  display: block;
  left: 8px;
  font-size: 10px;
  font-weight: 500;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const ValueBar = ({ value, minValue, maxValue, color }) => {
  const maxBarWidth = 48;
  let barWidth;
  if (value <= minValue) {
    barWidth = 0;
  } else if (value >= maxValue) {
    barWidth = maxBarWidth;
  } else {
    barWidth = (value - minValue) / (maxValue - minValue) * maxBarWidth;
  }
  return (
    <Container>
      <Bar style={{ width: barWidth }} color={color} />
      <Label>{value}</Label>
    </Container>
  );
};
ValueBar.propTypes = {
  value: PropTypes.number.isRequired,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  color: PropTypes.string,
};
ValueBar.defaultProps = {
  minValue: 0,
  maxValue: 1,
  color: '#C4C4C4',
};

export default ValueBar;
