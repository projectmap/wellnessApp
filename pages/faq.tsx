import Link from 'next/link';
import { Box } from '@mui/system';
import type { NextPage } from 'next';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

import { ArrowDown, Logo } from '~/icons';
import ChevronDownAccordian from '~/icons/downArrowIcon.svg';

const FAQData = [
  {
    id: 1,
    question: 'If I finish this program, can I get a discount on coming to your residential 18 day program?',
    answer:
      'We have a surprise for you after watching the 8th session. We will be provided a discount offer at that time.',
  },
  {
    id: 2,
    question: 'Can I shared the pdf materials and reprint them?',
    answer:
      'We have a surprise for you after watching the 8th session. We will be provided a discount offer at that time.',
  },
  {
    id: 3,
    question: 'How long can I watch each session before I am locked out?',
    answer:
      'We have a surprise for you after watching the 8th session. We will be provided a discount offer at that time.',
  },
  {
    id: 4,
    question: 'How will this compare to your residential 18 day program?',
    answer:
      'We have a surprise for you after watching the 8th session. We will be provided a discount offer at that time.',
  },
  {
    id: 5,
    question: 'Can I get a group Discount?',
    answer:
      'We have a surprise for you after watching the 8th session. We will be provided a discount offer at that time.',
  },
  {
    id: 6,
    question: 'Can I have other participants join me in watching the program?',
    answer:
      'We have a surprise for you after watching the 8th session. We will be provided a discount offer at that time.',
  },
  {
    id: 7,
    question: 'Can I just skip around and pick the topics that most interest me?',
    answer:
      'We have a surprise for you after watching the 8th session. We will be provided a discount offer at that time.',
  },
  {
    id: 8,
    question: 'How many days should I take to get through the program?',
    answer:
      'We have a surprise for you after watching the 8th session. We will be provided a discount offer at that time.',
  },
];

const FAQ: NextPage = () => {
  return (
    <Box sx={{ background: '#FFF', height: '100%' }}>
      <Container maxWidth="xl" sx={{ paddingY: 3 }}>
        <Link href="/user/signin">
          <a>
            <Logo />
          </a>
        </Link>
      </Container>
      <Container maxWidth="xl" sx={{ pt: 1 }}>
        <Typography variant="h3" sx={{ mb: 4 }}>
          FAQ
        </Typography>
        {FAQData?.map((item, id) => {
          return (
            <Accordion
              key={id}
              sx={{
                borderRadius: '8px',
                mb: 2,
                background: '#F4F5FC',
                boxShadow: 'none',
                border: '1px solid #E7E7EB',
                '&::before': { display: 'none' },
              }}
              elevation={0}
            >
              <AccordionSummary
                expandIcon={<ArrowDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ paddingX: 3.4, paddingY: 2 }}
              >
                <Typography variant="subtitle1">{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ paddingY: 3, background: '#FFF' }}>
                <Typography variant="body1">{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Container>
    </Box>
  );
};

export default FAQ;
