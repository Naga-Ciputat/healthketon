import type { Meta, StoryObj } from "@storybook/react";
import { TabsBar } from "@/components/widgets/TabsBar";
import { FileText, FileCode, Edit3, Users, Settings } from "lucide-react";

const meta: Meta<typeof TabsBar> = {
  title: "Navigation/TabsBar",
  component: TabsBar,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof TabsBar>;

export const NotesTabs: Story = {
  args: {
    tabs: [
      { id: "notes", label: "Notes", count: 1, icon: FileText },
      { id: "templates", label: "Templates", count: 0, icon: FileCode },
    ],
    activeTab: "notes",
  },
};

export const SequenceTabs: Story = {
  args: {
    tabs: [
      { id: "editor", label: "Editor", icon: Edit3 },
      { id: "recipients", label: "Recipients", count: 0, icon: Users },
      { id: "settings", label: "Settings", icon: Settings },
    ],
    activeTab: "editor",
  },
};
