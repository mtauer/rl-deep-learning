/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import values from 'lodash/values';
import sum from 'lodash/sum';

import { getIterations } from '../data/redux';
import IterationsChart from './IterationsChart';

const IterationsStats = ({ iterations }) => (
  <div>
    <IterationsChart
      data={iterations.map(i => ({
        x: i.iteration,
        y: i.iterationSummary.trainingEpisodesStats.winRate * 100,
      }))}
      dataColor="#d6604d"
    />
    <IterationsChart
      data={iterations.map((i) => {
        const { actionCounts } = i.iterationSummary.trainingEpisodesStats;
        const actionsTotal = sum(values(actionCounts));
        return {
          x: i.iteration,
          y: (actionCounts.DO_NOTHING / actionsTotal) * 100,
        };
      })}
      dataColor="#4393c3"
    />
  </div>
);
IterationsStats.propTypes = {
  iterations: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  iterations: values(getIterations(state)),
});
export default connect(mapStateToProps)(IterationsStats);
