/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { select } from 'd3-selection';
import range from 'lodash/range';

import './IterationsChart.css';

class IterationsChart extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      height: 200,
      width: 928,
      padding: {
        top: 8,
        right: 36,
        bottom: 24,
        left: 36,
      },
    };
    this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    const { svgRef } = this;
    const { height, width, padding } = this.styles;
    const contentHeight = height - padding.top - padding.bottom;
    const contentWidth = width - padding.left - padding.right;
    const contentX = padding.left;
    const contentY = padding.top;

    renderHorizontalGrid();
    renderVerticalGrid();
    renderHorizontalAxis();
    renderVerticalAxis();
    // renderVerticalGrid();
    // range(0, 6).forEach()

    // select(svgRef)
    //   .append('rect')
    //   .attr('x', padding.left)
    //   .attr('y', padding.top)
    //   .attr('height', contentHeight)
    //   .attr('width', contentWidth);

    function renderHorizontalGrid() {
      const steps = 5;
      const stepHeight = contentHeight / steps;
      const gridGroup = select(svgRef).append('g');
      range(0, steps).forEach((i) => {
        const lineGroup = gridGroup.append('g');
        lineGroup.append('line')
          .attr('class', 'p-chart__grid-line')
          .attr('x1', contentX)
          .attr('y1', contentY + i * stepHeight)
          .attr('x2', contentX + contentWidth)
          .attr('y2', contentY + i * stepHeight);
        lineGroup.append('line')
          .attr('class', 'p-chart__axis-line')
          .attr('x1', contentX - 4)
          .attr('y1', contentY + i * stepHeight)
          .attr('x2', contentX)
          .attr('y2', contentY + i * stepHeight);
        lineGroup.append('text')
          .attr('class', 'p-chart__grid-label')
          .attr('x', contentX - 8)
          .attr('y', contentY + i * stepHeight)
          .attr('dy', '5px')
          .attr('text-anchor', 'end')
          .text((100 - i * 20).toString());
      });
    }

    function renderVerticalGrid() {
      const steps = 4;
      const stepWidth = contentWidth / steps;
      const gridGroup = select(svgRef).append('g');
      range(0, steps).forEach((i) => {
        const lineGroup = gridGroup.append('g');
        if (i === steps - 1) {
          lineGroup.append('line')
            .attr('class', 'p-chart__grid-line')
            .attr('x1', contentX + (i + 1) * stepWidth)
            .attr('y1', contentY)
            .attr('x2', contentX + (i + 1) * stepWidth)
            .attr('y2', contentY + contentHeight);
        }
        lineGroup.append('line')
          .attr('class', 'p-chart__axis-line')
          .attr('x1', contentX + (i + 1) * stepWidth)
          .attr('y1', contentY + contentHeight)
          .attr('x2', contentX + (i + 1) * stepWidth)
          .attr('y2', contentY + contentHeight + 4);
        lineGroup.append('text')
          .attr('class', 'p-chart__grid-label')
          .attr('x', contentX + (i + 1) * stepWidth)
          .attr('y', contentY + contentHeight + 6)
          .attr('dy', '11px')
          .attr('text-anchor', 'middle')
          .text(((i + 1) * 5).toString());
      });
    }

    function renderHorizontalAxis() {
      const axisGroup = select(svgRef).append('g');
      axisGroup.append('line')
        .attr('class', 'p-chart__axis-line')
        .attr('x1', contentX)
        .attr('y1', contentY + contentHeight)
        .attr('x2', contentX + contentWidth)
        .attr('y2', contentY + contentHeight);
    }

    function renderVerticalAxis() {
      const axisGroup = select(svgRef).append('g');
      axisGroup.append('line')
        .attr('class', 'p-chart__axis-line')
        .attr('x1', contentX)
        .attr('y1', contentY)
        .attr('x2', contentX)
        .attr('y2', contentY + contentHeight);
    }
  }

  render() {
    const { height, width } = this.styles;
    return (
      <svg
        ref={(ref) => { this.svgRef = ref; }}
        height={height}
        width={width}
      />
    );
  }
}

export default IterationsChart;
