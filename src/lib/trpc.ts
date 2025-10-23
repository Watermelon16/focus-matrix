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

// Mock state storage
let mockTasks: Task[] = [
  {
    id: 'demo-1',
    title: 'Hoàn thành báo cáo tháng 12',
    notes: 'Báo cáo tài chính và kế hoạch năm 2024',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    priority: 'UI' as const,
    completed: false,
    rolloverCount: 0
  },
  {
    id: 'demo-2',
    title: 'Lập kế hoạch marketing Q1',
    notes: 'Chiến lược marketing cho quý 1 năm 2024',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    priority: 'UNI' as const,
    completed: false,
    rolloverCount: 0
  },
  {
    id: 'demo-3',
    title: 'Trả lời email khách hàng',
    notes: 'Phản hồi các câu hỏi từ khách hàng',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    priority: 'NUI' as const,
    completed: false,
    rolloverCount: 0
  },
  {
    id: 'demo-4',
    title: 'Dọn dẹp email cũ',
    notes: 'Xóa các email không cần thiết',
    createdAt: new Date().toISOString(),
    priority: 'NUNI' as const,
    completed: true,
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    rolloverCount: 0
  }
];

let mockReminders: Reminder[] = [
  {
    id: 'reminder-1',
    taskId: 'demo-1',
    reminderTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    email: 'demo@example.com'
  },
  {
    id: 'reminder-2',
    taskId: 'demo-2',
    reminderTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    email: 'demo@example.com'
  }
];

// Mock tRPC for now - in a real app you'd use actual tRPC
export const trpc = {
  auth: {
    // Placeholder for future backend; currently front-end only
    getGoogleDriveToken: {
      useMutation: (_options?: any) => ({
        mutateAsync: async (_data: any) => ({ accessToken: '' }),
        isPending: false,
      })
    }
  },
  tasks: {
    list: {
      useQuery: (options?: any) => {
        // Add listener for state changes
        if (options?.onSuccess) {
          listeners.push(options.onSuccess);
        }
        
        return {
          data: mockTasks, 
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
              rolloverCount: 0
            };
            mockTasks.push(newTask);
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
              rolloverCount: 0
            };
            mockTasks.push(newTask);
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
          const taskIndex = mockTasks.findIndex(t => t.id === data.id);
          if (taskIndex !== -1) {
            mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...data };
            triggerStateChange();
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
            mockTasks = mockTasks.filter(t => t.id !== data.id);
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
    deleteAll: {
      useMutation: (options?: any) => {
        let isPending = false;
        
        return {
          mutate: () => {
            if (isPending) return;
            isPending = true;
            
            console.log('Deleting all tasks');
            mockTasks = [];
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
      useQuery: (_options?: any) => ({
        data: mockReminders,
        isLoading: false,
        refetch: () => Promise.resolve()
      })
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
            mockReminders = mockReminders.filter(r => r.id !== data.id);
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
