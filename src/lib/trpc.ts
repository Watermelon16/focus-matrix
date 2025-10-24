import type { Task, Reminder } from '@/types';
import { userService, taskService, reminderService } from './firebaseService';

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

// Firebase user interface (imported from firebaseService)

// Firebase-powered tRPC
export const trpc = {
  auth: {
    // Placeholder for future backend; currently front-end only
    getGoogleDriveToken: {
      useMutation: (_options?: any) => ({
        mutateAsync: async (_data: any) => ({ accessToken: '' }),
        isPending: false,
      })
    },
    // Firebase auth mutations
    login: {
      useMutation: (options?: any) => {
        let isPending = false;
        return {
          mutate: async (data: { email: string; password: string }) => {
            if (isPending) return;
            isPending = true;

            try {
              console.log('Firebase login attempt:', data);
              const users = await userService.getAllUsers();
              const user = users.find(u => u.email === data.email && u.passwordHash === data.password);
              
              if (user) {
                console.log('Firebase login success for:', user.email);
                if (options?.onSuccess) {
                  options.onSuccess(user);
                }
              } else {
                console.log('Firebase login failed for:', data.email);
                if (options?.onError) {
                  options.onError(new Error('Invalid credentials'));
                }
              }
            } catch (error) {
              console.error('Firebase login error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            isPending = false;
          },
          isPending: isPending
        };
      }
    },
    register: {
      useMutation: (options?: any) => {
        let isPending = false;
        return {
          mutate: async (data: { name: string; email: string; password: string }) => {
            if (isPending) return;
            isPending = true;

            try {
              console.log('Firebase register attempt:', data);
              const users = await userService.getAllUsers();
              const existingUser = users.find(u => u.email === data.email);
              
              if (existingUser) {
                console.log('Firebase register failed: User already exists', data.email);
                if (options?.onError) {
                  options.onError(new Error('User with this email already exists'));
                }
              } else {
                const newUser = {
                  name: data.name,
                  email: data.email,
                  role: 'user' as const,
                  status: 'active' as const,
                  joinedAt: new Date().toISOString(),
                };
                
                const userId = await userService.createUser(newUser);
                const createdUser = { id: userId, ...newUser };
                
                triggerStateChange(); // Trigger refresh for admin dashboard
                console.log('Firebase register success for:', createdUser.email);
                if (options?.onSuccess) {
                  options.onSuccess(createdUser);
                }
              }
            } catch (error) {
              console.error('Firebase register error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            isPending = false;
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
        
        // Initialize with empty data, will be populated by real-time listener
        let currentData: Task[] = [];
        
        const unsubscribe = taskService.onUserTasksChange(userId, (tasks) => {
          currentData = tasks;
          if (options?.onSuccess) {
            options.onSuccess(tasks);
          }
          triggerStateChange();
        });
        
        return {
          data: currentData,
          isLoading: false,
          refreshCounter,
          refetch: () => {
            triggerStateChange();
            return Promise.resolve();
          },
          unsubscribe // For cleanup
        };
      }
    },
    create: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: async (data: any) => {
            if (isPending) return;
            isPending = true;
            
            try {
              console.log('Firebase creating task:', data);
              
              // Get current user ID
              const currentUser = localStorage.getItem('user');
              const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
              
              const newTask: Omit<Task, 'id'> & { userId: string } = {
                title: data.title,
                notes: data.notes || '',
                createdAt: new Date().toISOString(),
                dueDate: data.dueDate,
                priority: data.priority,
                completed: false,
                rolloverCount: 0,
                taskType: data.taskType || 'work',
                userId: userId
              };
              
              const taskId = await taskService.createTask(newTask);
              
              // Create reminder if provided
              if (data.reminder && data.reminder.time) {
                const newReminder: Omit<Reminder, 'id'> & { userId: string } = {
                  taskId: taskId,
                  reminderTime: data.reminder.time,
                  email: data.reminder.email,
                  userId: userId
                };
                
                await reminderService.createReminder(newReminder);
              }
              
              triggerStateChange();
              
              // Call onSuccess callback
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } catch (error) {
              console.error('Firebase create task error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            
            isPending = false;
          }, 
          mutateAsync: async (data: any) => {
            if (isPending) return Promise.resolve({});
            isPending = true;
            
            try {
              console.log('Firebase creating task async:', data);
              
              // Get current user ID
              const currentUser = localStorage.getItem('user');
              const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
              
              const newTask: Omit<Task, 'id'> & { userId: string } = {
                title: data.title,
                notes: data.notes || '',
                createdAt: new Date().toISOString(),
                dueDate: data.dueDate,
                priority: data.priority,
                completed: false,
                rolloverCount: 0,
                taskType: data.taskType || 'work',
                userId: userId
              };
              
              const taskId = await taskService.createTask(newTask);
              
              // Create reminder if provided
              if (data.reminder && data.reminder.time) {
                const newReminder: Omit<Reminder, 'id'> & { userId: string } = {
                  taskId: taskId,
                  reminderTime: data.reminder.time,
                  email: data.reminder.email,
                  userId: userId
                };
                
                await reminderService.createReminder(newReminder);
              }
              
              triggerStateChange();
              
              // Call onSuccess callback
              if (options?.onSuccess) {
                options.onSuccess();
              }
              
              return Promise.resolve();
            } catch (error) {
              console.error('Firebase create task async error:', error);
              if (options?.onError) {
                options.onError(error);
              }
              return Promise.reject(error);
            } finally {
              isPending = false;
            }
          },
          isPending: isPending
        };
      }
    },
    update: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: async (data: { id: string; [key: string]: any }) => {
            if (isPending) return;
            isPending = true;
            
            try {
              console.log('Firebase updating task:', data);
              await taskService.updateTask(data.id, data);
              triggerStateChange();
              
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } catch (error) {
              console.error('Firebase update task error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            
            isPending = false;
          },
          isPending: isPending
        };
      }
    },
    delete: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: async (data: { id: string }) => {
            if (isPending) return;
            isPending = true;
            
            try {
              console.log('Firebase deleting task:', data);
              await taskService.deleteTask(data.id);
              triggerStateChange();
              
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } catch (error) {
              console.error('Firebase delete task error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            
            isPending = false;
          },
          isPending: isPending
        };
      }
    },
    deleteAll: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: async () => {
            if (isPending) return;
            isPending = true;
            
            try {
              console.log('Firebase deleting all tasks');
              const currentUser = localStorage.getItem('user');
              const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
              
              await taskService.deleteAllUserTasks(userId);
              await reminderService.deleteAllUserReminders(userId);
              triggerStateChange();
              
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } catch (error) {
              console.error('Firebase delete all tasks error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            
            isPending = false;
          },
          isPending: isPending
        };
      }
    },
    replaceAll: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: async (data: { tasks: Task[] }) => {
            if (isPending) return;
            isPending = true;
            
            try {
              console.log('Firebase replacing all tasks:', data);
              const currentUser = localStorage.getItem('user');
              const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
              
              await taskService.replaceUserTasks(userId, data.tasks);
              triggerStateChange();
              
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } catch (error) {
              console.error('Firebase replace all tasks error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            
            isPending = false;
          },
          isPending: isPending
        };
      }
    }
  },
  reminders: {
    list: {
      useQuery: (options?: any) => {
        // Add listener for state changes
        if (options?.onSuccess) {
          listeners.push(options.onSuccess);
        }
        
        // Get current user ID from localStorage
        const currentUser = localStorage.getItem('user');
        const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
        
        // Initialize with empty data, will be populated by real-time listener
        let currentData: Reminder[] = [];
        
        const unsubscribe = reminderService.onUserRemindersChange(userId, (reminders) => {
          currentData = reminders;
          if (options?.onSuccess) {
            options.onSuccess(reminders);
          }
          triggerStateChange();
        });
        
        return {
          data: currentData,
          isLoading: false,
          refetch: () => Promise.resolve(),
          unsubscribe // For cleanup
        };
      }
    },
    create: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: async (data: any) => {
            if (isPending) return;
            isPending = true;
            
            try {
              console.log('Firebase creating reminder:', data);
              const currentUser = localStorage.getItem('user');
              const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
              
              const newReminder: Omit<Reminder, 'id'> & { userId: string } = {
                taskId: data.taskId,
                reminderTime: data.reminderTime,
                email: data.email,
                userId: userId
              };
              
              await reminderService.createReminder(newReminder);
              triggerStateChange();
              
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } catch (error) {
              console.error('Firebase create reminder error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            
            isPending = false;
          },
          isPending: isPending
        };
      }
    },
    update: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: async (data: { id: string; [key: string]: any }) => {
            if (isPending) return;
            isPending = true;
            
            try {
              console.log('Firebase updating reminder:', data);
              await reminderService.updateReminder(data.id, data);
              triggerStateChange();
              
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } catch (error) {
              console.error('Firebase update reminder error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            
            isPending = false;
          },
          isPending: isPending
        };
      }
    },
    delete: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: async (data: { id: string }) => {
            if (isPending) return;
            isPending = true;
            
            try {
              console.log('Firebase deleting reminder:', data);
              await reminderService.deleteReminder(data.id);
              triggerStateChange();
              
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } catch (error) {
              console.error('Firebase delete reminder error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            
            isPending = false;
          },
          isPending: isPending
        };
      }
    },
    replaceAll: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: async (data: { reminders: Reminder[] }) => {
            if (isPending) return;
            isPending = true;
            
            try {
              console.log('Firebase replacing all reminders:', data);
              const currentUser = localStorage.getItem('user');
              const userId = currentUser ? JSON.parse(currentUser).id : 'anonymous';
              
              await reminderService.replaceUserReminders(userId, data.reminders);
              triggerStateChange();
              
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } catch (error) {
              console.error('Firebase replace all reminders error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            
            isPending = false;
          },
          isPending: isPending
        };
      }
    }
  },
  users: {
    list: {
      useQuery: (options?: any) => {
        // Add listener for state changes
        if (options?.onSuccess) {
          listeners.push(options.onSuccess);
        }
        
        // Initialize with empty data, will be populated by real-time listener
        let currentData: any[] = [];
        
        const unsubscribe = userService.onUsersChange((users) => {
          currentData = users;
          if (options?.onSuccess) {
            options.onSuccess(users);
          }
          triggerStateChange();
        });
        
        return {
          data: currentData,
          isLoading: false,
          refetch: () => Promise.resolve(),
          unsubscribe // For cleanup
        };
      }
    },
    update: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: async (data: { id: string; [key: string]: any }) => {
            if (isPending) return;
            isPending = true;
            
            try {
              console.log('Firebase updating user:', data);
              await userService.updateUser(data.id, data);
              triggerStateChange();
              
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } catch (error) {
              console.error('Firebase update user error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            
            isPending = false;
          },
          isPending: isPending
        };
      }
    },
    delete: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: async (data: { id: string }) => {
            if (isPending) return;
            isPending = true;
            
            try {
              console.log('Firebase deleting user:', data);
              await userService.deleteUser(data.id);
              triggerStateChange();
              
              if (options?.onSuccess) {
                options.onSuccess();
              }
            } catch (error) {
              console.error('Firebase delete user error:', error);
              if (options?.onError) {
                options.onError(error);
              }
            }
            
            isPending = false;
          },
          isPending: isPending
        };
      }
    }
  }
};
