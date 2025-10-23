import Dexie from 'dexie';
import type { Task, Reminder, VaultConfig } from './types';

const db = new Dexie('FocusMatrixDB') as Dexie & {
  tasks: Dexie.Table<Task, string>;
  reminders: Dexie.Table<Reminder, string>;
  vault: Dexie.Table<VaultConfig & { id: string }, string>;
};

// Schema version 1
db.version(1).stores({
  tasks: 'id, dueDate, completed, priority, createdAt',
  reminders: 'id, taskId, reminderTime',
  vault: 'id'
});

export { db };
