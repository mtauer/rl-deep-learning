import React, { Fragment } from 'react';

import LabeledValue from '../../components/LabeledValue';
import { PageSideSection, SectionTitle } from '../../components/Page';

const VersionDescription = () => (
  <Fragment>
    <PageSideSection>
      <SectionTitle type="secondary">
        Version 0.3.2
      </SectionTitle>
    </PageSideSection>
    <PageSideSection>
      <LabeledValue
        label="Game rules"
        value="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
        direction="column"
        type="secondary"
      />
    </PageSideSection>
    <PageSideSection>
      <LabeledValue
        label="Neural network"
        value="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
        direction="column"
        type="secondary"
      />
    </PageSideSection>
  </Fragment>
);

export default VersionDescription;
