import React from 'react';
import styled from 'styled-components';

const Label = styled.div`
  color: rgba(0, 0, 0, 0.54);
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
  padding: 0 0 4px 0;
`;

const MatchNetworkPOutputs = () => (
  <Label>Predicted action parameter probabilites</Label>
);

export default MatchNetworkPOutputs;
