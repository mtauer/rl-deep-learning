import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getSelectedMatch } from './redux';
import LabeledValue from '../../components/LabeledValue';
import { PageSideSection, SectionTitle } from '../../components/Page';

const MatchInfo = ({ match }) => {
  if (!match) { return null; }
  return (
    <Fragment>
      <SectionTitle type="secondary">
        Match {match.matchId.split('-')[0]}
      </SectionTitle>
      <PageSideSection>
        <LabeledValue
          label="Created"
          value={new Date(match.createdAt).toLocaleString()}
          direction="column"
          type="secondary"
        />
      </PageSideSection>
    </Fragment>
  );
};
MatchInfo.propTypes = {
  match: PropTypes.shape(),
};
MatchInfo.defaultProps = {
  match: null,
};

const mapStateToProps = (state) => {
  const match = getSelectedMatch(state);
  return {
    match,
  };
};
export default connect(mapStateToProps)(MatchInfo);
