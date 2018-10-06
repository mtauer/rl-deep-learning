import React from 'react';

import { Page, PageSide, PageContent, PageContentWrapper, PageSection, Title } from '../components/Page';
import MatchSelection from './MatchSelection';
import MatchTabs from './MatchTabs';

const MatchesPage = () => (
  <Page>
    <PageSide left />
    <PageContent>
      <PageContentWrapper>
        <Title>Pandemic Matches</Title>
        <PageSection>
          <MatchSelection />
        </PageSection>
        <PageSection>
          <MatchTabs />
        </PageSection>
      </PageContentWrapper>
    </PageContent>
    <PageSide right />
  </Page>
);

export default MatchesPage;
