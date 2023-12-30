import React from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { DownloadArrowIcon } from '~/icons';
import { IAwsS3Response } from '@newstart-online/sdk';

interface IHandOutResourceTab {
  resources: IAwsS3Response[] | undefined;
}

const HandOutResourceTab = (props: IHandOutResourceTab) => {
  const { resources } = props;

  return (
    <Box>
      {resources?.map((item, index) => {
        return (
          <a href={item.completedUrl} download key={index}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'spance-between',
                cursor: 'pointer',
                color: '#0C72E0',
                mt: '12px',
              }}
            >
              <DownloadArrowIcon />
              <Typography variant="body1" sx={{ ml: '16px' }}>
                {item.filename}
              </Typography>
            </Box>
          </a>
        );
      })}
    </Box>
  );
};

export default HandOutResourceTab;
