import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import min from 'lodash/min';
import max from 'lodash/max';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Block from '@material-ui/icons/Block';
import Commute from '@material-ui/icons/Commute';
import FlightLand from '@material-ui/icons/FlightLand';
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import Flight from '@material-ui/icons/Flight';
import Home from '@material-ui/icons/Home';
import Delete from '@material-ui/icons/Delete';
import People from '@material-ui/icons/People';
import Opacity from '@material-ui/icons/Opacity';

import { getMatches } from '../../data/redux';
import { getCurrentStep, getSelectedMatchId } from './redux';
import { PageSection } from '../../components/Page';
import LabeledValue from '../../components/LabeledValue';
import ValuesRow from './ValuesRow';

const Label = styled.div`
  color: #333333;
  display: block;
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  padding: 0 0 12px 0;
`;
const ActionType = styled.div`
  align-items: center;
  display: flex;
`;
const Icon = styled.span`
  display: block;
  height: 24px;
  margin: 0 8px 0 0;
`;
const Type = styled.span`
  display: block;
`;
const ValuesContainer = styled.div`
  display: flex;
  margin: 16px 0 0 0;

  & > * {
    margin: 0 16px 0 0;
  }
`;

const MatchNetworkPOutputs = ({ currentNetworkPOutput }) => {
  const minValue = currentNetworkPOutput ? min(currentNetworkPOutput) : 0;
  const maxValue = currentNetworkPOutput ? max(currentNetworkPOutput) : 1;
  return (
    <PageSection>
      <Label>Predicted action parameter probabilites</Label>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 250 }}>Action type</TableCell>
            <TableCell>Action parameter probabilities</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderValuesRow(<Icon><Block /></Icon>, 'Do nothing', 0, 1)}
          {renderValuesRow(<Icon><Commute /></Icon>, 'Drive/ferry', 1, 49)}
          {renderValuesRow(<Icon><FlightLand /></Icon>, 'Direct flight', 49, 97)}
          {renderValuesRow(<Icon><FlightTakeoff /></Icon>, 'Charter flight', 97, 145)}
          {renderValuesRow(<Icon><Flight /></Icon>, 'Shuttle flight', 145, 193)}
          {renderValuesRow(<Icon><Home /></Icon>, 'Build research center', 193, 241)}
          {renderValuesRow(<Icon><Delete /></Icon>, 'Discard card', 241, 289)}
          {renderValuesRow(<Icon><People /></Icon>, 'Share knowledge', 289, 337)}
          {renderValuesRow(<Icon><Opacity /></Icon>, 'Discover cure', 337, 385)}
        </TableBody>
      </Table>
      <ValuesContainer>
        <LabeledValue label="Min p value" value={minValue.toFixed(3)} type="secondary" />
        <LabeledValue label="Max p value" value={maxValue.toFixed(3)} type="secondary" />
      </ValuesContainer>
    </PageSection>
  );

  function renderValuesRow(icon, label, offsetFrom, offsetTo) {
    return (
      <TableRow key={`values-row-${offsetFrom}`}>
        <TableCell>
          <ActionType>
            {icon}
            <Type>{label}</Type>
          </ActionType>
        </TableCell>
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
