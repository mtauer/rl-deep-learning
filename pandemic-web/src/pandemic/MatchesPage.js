import React from 'react';

import { Page, PageSide, PageContent, PageContentWrapper, Title } from '../components/Page';

const MatchesPage = () => (
  <Page>
    <PageSide left />
    <PageContent>
      <PageContentWrapper>
        <Title>Pandemic Matches</Title>
      </PageContentWrapper>
    </PageContent>
    <PageSide right />
  </Page>
);

export default MatchesPage;
