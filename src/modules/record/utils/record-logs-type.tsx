// import { } from "@newstart-online/sdk"

import React from 'react';

import {
  AirIcon,
  BodyMeasureIcon,
  ExerciseIcon,
  HeartIcon,
  NutritionIcon,
  SunlightIcon,
  TemperanceIcon,
  WaterIntakeIcon,
} from '~/icons';
import { getNewDate } from '~/utils/getNewDate';
import { FieldValues, RegisterOptions } from 'react-hook-form';
import { GET_RECORD_DATA_BY, IRecordLogsAverageData, RECORD_TYPE } from '@newstart-online/sdk';

export enum FIELD_TYPES_ENUM {
  TEXT = 'text',
  NUMBER = 'number',
  DROPDOWN = 'dropdown',
  EMAIL = 'email',
  PASSWORD = 'password',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
}

export interface IOptions {
  label: string;
}

export interface IValidations {
  isRequired: boolean;
  regex: string;
}

export interface IQuestion extends React.HTMLProps<HTMLInputElement> {
  options?: IOptions[];
  validations?: IValidations;
  register?: FieldValues;
  name: string;
  registerOptions?: RegisterOptions<FieldValues, string> | undefined;
  conversionsOptions?: IOptionsConversions[];
  maxValue?: number;
}

interface IRecordTypeWithQuestions {
  title: string;
  icon: any;
  recordType: RECORD_TYPE;

  questionLabel: string;
  questions: IQuestion[];
  initialValue: {
    [key: string]: any;
  };
}

export interface IOptionsConversions {
  value: string;
  label: string;
  conversion?: number;
  defaultUnit?: boolean;
  maxValue?: number;
}

export const optionsForTime: IOptionsConversions[] = [
  { value: 'hr', label: 'hrs', conversion: 60, maxValue: 24 },
  { value: 'mins', label: 'mins', conversion: 1 / 60, defaultUnit: true, maxValue: 1440 },
];
export const optionsForWeight: IOptionsConversions[] = [
  { value: 'lb', label: 'pound', conversion: 1 / 2.20462, defaultUnit: true, maxValue: 881.849 },
  { value: 'kg', label: 'kg', conversion: 2.20462, maxValue: 400 },
];
export const optionsForWaterBalance: IOptionsConversions[] = [
  { value: 'ltr', label: 'ltr', conversion: 1000, maxValue: 50 },
  { value: 'ml', label: 'ml', conversion: 1 / 1000, defaultUnit: true, maxValue: 50000 },
];
export const optionsForDistance: IOptionsConversions[] = [
  { value: 'miles', label: 'miles', conversion: 1.60934, maxValue: 62.13 },
  { value: 'km', label: 'km', defaultUnit: true, conversion: 1 / 1.60934, maxValue: 100 },
];

export const getOptionsForRecordLogs = (recordType: RECORD_TYPE | null) => {
  switch (recordType) {
    case RECORD_TYPE.DEVOTIONAL_TIME:
    case RECORD_TYPE.PRAYER_TIME:
    case RECORD_TYPE.SCREEN_TIME:
    case RECORD_TYPE.TIME_OUTSIDE:
    case RECORD_TYPE.SLEEP:
    case RECORD_TYPE.FLIGHTS_CLIMBED:
    case RECORD_TYPE.VITAMIN_D:
      return optionsForTime;
    case RECORD_TYPE.EXERCISE_MINUTES:
      return optionsForDistance;
    case RECORD_TYPE.WATER_INTAKE:
      return optionsForWaterBalance;
    case RECORD_TYPE.WEIGHT:
      return optionsForWeight;
    default:
      return null;
  }
};

const nutritionQuestions: IQuestion[] = [
  {
    name: 'ateNutritionFood',
    label: 'Ate balanced, plant based diet',
    type: FIELD_TYPES_ENUM.CHECKBOX,
  },
];

const activeEnergyQuestions: IQuestion[] = [
  {
    label: 'Exercise type in kcal',
    name: 'value',
    type: FIELD_TYPES_ENUM.NUMBER,
    maxValue: 4000,
  },
];

const waterIntakeQuestions: IQuestion[] = [
  {
    label: 'Water',
    name: 'value',
    type: FIELD_TYPES_ENUM.NUMBER,
    conversionsOptions: optionsForWaterBalance,
  },
];

const temperanceQuestions: IQuestion[] = [
  {
    label: 'Avoided alcohol? ',
    name: 'avoidedAlcohol',
    type: FIELD_TYPES_ENUM.CHECKBOX,
  },
  {
    label: 'Avoided drugs? ',
    name: 'avoidedDrugs',
    type: FIELD_TYPES_ENUM.CHECKBOX,
  },
  {
    label: 'Avoided smoking? ',
    name: 'avoidedSmoking',
    type: FIELD_TYPES_ENUM.CHECKBOX,
  },
];

const stepsQuestions: IQuestion[] = [
  {
    label: 'Steps',
    name: 'value',
    type: FIELD_TYPES_ENUM.NUMBER,
    maxValue: 100000,
  },
];

const exerciseQuestions: IQuestion[] = [
  {
    label: 'Exercise type',
    name: 'exerciseType',
    type: FIELD_TYPES_ENUM.TEXT,
    disabled: true,
  },
  {
    label: 'Exercise time',
    name: 'exerciseTime',
    type: FIELD_TYPES_ENUM.NUMBER,
    conversionsOptions: optionsForTime,
  },
  {
    label: 'Distance travel',
    name: 'distanceTravel',
    type: FIELD_TYPES_ENUM.NUMBER,
    conversionsOptions: optionsForDistance,
  },
];

const hearRateQuestions: IQuestion[] = [
  {
    label: 'Heart Rate in BPM',
    name: 'heartRate',
    type: FIELD_TYPES_ENUM.NUMBER,
    maxValue: 240,
  },
  {
    label: 'Resting Heart Rate in BPM',
    name: 'restingHeartRate',
    type: FIELD_TYPES_ENUM.NUMBER,
    maxValue: 216,
  },
];

const vitaminDQuestions: IQuestion[] = [
  {
    label: 'Sunlight',
    name: 'timeInDirectSunlight',
    type: FIELD_TYPES_ENUM.NUMBER,
    conversionsOptions: optionsForTime,
  },
  {
    label: 'Did you take vitamin D supplement?',
    name: 'haveTakenVitaminDSupplement',
    type: FIELD_TYPES_ENUM.CHECKBOX,
  },
];

const sleepQuestions: IQuestion[] = [
  {
    label: 'Sleep',
    type: FIELD_TYPES_ENUM.NUMBER,
    name: 'value',
    conversionsOptions: optionsForTime,
  },
];

const flightsClimbedQuestions: IQuestion[] = [
  {
    label: 'Flight Climbed',
    name: 'value',
    type: FIELD_TYPES_ENUM.NUMBER,
    conversionsOptions: optionsForTime,
  },
];

const weightQuestions: IQuestion[] = [
  {
    label: 'Weight',
    name: 'value',
    type: FIELD_TYPES_ENUM.NUMBER,
    conversionsOptions: optionsForWeight,
  },
];

const bloodPressureQuestions: IQuestion[] = [
  {
    label: 'Systolic(mmHG)',
    name: 'high',
    type: FIELD_TYPES_ENUM.NUMBER,
    maxValue: 999,
  },
  {
    label: 'Diastolic(mmHG)',
    name: 'low',
    type: FIELD_TYPES_ENUM.NUMBER,
    maxValue: 999,
  },
];

const bloodSugarQuestions: IQuestion[] = [
  {
    label: 'Fasting blood sugar (mg/dL)',
    name: 'fastingBloodSugar',
    type: FIELD_TYPES_ENUM.NUMBER,
    maxValue: 999,
  },
  {
    label: 'Random blood sugar (mg/dL)',
    name: 'randomBloodSugar',
    type: FIELD_TYPES_ENUM.NUMBER,
    maxValue: 999,
  },
];

const screenTimeQuestions: IQuestion[] = [
  {
    label: 'Screen time',
    name: 'value',
    type: FIELD_TYPES_ENUM.NUMBER,
    conversionsOptions: optionsForTime,
  },
];

const devotionalTimeQuestions: IQuestion[] = [
  {
    label: 'Devotional time',
    name: 'value',
    type: FIELD_TYPES_ENUM.NUMBER,
    conversionsOptions: optionsForTime,
  },
];

const prayerTimeQuestion: IQuestion[] = [
  {
    label: 'Prayer time',
    name: 'value',
    type: FIELD_TYPES_ENUM.NUMBER,
    conversionsOptions: optionsForTime,
  },
];

const timeOutsideQuestions: IQuestion[] = [
  {
    label: 'Time outside',
    name: 'value',
    type: FIELD_TYPES_ENUM.NUMBER,
    conversionsOptions: optionsForTime,
  },
];

export const recordTypeWithQuestions: IRecordTypeWithQuestions[] = [
  {
    title: 'Active Energy',
    recordType: RECORD_TYPE.ACTIVE_ENERGY,
    questionLabel: 'What is your active energy today?',
    questions: activeEnergyQuestions,
    icon: <NutritionIcon />,
    initialValue: {
      value: 0,
    },
  },
  {
    title: 'Blood Pressure',
    recordType: RECORD_TYPE.BLOOD_PRESSURE,
    questionLabel: 'What is your Blood Pressure today?',
    questions: bloodPressureQuestions,
    icon: <AirIcon />,
    initialValue: {
      high: 0,
      low: 0,
    },
  },
  {
    title: 'Blood Sugars',
    recordType: RECORD_TYPE.BLOOD_SUGARS,
    questionLabel: 'What is your Blood Sugar today?',
    questions: bloodSugarQuestions,
    icon: <SunlightIcon />,
    initialValue: {
      fastingBloodSugar: 0,
      randomBloodSugar: 0,
    },
  },
  {
    title: 'Devotional Time',
    recordType: RECORD_TYPE.DEVOTIONAL_TIME,
    questionLabel: 'How long did you get to spend in devotion today?',
    questions: devotionalTimeQuestions,
    icon: <SunlightIcon />,
    initialValue: {
      value: 0,
    },
  },
  {
    title: 'Exercise Minutes',
    recordType: RECORD_TYPE.EXERCISE_MINUTES,
    questionLabel: 'How much did you exercise today?',
    questions: exerciseQuestions,
    icon: <ExerciseIcon />,
    initialValue: {
      exerciseType: 'Running and Walking',
      exerciseTime: 0,
      distanceTravel: 0,
    },
  },
  {
    title: 'Flights Climbed',
    recordType: RECORD_TYPE.FLIGHTS_CLIMBED,
    questionLabel: 'How many flights of stairs did you climb today?',
    questions: flightsClimbedQuestions,
    icon: <BodyMeasureIcon />,
    initialValue: {
      value: 0,
    },
  },

  {
    title: 'Heart Rate',
    recordType: RECORD_TYPE.HEART_RATE,
    questionLabel: 'What is your heart rate today?',
    questions: hearRateQuestions,
    icon: <HeartIcon />,
    initialValue: {
      heartRate: 0,
      restingHeartRate: 0,
    },
  },
  {
    title: 'Nutrition',
    icon: <NutritionIcon />,
    recordType: RECORD_TYPE.NUTRITION,
    questionLabel: 'Did you eat a plant-based diet today? ',
    questions: nutritionQuestions,
    initialValue: {
      ateNutritionFood: false,
    },
  },

  {
    title: 'Prayer Time',
    recordType: RECORD_TYPE.PRAYER_TIME,
    questionLabel: 'How much time did you spend in prayer today?',
    questions: prayerTimeQuestion,
    icon: <BodyMeasureIcon />,
    initialValue: {
      value: 0,
    },
  },
  {
    title: 'Screen Time',
    recordType: RECORD_TYPE.SCREEN_TIME,
    questionLabel: 'What is your Screen Time today?',
    questions: screenTimeQuestions,
    icon: <BodyMeasureIcon />,
    initialValue: {
      value: 0,
    },
  },
  {
    title: 'Sleep',
    recordType: RECORD_TYPE.SLEEP,
    questionLabel: 'How much sleep did you get last night?',
    questions: sleepQuestions,
    icon: <SunlightIcon />,
    initialValue: {
      value: 0,
    },
  },
  {
    title: 'Steps',
    recordType: RECORD_TYPE.STEPS,
    questionLabel: 'How many steps did you take today?',
    questions: stepsQuestions,
    icon: <TemperanceIcon />,
    initialValue: {
      value: 0,
    },
  },
  {
    title: 'Vitamin D',
    recordType: RECORD_TYPE.VITAMIN_D,
    questionLabel: 'Have you been out in sunlight today?',
    questions: vitaminDQuestions,
    icon: <SunlightIcon />,
    initialValue: {
      timeInDirectSunlight: 0,
      haveTakenVitaminDSupplement: 0,
    },
  },
  {
    title: 'Temperance',
    recordType: RECORD_TYPE.TEMPERANCE,
    questionLabel: 'How is your temperance?',
    questions: temperanceQuestions,
    icon: <TemperanceIcon />,
    initialValue: {
      avoidedAlcohol: false,
      avoidedDrugs: false,
      avoidedSmoking: false,
    },
  },
  {
    title: 'Time Outside',
    recordType: RECORD_TYPE.TIME_OUTSIDE,
    questionLabel: 'How much time did you spend outside today?',
    questions: timeOutsideQuestions,
    icon: <SunlightIcon />,
    initialValue: {
      value: 0,
    },
  },
  {
    title: 'Water Intake',
    recordType: RECORD_TYPE.WATER_INTAKE,
    questionLabel: 'How much water did you drink today?',
    questions: waterIntakeQuestions,
    icon: <WaterIntakeIcon />,
    initialValue: {
      value: 0,
    },
  },
  {
    title: 'Weight',
    recordType: RECORD_TYPE.WEIGHT,
    questionLabel: 'How much do you weigh today?',
    questions: weightQuestions,
    icon: <BodyMeasureIcon />,
    initialValue: {
      value: 0,
    },
  },
];

interface IRecordTypeColor {
  [RECORD_TYPE: string]: {
    start: string;
    end: string;
  };
}

export const recordTypeWidthAndHeight = {
  [RECORD_TYPE.EXERCISE_MINUTES]: {
    width: '42px',
    height: '29px',
  },
  [RECORD_TYPE.SCREEN_TIME]: {
    width: '34px',
    height: '42px',
  },
  [RECORD_TYPE.WATER_INTAKE]: {
    width: '30px',
    height: '42px',
  },

  [RECORD_TYPE.WEIGHT]: {
    width: '42px',
    height: '42px',
  },

  [RECORD_TYPE.NUTRITION]: {
    width: '54px',
    height: '54px',
  },
  [RECORD_TYPE.HEART_RATE]: {
    width: '42px',
    height: '42px',
  },

  [RECORD_TYPE.BLOOD_SUGARS]: {
    width: '41px',
    height: '43px',
  },
  [RECORD_TYPE.BLOOD_PRESSURE]: {
    width: '43px',
    height: '43px',
  },

  [RECORD_TYPE.TEMPERANCE]: {
    width: '19px',
    height: '43px',
  },

  [RECORD_TYPE.STEPS]: {
    width: '42px',
    height: '42px',
  },
  [RECORD_TYPE.ACTIVE_ENERGY]: {
    width: '42px',
    height: '42px',
  },
  [RECORD_TYPE.FLIGHTS_CLIMBED]: {
    width: '35px',
    height: '42px',
  },
  [RECORD_TYPE.DEVOTIONAL_TIME]: {
    width: '42px',
    height: '41px',
  },
  [RECORD_TYPE.PRAYER_TIME]: {
    width: '43px',
    height: '43px',
  },
  [RECORD_TYPE.VITAMIN_D]: {
    width: '43px',
    height: '43px',
  },
  [RECORD_TYPE.TIME_OUTSIDE]: {
    width: '43px',
    height: '43px',
  },
  [RECORD_TYPE.SLEEP]: {
    width: '43px',
    height: '43px',
  },
};

export const recordTypeColor: IRecordTypeColor = {
  [RECORD_TYPE.EXERCISE_MINUTES]: {
    start: '#FDE078',
    end: '#FDB839',
  },
  [RECORD_TYPE.SCREEN_TIME]: {
    start: '#519BD2',
    end: '#1A65B0',
  },
  [RECORD_TYPE.WATER_INTAKE]: {
    start: '#1C89FF',
    end: '#1C89E3',
  },

  [RECORD_TYPE.WEIGHT]: {
    start: '#1C89FF',
    end: '#1C89FF',
  },

  [RECORD_TYPE.TEMPERANCE]: {
    start: '#1C89FF',
    end: '#4CEEBE',
  },

  [RECORD_TYPE.STEPS]: {
    start: '#FDE078',
    end: '#FDB839',
  },
  [RECORD_TYPE.ACTIVE_ENERGY]: {
    start: '#FAB05C',
    end: '#F57E2A',
  },
  [RECORD_TYPE.FLIGHTS_CLIMBED]: {
    start: '#27AE60',
    end: '#9EB643',
  },
  [RECORD_TYPE.DEVOTIONAL_TIME]: {
    start: '#E279B2',
    end: '#D1499B',
  },
  [RECORD_TYPE.PRAYER_TIME]: {
    start: '#27AE60',
    end: '#9EB643',
  },
  [RECORD_TYPE.VITAMIN_D]: {
    start: '#FDE078',
    end: '#FDB839',
  },
  [RECORD_TYPE.TIME_OUTSIDE]: {
    start: '#FDE078',
    end: '#FDB839',
  },
  [RECORD_TYPE.SLEEP]: {
    start: '#E279B2',
    end: '#D1499B',
  },
};

export const defaultColor = '#1C89FF';

const labelsOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
const labelsOfMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export const getDataWithLabelsForRecordLogs = (
  data: IRecordLogsAverageData[] | undefined,
  recordType: RECORD_TYPE,
  startDate: string,
  endDate: string,
  dataBy = GET_RECORD_DATA_BY.DAY,
  conversionRate = 1,
) => {
  const labels: string[] = [];
  const dataAverage: any[] = [];
  const drugsAverage: any[] = [];
  const smokingAverage: any[] = [];

  const dataAverageExerciseMinutes: any[] = [];
  const dataAverageExerciseDistance: any[] = [];
  const dataAverageHeartRate: any[] = [];
  const dataAverageRestingHeartRate: any[] = [];
  const dataFastingBloodSugar: any[] = [];
  const dataRestingBloodSugar: any[] = [];

  const dataSystolicBloodPressure: any[] = [];
  const dataDaistolicBloodPressure: any[] = [];

  const nutritionsData: any[] = [];

  const getDifferences = Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000);
  let _startDate = new Date(startDate).getDay();

  if (dataBy === GET_RECORD_DATA_BY.DAY) {
    for (let day = 1; day <= getDifferences; day++) {
      const newDay = _startDate + day;

      const labelsToBePushed = newDay % 7;
      labels.push(labelsOfDays[labelsToBePushed]);

      const newDate = getNewDate(startDate, Math.abs(day));

      const dataToBePushed = data?.find((item) => {
        return new Date(item._id.day).toDateString() === new Date(newDate).toDateString();
      });
      if (recordType === RECORD_TYPE.EXERCISE_MINUTES) {
        dataAverageExerciseMinutes.push(dataToBePushed?.averageExerciseMinutes);
        dataAverageExerciseDistance.push(dataToBePushed?.averageExerciseDistance);
      } else if (recordType === RECORD_TYPE.TEMPERANCE) {
        dataAverage.push(dataToBePushed?.averageAvoidedAlcohol === 'Yes' ? 1 : 0);
        drugsAverage.push(dataToBePushed?.averageAvoidedDrugs === 'Yes' ? 1 : 0);
        smokingAverage.push(dataToBePushed?.averageAvoidedSmoking === 'Yes' ? 1 : 0);
      } else if (recordType === RECORD_TYPE.HEART_RATE) {
        dataAverageHeartRate.push(dataToBePushed?.average);
        dataAverageRestingHeartRate.push(dataToBePushed?.averageRestingHeartRate);
      } else if (recordType === RECORD_TYPE.BLOOD_PRESSURE) {
        dataSystolicBloodPressure.push(dataToBePushed?.average?.toString().split('/')[0]);
        dataDaistolicBloodPressure.push(dataToBePushed?.average?.toString().split('/')[1]);
      } else if (recordType === RECORD_TYPE.BLOOD_SUGARS) {
        dataFastingBloodSugar.push(dataToBePushed?.average);
        dataRestingBloodSugar.push(dataToBePushed?.averageRandomBloodSugars);
      } else if (recordType === RECORD_TYPE.NUTRITION) {
        nutritionsData.push(dataToBePushed?.average === 'Yes' ? 1 : 0);
      } else {
        dataAverage.push(dataToBePushed?.average);
      }
    }
  }

  const startDateMonth = new Date(startDate).getMonth();

  if (dataBy === GET_RECORD_DATA_BY.MONTH) {
    for (let i = startDateMonth + 1; i < startDateMonth + 13; i++) {
      const labelsToBePushed = i % 12;
      labels.push(labelsOfMonth[labelsToBePushed]);

      const dataToBePushed = data?.find((item) => {
        return item._id.month === (i + 1) % 12;
      });
      if (recordType === RECORD_TYPE.EXERCISE_MINUTES) {
        dataAverageExerciseMinutes.push(dataToBePushed?.averageExerciseMinutes);
        dataAverageExerciseDistance.push(dataToBePushed?.averageExerciseDistance);
      } else if (recordType === RECORD_TYPE.TEMPERANCE) {
        dataAverage.push(dataToBePushed?.averageAvoidedAlcohol === 'Yes' ? 1 : 0);
        drugsAverage.push(dataToBePushed?.averageAvoidedDrugs === 'Yes' ? 1 : 0);
        smokingAverage.push(dataToBePushed?.averageAvoidedSmoking === 'Yes' ? 1 : 0);
      } else if (recordType === RECORD_TYPE.HEART_RATE) {
        dataAverageHeartRate.push(dataToBePushed?.average);
        dataAverageRestingHeartRate.push(dataToBePushed?.averageRestingHeartRate);
      } else if (recordType === RECORD_TYPE.BLOOD_PRESSURE) {
        dataSystolicBloodPressure.push(dataToBePushed?.average?.toString().split('/')[0]);
        dataDaistolicBloodPressure.push(dataToBePushed?.average?.toString().split('/')[1]);
      } else if (recordType === RECORD_TYPE.BLOOD_SUGARS) {
        dataFastingBloodSugar.push(dataToBePushed?.average);
        dataRestingBloodSugar.push(dataToBePushed?.averageRandomBloodSugars);
      } else if (recordType === RECORD_TYPE.NUTRITION) {
        nutritionsData.push(dataToBePushed?.average === 'Yes' ? 1 : 0);
      } else {
        dataAverage.push(dataToBePushed?.average);
      }
    }
  }

  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  const differenceBetweenYear = endYear - startYear;

  if (dataBy === GET_RECORD_DATA_BY.YEAR) {
    for (let i = startYear; i <= startYear + differenceBetweenYear; i++) {
      labels.push(i.toString());

      const dataToBePushed = data?.find((item) => {
        return item._id.year === i;
      });
      if (recordType === RECORD_TYPE.EXERCISE_MINUTES) {
        dataAverageExerciseMinutes.push(dataToBePushed?.averageExerciseMinutes);
        dataAverageExerciseDistance.push(dataToBePushed?.averageExerciseDistance);
      } else if (recordType === RECORD_TYPE.TEMPERANCE) {
        dataAverage.push(dataToBePushed?.averageAvoidedAlcohol === 'Yes' ? 1 : 0);
        drugsAverage.push(dataToBePushed?.averageAvoidedDrugs === 'Yes' ? 1 : 0);
        smokingAverage.push(dataToBePushed?.averageAvoidedSmoking === 'Yes' ? 1 : 0);
      } else if (recordType === RECORD_TYPE.HEART_RATE) {
        dataAverageHeartRate.push(dataToBePushed?.average);
        dataAverageRestingHeartRate.push(dataToBePushed?.averageRestingHeartRate);
      } else if (recordType === RECORD_TYPE.BLOOD_PRESSURE) {
        dataSystolicBloodPressure.push(dataToBePushed?.average?.toString().split('/')[0]);
        dataDaistolicBloodPressure.push(dataToBePushed?.average?.toString().split('/')[1]);
      } else if (recordType === RECORD_TYPE.BLOOD_SUGARS) {
        dataFastingBloodSugar.push(dataToBePushed?.average);
        dataRestingBloodSugar.push(dataToBePushed?.averageRandomBloodSugars);
      } else if (recordType === RECORD_TYPE.NUTRITION) {
        nutritionsData.push(dataToBePushed?.average === 'Yes' ? 1 : 0);
      } else {
        dataAverage.push(dataToBePushed?.average);
      }
    }
  }

  if (recordType === RECORD_TYPE.TEMPERANCE) {
    return {
      labels,
      datasets: [
        {
          label: TEMPERANCE.alcohol,
          data: dataAverage,
        },
        {
          label: TEMPERANCE.drugs,
          data: drugsAverage,
        },
        {
          label: TEMPERANCE.smoke,
          data: smokingAverage,
        },
      ],
    };
  }

  if (recordType === RECORD_TYPE.NUTRITION) {
    return {
      labels,
      datasets: [
        {
          label: 'Nutrition Data',
          data: nutritionsData,
        },
      ],
    };
  }

  if (recordType === RECORD_TYPE.EXERCISE_MINUTES) {
    return {
      labels,
      datasets: [
        {
          label: 'Distance Travel',
          data: dataAverageExerciseDistance.map((item) => (item / conversionRate).toFixed(2)),
          startColor: '#E9AE30',
          endColor: '#FDB849',
        },
        {
          label: 'Exercise time',
          data: dataAverageExerciseMinutes,
          startColor: recordTypeColor[RECORD_TYPE.EXERCISE_MINUTES].start,
          endColor: 'red',
        },
      ],
    };
  } else if (recordType === RECORD_TYPE.HEART_RATE) {
    return {
      labels,
      datasets: [
        {
          label: 'Heart Rate',
          data: dataAverageHeartRate,
          startColor: '#DB392C',
          endColor: '#DB392C',
        },
        {
          label: 'Resting Heart Rate',
          data: dataAverageRestingHeartRate,
          startColor: '#1C89FF',
          endColor: '#1C89FF',
        },
      ],
    };
  } else if (recordType === RECORD_TYPE.BLOOD_PRESSURE) {
    return {
      labels,
      datasets: [
        {
          label: 'Systolic Blood Pressure',
          data: dataSystolicBloodPressure,
          startColor: '#D3DB65',
          endColor: '#D3DB65',
        },
        {
          label: 'Diastolic Blood Pressure',
          data: dataDaistolicBloodPressure,
          startColor: '#1C89FF',
          endColor: '#1C89FF',
        },
      ],
    };
  } else if (recordType === RECORD_TYPE.BLOOD_SUGARS) {
    return {
      labels,
      datasets: [
        {
          label: 'Fasting Blood Sugar',
          data: dataFastingBloodSugar,
          startColor: '#723093',
          endColor: '#723093',
        },
        {
          label: 'Resting Blood Sugar',
          data: dataRestingBloodSugar,
          startColor: '#F57E2A',
          endColor: '#F57E2A',
        },
      ],
    };
  } else {
    return {
      labels,
      datasets: [
        {
          label: '',
          data: dataAverage.map((item) => (item / conversionRate).toFixed(2)),
        },
      ],
    };
  }
};

export const getDaysDifferencesBetweenTwoDays = (date_1: Date, date_2: Date) => {
  let difference = date_1.getTime() - date_2.getTime();

  return Math.ceil(difference / (1000 * 3600 * 24));
};

export const unitForRecordType = (recordType: RECORD_TYPE) => {
  switch (recordType) {
    case RECORD_TYPE.WEIGHT:
      return ' kg';
    case RECORD_TYPE.BLOOD_PRESSURE:
      return ' mm hg';
    case RECORD_TYPE.HEART_RATE:
      return ' bpm';
    case RECORD_TYPE.BLOOD_SUGARS:
      return ' mg/dl';
    case RECORD_TYPE.WATER_INTAKE:
      return ' ml';
    case RECORD_TYPE.ACTIVE_ENERGY:
      return ' kcal';
    case RECORD_TYPE.STEPS:
      return '';
    default:
      return ' mins';
  }
};
export enum TEMPERANCE {
  alcohol = 'Alcohol',
  smoke = 'Smoke',
  drugs = 'Drugs',
}

export const colorForTemperance: { [key: string]: string } = {
  [TEMPERANCE.alcohol]: '#188DB4',
  [TEMPERANCE.smoke]: '#E9AE30',

  [TEMPERANCE.drugs]: '#9AB54A',
};
