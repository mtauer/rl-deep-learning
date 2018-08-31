/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import max from 'lodash/max';
import isFinite from 'lodash/isFinite';

const Chart = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: ${({ size }) => `${size}px`};
  grid-gap: 1px;
  justify-items: stretch;
  width: ${({ size }) => `${size}px`};
`;
const Cell = styled.div`
  align-items: center;
  display: flex;
  position: relative;
  text-align: center;
`;
const CellValue = styled.div`
  bottom: 0;
  font-size: 12px;
  left: 6px;
  line-height: 80px;
  position: absolute;
  top: 0;
`;
const CellBar = styled.div`
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
`;

const BarChart = ({
  values,
  color,
  size,
  offset,
  formatFunc,
}) => {
  const maxValue = max(values) - offset;
  return (
    <Chart size={size}>
      { values.map((v, i) => {
        const barWidth = !isFinite(v) || (v - offset) < 0 ? 0 : size * (v - offset) / maxValue;
        return (
          <Cell key={`next-action-bar-${i}`}>
            <CellBar style={{ width: `${barWidth}px`, backgroundColor: color }} />
            <CellValue>
              {v !== undefined ? formatFunc(v) : ''}
            </CellValue>
          </Cell>
        );
      }) }
    </Chart>
  );
};
BarChart.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number,
  offset: PropTypes.number,
  formatFunc: PropTypes.func,
};
BarChart.defaultProps = {
  size: 80,
  offset: 0,
  formatFunc: v => v,
};

export default BarChart;
