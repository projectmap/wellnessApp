import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { IOptionsConversions } from '~/modules/record/utils/record-logs-type';

interface IToggleBar {
  options: IOptionsConversions[];
  onClick: (data: IOptionsConversions) => void;
  activeOptions: string;
}
const ToggleBar = (props: IToggleBar) => {
  const { options, onClick, activeOptions } = props;

  const isActive = (selectedValue: string) => activeOptions === selectedValue;

  return (
    <Box display="flex" border="1px solid #B8B8C3" borderRadius="40px">
      {options.map((item, index) => {
        return (
          <Grid
            item
            sx={{
              border: isActive(item.value) ? '1px solid #0C72E0' : '',
              paddingX: '21px',
              paddingY: '3.5px',
              borderRadius: '40px',
              cursor: 'pointer',
              backgroundColor: isActive(item.value) ? '#E8F2FD' : '',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => onClick(item)}
            key={index}
          >
            <Typography
              alignItems="center"
              sx={{ fontSize: '14px' }}
              color={isActive(item.value) ? '#0C72E0' : ''}
              onClick={() => onClick(item)}
            >
              {item.label}
            </Typography>
          </Grid>
        );
      })}
    </Box>
  );
};

export default ToggleBar;
