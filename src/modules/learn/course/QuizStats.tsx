import React from 'react';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Grid, IconButton, Typography } from '@mui/material';

import { CloseIcon } from '~/icons';
import trophy from '~/assets/home/trophy.png';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';

interface IQuizStats {
  onPrev: () => void;
  onClose: () => void;
  correctAnswers: number;
  totalQuestions: number;
  incorrectAnswers: number;
  questionsAnswers: [];
  selectedAnswer: { [key: number]: number };
}

const QuizStats = (props: IQuizStats) => {
  const { onPrev, onClose, correctAnswers, totalQuestions, questionsAnswers, selectedAnswer } = props;

  const theme = useTheme();
  const matchesLG = useMediaQuery('(max-width:1610px)');
  const dynamicStylesForQuizSummary = {
    ...(matchesLG && { height: '216px' }),
  };

  const dynamicStylesForDoneButton = {
    ...(matchesLG && { marginTop: '32px' }),
  };

  return (
    <div>
      <Grid position="relative" sx={{ width: '100%', height: '290px', borderRadius: '12px 12px 0 0' }}>
        <hr style={{ border: '1px solid #0C72E0', position: 'absolute', top: '82px', left: '0', width: '100%' }} />
        <Box
          sx={{
            pt: 3,
            pb: 6,
            pr: 4,
            pl: 4,
          }}
        >
          <Box sx={{ display: 'flex', mb: '57px', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">Quiz Stats</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: '28px 47px 44px 24px',
              borderRadius: '4px',
              backgroundColor: '#147AE9',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '30%',
              }}
            >
              <Image src={trophy} width="96px" height="96px" />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
              <Typography variant="subtitle1" sx={{ color: 'white' }}>
                Congratulations
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'white', mt: '4px', mb: '15px' }}>
                You received a score of {correctAnswers}/{totalQuestions} on the Lesson 1 quiz.
              </Typography>
              <Box
                sx={{
                  background: '#FFFF',
                  height: '12px',
                  borderRadius: '12px',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(to right, #FDB839,#FDB839,#FDB839,#FDE078)',
                    width: `${(correctAnswers / totalQuestions) * 100}%`,
                    height: '12px',
                    borderRadius: '12px',
                  }}
                ></Box>
              </Box>
              <Typography variant="h6" sx={{ color: 'white', mt: '4px' }}>
                Your Score : {(correctAnswers / totalQuestions) * 100}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      <Box
        sx={{
          pt: 3,
          pb: 6,
          pr: 4,
          pl: 4,
          mt: '24px',
        }}
      >
        <Box
          sx={{
            height: '380px',
            overflowY: 'scroll',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            ...dynamicStylesForQuizSummary,
          }}
        >
          <Typography variant="h6" sx={{ mb: '12px', mt: '24px' }}>
            Quiz summary
          </Typography>
          {questionsAnswers?.map((item: any, index: number) => {
            const correctAnswer = item?.options.filter((item: any) => item?.isCorrectAnswer);
            const selectedSingleAnswer = item?.options[selectedAnswer?.[index] - 1];

            return (
              <Box sx={{ borderBottom: '2px solid #B8B8C3', pb: '4px', mb: '24px' }} key={item?.id}>
                <Box
                  sx={{
                    mb: '24px',
                    borderLeft: `${selectedSingleAnswer?.isCorrectAnswer ? 'solid #27AE60 ' : 'solid #DB392C '}`,
                    pl: '8px',
                  }}
                >
                  <Typography sx={{ fontSize: '14px', lineHeight: '21px' }}>{item?.question}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2"> Correct Answer : </Typography>
                    <Typography variant="h6" sx={{ fontSize: '14px', ml: '4px', mr: '10px' }}>
                      {correctAnswer[0]?.answer}
                    </Typography>
                    {!selectedSingleAnswer?.isCorrectAnswer && (
                      <>
                        <Typography variant="body2"> Your Answer : </Typography>
                        <Typography variant="h6" sx={{ fontSize: '14px', ml: '4px' }}>
                          {selectedSingleAnswer?.answer}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        <PrimaryButton
          sx={{
            px: '62px',
            borderRadius: '32px',
            mt: '68px',
            mx: 'auto',
            display: 'flex',
            ...dynamicStylesForDoneButton,
          }}
          onClick={onClose}
        >
          Done
        </PrimaryButton>
      </Box>
    </div>
  );
};

export default QuizStats;
