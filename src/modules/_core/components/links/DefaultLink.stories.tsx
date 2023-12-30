import { Meta, Story } from '@storybook/react';
import { DefaultLink, DefaultLinkProps } from './DefaultLink';

export default {
  title: 'DefaultLink',
  component: DefaultLink,
  argTypes: {
    onClick: {
      action: 'Clicked',
    },
  },
} as Meta;

const Template: Story<DefaultLinkProps> = (args) => <DefaultLink {...args}>{args.children}</DefaultLink>;

export const Primary = Template.bind({});
Primary.args = {
  to: '',
  children: 'Default Link',
  muiLinkProps: {
    sx: {
      fontSize: '1rem',
    },
  },
};
