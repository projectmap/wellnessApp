import React, { useEffect } from 'react';

import Image from 'next/image';

import { useDropzone } from 'react-dropzone';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';

import { PostImage } from '~/icons';
import { SvgIcons } from '~/icons/svgIcons';
import { SvgIconName } from '~/utils/enums';
import { Image as ImageType } from './Types';
import { FunctionWithParam } from '~/utils/helpers';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { allowedExtensions, getImageExtensionFileOnlyAndCheckIfFileisOtherThanImage } from '~/utils/fileValidator';
import { toast } from 'react-toastify';

type Props =
  | {
      file: File[] | null;
      setFile: any;
    } & (
      | {
          images?: never;
          onClose?: never;
        }
      | {
          images: ImageType[];
          onClose: FunctionWithParam<string>;
        }
    );

export const ImageDropzone = React.forwardRef(({ file, setFile, images, onClose }: Props) => {
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    multiple: true,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
    onDrop: (acceptedFiles) => {
      const { filteredFile, containsInvalidFormatFile } = getImageExtensionFileOnlyAndCheckIfFileisOtherThanImage(
        (acceptedFiles as any) || [],
      );

      if (filteredFile.length > 0) {
        file === null ? setFile(filteredFile) : setFile((prev: File[]) => [...(prev || []), ...(filteredFile || [])]);

        return;
      }

      if (filteredFile.length >= 0) {
        return;
      }

      file === null ? setFile(filteredFile[0]) : setFile((prev: File[]) => [...(prev || []), filteredFile[0]]);
    },
  });

  useEffect(() => {
    if (file && file.length === 0) {
      setFile(null);
    }
  }, [file]);

  useEffect(() => {
    if (fileRejections.length > 0) {
      toast.error('File format other than image was selected and not supported');
    }
  }, [fileRejections]);

  return (
    <>
      {!file && (!images || images.length === 0) ? (
        <section
          className="container"
          style={{
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.5)',
            minHeight: 128,
          }}
        >
          <div {...getRootProps({ className: 'dropzone' })} style={{ padding: 8 }}>
            <input {...getInputProps()} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '280px',
                background: '#F4F5FC',
                borderRadius: '12px',
                flexDirection: 'column',
              }}
            >
              <SvgIcons iconName={SvgIconName.POST_IMAGE} width={35} height={35} fill="#5A5A72" />
              <Typography variant="h2" sx={{ mb: 0, lineHeight: 1.5 }}>
                Add Photos
              </Typography>
              <Typography variant="body2" sx={{ color: '#A1A1AF' }}>
                or drag and drop
              </Typography>
            </Box>
          </div>
        </section>
      ) : (
        <Box>
          <Grid item>
            <Typography variant="h6" sx={{ margin: '8px' }}>
              Your Image:
            </Typography>
          </Grid>

          <Grid item sx={{ overflowY: 'auto', height: 300 }}>
            <>
              {images &&
                images.length !== 0 &&
                images.map((image) => (
                  <Box
                    key={image._id}
                    sx={{ width: 'auto', height: 250, maxWidth: '100%', position: 'relative', margin: '8px 0' }}
                  >
                    <Box
                      sx={{
                        zIndex: 1,
                        position: 'relative',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mr: 2,
                      }}
                    >
                      <IconButton>
                        <CloseIcon onClick={() => onClose && onClose(image._id)} />
                      </IconButton>
                    </Box>

                    <Image
                      src={image.completedUrl}
                      layout="fill"
                      width={'100%'}
                      height={'100%'}
                      objectFit="contain"
                      alt="user-images"
                    />
                  </Box>
                ))}
              {file &&
                file.map((f, i) => (
                  <>
                    <Box
                      sx={{ width: 'auto', height: 250, maxWidth: '100%', position: 'relative', margin: '8px 0' }}
                      key={i}
                    >
                      <Box
                        sx={{
                          zIndex: 1,
                          position: 'relative',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mr: 2,
                        }}
                      >
                        <IconButton>
                          <CloseIcon
                            onClick={() =>
                              setFile((prevFile: File[]) => {
                                const updatedFiles = prevFile.filter((sFile) => sFile !== f);

                                return updatedFiles;
                              })
                            }
                          />
                        </IconButton>
                      </Box>
                      <Image
                        src={f ? URL.createObjectURL(f) : ''}
                        layout="fill"
                        width={'100%'}
                        height={'100%'}
                        objectFit="contain"
                        alt={f?.name}
                      />
                    </Box>
                  </>
                ))}
              {/* UPLOAD IMAGE BUTTON */}

              <div {...getRootProps({ className: 'dropzone' })} style={{ padding: 8 }}>
                <input {...getInputProps()} />
                <Stack
                  sx={{
                    mt: 1,
                    ml: 1,
                  }}
                  spacing={2}
                  direction="row"
                  justifyContent="left"
                >
                  <ButtonWithIcon icon={<PostImage />}>Image</ButtonWithIcon>
                  {/* TODO: Video Upload Implementation */}
                  {/* <ButtonWithIcon icon={<PostVideo />}>Video</ButtonWithIcon> */}
                </Stack>
              </div>
            </>
          </Grid>
        </Box>
      )}
    </>
  );
});
