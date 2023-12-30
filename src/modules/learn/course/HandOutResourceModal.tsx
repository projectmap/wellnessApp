import React from 'react';

import { DownloadIcon } from '~/icons';
import { IAwsS3Response } from '@newstart-online/sdk';
import { Grid, IconButton, Typography } from '@mui/material';
import { GenericModal } from '~/modules/_core/bits/modals/DragableModal';
import { HandoutResourceModalStyles } from './styles/HandoutResourceModalStyles';

interface IHandOutResourceModal {
  toggleHandOutResourceModal: () => void;
  handOutResourceModal: boolean;
  resources: IAwsS3Response[] | undefined;
}

const HandOutResourceModal = (props: IHandOutResourceModal) => {
  const { toggleHandOutResourceModal, handOutResourceModal, resources } = props;

  return (
    <GenericModal
      onCloseModal={toggleHandOutResourceModal}
      title="Handout Resources"
      isOpen={handOutResourceModal}
      showCloseButton={false}
      sx={HandoutResourceModalStyles.handoutResourceContainer}
    >
      <>
        <Typography sx={HandoutResourceModalStyles.downloadAllButton}>Download All</Typography>
        {resources?.map((item, index) => {
          return (
            <Grid key={index} container display="flex" alignItems="center" justifyContent="space-between">
              <Grid item>{item.filename}</Grid>
              <Grid item>
                <a href={item.completedUrl} download>
                  <IconButton>
                    <DownloadIcon />
                  </IconButton>
                </a>
              </Grid>
            </Grid>
          );
        })}
      </>
    </GenericModal>
  );
};

export default HandOutResourceModal;
