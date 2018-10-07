import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { PageSection } from '../../components/Page';

const MatchSelection = () => (
  <PageSection>
    <Grid container spacing={24}>
      <Grid item xs={4}>
        <FormControl fullWidth disabled>
          <InputLabel htmlFor="version">Version</InputLabel>
          <Select
            value=""
            onChange={() => console.log('onChange')}
            inputProps={{ id: 'version' }}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth disabled>
          <InputLabel htmlFor="iteration">Iteration</InputLabel>
          <Select
            value=""
            onChange={() => console.log('onChange')}
            inputProps={{ id: 'iteration' }}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
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

export default MatchSelection;
