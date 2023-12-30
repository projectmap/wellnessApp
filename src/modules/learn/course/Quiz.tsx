import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { Typography, Box, IconButton, Grid } from '@mui/material';

import Image from 'next/image';
import QuizStats from './QuizStats';
import { useSubmitQuizStatsMutation } from '@newstart-online/sdk';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { ClockIcon, CloseIcon, RadioSubscriptionChecked, RadioSubscriptionUnChecked } from '~/icons';

interface IQuiz {
  currentLecture: any | undefined;
  onSkipQuiz: () => void;
}
const Quiz: FC<IQuiz> = ({ currentLecture, onSkipQuiz }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<any>({});
  const [submitQuizStats] = useSubmitQuizStatsMutation();
  const [quizCompletedToLast, setQuizCompletedToLast] = React.useState(false);
  const router = useRouter();

  const [correctCount, setCorrectCount] = React.useState<number>(0);
  const [incorrectCount, setIncorrectCount] = React.useState<number>(0);

  const nextPrevIndex = (index: number) => {
    if (index === -1) {
      activeIndex !== 0 && setActiveIndex(activeIndex + index);
    } else {
      activeIndex < currentLecture?.quiz?.questionWithAnswers?.length && setActiveIndex(activeIndex + index);
    }
  };

  const onQuizSubmit = () => {
    submitQuizStats({ lectureId: router.query.lecture as string, correctCount: correctCount.toString() });
    onSkipQuiz();
  };

  if (activeIndex === currentLecture?.quiz?.questionWithAnswers?.length) {
    return (
      <QuizStats
        incorrectAnswers={incorrectCount}
        onPrev={() => nextPrevIndex(-1)}
        onClose={onQuizSubmit}
        selectedAnswer={selectedAnswer}
        correctAnswers={correctCount}
        questionsAnswers={currentLecture?.quiz?.questionWithAnswers}
        totalQuestions={currentLecture?.quiz?.questionWithAnswers?.length || 0}
      />
    );
  }

  return (
    <div>
      {currentLecture?.quiz?.questionWithAnswers?.map((item: any, index: number) => {
        if (index === activeIndex) {
          return (
            <>
              <Grid
                position="relative"
                sx={{
                  display: 'flex',
                  width: '100%',
                  borderRadius: '12px 12px 0 0',
                }}
              >
                <Box
                  sx={{
                    pt: 3,
                    pr: 4,
                    pl: 4,
                    width: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>{`${index + 1} of ${
                      currentLecture?.quiz?.questionWithAnswers.length
                    }`}</Typography>
                    <IconButton onClick={onSkipQuiz}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      background: ' #B8B8C3',
                      mt: '4px',
                      width: '100%',
                      position: 'absolute',
                      top: '64px',
                      left: '0',
                      height: '3px',
                    }}
                  >
                    <Box
                      sx={{
                        background: ' #147AE9',
                        width: `${((index + 1) / currentLecture?.quiz?.questionWithAnswers.length) * 100}%`,
                        height: '3px',
                        transition: 'all 0.7s ease-in-out',
                      }}
                    />
                  </Box>

                  <Grid xs={3} sx={{ mt: '32px' }}>
                    <Typography sx={{ textAlign: 'left' }} variant="h6">
                      {item.question}
                    </Typography>
                  </Grid>
                </Box>
              </Grid>

              <Grid
                sx={{
                  mb: '24px',
                  pt: 3,
                  pb: 6,
                  pr: 4,
                  pl: 4,
                }}
              >
                {item.options.map((choice: any, choiceIndex: number) => {
                  return (
                    <Box
                      sx={{
                        display: 'flex',
                        py: '22px',
                        pl: '16px',
                        marginTop: '24px',
                        backgroundColor: selectedAnswer[index] === choiceIndex + 1 ? 'rgba(20, 122, 233, 0.1)' : '',
                        border: selectedAnswer[index] === choiceIndex + 1 ? '2px solid #147AE9' : '1px solid #E7E7EB',
                        borderRadius: '4px',
                      }}
                      onClick={() => {
                        if (!quizCompletedToLast) {
                          if (choice.isCorrectAnswer) {
                            if (!(correctCount === index + 1)) {
                              setCorrectCount((correctCount) => correctCount + 1);
                            }
                          }
                          setSelectedAnswer({ ...selectedAnswer, [index]: choiceIndex + 1 });
                        }
                      }}
                      key={choiceIndex}
                    >
                      {selectedAnswer[index] === choiceIndex + 1 ? (
                        <RadioSubscriptionChecked />
                      ) : (
                        <RadioSubscriptionUnChecked />
                      )}

                      <Typography
                        sx={{
                          marginLeft: '10px',
                          color: selectedAnswer[index] === choiceIndex + 1 ? '#147AE9' : '#5A5A72;',
                        }}
                      >
                        {choice.answer}
                      </Typography>
                    </Box>
                  );
                })}

                <>
                  <PrimaryButton
                    sx={{ px: '62px', borderRadius: '32px', mt: '68px', mx: 'auto', display: 'flex' }}
                    disabled={!selectedAnswer[index]}
                    onClick={() => {
                      if (selectedAnswer[index]) {
                        setQuizCompletedToLast(activeIndex === currentLecture?.quiz?.questionWithAnswers?.length - 1);
                        nextPrevIndex(1);
                      }
                    }}
                  >
                    Next
                  </PrimaryButton>
                </>
              </Grid>
            </>
          );
        }
      })}
    </div>
  );
};

export default Quiz;
