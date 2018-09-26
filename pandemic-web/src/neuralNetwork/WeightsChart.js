/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { rgb } from 'd3-color';
import { interpolateHcl } from 'd3-interpolate';

class WeightsChart extends Component {
  constructor(props) {
    super(props);
    this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    console.log('createChart');
    const { svgRef } = this;
    const { data, shape } = this.props;
    const size = 2;
    select(svgRef)
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect');
    select(svgRef)
      .selectAll('rect')
      .data(data)
      .style('fill', d => getCellBgColor(d))
      .attr('x', (d, i) => (i % shape[0]) * size)
      .attr('y', (d, i) => (Math.floor(i / shape[0])) * size)
      .attr('height', size)
      .attr('width', size);
  }

  render() {
    return (
      <svg
        ref={(ref) => { this.svgRef = ref; }}
        width={500}
        height={500}
      />
    );
  }
}
WeightsChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  shape: PropTypes.arrayOf(PropTypes.number).isRequired,
};

function getCellBgColor(value) {
  if (!value) { return '#e6e6e6'; }
  const valueColor = scaleLinear().domain([-1.0, 0.0, 1.0])
    .interpolate(interpolateHcl)
    .range([rgb('#a50026'), rgb('#ffffff'), rgb('#1a9850')]);
  return valueColor(value);
}

export default WeightsChart;
