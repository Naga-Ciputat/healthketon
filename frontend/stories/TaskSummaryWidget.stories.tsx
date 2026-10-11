import type { Meta, StoryObj } from "@storybook/react";
import { TaskSummaryWidget } from "@/components/widgets/TaskSummaryWidget";

const meta: Meta<typeof TaskSummaryWidget> = {
  title: "Dashboard/TaskSummaryWidget",
  component: TaskSummaryWidget,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof TaskSummaryWidget>;

export const EmptyZeroTasks: Story = {
  args: {
    taskCount: 0,
  },
};

export const WithTasks: Story = {
  args: {
    taskCount: 5,
  },
};
