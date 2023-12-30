import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TextField, InputAdornment, IconButton } from '@mui/material';

interface IPassword {
  label: string;
  id: string;
  name: string;
}

const TextFieldPassword = ({ label, id, name }: IPassword) => {
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  const handlePasswordChange = (prop: string) => (event: React.SyntheticEvent) => {
    setValues({
      ...values,
      [prop]: (event.target as HTMLInputElement).value,
    });
  };

  return (
    <div>
      <TextField
        required
        variant="filled"
        fullWidth
        size="small"
        name={name}
        label={label}
        id={id}
        sx={{
          opacity: 0.6,
          '& .MuiFilledInput-root': {
            background: 'transparent',
            border: '1px solid #A1A1AF',
            borderRadius: '4px',
          },
          '& .MuiFilledInput-root:before': {
            borderBottom: 'none',
            content: 'none',
          },
          '& .MuiFilledInput-root:after': {
            borderBottom: 'none',
            content: 'none',
          },
        }}
        type={values.showPassword ? 'text' : 'password'}
        onChange={handlePasswordChange('password')}
        value={values.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                  {values.showPassword ? (
                    <VisibilityIcon
                      sx={{
                        mt: -2.2,
                        mr: -2,
                        color: ' #09121F',
                        opacity: '0.5',
                      }}
                    />
                  ) : (
                    <VisibilityOffIcon
                      sx={{
                        mt: -2.2,
                        mr: -2,
                        color: ' #09121F',
                        opacity: '0.5',
                      }}
                    />
                  )}
                </IconButton>
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export { TextFieldPassword };
