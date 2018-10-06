import React from 'react';

import { Page, PageSide, PageContent, PageContentWrapper, Title } from '../components/Page';
import MatchSelection from './MatchSelection';
import MatchTabs from './MatchTabs';
import MatchSimulations from './MatchSimulations';

const MatchesPage = () => (
  <Page>
    <PageSide left />
    <PageContent>
      <PageContentWrapper>
        <Title>Pandemic Matches</Title>
        <MatchSelection />
        <MatchTabs />
        <MatchSimulations />
      </PageContentWrapper>
    </PageContent>
    <PageSide right />
  </Page>
);

export default MatchesPage;
