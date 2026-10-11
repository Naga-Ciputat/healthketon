import type { Meta, StoryObj } from "@storybook/react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { Home, FileText, Send, CheckSquare } from "lucide-react";

const meta: Meta<typeof TopHeader> = {
  title: "Navigation/TopHeader",
  component: TopHeader,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TopHeader>;

export const HomeHeader: Story = {
  args: {
    title: "Home",
    showHelp: true,
    showAskAttio: false,
  },
};

export const NotesHeader: Story = {
  args: {
    title: "Notes",
    showHelp: true,
    showAskAttio: true,
  },
};

export const SequencesHeader: Story = {
  args: {
    title: "Sequences / Untitled Sequence",
    showShare: true,
    showHelp: true,
    showAskAttio: true,
  },
};
