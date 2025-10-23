import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { db } from '../db';
import type { Task } from '../types';

const t = initTRPC.create();

export const appRouter = t.router({
  tasks: t.router({
    list: t.procedure.query(async () => {
      return await db.tasks.toArray();
    }),
    create: t.procedure
      .input(z.object({
        title: z.string(),
        notes: z.string().optional(),
        dueDate: z.string().optional(),
        priority: z.enum(['UI', 'UNI', 'NUI', 'NUNI']),
      }))
      .mutation(async ({ input }) => {
        const task: Task = {
          id: crypto.randomUUID(),
          title: input.title,
          notes: input.notes,
          dueDate: input.dueDate,
          priority: input.priority,
          completed: false,
          createdAt: new Date().toISOString(),
          rolloverCount: 0,
        };
        await db.tasks.add(task);
        return task;
      }),
    update: t.procedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        notes: z.string().optional(),
        dueDate: z.string().optional(),
        priority: z.enum(['UI', 'UNI', 'NUI', 'NUNI']).optional(),
        completed: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.tasks.update(id, updates);
        return await db.tasks.get(id);
      }),
    delete: t.procedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.tasks.delete(input.id);
        return { success: true };
      }),
    deleteAll: t.procedure
      .mutation(async () => {
        await db.tasks.clear();
        return { success: true };
      }),
    rollover: t.procedure
      .input(z.object({ now: z.string() }))
      .mutation(async ({ input }) => {
        const now = new Date(input.now);
        const today = now.toISOString().split('T')[0];
        
        const allTasks = await db.tasks.toArray();
        const incompleteTasks = allTasks.filter(task => 
          !task.completed && 
          task.dueDate && 
          task.dueDate < today
        );
        
        let processed = 0;
        for (const task of incompleteTasks) {
          await db.tasks.update(task.id, {
            rolloverCount: task.rolloverCount + 1,
            dueDate: now.toISOString(),
          });
          processed++;
        }
        
        return { processed };
      }),
  }),
  reminders: t.router({
    list: t.procedure.query(async () => {
      return await db.reminders.toArray();
    }),
    create: t.procedure
      .input(z.object({
        taskId: z.string(),
        reminderTime: z.string(),
        email: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const reminder = {
          id: crypto.randomUUID(),
          taskId: input.taskId,
          reminderTime: input.reminderTime,
          email: input.email,
        };
        await db.reminders.add(reminder);
        return reminder;
      }),
    delete: t.procedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.reminders.delete(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
