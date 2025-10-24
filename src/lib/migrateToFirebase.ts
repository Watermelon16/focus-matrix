import { userService, taskService, reminderService } from './firebaseService';

// Migration script to move data from localStorage to Firebase
export const migrateToFirebase = async () => {
  try {
    console.log('Starting migration from localStorage to Firebase...');
    
    // Check if migration already done
    const migrationDone = localStorage.getItem('firebase_migration_done');
    if (migrationDone) {
      console.log('Migration already completed');
      return;
    }
    
    // Migrate users
    const localUsers = JSON.parse(localStorage.getItem('focus_matrix_users') || '[]');
    console.log(`Migrating ${localUsers.length} users...`);
    
    for (const user of localUsers) {
      try {
        await userService.createUser({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          joinedAt: user.joinedAt
        });
        console.log(`Migrated user: ${user.email}`);
      } catch (error) {
        console.error(`Error migrating user ${user.email}:`, error);
      }
    }
    
    // Migrate tasks
    const localTasks = JSON.parse(localStorage.getItem('focus_matrix_tasks') || '{}');
    console.log(`Migrating tasks for ${Object.keys(localTasks).length} users...`);
    
    for (const [userId, tasks] of Object.entries(localTasks)) {
      if (Array.isArray(tasks) && tasks.length > 0) {
        try {
          await taskService.replaceUserTasks(userId, tasks as any[]);
          console.log(`Migrated ${tasks.length} tasks for user ${userId}`);
        } catch (error) {
          console.error(`Error migrating tasks for user ${userId}:`, error);
        }
      }
    }
    
    // Migrate reminders
    const localReminders = JSON.parse(localStorage.getItem('focus_matrix_reminders') || '{}');
    console.log(`Migrating reminders for ${Object.keys(localReminders).length} users...`);
    
    for (const [userId, reminders] of Object.entries(localReminders)) {
      if (Array.isArray(reminders) && reminders.length > 0) {
        try {
          await reminderService.replaceUserReminders(userId, reminders as any[]);
          console.log(`Migrated ${reminders.length} reminders for user ${userId}`);
        } catch (error) {
          console.error(`Error migrating reminders for user ${userId}:`, error);
        }
      }
    }
    
    // Mark migration as done
    localStorage.setItem('firebase_migration_done', 'true');
    console.log('Migration completed successfully!');
    
    // Optionally clear localStorage data
    // localStorage.removeItem('focus_matrix_users');
    // localStorage.removeItem('focus_matrix_tasks');
    // localStorage.removeItem('focus_matrix_reminders');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Auto-migrate on app start
export const autoMigrate = () => {
  // Only migrate if Firebase is configured
  const hasFirebaseConfig = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID && 
                           (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID !== 'demo-project';
  
  if (hasFirebaseConfig) {
    migrateToFirebase().catch(console.error);
  } else {
    console.log('Firebase not configured, skipping migration');
  }
};
