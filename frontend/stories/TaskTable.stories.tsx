import type { Meta, StoryObj } from "@storybook/react";
import { TaskTable } from "@/components/widgets/TaskTable";

const meta: Meta<typeof TaskTable> = {
  title: "Data/TaskTable",
  component: TaskTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof TaskTable>;

export const Default: Story = {
  args: {
    tasks: [
      {
        id: "1",
        title: "contoh",
        dueDate: "Due today",
        dueStatus: "today",
        recordName: "",
        assignedToName: "Muhammad Raihan Mau...",
        assignedToAvatarText: "M",
        assignedToAvatarColor: "bg-orange-500",
        completed: false,
      },
    ],
  },
};

export const MultipleTasks: Story = {
  args: {
    tasks: [
      {
        id: "1",
        title: "Follow up with Microsoft renewal contract",
        dueDate: "Due today",
        dueStatus: "today",
        recordName: "Microsoft",
        assignedToName: "Muhammad Raihan Maulana",
        assignedToAvatarText: "M",
        assignedToAvatarColor: "bg-orange-500",
        completed: false,
      },
      {
        id: "2",
        title: "Prepare slide deck for quarterly business review",
        dueDate: "Tomorrow",
        dueStatus: "upcoming",
        recordName: "Stripe",
        assignedToName: "Sarah Connor",
        assignedToAvatarText: "S",
        assignedToAvatarColor: "bg-blue-500",
        completed: false,
      },
      {
        id: "3",
        title: "Review inbound security questionnaires",
        dueDate: "Yesterday",
        dueStatus: "overdue",
        recordName: "Figma",
        assignedToName: "Alex Rivera",
        assignedToAvatarText: "A",
        assignedToAvatarColor: "bg-emerald-500",
        completed: true,
      },
    ],
  },
};
