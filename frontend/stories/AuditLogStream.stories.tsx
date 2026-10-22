import type { Meta, StoryObj } from "@storybook/react";
import { AuditLogStream } from "@/components/widgets/AuditLogStream";

const meta: Meta<typeof AuditLogStream> = {
  title: "Clarix AI Clinical/AuditLogStream",
  component: AuditLogStream,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof AuditLogStream>;

export const DefaultLogStream: Story = {
  args: {
    title: "Jejak Audit & Rekam Putusan Verifikator",
  },
};
