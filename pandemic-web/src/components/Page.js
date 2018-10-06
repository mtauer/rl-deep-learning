import styled from 'styled-components';

export const Page = styled.div`
  display: flex;
  min-height: 100vh;
`;
export const PageContent = styled.div`
  background-color: #ffffff;
  flex: 1;
  margin: 0 290px 0 220px;
`;
export const PageContentWrapper = styled.div`
  margin: 0 auto;
  max-width: 800px;
  padding: 32px 24px;
`;
export const PageSide = styled.div`
  background-color: #f7f7f7;
  bottom: 0;
  left: ${({ left }) => (left ? '0' : 'auto')};
  top: 0;
  position: fixed;
  right: ${({ right }) => (right ? '0' : 'auto')};
  width: ${({ left }) => (left ? '220px' : '290px')};

  &:after {
    content: " ";
    display: block;
    height: 1px;
    position: relative;
    width: 320px;
  }
`;

export const Container = styled.div`
  background-color: #ffffff;
  margin: 0 auto;
  max-width: 1024px;
  min-height: 100vh;
  padding: 32px 48px;
`;
export const Section = styled.div`
  padding: 0 0 32px 0;
`;
export const Title = styled.h1`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 27px;
  font-weight: 400;
  margin: 0;
  padding: 0 0 16px 0;
`;
export const Label = styled.label`
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  padding: 0 0 8px 0;
`;
export const Row = styled.div`
  display: flex;
`;
export const Column = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
export const SectionTitle = styled.h2`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 18px;
  margin: 0;
  padding: 0 0 8px 0;
`;
export const Button = styled.button`
  background-color: #e6e6e6;
  border: 0;
  border-radius: 3px;
  font-size: 16px;
  margin: 0;
  outline: 0;
  padding: 7px 16px 9px 16px;

  &:hover:not([disabled]) {
    background-color: #d6d6d6;
    cursor: pointer;
  }

  &:active {
    background-color: #d0d0d0;
  }

  &[disabled] {
    opacity: 0.5;
  }
`;
