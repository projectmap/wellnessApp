import { Typography, Paper, Box } from '@mui/material';
import React, { FC } from 'react';

const AboutTab: FC<{ descriptions: string | undefined }> = ({ descriptions }) => {
  return (
    <Box>
      <Typography variant="h6">Course descriptions</Typography>

      {descriptions && (
        <Typography
          dangerouslySetInnerHTML={{
            __html: descriptions,
          }}
          sx={{ mt: '12px' }}
          variant="body1"
        ></Typography>
      )}
    </Box>
  );
};

export default AboutTab;
