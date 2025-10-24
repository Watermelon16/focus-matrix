import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task, Reminder } from '@/types';

// User interface
export interface FirebaseUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string; // For demo purposes
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  joinedAt: string;
  createdAt: any; // serverTimestamp
}

// Collections
const USERS_COLLECTION = 'users';
const TASKS_COLLECTION = 'tasks';
const REMINDERS_COLLECTION = 'reminders';

// User operations
export const userService = {
  // Get all users
  async getAllUsers(): Promise<FirebaseUser[]> {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseUser[];
  },

  // Get user by ID
  async getUserById(id: string): Promise<FirebaseUser | null> {
    const docRef = doc(db, USERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FirebaseUser;
    }
    return null;
  },

  // Create user
  async createUser(userData: Omit<FirebaseUser, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...userData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update user
  async updateUser(id: string, updates: Partial<FirebaseUser>): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(docRef, updates);
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Listen to users changes
  onUsersChange(callback: (users: FirebaseUser[]) => void) {
    return onSnapshot(collection(db, USERS_COLLECTION), (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseUser[];
      callback(users);
    });
  }
};

// Task operations
export const taskService = {
  // Get tasks for user
  async getUserTasks(userId: string): Promise<Task[]> {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
  },

  // Create task
  async createTask(taskData: Omit<Task, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
      ...taskData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update task
  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const docRef = doc(db, TASKS_COLLECTION, id);
    await updateDoc(docRef, updates);
  },

  // Delete task
  async deleteTask(id: string): Promise<void> {
    const docRef = doc(db, TASKS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Delete all tasks for user
  async deleteAllUserTasks(userId: string): Promise<void> {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },

  // Replace all tasks for user
  async replaceUserTasks(userId: string, tasks: Task[]): Promise<void> {
    // Delete existing tasks
    await this.deleteAllUserTasks(userId);
    
    // Add new tasks
    const addPromises = tasks.map(task => 
      addDoc(collection(db, TASKS_COLLECTION), {
        ...task,
        userId,
        createdAt: serverTimestamp()
      })
    );
    await Promise.all(addPromises);
  },

  // Listen to tasks changes for user
  onUserTasksChange(userId: string, callback: (tasks: Task[]) => void) {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('userId', '==', userId)
    );
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      callback(tasks);
    });
  }
};

// Reminder operations
export const reminderService = {
  // Get reminders for user
  async getUserReminders(userId: string): Promise<Reminder[]> {
    const q = query(
      collection(db, REMINDERS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Reminder[];
  },

  // Create reminder
  async createReminder(reminderData: Omit<Reminder, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, REMINDERS_COLLECTION), {
      ...reminderData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update reminder
  async updateReminder(id: string, updates: Partial<Reminder>): Promise<void> {
    const docRef = doc(db, REMINDERS_COLLECTION, id);
    await updateDoc(docRef, updates);
  },

  // Delete reminder
  async deleteReminder(id: string): Promise<void> {
    const docRef = doc(db, REMINDERS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Delete all reminders for user
  async deleteAllUserReminders(userId: string): Promise<void> {
    const q = query(
      collection(db, REMINDERS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },

  // Replace all reminders for user
  async replaceUserReminders(userId: string, reminders: Reminder[]): Promise<void> {
    // Delete existing reminders
    await this.deleteAllUserReminders(userId);
    
    // Add new reminders
    const addPromises = reminders.map(reminder => 
      addDoc(collection(db, REMINDERS_COLLECTION), {
        ...reminder,
        userId,
        createdAt: serverTimestamp()
      })
    );
    await Promise.all(addPromises);
  },

  // Listen to reminders changes for user
  onUserRemindersChange(userId: string, callback: (reminders: Reminder[]) => void) {
    const q = query(
      collection(db, REMINDERS_COLLECTION),
      where('userId', '==', userId)
    );
    return onSnapshot(q, (snapshot) => {
      const reminders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reminder[];
      callback(reminders);
    });
  }
};
