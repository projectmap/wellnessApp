import styled from 'styled-components';

export const CardWrapper = styled.div`
  .card-number {
    border: 1px solid #a1a1af;
    border-radius: 4px;
    padding: 12px;
  }
  .invalid {
    border: 1px solid #ed2f00;
    margin-bottom: 3px;
  }
  span {
    color: #ed2f00;
  }
`;

export const CardWrapperForGiftCard = styled.div`
  .card-number {
    border: 1px solid #a1a1af;
    border-radius: 4px;
    padding: 12px;
  }
  .invalid {
    border: 1px solid #ed2f00;
    margin-bottom: 3px;
  }
  span {
    color: #ed2f00;
  }
`;

//style for stripe cardElement iframe
export const inputStyle = {
  color: '#131336',
  fontWeight: '400',
  fontFamily: 'Inter, Open Sans, Segoe UI, sans-serif',
  fontSize: '16px',
  fontSmoothing: 'antialiased',
  width: '100%',
  height: '100%',
  border: '1px solid #13133666',
  ':-webkit-autofill': {
    color: '#131336',
  },
  '::placeholder': {
    color: '#13133666',
  },
};
