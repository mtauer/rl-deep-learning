import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const MatchTabs = () => (
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
);

export default MatchTabs;
