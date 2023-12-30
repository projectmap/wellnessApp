import { TextField } from '@mui/material';

interface ITextField {
  label: string;
  id: string;
  name: string;
}

const TextFieldNormal = ({ label, id, name }: ITextField) => {
  return (
    <div>
      <TextField
        required
        variant="filled"
        fullWidth
        size="small"
        name={name}
        label={label}
        autoFocus
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
      />
    </div>
  );
};

export { TextFieldNormal };
