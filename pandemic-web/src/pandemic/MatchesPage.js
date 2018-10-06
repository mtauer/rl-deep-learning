import React from 'react';

import { Page, PageSide, PageContent, PageContentWrapper, Title, SectionTitle } from '../components/Page';
import MatchSelection from './MatchSelection';
import MatchTabs from './MatchTabs';
import StepNavigation from './StepNavigation';
import MatchSimulations from './MatchSimulations';

const MatchesPage = () => (
  <Page>
    <PageSide left />
    <PageContent>
      <PageContentWrapper>
        <Title>Pandemic Matches</Title>
        <MatchSelection />
        <MatchTabs />
        <SectionTitle>Simulations</SectionTitle>
        <StepNavigation />
        <MatchSimulations />
      </PageContentWrapper>
    </PageContent>
    <PageSide right />
  </Page>
);

export default MatchesPage;
