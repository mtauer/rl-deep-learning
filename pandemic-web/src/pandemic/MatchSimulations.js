import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { PageSection } from '../components/Page';

const MatchSimulations = () => (
  <PageSection>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell padding="none">P1</TableCell>
          <TableCell>N</TableCell>
          <TableCell>UCB</TableCell>
          <TableCell>Q</TableCell>
          <TableCell>P2</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Cards</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell padding="none">.</TableCell>
          <TableCell>.</TableCell>
          <TableCell>.</TableCell>
          <TableCell>.</TableCell>
          <TableCell>.</TableCell>
          <TableCell>DRIVE_FERRY</TableCell>
          <TableCell>LA_KH_LA_KH_LA</TableCell>
        </TableRow>
        <TableRow>
          <TableCell padding="none">.</TableCell>
          <TableCell>.</TableCell>
          <TableCell>.</TableCell>
          <TableCell>.</TableCell>
          <TableCell>.</TableCell>
          <TableCell>DRIVE_FERRY</TableCell>
          <TableCell>LA_KH_LA_KH_LA</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </PageSection>
);

export default MatchSimulations;
