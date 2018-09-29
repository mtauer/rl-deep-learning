/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { rgb } from 'd3-color';
import { interpolateHcl } from 'd3-interpolate';
import clamp from 'lodash/clamp';

const clampValue = 3;

class WeightsChart extends Component {
  constructor(props) {
    super(props);
    this.createChart = this.createChart.bind(this);
    this.getCellBgColor = this.getCellBgColor.bind(this);
    this.valueColor = scaleLinear().domain([-clampValue, 0.0, clampValue])
      .interpolate(interpolateHcl)
      .range([rgb('#a50026'), rgb('#ffffff'), rgb('#1a9850')]);
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    const { svgRef } = this;
    const { data, shape } = this.props;
    const size = 2;
    const lineLength = shape[1] || 1;
    select(svgRef)
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect');
    select(svgRef)
      .selectAll('rect')
      .data(data)
      .style('fill', d => this.getCellBgColor(d))
      .attr('x', (d, i) => (Math.floor(i / lineLength)) * size)
      .attr('y', (d, i) => (i % lineLength) * size)
      .attr('height', size)
      .attr('width', size);
  }

  getCellBgColor(value) {
    return this.valueColor(clamp(value, -clampValue, clampValue));
  }

  render() {
    return (
      <svg
        ref={(ref) => { this.svgRef = ref; }}
        width={820}
        height={820}
      />
    );
  }
}
WeightsChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  shape: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default WeightsChart;
