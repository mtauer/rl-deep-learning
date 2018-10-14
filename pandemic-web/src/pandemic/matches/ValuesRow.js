/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { scaleLinear } from 'd3-scale';
import { rgb } from 'd3-color';
import { interpolateHcl } from 'd3-interpolate';

const valueColor = scaleLinear().domain([0.0, 1.0])
  .interpolate(interpolateHcl)
  .range([rgb('#FFFFFF'), rgb('#82AD4A')]); // #2166ac, #ffffff, #d73027

const Container = styled.div`
  display: flex;
`;
const ValueCell = styled.span`
  display: block;
  height: 40px;
  width: 8px;
`;

const ValuesRow = ({ values }) => (
  <Container>
    {values.map((v, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <ValueCell key={`value-${i}`} style={{ backgroundColor: valueColor(v) }} />
    ))}
  </Container>
);
ValuesRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.array.isRequired,
};

export default ValuesRow;
