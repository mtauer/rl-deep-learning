import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import styled from 'styled-components';

import { getSelectedMatchId } from './redux';
import { getMatches } from '../../data/redux';
import { PageSection } from '../../components/Page';
import PandemicAction from './PandemicAction';
import PandemicCards from './PandemicCards';
import PandemicLocation from './PandemicLocation';

const Container = styled.div`
  border-top: 2px solid #e0e0e0;
`;
const SmallLabel = styled.span`
  color: rgba(0, 0, 0, 0.54);
  display: block;
  font-size: 10px;
  font-weight: 500;
`;

const styles = () => ({
  headRow: {
    backgroundColor: '#F7F7F7',
    height: 32,
  },
  bodyRow: {
    height: 40,
  },
});

const MatchActions = ({ actions, states, classes }) => {
  return (
    <PageSection>
      <Container>
        <Table>
          <TableHead>
            <TableRow className={classes.headRow}>
              <TableCell style={{ width: 40 }}>#</TableCell>
              <TableCell style={{ width: 80 }}>Player</TableCell>
              <TableCell style={{ width: 80 }}>Position</TableCell>
              <TableCell style={{ width: 160 }}>Action</TableCell>
              <TableCell>Cards</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actions.map((a, i) => renderActionRow(a, i))}
          </TableBody>
        </Table>
      </Container>
    </PageSection>
  );

  function renderActionRow(action, index) {
    const { playerPosition } = states[index];
    return (
      <TableRow key={`action-${index}`} className={classes.bodyRow}>
        <TableCell>
          <SmallLabel>{index + 1}</SmallLabel>
        </TableCell>
        <TableCell>
          {Number.parseInt(action.player, 10) + 1}
        </TableCell>
        <TableCell>
          <PandemicLocation locationId={playerPosition[action.player]} />
        </TableCell>
        <TableCell>
          <PandemicAction
            action={action}
          />
        </TableCell>
        <TableCell>
          <PandemicCards
            cardIds={action.card || action.cards || action.usedCards}
          />
        </TableCell>
      </TableRow>
    );
  }
};
MatchActions.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  actions: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  states: PropTypes.array.isRequired,
  classes: PropTypes.shape().isRequired,
};

const mapStateToProps = (state) => {
  const matches = getMatches(state);
  const matchId = getSelectedMatchId(state);
  const actions = matches[matchId] ? matches[matchId].actions : [];
  const states = matches[matchId] ? matches[matchId].states : [];
  return {
    actions,
    states,
  };
};
export default compose(
  withStyles(styles),
  connect(mapStateToProps),
)(MatchActions);
