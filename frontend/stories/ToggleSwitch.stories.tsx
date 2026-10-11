import type { Meta, StoryObj } from "@storybook/react";
import { ToggleSwitch } from "@/components/widgets/ToggleSwitch";

const meta: Meta<typeof ToggleSwitch> = {
  title: "Controls/ToggleSwitch",
  component: ToggleSwitch,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

export const Checked: Story = {
  args: {
    label: "Business days only",
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    label: "Thread emails",
    checked: false,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Enable sequence",
    description: "Start enrolling candidates automatically into this outreach flow",
    checked: true,
  },
};
