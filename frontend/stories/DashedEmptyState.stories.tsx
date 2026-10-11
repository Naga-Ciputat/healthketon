import type { Meta, StoryObj } from "@storybook/react";
import { DashedEmptyState } from "@/components/widgets/DashedEmptyState";
import { Star } from "lucide-react";

const meta: Meta<typeof DashedEmptyState> = {
  title: "Feedback/DashedEmptyState",
  component: DashedEmptyState,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof DashedEmptyState>;

export const FavoritesEmpty: Story = {
  args: {
    title: "Favorites",
    description: "Notes that you favorite will appear here",
  },
};

export const WithIcon: Story = {
  args: {
    title: "No pinned items",
    description: "Pin frequently referenced records, notes, and sequences for quick access.",
    icon: <Star className="w-5 h-5 text-gray-400" />,
  },
};
