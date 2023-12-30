import styled from 'styled-components';
import { device } from '~/styles/device';

export const ModalWrapper = styled.div<any>`
  .modelWrapper {
    position: fixed;
    display: flex;
    width: 100vw;
    top: 0;
    left: 0;
    min-height: 100vh;
    z-index: 13;
    background-color: #000000ad;
  }
  .modal__content {
    margin: auto;
    position: relative;
    width: ${(props) => props.width};
    ${device.max.mobileL} {
      width: 100%;
      padding: 15px;
    }
  }
  .close--btn {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    ${device.max.mobileL} {
      top: 30px;
      right: 30px;
    }

    svg {
      color: #000;
    }
  }
`;
