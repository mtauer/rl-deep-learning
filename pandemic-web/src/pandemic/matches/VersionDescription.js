import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getSelectedVersion } from './redux';
import LabeledValue from '../../components/LabeledValue';
import { PageSideSection, SectionTitle } from '../../components/Page';

const VersionDescription = ({ version }) => {
  if (!version) { return null; }
  return (
    <Fragment>
      <PageSideSection>
        <SectionTitle type="secondary">
          {version.name}
        </SectionTitle>
      </PageSideSection>
      <PageSideSection>
        <LabeledValue
          label="Game rules"
          value={version.gameDescription}
          direction="column"
          type="secondary"
        />
      </PageSideSection>
      <PageSideSection>
        <LabeledValue
          label="Neural network"
          value={version.neuralNetworkDescription}
          direction="column"
          type="secondary"
        />
      </PageSideSection>
    </Fragment>
  );
};
VersionDescription.propTypes = {
  version: PropTypes.shape(),
};
VersionDescription.defaultProps = {
  version: null,
};

const mapStateToProps = (state) => {
  const version = getSelectedVersion(state);
  return {
    version,
  };
};
export default connect(mapStateToProps)(VersionDescription);
