import {
  ENTRY_TYPE,
  RECORD_TYPE,
  useCreateRecordLogsMutation,
  useGetCurrentUserRecordLogsLastRecordedQuery,
  useGetRecordDataByRecordTypeQuery,
} from '@newstart-online/sdk';
import { Box } from '@mui/system';
import React, { FC, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Typography } from '@mui/material';
import FormElement from '../FormElement/FormElement';
import { toast, ToastContainer } from 'react-toastify';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import { IOptionsConversions, IQuestion } from '../../utils/record-logs-type';
import { useAppDispatch } from '~/state/app/hooks';
import {
  setBadgeInfoDetails,
  setShowRecordLogBadgeUnlockedModal,
} from '~/state/services/recordLogsBadgeNotification/recordLogsBadgeNotification';

interface IFormGroup {
  questions: IQuestion[];
  recordType: RECORD_TYPE;
  selectedDate?: Date;
  initialValue: {
    [key: string]: any;
  };
  closeModal: () => void;
}
const RecordFormGroup: FC<IFormGroup> = ({ questions, recordType, selectedDate, initialValue, closeModal }) => {
  const formProps = useForm();
  const ref = useRef<any>(null);

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, defaultValues },
    resetField,
    reset,
    getValues,
    setValue,
  } = formProps;
  const todayDate = new Date();

  const { data: lastRecordedData } = useGetCurrentUserRecordLogsLastRecordedQuery();

  const { data: record } = useGetRecordDataByRecordTypeQuery({
    date: selectedDate?.toISOString().split('T')[0] as any,
    recordType: recordType,
  });

  const [createRecordLogs, { data, isLoading }] = useCreateRecordLogsMutation();

  const isEntryManualorAuto = React.useMemo(() => {
    const foundItem = lastRecordedData?.data?.find((item) => item?.recordType === recordType);

    return foundItem?.entryType;
  }, [lastRecordedData, recordType]);

  React.useEffect(() => {
    if (record?.data?.record) {
      reset(record.data.record[recordType]);
    } else {
      reset(initialValue);
    }

    return () => {};
  }, [record?.data?.record]);

  React.useEffect(() => {
    if (ref?.current) {
      ref?.current?.focus();
    }
  }, [ref]);

  const onSubmit = (data: any) => {
    if (selectedDate) {
      const postData = {
        recordType: recordType,
        entryType: ENTRY_TYPE.MANUAL,
        date: todayDate.toISOString().split('T')[0] as any,
        record: {
          [recordType]: data,
        },
      };

      createRecordLogs(postData)
        .unwrap()
        .then((item) => {
          if (item?.data?.unlockedBadge) {
            dispatch(
              setBadgeInfoDetails({
                title: item?.data?.unlockedBadge[0]?.title,
                descriptions: item?.data?.unlockedBadge[0]?.descriptions,
                imageUrl: item?.data?.unlockedBadge[0]?.badge?.completedUrl,
              }),
            );
            dispatch(setShowRecordLogBadgeUnlockedModal(true));
          }
          toast.success(item.message);
          closeModal();
        });
    }
  };

  const checkIfValueIsNotDefined = Object.values(watch()).some((item) => Number.isNaN(item) || item === 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {questions.map((item, index) => (
        <Box sx={{ marginTop: '24px' }} key={item.title}>
          <FormElement {...item} recordType={recordType} formProps={formProps} ref={index === 0 ? ref : null} />
        </Box>
      ))}
      <ToastContainer position="bottom-center" hideProgressBar={true} />
      {isEntryManualorAuto !== undefined && isEntryManualorAuto === ENTRY_TYPE.AUTO ? (
        <Typography
          variant="body1"
          sx={{ borderRadius: '4px', backgroundColor: '#F3F8FE', p: '8px 16px', color: '#131336', mt: '24px' }}
        >
          This data is automatically filled from your health tracking device; you cannot manually update it.
        </Typography>
      ) : null}

      {isEntryManualorAuto === ENTRY_TYPE.MANUAL || isEntryManualorAuto === undefined ? (
        <LoadingBtn
          loading={isLoading}
          sx={{ p: '16px 71px', borderRadius: '50px', mt: '34px', mx: 'auto', display: 'flex' }}
          disabled={selectedDate?.toDateString() !== todayDate.toDateString() || checkIfValueIsNotDefined}
        >
          Save
        </LoadingBtn>
      ) : null}
    </form>
  );
};

export default RecordFormGroup;
