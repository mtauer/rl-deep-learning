/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import values from 'lodash/values';
import sum from 'lodash/sum';
import { VictoryChart, VictoryTheme, VictoryLine } from 'victory';

import { getIterations } from '../data/redux';

const IterationsStats = ({ iterations }) => (
  <div>
    <VictoryChart theme={VictoryTheme.material} height={300} width={928} minDomain={{ x: 0, y: 0 }} maxDomain={{ x: 20, y: 100 }}>
      <VictoryLine
        data={iterations.map(i => ({
          x: i.iteration,
          y: i.iterationSummary.trainingEpisodesStats.winRate * 100,
        }))}
      />
    </VictoryChart>
    <VictoryChart theme={VictoryTheme.material} height={300} width={928} minDomain={{ x: 0, y: 0 }} maxDomain={{ x: 20, y: 100 }}>
      <VictoryLine
        data={iterations.map((i) => {
          const { actionCounts } = i.iterationSummary.trainingEpisodesStats;
          const actionsTotal = sum(values(actionCounts));
          return {
            x: i.iteration,
            y: (actionCounts.DO_NOTHING / actionsTotal) * 100,
          };
        })}
      />
    </VictoryChart>
  </div>
);
IterationsStats.propTypes = {
  iterations: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  iterations: values(getIterations(state)),
});
export default connect(mapStateToProps)(IterationsStats);
