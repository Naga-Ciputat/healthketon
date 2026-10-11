import type { Meta, StoryObj } from "@storybook/react";
import { SequenceInspector } from "@/components/widgets/SequenceInspector";

const meta: Meta<typeof SequenceInspector> = {
  title: "Sequences/SequenceInspector",
  component: SequenceInspector,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SequenceInspector>;

export const Default: Story = {
  args: {
    title: "Untitled Sequence",
    startHour: "09:00",
    endHour: "17:00",
    timezone: "Asia/Jakarta",
    businessDaysOnly: true,
    unsubscribeOption: "Stop hearing from me",
    threadEmails: true,
    includeSignature: true,
  },
};

export const CustomSchedule: Story = {
  args: {
    title: "Enterprise Outbound - EMEA",
    startHour: "08:00",
    endHour: "18:00",
    timezone: "Europe/London",
    businessDaysOnly: false,
    unsubscribeOption: "Opt-out preferences",
    threadEmails: false,
    includeSignature: true,
  },
};
