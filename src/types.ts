export type Priority = "UI" | "UNI" | "NUI" | "NUNI";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  createdAt: string;   // ISO
  dueDate?: string;    // ISO
  priority: Priority;
  completed: boolean;
  completedAt?: string;
  origin?: "manual" | "ics" | "gcal" | "apple";
  sourceEventId?: string;
  rolloverCount: number;
  taskType?: string;   // work, personal, health, learning, family, other
}

export interface Reminder {
  id: string;
  taskId: string;
  reminderTime: string;
  email?: string;
}

export interface VaultConfig {
  encryptionEnabled: boolean;
  authMethod: "passphrase" | "passkey" | "none";
  lastRotated?: string;
}
