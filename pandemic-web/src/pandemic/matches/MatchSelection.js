import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import values from 'lodash/values';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { getVersions, getIsInitialized } from '../../data/redux';
import { selectVersionAction, selectIterationAction, selectMatchAction,
  getSelectedVersionId, getSelectedIterationId, getSelectedMatchId,
  getSelectedIterationsArray, getSelectedMatchesArray } from './redux';
import { PageSection } from '../../components/Page';

const MatchSelection = ({
  versions,
  iterations,
  matches,
  isInitializedVersions,
  isInitializedIterations,
  isInitializedMatches,
  selectedVersionId,
  selectedIterationId,
  selectedMatchId,
  onVersionSelectChange,
  onIterationSelectChange,
  onMatchSelectChange,
}) => (
  <PageSection>
    <Grid container spacing={24}>
      <Grid item xs={4}>
        <FormControl fullWidth disabled={!isInitializedVersions}>
          <InputLabel htmlFor="version">Version</InputLabel>
          <Select
            value={selectedVersionId || ''}
            onChange={onVersionSelectChange}
            inputProps={{ id: 'version' }}
          >
            {versions.map(v => (
              <MenuItem key={v.versionId} value={v.versionId}>{v.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth disabled={!isInitializedIterations}>
          <InputLabel htmlFor="iteration">Iteration</InputLabel>
          <Select
            value={selectedIterationId || ''}
            onChange={onIterationSelectChange}
            inputProps={{ id: 'iteration' }}
          >
            {iterations.map(i => (
              <MenuItem key={i.iterationId} value={i.iterationId}>
                {`${i.name} – ${(i.winRate * 100).toFixed(2)}%`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth disabled={!isInitializedMatches}>
          <InputLabel htmlFor="iteration">Match</InputLabel>
          <Select
            value={selectedMatchId || ''}
            onChange={onMatchSelectChange}
            inputProps={{ id: 'match' }}
          >
            {matches.map(m => (
              <MenuItem key={m.matchId} value={m.matchId}>{`Match ${m.matchId.split('-')[0]} – ${m.resultValue.toFixed(3)}`}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  </PageSection>
);
MatchSelection.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  versions: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  iterations: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  matches: PropTypes.array.isRequired,
  isInitializedVersions: PropTypes.bool.isRequired,
  isInitializedIterations: PropTypes.bool.isRequired,
  isInitializedMatches: PropTypes.bool.isRequired,
  selectedVersionId: PropTypes.string,
  selectedIterationId: PropTypes.string,
  selectedMatchId: PropTypes.string,
  onVersionSelectChange: PropTypes.func.isRequired,
  onIterationSelectChange: PropTypes.func.isRequired,
  onMatchSelectChange: PropTypes.func.isRequired,
};
MatchSelection.defaultProps = {
  selectedVersionId: null,
  selectedIterationId: null,
  selectedMatchId: null,
};

const mapStateToProps = (state) => {
  const versions = values(getVersions(state));
  const iterations = getSelectedIterationsArray(state);
  const matches = getSelectedMatchesArray(state);
  const isInitialized = getIsInitialized(state);
  const selectedVersionId = getSelectedVersionId(state);
  const selectedIterationId = getSelectedIterationId(state);
  const selectedMatchId = getSelectedMatchId(state);
  return {
    versions,
    iterations,
    matches,
    isInitializedVersions: Boolean(isInitialized.versions),
    isInitializedIterations: selectedVersionId
      ? Boolean(isInitialized.versionIterations[selectedVersionId])
      : false,
    isInitializedMatches: selectedIterationId
      ? Boolean(isInitialized.iterationMatches[selectedIterationId])
      : false,
    selectedVersionId,
    selectedIterationId,
    selectedMatchId,
  };
};
const mapDispatchToProps = dispatch => ({
  onVersionSelectChange: (event) => {
    dispatch(selectVersionAction(event.target.value));
  },
  onIterationSelectChange: (event) => {
    dispatch(selectIterationAction(event.target.value));
  },
  onMatchSelectChange: (event) => {
    dispatch(selectMatchAction(event.target.value));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(MatchSelection);
