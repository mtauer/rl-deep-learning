import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import max from 'lodash/max';
import mean from 'lodash/mean';
import isEqual from 'lodash/isEqual';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styled from 'styled-components';

import { getMatches } from '../../data/redux';
import { getCurrentStep } from './redux';
import { PageSection } from '../../components/Page';
import ValueBar from './ValueBar';
import PandemicAction from './PandemicAction';
import PandemicCards from './PandemicCards';

const Container = styled.div`
  border-top: 2px solid #e0e0e0;
`;
const ValueBarContainer = styled.div`
  padding: 0 8px 0 0;
`;

const styles = () => ({
  headRow: {
    backgroundColor: '#F7F7F7',
    height: 32,
  },
  barHeadCell: {
    padding: '0 8px',
    width: 58,
  },
  bodyRow: {
    height: 40,
  },
  bodyRowActive: {
    backgroundColor: '#F3F7ED',
    height: 40,
  },
});

const MatchSimulations = ({ currentSimulation, nextAction, classes }) => {
  const {
    p1,
    n,
    ucb,
    q,
    p2,
    pt,
    validActions,
  } = currentSimulation;
  const p1Max = mean([max(p1), 1]);
  const nMax = max(n);
  const ucbMax = max(ucb);
  const qMax = mean([max(q), 1]);
  const p2Max = mean([max(p2), 1]);
  const ptMax = mean([max(pt), 1]);
  return (
    <PageSection>
      <Container>
        <Table>
          <TableHead>
            <TableRow className={classes.headRow}>
              <TableCell className={classes.barHeadCell}>P1</TableCell>
              <TableCell className={classes.barHeadCell}>N</TableCell>
              <TableCell className={classes.barHeadCell}>UCB</TableCell>
              <TableCell className={classes.barHeadCell}>Q</TableCell>
              <TableCell className={classes.barHeadCell}>P2</TableCell>
              <TableCell className={classes.barHeadCell}>Pt</TableCell>
              <TableCell style={{ width: 160 }}>Action</TableCell>
              <TableCell>Cards</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {validActions.map((a, i) => renderSimulationRow(i))}
          </TableBody>
        </Table>
      </Container>
    </PageSection>
  );

  function renderSimulationRow(index) {
    const rowClassName = nextAction && isEqual(nextAction, validActions[index])
      ? classes.bodyRowActive
      : classes.bodyRow;
    return (
      <TableRow key={`action-${index}`} className={rowClassName}>
        <TableCell padding="none">
          <ValueBarContainer>
            <ValueBar value={p1[index]} color="#82AD4A" formatFunc={f => f.toFixed(3)} maxValue={p1Max} />
          </ValueBarContainer>
        </TableCell>
        <TableCell padding="none">
          <ValueBarContainer>
            <ValueBar value={n[index]} maxValue={nMax} />
          </ValueBarContainer>
        </TableCell>
        <TableCell padding="none">
          <ValueBarContainer>
            <ValueBar
              value={ucb[index]}
              formatFunc={f => f.toFixed(3)}
              minValue={-1}
              maxValue={ucbMax}
            />
          </ValueBarContainer>
        </TableCell>
        <TableCell padding="none">
          <ValueBarContainer>
            <ValueBar
              value={q[index]}
              formatFunc={f => f.toFixed(3)}
              minValue={-1}
              maxValue={qMax}
            />
          </ValueBarContainer>
        </TableCell>
        <TableCell padding="none">
          <ValueBarContainer>
            <ValueBar value={p2[index]} color="#82AD4A" formatFunc={f => f.toFixed(3)} maxValue={p2Max} />
          </ValueBarContainer>
        </TableCell>
        <TableCell padding="none">
          <ValueBarContainer>
            <ValueBar value={pt[index]} formatFunc={f => f.toFixed(3)} maxValue={ptMax} />
          </ValueBarContainer>
        </TableCell>
        <TableCell>
          <PandemicAction action={validActions[index]} />
        </TableCell>
        <TableCell>
          <PandemicCards
            cardIds={
              validActions[index].card
              || validActions[index].cards
              || validActions[index].usedCards
            }
          />
        </TableCell>
      </TableRow>
    );
  }
};
MatchSimulations.propTypes = {
  currentSimulation: PropTypes.shape().isRequired,
  nextAction: PropTypes.shape(),
  classes: PropTypes.shape().isRequired,
};
MatchSimulations.defaultProps = {
  nextAction: null,
};

const mapStateToProps = (state) => {
  const matches = getMatches(state);
  const matchId = 'bbdea21a-cae8-402d-a1a1-f31a6692ebf5';
  const simulations = matches[matchId] ? matches[matchId].simulations : null;
  const currentStep = getCurrentStep(state);
  const currentSimulation = simulations ? simulations[currentStep - 1] : {
    p1: [],
    validActions: [],
  };
  const actions = matches[matchId] ? matches[matchId].actions : null;
  const nextAction = actions ? actions[currentStep - 1] : null;
  return {
    currentSimulation,
    nextAction,
  };
};
export default compose(
  withStyles(styles),
  connect(mapStateToProps),
)(MatchSimulations);
