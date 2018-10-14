import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import max from 'lodash/max';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import { getMatches } from '../../data/redux';
import { getCurrentStep, getSelectedMatchId } from './redux';
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

const MatchNetworkPOutputs = ({ currentNetworkPOutput }) => {
  const maxValue = currentNetworkPOutput ? max(currentNetworkPOutput) : 1;
  return (
    <PageSection>
      <Label>Predicted action parameter probabilites</Label>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 220 }}>Action type</TableCell>
            <TableCell>Action parameter probabilities</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderValuesRow('Do nothing', 0, 1)}
          {renderValuesRow('Drive/ferry', 1, 49)}
          {renderValuesRow('Direct flight', 49, 97)}
          {renderValuesRow('Charter flight', 97, 145)}
          {renderValuesRow('Shuttle flight', 145, 193)}
          {renderValuesRow('Build research center', 193, 241)}
          {renderValuesRow('Discard card', 241, 289)}
          {renderValuesRow('Share knowledge', 289, 337)}
          {renderValuesRow('Discover cure', 337, 385)}
        </TableBody>
      </Table>
    </PageSection>
  );

  function renderValuesRow(label, offsetFrom, offsetTo) {
    return (
      <TableRow key={`values-row-${offsetFrom}`}>
        <TableCell>{label}</TableCell>
        <TableCell padding="none">
          <ValuesRow
            values={currentNetworkPOutput ? currentNetworkPOutput.slice(offsetFrom, offsetTo) : []}
            maxValue={maxValue}
          />
        </TableCell>
      </TableRow>
    );
  }
};
MatchNetworkPOutputs.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  currentNetworkPOutput: PropTypes.array,
};
MatchNetworkPOutputs.defaultProps = {
  currentNetworkPOutput: null,
};

const mapStateToProps = (state) => {
  const matches = getMatches(state);
  const matchId = getSelectedMatchId(state);
  const networkPOutputs = matches[matchId] ? matches[matchId].networkPOutputs : null;
  const currentStep = getCurrentStep(state);
  const currentNetworkPOutput = networkPOutputs ? networkPOutputs[currentStep - 1] : null;
  return {
    currentNetworkPOutput,
  };
};
export default connect(mapStateToProps)(MatchNetworkPOutputs);
