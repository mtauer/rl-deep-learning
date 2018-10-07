import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styled from 'styled-components';

import { PageSection } from '../components/Page';
import ValueBar from './ValueBar';
import PandemicAction from './PandemicAction';

const ValueBarContainer = styled.div`
  border-left: 1px solid rgba(224, 224, 224, 1);
  padding: 0 8px 0 0;
`;

const styles = () => ({
  barHeadCell: {
    padding: '0 8px',
    width: 58,
  },
});

const MatchSimulations = ({ classes }) => (
  <PageSection>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.barHeadCell}>P1</TableCell>
          <TableCell className={classes.barHeadCell}>N</TableCell>
          <TableCell className={classes.barHeadCell}>UCB</TableCell>
          <TableCell className={classes.barHeadCell}>Q</TableCell>
          <TableCell className={classes.barHeadCell}>P2</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Cards</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell padding="none">
            <ValueBarContainer>
              <ValueBar value={0.125} color="#82AD4A" />
            </ValueBarContainer>
          </TableCell>
          <TableCell padding="none">
            <ValueBarContainer>
              <ValueBar value={0.425} />
            </ValueBarContainer>
          </TableCell>
          <TableCell padding="none">
            <ValueBarContainer>
              <ValueBar value={0.425} />
            </ValueBarContainer>
          </TableCell>
          <TableCell padding="none">
            <ValueBarContainer>
              <ValueBar value={0.425} />
            </ValueBarContainer>
          </TableCell>
          <TableCell padding="none">
            <ValueBarContainer>
              <ValueBar value={0.425} color="#82AD4A" />
            </ValueBarContainer>
          </TableCell>
          <TableCell>
            <PandemicAction action={{ type: 'DIRECT_FLIGHT', to: 3 }} />
          </TableCell>
          <TableCell>LA_KH_LA_KH_LA</TableCell>
        </TableRow>
        <TableRow>
          <TableCell padding="none">.</TableCell>
          <TableCell padding="none">.</TableCell>
          <TableCell padding="none">.</TableCell>
          <TableCell padding="none">.</TableCell>
          <TableCell padding="none">.</TableCell>
          <TableCell>DRIVE_FERRY</TableCell>
          <TableCell>LA_KH_LA_KH_LA</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </PageSection>
);
MatchSimulations.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(MatchSimulations);
