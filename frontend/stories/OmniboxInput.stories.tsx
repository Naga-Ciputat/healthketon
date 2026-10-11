import type { Meta, StoryObj } from "@storybook/react";
import { OmniboxInput } from "@/components/widgets/OmniboxInput";

const meta: Meta<typeof OmniboxInput> = {
  title: "AI/OmniboxInput",
  component: OmniboxInput,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof OmniboxInput>;

export const Default: Story = {
  args: {
    placeholder: "Ask anything...",
    initialMode: "Auto",
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Summarize recent customer conversations or draft a follow-up...",
    initialMode: "Auto",
  },
};
