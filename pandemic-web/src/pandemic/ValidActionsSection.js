import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getGameState, getValidActions, getPredictedPValues,
  getPredictedVValues, getNaValues, getQaValues, getUcbSumValues } from './redux';
import { Section, Label, SectionTitle, Row } from '../components/Page';
import BarChart from './BarChart';
import ValidActions from './ValidActions';

const BarChartContainer = styled.div`
  margin-right: 16px;
`;
const ValidActionsContainer = styled.div`
  flex: 1;
`;

const NextActionsSection = ({
  gameState,
  validActions,
  predictedPValues,
  predictedVValues,
  naValues,
  qaValues,
  ucbSumValues,
}) => {
  console.log('gameState', gameState);
  return (
    <Section>
      <SectionTitle>
        Live view – Iteration .., Episode .., Step ..
      </SectionTitle>
      <Label>
        Next actions (blue: v value and probabilities from neural network, orange:
        combined upper confidence bound and number of visits)
      </Label>
      <Row>
        <BarChartContainer>
          <BarChart
            values={predictedVValues}
            color="#91bfdb"
            offset={-1}
            formatFunc={f => f.toFixed(3)}
          />
        </BarChartContainer>
        <BarChartContainer>
          <BarChart
            values={predictedPValues}
            color="#91bfdb"
            formatFunc={f => f.toFixed(3)}
          />
        </BarChartContainer>
        <BarChartContainer>
          <BarChart
            values={ucbSumValues}
            color="#fca982"
            offset={-1}
            formatFunc={f => f.toFixed(3)}
          />
        </BarChartContainer>
        <BarChartContainer>
          <BarChart
            values={naValues}
            color="#fca982"
          />
        </BarChartContainer>
        <ValidActionsContainer>
          <ValidActions
            validActions={validActions}
            values={qaValues}
          />
        </ValidActionsContainer>
      </Row>
    </Section>
  );
};
NextActionsSection.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  gameState: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  validActions: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  predictedPValues: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  predictedVValues: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  naValues: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  qaValues: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  ucbSumValues: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  gameState: getGameState(state),
  validActions: getValidActions(state),
  predictedVValues: getPredictedVValues(state),
  predictedPValues: getPredictedPValues(state),
  naValues: getNaValues(state),
  qaValues: getQaValues(state),
  ucbSumValues: getUcbSumValues(state),
});
export default connect(mapStateToProps)(NextActionsSection);
