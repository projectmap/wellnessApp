import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { getNewDate } from '@newstart-online/sdk';
import { TickIconBlue, TickIconDisabled } from '~/icons';
import ChevronDownAccordian from '~/icons/downArrowIcon.svg';
import { RESOURCES_LOADING_THUMBNAIL } from '~/state/constants';
import { UserMealPlanStyles } from '~/modules/_core/styles/UserMealPlanStyles';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Box } from '@mui/material';

interface IMealPlanAccordian {
  mealPlan: any;
  mealCycleStartDate: string;
}

const MealPlanAccordian: React.FC<IMealPlanAccordian> = ({ mealPlan, mealCycleStartDate }) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChangeAccordion = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [selectedMealPlanDayId, setSelectedMealPlanDayId] = React.useState<string>();

  return (
    <Box sx={{ height: '50vh', overflow: 'scroll', mt: '24px' }}>
      {mealPlan &&
        mealPlan?.map((mealItem: any, idx: number) => {
          const breakfasts = mealItem?.breakfasts;
          const lunchs = mealItem?.lunch;
          const { _id } = mealItem;
          const date = getNewDate(mealCycleStartDate, idx);

          return (
            <Accordion
              elevation={0}
              expanded={expanded === `panel${idx + 1}`}
              onChange={handleChangeAccordion(`panel${idx + 1}`)}
              key={idx}
              sx={{
                ...UserMealPlanStyles.accordion,
                border: selectedMealPlanDayId === _id ? '1px solid #8DC4FF' : '1px solid #EFEFEF',
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDownAccordian />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                onClick={() => {
                  setSelectedMealPlanDayId(_id);
                }}
                sx={UserMealPlanStyles.accordionSummary}
              >
                <Box sx={UserMealPlanStyles.accordionSummaryItem}>
                  {selectedMealPlanDayId === _id ? <TickIconBlue /> : <TickIconDisabled />}

                  <Box sx={UserMealPlanStyles.accordionSummaryTitleDate}>
                    <Typography sx={UserMealPlanStyles.accordionSummaryTitle} variant="h6">
                      {mealItem.title}
                    </Typography>
                    <Typography variant="body2">{date}</Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={UserMealPlanStyles.accordionDetailsContainer}>
                  <Box sx={UserMealPlanStyles.accordionDetailsHeader}>
                    <Typography variant="subtitle1" sx={UserMealPlanStyles.accordionDetailsTitle}>
                      Breakfast
                    </Typography>
                  </Box>
                  {breakfasts?.map((item: any) => {
                    const { title, _id } = item;

                    return (
                      <Box key={_id} sx={UserMealPlanStyles.accordionDietItems}>
                        <Box sx={{ position: 'relative', height: '48px', width: '48px' }}>
                          <Image
                            src={
                              item?.vimeoDetails?.thumbNailImage ||
                              item?.featuredImage[0]?.completedUrl ||
                              RESOURCES_LOADING_THUMBNAIL
                            }
                            alt={item?.title}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                            style={{ borderRadius: '50%' }}
                          />
                        </Box>
                        <Link href={`/user/learn/recipe/${_id}/`}>
                          <Typography variant="body1" sx={UserMealPlanStyles.accordionDietItemTitle}>
                            {title}
                          </Typography>
                        </Link>
                      </Box>
                    );
                  })}
                </Box>
                <Box sx={UserMealPlanStyles.accordionDetailsContainer}>
                  <Box sx={UserMealPlanStyles.accordionDetailsHeader}>
                    <Typography variant="subtitle1" sx={UserMealPlanStyles.accordionDetailsTitle}>
                      Lunch
                    </Typography>
                  </Box>

                  {lunchs?.map((item: any) => {
                    const { _id, title } = item;

                    return (
                      <Box key={_id} sx={UserMealPlanStyles.accordionDietItems}>
                        <Box sx={{ position: 'relative', height: '48px', width: '48px' }}>
                          <Image
                            src={
                              item?.vimeoDetails?.thumbNailImage ||
                              item?.featuredImage[0]?.completedUrl ||
                              RESOURCES_LOADING_THUMBNAIL
                            }
                            alt={item?.title}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                            style={{ borderRadius: '50%' }}
                          />
                        </Box>
                        <Link href={`/user/learn/recipe/${_id}/`}>
                          <Typography variant="body1" sx={UserMealPlanStyles.accordionDietItemTitle}>
                            {title}
                          </Typography>
                        </Link>
                      </Box>
                    );
                  })}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </Box>
  );
};

export default MealPlanAccordian;
