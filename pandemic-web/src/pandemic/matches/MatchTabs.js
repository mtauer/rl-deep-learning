import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { PageSection } from '../../components/Page';

const MatchTabs = () => (
  <PageSection>
    <Tabs
      value={2}
      indicatorColor="primary"
      textColor="primary"
      onChange={() => console.log('Tabs changed')}
    >
      <Tab label="Steps" disabled />
      <Tab label="Replay" disabled />
      <Tab label="Policy Improvement" />
    </Tabs>
  </PageSection>
);

export default MatchTabs;
