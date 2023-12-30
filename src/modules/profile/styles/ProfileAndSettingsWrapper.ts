import styled from 'styled-components';

export const ProfileAndSettingsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  .link_wrapper_subscription {
    padding: 13px 0px;
    border-bottom: 1px solid ${(props) => props.theme.palette.border.light};
    border-top: 1px solid ${(props) => props.theme.palette.border.light};
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    button {
      color: ${(props) => props.theme.palette.primary.main};
      font-size: 1rem;
      font-weight: 900;
      letter-spacing: 0.002em;
    }
  }
  .link_wrapper_about_the_app {
    padding: 13px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
  }
  .switch-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    margin-top: 15px;
    border-bottom: 1px solid ${(props) => props.theme.palette.border.light};
  }
  .units {
    display: flex;
    margin-bottom: 18px;
    align-items: center;
    .unit_selected {
      color: ${(props) => props.theme.palette.primary.main};
      padding: 5px 30px;
      border: 2px solid ${(props) => props.theme.palette.primary.main};
      border-radius: 30px;
      margin-right: 24px;
      cursor: pointer;
    }
    button {
      cursor: pointer;
    }
  }
  .about_the_app {
    margin-bottom: 12px;
  }
  .delete_link_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      color: ${(props) => props.theme.palette.error.main};
      font-size: 1rem;
      font-weight: 900;
      letter-spacing: 0.002em;
      cursor: pointer;
    }
  }
`;
