import type { Task, Reminder } from '@/types';

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
      useQuery: (_options?: any) => ({ 
        data: [
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
        ] as Task[], 
        isLoading: false, 
        refetch: () => Promise.resolve() 
      })
    },
    create: {
      useMutation: (_options?: any) => ({ 
        mutate: (_data: any) => {
          console.log('Creating task:', _data);
          return Promise.resolve();
        }, 
        mutateAsync: (_data: any) => {
          console.log('Creating task async:', _data);
          return Promise.resolve({});
        }, 
        isPending: false 
      })
    },
    update: {
      useMutation: (_options?: any) => ({ 
        mutate: (_data: any) => {
          console.log('Updating task:', _data);
          return Promise.resolve();
        }, 
        isPending: false 
      })
    },
    delete: {
      useMutation: (_options?: any) => ({ 
        mutate: (_data: any) => {
          console.log('Deleting task:', _data);
          return Promise.resolve();
        }, 
        isPending: false 
      })
    },
    deleteAll: {
      useMutation: (_options?: any) => ({ 
        mutate: () => {
          console.log('Deleting all tasks');
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
      useQuery: (_options?: any) => ({ 
        data: [
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
        ] as Reminder[], 
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
      useMutation: (_options?: any) => ({ 
        mutate: (_data: any) => {
          console.log('Deleting reminder:', _data);
          return Promise.resolve();
        }, 
        isPending: false 
      })
    }
  }
};
