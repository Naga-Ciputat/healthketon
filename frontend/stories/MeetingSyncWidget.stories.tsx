import type { Meta, StoryObj } from "@storybook/react";
import { MeetingSyncWidget } from "@/components/widgets/MeetingSyncWidget";

const meta: Meta<typeof MeetingSyncWidget> = {
  title: "Dashboard/MeetingSyncWidget",
  component: MeetingSyncWidget,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof MeetingSyncWidget>;

export const Default: Story = {
  args: {
    dateLabel: "Today, Oct 11",
  },
};

export const TomorrowDate: Story = {
  args: {
    dateLabel: "Tomorrow, Oct 12",
  },
};
