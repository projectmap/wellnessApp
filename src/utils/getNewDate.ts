import { MEALPLAN_START_DATE_MULTIPLIER } from '~/state/constants';

export const getNewDate = (stardDate: any, idx: number) => {
  return new Date(new Date(stardDate).getTime() + idx * MEALPLAN_START_DATE_MULTIPLIER.MULTIPLIER).toDateString();
};
