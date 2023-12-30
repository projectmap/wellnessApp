import styled from 'styled-components';

const StickyDiv = styled.div`
  position: sticky;
  top: 100px;
  @media screen and (max-width: 1430px) {
    position: static;
  }
  @media screen and (max-height: 970px) {
    position: static;
  }
`;

const StickyDivForTbSection = styled.div`
  position: sticky;
  top: 110px;
`;

const StickyDivFriendRequest = styled.div`
  position: sticky;
  top: 370px;
`;
export { StickyDiv, StickyDivFriendRequest, StickyDivForTbSection };
