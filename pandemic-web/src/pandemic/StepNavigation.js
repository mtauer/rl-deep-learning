import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import PlayArrow from '@material-ui/icons/PlayArrow';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';

import LabeledValue from '../components/LabeledValue';

const Container = styled.div`
  align-items: center;
  display: flex;
`;
const NavItem = styled.div`
  padding: 0 32px 0 0;
`;

const StepNavigation = () => (
  <Container>
    <NavItem>
      <IconButton color="primary" aria-label="Previous Step">
        <SkipPrevious />
      </IconButton>
      <IconButton color="primary" aria-label="Play">
        <PlayArrow />
      </IconButton>
      <IconButton color="primary" aria-label="Next Step">
        <SkipNext />
      </IconButton>
    </NavItem>
    <NavItem>
      <LabeledValue label="Step" value="1 / 61" />
    </NavItem>
    <NavItem>
      <LabeledValue label="Player" value="1" />
    </NavItem>
    <NavItem>
      <LabeledValue label="Moves Left" value="4" />
    </NavItem>
    <NavItem>
      <LabeledValue label="Location" value="Atlanta" />
    </NavItem>
  </Container>
);

export default StepNavigation;
