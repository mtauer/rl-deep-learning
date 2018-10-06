import React from 'react';

import { Page, PageSide, PageContent, PageContentWrapper, Title } from '../components/Page';
import MatchSelection from './MatchSelection';

const MatchesPage = () => (
  <Page>
    <PageSide left />
    <PageContent>
      <PageContentWrapper>
        <Title>Pandemic Matches</Title>
        <MatchSelection />
      </PageContentWrapper>
    </PageContent>
    <PageSide right />
  </Page>
);

export default MatchesPage;
