export const ModalformData: {
  activeStep: number;
  iconSrc?: string;
  question: string;
}[] = [
  {
    activeStep: 1,
    iconSrc: '/assets/images/Health.svg',
    question: 'How much do you weight now?',
  },
  { activeStep: 2, iconSrc: '/assets/images/Ruler.svg', question: 'Your height?' },
  { activeStep: 3, iconSrc: '/assets/images/AgeIcon.svg', question: 'Your age?' },
  { activeStep: 4, iconSrc: '/assets/images/AgeIcon.svg', question: 'I am' },
  { activeStep: 5, question: 'Lastly, Do you have any Health Conditions?' },
];
