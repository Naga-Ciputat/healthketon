import type { Meta, StoryObj } from "@storybook/react";
import { NoteCard } from "@/components/widgets/NoteCard";

const meta: Meta<typeof NoteCard> = {
  title: "Cards/NoteCard",
  component: NoteCard,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof NoteCard>;

export const Default: Story = {
  args: {
    companyName: "Microsoft",
    title: "Untitled note",
    contentSnippet: "This note has no content.",
    authorName: "Muhammad Raihan Maulana",
    authorAvatarText: "M",
    authorAvatarColor: "bg-orange-500",
    dateLabel: "Today",
  },
};

export const WithDetailedContent: Story = {
  args: {
    companyName: "Google Cloud",
    title: "Quarterly Enterprise Renewal Strategy",
    contentSnippet: "Key discussion points: Contract expansion, AI infra credits, and SLA guarantees for APAC regions.",
    authorName: "Sarah Connor",
    authorAvatarText: "S",
    authorAvatarColor: "bg-blue-500",
    dateLabel: "Yesterday",
  },
};
