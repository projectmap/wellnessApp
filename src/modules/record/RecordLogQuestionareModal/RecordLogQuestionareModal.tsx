import moment from 'moment';
import { Box } from '@mui/system';
import React, { FC } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { recordTypeWithQuestions, recordTypeWidthAndHeight } from '../utils/record-logs-type';
import RecordFormGroup from '../common/RecordFormGroup/RecordFormGroup';
import { RECORD_TYPE, useListRecordLogsTypesQuery } from '@newstart-online/sdk';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ChevronBlueLeft, DownArrow, DownArrowBlueIcon, NutritionIcon } from '~/icons';
import { RecordLogQuestionareModalWrapper } from '../styles/RecordLogQuestionareModalWrapper';

interface IRecordLogQuestionareModal {
  selectedRecordLogs: RECORD_TYPE;
  closeModal: () => void;
}
export const RecordLogQuestionareModal: FC<IRecordLogQuestionareModal> = ({ selectedRecordLogs, closeModal }) => {
  const selectedRecordLogsDetails = recordTypeWithQuestions.find((item) => item.recordType === selectedRecordLogs);

  const [value, setValue] = React.useState<Dayjs | null>(dayjs(new Date()));
  const { data: recordLogTypes } = useListRecordLogsTypesQuery();

  const selectedRecord = recordLogTypes?.data?.find((item) => item.recordLogEnum === selectedRecordLogs);

  return (
    <RecordLogQuestionareModalWrapper>
      <Box sx={{ marginBottom: '28px', mx: 'auto', display: 'flex', justifyContent: 'center' }}>
        <img
          src={selectedRecord?.logo?.completedUrl}
          style={{ width: recordTypeWidthAndHeight[selectedRecordLogs].width }}
          height={recordTypeWidthAndHeight[selectedRecordLogs].height}
        />
      </Box>
      <Typography component="h1" fontSize="24px" fontWeight="700" textAlign="center">
        {selectedRecordLogsDetails?.questionLabel}
      </Typography>

      <Box sx={{ marginTop: '16px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Custom input"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            components={{
              OpenPickerIcon: DownArrowBlueIcon,
            }}
            renderInput={({ inputRef, inputProps, InputProps }) => (
              <Box ref={inputRef} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="#147AE9" fontWeight="700" fontSize="20px">
                  {moment(value?.toDate().toDateString()).format('ll')}
                </Typography>

                {InputProps?.endAdornment}
              </Box>
            )}
          />
        </LocalizationProvider>
      </Box>

      <Box>
        {selectedRecordLogsDetails && (
          <RecordFormGroup
            initialValue={selectedRecordLogsDetails.initialValue}
            questions={selectedRecordLogsDetails?.questions}
            recordType={selectedRecordLogs}
            selectedDate={value?.toDate()}
            closeModal={closeModal}
          />
        )}
      </Box>
    </RecordLogQuestionareModalWrapper>
  );
};
