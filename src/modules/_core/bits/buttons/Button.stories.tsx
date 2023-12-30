import { Meta, Story } from '@storybook/react';
import { ButtonProps } from '@mui/material';
import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    onClick: {
      action: 'Clicked',
    },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args}>{args.children}</Button>;

export const Primary = Template.bind({});
Primary.args = {
  size: 'small',
  sx: { background: '#0C72E0' },
  children: 'Primary',
};
