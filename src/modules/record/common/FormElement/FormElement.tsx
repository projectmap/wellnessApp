import React from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import ToggleBar from '~/common-ui/ToggleBar/ToggleBar';

import { FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import { FIELD_TYPES_ENUM, IOptionsConversions, IQuestion } from '../../utils/record-logs-type';
import { RECORD_TYPE } from '@newstart-online/sdk';

interface IFormElement extends IQuestion {
  registerOptions?: RegisterOptions<FieldValues, string> | undefined;
  formProps: UseFormReturn<FieldValues, any>;
  ref?: any;
  recordType: RECORD_TYPE;
}

const FormElement: React.FC<IFormElement> = (props) => {
  const { label, type, name, registerOptions, conversionsOptions, formProps, maxValue, ref, recordType } = props;

  const { getValues, setValue, register, formState, watch, reset } = formProps;

  const [unconvertedValue, setConvertedValue] = React.useState<number>(0);

  const [activeUnit, setActiveUnit] = React.useState<IOptionsConversions>({ value: '', label: '' });

  React.useEffect(() => {
    if (conversionsOptions) {
      setActiveUnit(conversionsOptions[0]);
    }
  }, [conversionsOptions]);

  React.useEffect(() => {
    if (conversionsOptions) {
      if (!activeUnit.defaultUnit) {
        const value = activeUnit.conversion ? unconvertedValue * activeUnit.conversion : unconvertedValue;
        setValue(name, +value.toFixed(2));
      } else {
        setValue(name, unconvertedValue);
      }
    } else {
      setValue(name, unconvertedValue);
    }
  }, [unconvertedValue, activeUnit]);

  React.useEffect(() => {
    if (formState?.defaultValues) {
      const formValue = formState.defaultValues[name];
      if (!activeUnit.defaultUnit) {
        const value = activeUnit.conversion ? formValue * (1 / activeUnit.conversion) : formValue;
        setConvertedValue(value);
      } else {
        setConvertedValue(formValue);
      }
    }
  }, [formState?.defaultValues]);

  const onValueChange = (inputData: any) => {
    if (conversionsOptions) {
      const value = activeUnit.conversion ? inputData * (1 / activeUnit.conversion) : inputData;
      if (typeof value !== 'boolean') {
        setConvertedValue(+value.toFixed(2));
      } else {
        setConvertedValue(value as any);
      }
    } else {
      if (typeof inputData !== 'boolean') {
        setConvertedValue(+inputData.toFixed(2));
      } else {
        setConvertedValue(inputData as any);
      }
    }
  };

  React.useEffect(() => {
    if (activeUnit && unconvertedValue) {
      onValueChange(unconvertedValue);
    }
  }, [activeUnit]);

  if (type === FIELD_TYPES_ENUM.CHECKBOX) {
    return (
      <div>
        <Box className="checkbox-container" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography fontWeight="700" width="50%">
            {label}
          </Typography>
          <input {...props} {...register(name, registerOptions)} />
        </Box>
      </div>
    );
  }

  const ifMinCannotBeZero = () => {
    return (
      recordType === RECORD_TYPE.BLOOD_PRESSURE ||
      recordType === RECORD_TYPE.HEART_RATE ||
      recordType === RECORD_TYPE.BLOOD_SUGARS
    );
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 3,
          mb: 2,
        }}
      >
        <Typography variant="subtitle1">{label}</Typography>
        {/* <Box></Box> */}
        {conversionsOptions && (
          <ToggleBar
            options={conversionsOptions}
            onClick={(data) => setActiveUnit(data)}
            activeOptions={activeUnit.value}
          />
        )}
      </Box>

      <input
        disabled={label === 'Exercise type' ? true : false}
        className="input"
        name={props.name}
        value={typeof unconvertedValue === 'number' ? +unconvertedValue.toFixed(2) : unconvertedValue}
        type={props.type}
        min={ifMinCannotBeZero() ? 40 : 0}
        max={maxValue ?? activeUnit.maxValue}
        step="0.01"
        onChange={(e) => {
          label === 'Steps'
            ? setConvertedValue(parseFloat(e.target.value.replace(/[^0-9]/g, '')))
            : setConvertedValue(parseFloat(e.target.value));
        }}
      />
    </div>
  );
};

export default FormElement;
