import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getMatchesPath, getSelectedMatchId,
  ACTIONS_PATH, STATES_PATH, SIMULATIONS_PATH } from './redux';
import { getIsInitialized } from '../../data/redux';
import { Page, PageSide, PageContent, PageContentWrapper, Title, SectionTitle, PageSection } from '../../components/Page';
import MatchSelection from './MatchSelection';
import MatchTabs from './MatchTabs';
import StepNavigation from './StepNavigation';
import MatchSimulations from './MatchSimulations';
import StateMap from './StateMap';
import StateSummary from './StateSummary';
import MatchActions from './MatchActions';
import VersionInfo from './VersionInfo';

const MatchesPage = ({
  path,
  selectedMatchId,
  isInitializedMatchDetails,
}) => {
  let matchContent = null;
  switch (path) {
    case ACTIONS_PATH: {
      matchContent = renderActions();
      break;
    }
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
          { selectedMatchId && isInitializedMatchDetails && (
            <Fragment>
              <MatchTabs />
              {matchContent}
            </Fragment>
          )}
        </PageContentWrapper>
      </PageContent>
      <PageSide right>
        <VersionInfo />
      </PageSide>
    </Page>
  );

  function renderActions() {
    return (
      <Fragment>
        <PageSection>
          <SectionTitle>Steps</SectionTitle>
        </PageSection>
        <MatchActions />
      </Fragment>
    );
  }

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
  selectedMatchId: PropTypes.string,
  isInitializedMatchDetails: PropTypes.bool.isRequired,
};
MatchesPage.defaultProps = {
  selectedMatchId: null,
};

const mapStateToProps = (state) => {
  const path = getMatchesPath(state);
  const isInitialized = getIsInitialized(state);
  const selectedMatchId = getSelectedMatchId(state);
  return {
    path,
    selectedMatchId,
    isInitializedMatchDetails: selectedMatchId
      ? Boolean(isInitialized.matchMatchDetails[selectedMatchId])
      : false,
  };
};
export default connect(mapStateToProps)(MatchesPage);
