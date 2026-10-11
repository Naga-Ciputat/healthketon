import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "@/components/widgets/Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    workspaceName: "NAGA CIPUTAT",
    taskCount: 1,
    trialDaysLeft: 14,
    currentPath: "/home",
  },
};

export const ActiveOnTasks: Story = {
  args: {
    workspaceName: "NAGA CIPUTAT",
    taskCount: 3,
    trialDaysLeft: 7,
    currentPath: "/tasks",
  },
};

export const ActiveOnSequences: Story = {
  args: {
    workspaceName: "NAGA CIPUTAT",
    taskCount: 0,
    trialDaysLeft: 14,
    currentPath: "/sequences",
  },
};
