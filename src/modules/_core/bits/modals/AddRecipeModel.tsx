import React, { FC, MouseEventHandler } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';

import { CloseBtnModel } from '~/icons';
import { SearchBarWithIcon } from '../textfields/SearchBarWithIcon';
import { DefaultLink } from '~/modules/_core/components/links/DefaultLink';
interface Model {
  onClick?: MouseEventHandler;
}
const AddRecipeModal: FC<Model> = ({ onClick }) => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const handleSearch = (e: React.SyntheticEvent) => {
    setSearchValue((e.target as HTMLInputElement).value);
  };

  return (
    <Paper
      sx={{
        pt: 3,
        pb: 6,
        pr: 4,
        pl: 4,
        borderRadius: '12px',
        width: '455px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      elevation={0}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '24px' }}>
        <Typography variant="h6">Add items in your breakfast</Typography>
        <IconButton onClick={onClick}>
          <CloseBtnModel />
        </IconButton>
      </Box>
      <SearchBarWithIcon value={searchValue} onChange={handleSearch} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '24px' }}>
        <Typography variant="subtitle1">Recently searched</Typography>
        <DefaultLink to="/">Close</DefaultLink>
      </Box>
    </Paper>
  );
};
export { AddRecipeModal };
