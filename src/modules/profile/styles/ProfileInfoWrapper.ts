import styled from 'styled-components';

export const ProfileInfoWrapper = styled.div`
  padding: 24px 34px;
  border-radius: 12px;
  background-color: #fff;
  .profile {
    &__wrapper {
      display: flex;
      align-items: center;
      background-position: right;
      background-repeat: no-repeat;
      justify-content: space-between;
      background-image: url('/assets/images/profile/profile-info-bg.png');
    }
    &__name {
      gap: 33px;
      gap: 15px;
      display: flex;
      align-items: center;
      picture {
        flex-shrink: 0;
      }
      .content {
        h4 {
          font-size: 18px;
          line-height: 29px;
          letter-spacing: 0.0015em;
          color: ${(props) => props.theme.palette.text.primary};
        }
        .btn__wrap {
          margin-top: 6.8px;
        }
        .btn--qr {
          border-radius: 3.89474px;
        }
      }
    }
  }
`;
