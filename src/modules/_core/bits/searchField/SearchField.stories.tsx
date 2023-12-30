import { Meta, Story } from '@storybook/react';
import { SearchField } from './SearchField';

export default {
  title: 'Search',
  component: SearchField,
} as Meta;

const Template: Story = (args) => <SearchField searchText="" {...args} />;

export const Search = Template.bind({});
Search.args = {};
