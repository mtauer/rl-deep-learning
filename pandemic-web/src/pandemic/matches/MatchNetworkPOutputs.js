import React from 'react';
import range from 'lodash/range';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import { PageSection } from '../../components/Page';
import ValuesRow from './ValuesRow';

const Label = styled.div`
  color: #333333;
  display: block;
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  padding: 0 0 12px 0;
`;

const MatchNetworkPOutputs = () => (
  <PageSection>
    <Label>Predicted action parameter probabilites</Label>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={{ width: 200 }}>Action type</TableCell>
          <TableCell>Parameter probabilities</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>DRIVE_FERRY</TableCell>
          <TableCell padding="none">
            <ValuesRow values={range(48).map(() => Math.random())} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </PageSection>
);

export default MatchNetworkPOutputs;
