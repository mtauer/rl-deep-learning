import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getMatchesPath, STATES_PATH, SIMULATIONS_PATH } from './redux';
import { Page, PageSide, PageContent, PageContentWrapper, Title, SectionTitle } from '../../components/Page';
import MatchSelection from './MatchSelection';
import MatchTabs from './MatchTabs';
import StepNavigation from './StepNavigation';
import MatchSimulations from './MatchSimulations';
import StateMap from './StateMap';
import StateSummary from './StateSummary';

const MatchesPage = ({ path }) => {
  let matchContent = null;
  switch (path) {
    case STATES_PATH: {
      matchContent = renderStates();
      break;
    }
    case SIMULATIONS_PATH: {
      matchContent = renderSimulations();
      break;
    }
    default: break;
  }
  return (
    <Page>
      <PageSide left />
      <PageContent>
        <PageContentWrapper>
          <Title>Pandemic Matches</Title>
          <MatchSelection />
          <MatchTabs />
          {matchContent}
        </PageContentWrapper>
      </PageContent>
      <PageSide right />
    </Page>
  );

  function renderStates() {
    return (
      <Fragment>
        <SectionTitle>Game State</SectionTitle>
        <StepNavigation />
        <StateMap />
        <StateSummary />
      </Fragment>
    );
  }

  function renderSimulations() {
    return (
      <Fragment>
        <SectionTitle>Simulations</SectionTitle>
        <StepNavigation />
        <MatchSimulations />
      </Fragment>
    );
  }
};
MatchesPage.propTypes = {
  path: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const path = getMatchesPath(state);
  return {
    path,
  };
};
export default connect(mapStateToProps)(MatchesPage);
