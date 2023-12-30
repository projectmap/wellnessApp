import React from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';

import { SearchIcon } from '~/icons';

interface SearchProps {
  onChange?: (e: React.SyntheticEvent) => void;
  value?: string;
}

const SearchBarWithIcon = ({ onChange, value }: SearchProps) => {
  return (
    <TextField
      variant="filled"
      size="small"
      placeholder="Search"
      type="search"
      onChange={onChange}
      value={value}
      sx={{
        opacity: 0.6,
        '& .MuiFilledInput-root': {
          background: '#F1F1F1',
          border: 'none',
          borderRadius: '4px',
        },
        '& .MuiFilledInput-root:before': {
          borderBottom: 'none',
          content: 'none',
        },
        '& .MuiFilledInput-root:after': {
          borderBottom: 'none',
          content: 'none',
        },
        '& .MuiFilledInput-input': {
          py: 1.1,
        },
        '& .MuiInputAdornment-root': {
          mb: 2,
        },
        width: '100%',
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export { SearchBarWithIcon };
