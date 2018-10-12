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
import { selectVersionAction, selectIterationAction, getSelectedVersionId,
  getSelectedIterationId, getSelectedIterationsArray } from './redux';
import { PageSection } from '../../components/Page';

const MatchSelection = ({
  versions,
  iterations,
  isInitializedVersions,
  isInitializedIterations,
  selectedVersionId,
  selectedIterationId,
  onVersionSelectChange,
  onIterationSelectChange,
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
              <MenuItem key={i.iterationId} value={i.iterationId}>{i.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth disabled>
          <InputLabel htmlFor="iteration">Match</InputLabel>
          <Select
            value=""
            onChange={() => console.log('onChange')}
            inputProps={{ id: 'match' }}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
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
  isInitializedVersions: PropTypes.bool.isRequired,
  isInitializedIterations: PropTypes.bool.isRequired,
  selectedVersionId: PropTypes.string,
  selectedIterationId: PropTypes.string,
  onVersionSelectChange: PropTypes.func.isRequired,
  onIterationSelectChange: PropTypes.func.isRequired,
};
MatchSelection.defaultProps = {
  selectedVersionId: null,
  selectedIterationId: null,
};

const mapStateToProps = (state) => {
  const versions = values(getVersions(state));
  const iterations = getSelectedIterationsArray(state);
  const isInitialized = getIsInitialized(state);
  const selectedVersionId = getSelectedVersionId(state);
  const selectedIterationId = getSelectedIterationId(state);
  return {
    versions,
    iterations,
    isInitializedVersions: Boolean(isInitialized.versions),
    isInitializedIterations: selectedVersionId
      ? Boolean(isInitialized.versionIterations[selectedVersionId])
      : false,
    selectedVersionId,
    selectedIterationId,
  };
};
const mapDispatchToProps = dispatch => ({
  onVersionSelectChange: (event) => {
    dispatch(selectVersionAction(event.target.value));
  },
  onIterationSelectChange: (event) => {
    dispatch(selectIterationAction(event.target.value));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(MatchSelection);
