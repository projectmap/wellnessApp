import React from 'react';
import Image from 'next/image';
import { IPresentersResponse } from '@newstart-online/sdk';

import { Typography, Stack, Box } from '@mui/material';

interface IInstructorProfile {
  allPresenters: IPresentersResponse[] | [];
}
const InstructorProfile: React.FC<IInstructorProfile> = ({ allPresenters }) => {
  if (allPresenters?.length === 0) {
    return <></>;
  }

  return (
    <Box>
      {allPresenters && (
        <>
          <Typography variant="h6" color="textPrimary" sx={{ mt: '24px', mb: '7px' }}>
            Instructor profile
          </Typography>
          <Box>
            {allPresenters?.map((coursePresenter: any, id: number) => {
              return (
                <Box key={id}>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 3, width: '370px' }}
                  >
                    <Box>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <div className="amplify-image-container">
                          <Image
                            width="73px"
                            height="73px"
                            layout="responsive"
                            src={coursePresenter.portrait.completedUrl}
                          />
                        </div>
                        <Stack>
                          <Typography sx={{ fontWeight: '600', fontSize: '16px' }}>
                            {coursePresenter?.name} {coursePresenter?.lastName}
                          </Typography>
                          <Typography sx={{ fontWeight: '400', fontSize: '14px', opacity: '0.8' }}>
                            {coursePresenter?.designation}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                  <Box sx={{ width: '70%', mb: '24px' }}>
                    <Typography dangerouslySetInnerHTML={{ __html: coursePresenter?.bio }} variant="body2" />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

export default InstructorProfile;
