import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styled from 'styled-components';

import { PageSection } from '../../components/Page';

const Container = styled.div`
  border-top: 2px solid #e0e0e0;
`;

const styles = () => ({
  headRow: {
    backgroundColor: '#F7F7F7',
    height: 32,
  },
});

const MatchActions = ({ classes }) => (
  <PageSection>
    <Container>
      <Table>
        <TableHead>
          <TableRow className={classes.headRow}>
            <TableCell style={{ width: 160 }}>Action</TableCell>
            <TableCell>Cards</TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </Container>
  </PageSection>
);
MatchActions.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(MatchActions);
