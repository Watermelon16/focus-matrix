import type { Task, Reminder } from '@/types';

// Event system for notifying components of state changes
let listeners: (() => void)[] = [];
let refreshCounter = 0;

const notifyListeners = () => {
  refreshCounter++;
  console.log('Notifying listeners, refreshCounter:', refreshCounter);
  listeners.forEach(listener => {
    try {
      listener();
    } catch (error) {
      console.error('Error in listener:', error);
    }
  });
};

// Global state change event
const triggerStateChange = () => {
  notifyListeners();
  // Also trigger a custom event for components to listen
  window.dispatchEvent(new CustomEvent('trpc-state-change', { 
    detail: { refreshCounter } 
  }));
};

// Load data from localStorage or initialize
const loadMockUsers = (): MockUser[] => {
  try {
    const saved = localStorage.getItem('focus_matrix_users');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading users:', e);
  }
  // Default admin user
  return [
    {
      id: 'user-1',
      name: 'Phuong Admin',
      email: 'phuonglh43@gmail.com',
      passwordHash: '010486', // Admin password
      role: 'admin',
      status: 'active',
      joinedAt: new Date().toISOString(),
    }
  ];
};

const loadMockTasks = (): Record<string, Task[]> => {
  try {
    const saved = localStorage.getItem('focus_matrix_tasks');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading tasks:', e);
  }
  return {};
};

const loadMockReminders = (): Record<string, Reminder[]> => {
  try {
    const saved = localStorage.getItem('focus_matrix_reminders');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading reminders:', e);
  }
  return {};
};

// Save data to localStorage
const saveMockUsers = () => {
  try {
    localStorage.setItem('focus_matrix_users', JSON.stringify(mockUsers));
  } catch (e) {
    console.error('Error saving users:', e);
  }
};

const saveMockTasks = () => {
  try {
    localStorage.setItem('focus_matrix_tasks', JSON.stringify(mockTasks));
  } catch (e) {
    console.error('Error saving tasks:', e);
  }
};

const saveMockReminders = () => {
  try {
    localStorage.setItem('focus_matrix_reminders', JSON.stringify(mockReminders));
  } catch (e) {
    console.error('Error saving reminders:', e);
  }
};

// Mock user interface
interface MockUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  joinedAt: string;
}

// Mock state storage - PER USER (loaded from localStorage)
let mockUsers: MockUser[] = loadMockUsers();
let mockTasks: Record<string, Task[]> = loadMockTasks();
let mockReminders: Record<string, Reminder[]> = loadMockReminders();

// Mock tRPC for now - in a real app you'd use actual tRPC
export const trpc = {
  auth: {
    // Placeholder for future backend; currently front-end only
    getGoogleDriveToken: {
      useMutation: (_options?: any) => ({
        mutateAsync: async (_data: any) => ({ accessToken: '' }),
        isPending: false,
      })
    },
    // Mock auth mutations
    login: {
      useMutation: (options?: any) => {
        let isPending = false;
        return {
          mutate: (data: { email: string; password: string }) => {
            if (isPending) return;
            isPending = true;

            console.log('Mock login attempt:', data);
            const user = mockUsers.find(u => u.email === data.email && u.passwordHash === data.password);
            
            if (user) {
              console.log('Mock login success for:', user.email);
              if (options?.onSuccess) {
                options.onSuccess(user);
              }
            } else {
              console.log('Mock login failed for:', data.email);
              if (options?.onError) {
                options.onError(new Error('Invalid credentials'));
              }
            }
            isPending = false;
            return Promise.resolve();
          },
          isPending: isPending
        };
      }
    },
    register: {
      useMutation: (options?: any) => {
        let isPending = false;
        return {
          mutate: (data: { name: string; email: string; password: string }) => {
            if (isPending) return;
            isPending = true;

            console.log('Mock register attempt:', data);
            const existingUser = mockUsers.find(u => u.email === data.email);
            if (existingUser) {
              console.log('Mock register failed: User already exists', data.email);
              if (options?.onError) {
                options.onError(new Error('User with this email already exists'));
              }
            } else {
              const newUser: MockUser = {
                id: `user-${Date.now()}`,
                name: data.name,
                email: data.email,
                passwordHash: data.password, // For demo purposes, not secure
                role: 'user',
                status: 'active',
                joinedAt: new Date().toISOString(),
              };
              mockUsers.push(newUser);
              saveMockUsers(); // Save to localStorage
              triggerStateChange(); // Trigger refresh for admin dashboard
              console.log('Mock register success for:', newUser.email);
              if (options?.onSuccess) {
                options.onSuccess(newUser);
              }
            }
            isPending = false;
            return Promise.resolve();
          },
          isPending: isPending
        };
      }
    }
  },
  tasks: {
    list: {
      useQuery: (options?: any) => {
        // Add listener for state changes
        if (options?.onSuccess) {
          listeners.push(options.onSuccess);
        }
        
        // Get current user ID from localStorage
        const currentUser = localStorage.getItem('user');
        const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
        
        return {
          data: mockTasks[userId] || [], 
          isLoading: false,
          // Force refresh by including counter
          refreshCounter,
          refetch: () => {
            triggerStateChange();
            return Promise.resolve();
          }
        };
      }
    },
    create: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: (data: any) => {
            if (isPending) return;
            isPending = true;
            
            console.log('Creating task:', data);
            const newTask: Task = {
              id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: data.title,
              notes: data.notes || '',
              createdAt: new Date().toISOString(),
              dueDate: data.dueDate,
              priority: data.priority,
              completed: false,
              rolloverCount: 0,
              taskType: data.taskType || 'work'
            };
            
            // Get current user ID
            const currentUser = localStorage.getItem('user');
            const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
            
            if (!mockTasks[userId]) mockTasks[userId] = [];
            mockTasks[userId].push(newTask);
            saveMockTasks(); // Save to localStorage
            
            // Create reminder if provided
            if (data.reminder && data.reminder.time) {
              const newReminder: Reminder = {
                id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                taskId: newTask.id,
                reminderTime: data.reminder.time,
                email: data.reminder.email
              };
              
              if (!mockReminders[userId]) mockReminders[userId] = [];
              mockReminders[userId].push(newReminder);
              saveMockReminders(); // Save to localStorage
            }
            
            triggerStateChange();
            
            // Call onSuccess callback
            if (options?.onSuccess) {
              options.onSuccess();
            }
            
            isPending = false;
            return Promise.resolve();
          }, 
          mutateAsync: (data: any) => {
            if (isPending) return Promise.resolve({});
            isPending = true;
            
            console.log('Creating task async:', data);
            const newTask: Task = {
              id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: data.title,
              notes: data.notes || '',
              createdAt: new Date().toISOString(),
              dueDate: data.dueDate,
              priority: data.priority,
              completed: false,
              rolloverCount: 0,
              taskType: data.taskType || 'work'
            };
            
            // Get current user ID
            const currentUser = localStorage.getItem('user');
            const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
            
            if (!mockTasks[userId]) mockTasks[userId] = [];
            mockTasks[userId].push(newTask);
            saveMockTasks(); // Save to localStorage
            
            // Create reminder if provided
            if (data.reminder && data.reminder.time) {
              const newReminder: Reminder = {
                id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                taskId: newTask.id,
                reminderTime: data.reminder.time,
                email: data.reminder.email
              };
              
              if (!mockReminders[userId]) mockReminders[userId] = [];
              mockReminders[userId].push(newReminder);
              saveMockReminders(); // Save to localStorage
            }
            
            triggerStateChange();
            
            isPending = false;
            return Promise.resolve({});
          }, 
          isPending: isPending
        };
      }
    },
    update: {
      useMutation: (_options?: any) => ({
        mutate: (data: any) => {
          console.log('Updating task:', data);
          
          // Get current user ID
          const currentUser = localStorage.getItem('user');
          const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
          
          if (mockTasks[userId]) {
            const taskIndex = mockTasks[userId].findIndex(t => t.id === data.id);
            if (taskIndex !== -1) {
              mockTasks[userId][taskIndex] = { ...mockTasks[userId][taskIndex], ...data };
              saveMockTasks(); // Save to localStorage
              triggerStateChange();
            }
          }
          return Promise.resolve();
        },
        isPending: false
      })
    },
    delete: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: (data: any) => {
            if (isPending) return;
            isPending = true;
            
            console.log('Deleting task:', data);
            
            // Get current user ID
            const currentUser = localStorage.getItem('user');
            const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
            
            if (mockTasks[userId]) {
              mockTasks[userId] = mockTasks[userId].filter(t => t.id !== data.id);
              saveMockTasks(); // Save to localStorage
              triggerStateChange();
            }
            
            // Call onSuccess callback
            if (options?.onSuccess) {
              options.onSuccess();
            }
            
            isPending = false;
            return Promise.resolve();
          },
          isPending: isPending
        };
      }
    },
    deleteAll: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: () => {
            if (isPending) return;
            isPending = true;
            
            console.log('Deleting all tasks');
            
            // Get current user ID
            const currentUser = localStorage.getItem('user');
            const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
            
            mockTasks[userId] = [];
            saveMockTasks(); // Save to localStorage
            triggerStateChange();
            
            // Call onSuccess callback
            if (options?.onSuccess) {
              options.onSuccess();
            }
            
            isPending = false;
            return Promise.resolve();
          },
          isPending: isPending
        };
      }
    },
    // Replace all tasks (used by Drive restore)
    replaceAll: {
      useMutation: (_options?: any) => ({
        mutate: (data: { tasks: Task[] }) => {
          // Get current user ID
          const currentUser = localStorage.getItem('user');
          const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
          
          mockTasks[userId] = Array.isArray(data.tasks) ? [...data.tasks] : [];
          saveMockTasks(); // Save to localStorage
          triggerStateChange();
          return Promise.resolve();
        },
        isPending: false 
      })
    },
    rollover: {
      useMutation: (_options?: any) => ({ 
        mutate: (_data: any) => {
          console.log('Rollover tasks:', _data);
          return Promise.resolve({ processed: 0 });
        }, 
        isPending: false 
      })
    }
  },
  reminders: {
    list: {
      useQuery: (_options?: any) => {
        // Get current user ID
        const currentUser = localStorage.getItem('user');
        const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
        
        return {
          data: mockReminders[userId] || [],
          isLoading: false,
          refetch: () => Promise.resolve()
        };
      }
    },
    create: {
      useMutation: (_options?: any) => ({ 
        mutate: (_data: any) => {
          console.log('Creating reminder:', _data);
          return Promise.resolve();
        }, 
        isPending: false 
      })
    },
    update: {
      useMutation: (_options?: any) => ({ 
        mutate: (_data: any) => {
          console.log('Updating reminder:', _data);
          return Promise.resolve();
        }, 
        isPending: false 
      })
    },
    delete: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: (data: any) => {
            if (isPending) return;
            isPending = true;
            
            console.log('Deleting reminder:', data);
            
            // Get current user ID
            const currentUser = localStorage.getItem('user');
            const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
            
            if (mockReminders[userId]) {
              mockReminders[userId] = mockReminders[userId].filter(r => r.id !== data.id);
              saveMockReminders(); // Save to localStorage
              triggerStateChange();
            }
            
            if (options?.onSuccess) {
              options.onSuccess();
            }
            
            isPending = false;
            return Promise.resolve();
          },
          isPending: isPending
        };
      }
    },
    // Replace all reminders (used by Drive restore)
    replaceAll: {
      useMutation: (_options?: any) => ({
        mutate: (data: { reminders: Reminder[] }) => {
          // Get current user ID
          const currentUser = localStorage.getItem('user');
          const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
          
          mockReminders[userId] = Array.isArray(data.reminders) ? [...data.reminders] : [];
          saveMockReminders(); // Save to localStorage
          triggerStateChange();
          return Promise.resolve();
        },
        isPending: false 
      })
    }
  },
  // New mock for user management
  users: {
    list: {
      useQuery: (options?: any) => {
        // Add listener for state changes
        if (options?.onSuccess) {
          listeners.push(options.onSuccess);
        }
        return {
          data: mockUsers,
          isLoading: false,
          refreshCounter,
          refetch: () => {
            notifyListeners();
            return Promise.resolve();
          }
        };
      }
    },
    update: {
      useMutation: (options?: any) => {
        let isPending = false;
        return {
          mutate: (data: { id: string; name?: string; email?: string; role?: 'user' | 'admin'; status?: 'active' | 'inactive' }) => {
            if (isPending) return;
            isPending = true;

            console.log('Updating user:', data);
            const userIndex = mockUsers.findIndex(u => u.id === data.id);
            if (userIndex !== -1) {
              mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
              saveMockUsers(); // Save to localStorage
              triggerStateChange();
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } else {
              if (options?.onError) {
                options.onError(new Error('User not found'));
              }
            }
            isPending = false;
            return Promise.resolve();
          },
          isPending: isPending
        };
      }
    },
    delete: {
      useMutation: (options?: any) => {
        let isPending = false;
        return {
          mutate: (data: { id: string }) => {
            if (isPending) return;
            isPending = true;

            console.log('Deleting user:', data);
            mockUsers = mockUsers.filter(u => u.id !== data.id);
            saveMockUsers(); // Save to localStorage
            triggerStateChange();
            if (options?.onSuccess) {
              options.onSuccess();
            }
            isPending = false;
            return Promise.resolve();
          },
          isPending: isPending
        };
      }
    }
  }
};
