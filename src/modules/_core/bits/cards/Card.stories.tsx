import { Meta, Story } from '@storybook/react';
import { Card, CustomCardProps } from './Card';

export default {
  title: 'Card',
  component: Card,
} as Meta;

const Template: Story<CustomCardProps> = (args) => <Card {...args}>{args.children}</Card>;

export const Default = Template.bind({});
Default.args = {
  children: 'Default',
  cardSxProps: {
    boxShadow: '0px 2px 1px -1pxrgba(0,0,0,0.2),0px 1px 1px 0pxrgba(0,0,0,0.14),0px 1px 3px 0pxrgba(0,0,0,0.12)',
    width: '300px',
  },
};
