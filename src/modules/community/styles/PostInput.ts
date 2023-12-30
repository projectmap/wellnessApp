import styled from 'styled-components';
import InputBase from '@mui/material/InputBase';
import { alpha } from '@mui/material';

const StyledPost = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '1rem',
  padding: '1rem',
  border: '1px solid transparent',
  backgroundColor: '#ffffff',
  '&:hover': {
    backgroundColor: alpha('#F0F0F0', 0.9),
  },

  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
  cursor: 'pointer',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: '300px',
  color: alpha(theme.palette.common.black, 1),
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    height: '2.4em',
    paddingLeft: '16px',
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
    fontSize: '16px',
  },
}));

export { StyledPost, StyledInputBase };
