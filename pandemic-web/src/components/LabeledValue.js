import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  align-items: baseline;
  display: flex;
  flex-direction: ${({ direction }) => direction};
`;
const Label = styled.p`
  color: ${({ type }) => (type === 'secondary' ? 'rgba(0, 0, 0, 0.40)' : 'rgba(0, 0, 0, 0.54)')};
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  padding: 0 8px 4px 0;
`;

const Value = styled.p`
  color: ${({ type }) => (type === 'secondary' ? 'rgba(0, 0, 0, 0.54)' : '#333333')};
  display: block;
  margin: 0;
  font-size: ${({ type }) => (type === 'secondary' ? '14px' : '16px')};
  font-weight: ${({ type }) => (type === 'secondary' ? '500' : '700')};
  padding: 0 0 4px 0;
`;

const LabeledValue = ({ label, value, direction, type }) => (
  <Container direction={direction}>
    <Label type={type}>{label}</Label>
    <Value type={type}>{value}</Value>
  </Container>
);
LabeledValue.propTypes = {
  label: PropTypes.node,
  value: PropTypes.node,
  direction: PropTypes.string,
  type: PropTypes.string,
};
LabeledValue.defaultProps = {
  label: null,
  value: null,
  direction: 'row',
  type: 'primary',
};

export default LabeledValue;
