import type { Meta, StoryObj } from "@storybook/react";
import { FilterToolbar } from "@/components/widgets/FilterToolbar";

const meta: Meta<typeof FilterToolbar> = {
  title: "Toolbar/FilterToolbar",
  component: FilterToolbar,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof FilterToolbar>;

export const NotesToolbar: Story = {
  args: {
    sortLabel: "Creation date",
    showViewMode: true,
    viewMode: "grid",
    primaryActionLabel: "New note",
  },
};

export const TasksToolbar: Story = {
  args: {
    sortLabel: "Due date",
    showViewMode: false,
    hasFilterButton: true,
    primaryActionLabel: "New task",
  },
};
