import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { getMatchesPath, setMatchPathAction, allPaths } from './redux';
import { PageSection } from '../../components/Page';

const MatchTabs = ({ path, onTabClick }) => {
  const value = allPaths.indexOf(path);
  return (
    <PageSection>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={(e, v) => onTabClick(v)}
      >
        <Tab label="Overview" disabled />
        <Tab label="Replay" />
        <Tab label="Policy Improvement" />
      </Tabs>
    </PageSection>
  );
};
MatchTabs.propTypes = {
  path: PropTypes.string.isRequired,
  onTabClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const path = getMatchesPath(state);
  return {
    path,
  };
};
const mapDispatchToProps = dispatch => ({
  onTabClick: (value) => {
    const path = allPaths[value];
    dispatch(setMatchPathAction(path));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(MatchTabs);
