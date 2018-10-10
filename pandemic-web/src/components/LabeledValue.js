import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  align-items: baseline;
  display: flex;
`;
const Label = styled.p`
  color: rgba(0, 0, 0, 0.54);
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
  padding: 0 8px 0 0;
`;
const Value = styled.p`
  display: block;
  margin: 0;
  font-weight: 700;
`;

const LabeledValue = ({ label, value }) => (
  <Container>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </Container>
);
LabeledValue.propTypes = {
  label: PropTypes.node,
  value: PropTypes.node,
};
LabeledValue.defaultProps = {
  label: null,
  value: null,
};

export default LabeledValue;
