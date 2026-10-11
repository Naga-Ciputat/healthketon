import type { Meta, StoryObj } from "@storybook/react";
import { SequenceBuilder } from "@/components/widgets/SequenceBuilder";

const meta: Meta<typeof SequenceBuilder> = {
  title: "Sequences/SequenceBuilder",
  component: SequenceBuilder,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SequenceBuilder>;

export const UnpublishedSequence: Story = {
  args: {
    isPublished: false,
    triggerDelay: "immediately",
  },
};

export const PublishedSequence: Story = {
  args: {
    isPublished: true,
    triggerDelay: "2 days",
  },
};
