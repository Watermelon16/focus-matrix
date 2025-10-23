import { and, desc, eq, gte, lt, lte } from "drizzle-orm";
import { tasks, type InsertTask } from "../drizzle/schema";
import { getDb } from "./db";

export async function createTask(task: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(tasks).values(task);
  return task;
}

export async function getUserTasks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt));
}

export async function getTasksByDay(userId: number, dateISO: string) {
  const db = await getDb();
  if (!db) return [];
  
  const startOfDay = new Date(dateISO);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(dateISO);
  endOfDay.setHours(23, 59, 59, 999);
  
  return await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        gte(tasks.dueDate, startOfDay),
        lte(tasks.dueDate, endOfDay)
      )
    )
    .orderBy(tasks.dueDate);
}

export async function getOverdueTasks(userId: number, nowISO: string) {
  const db = await getDb();
  if (!db) return [];
  
  const now = new Date(nowISO);
  
  return await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.completed, 0),
        lt(tasks.dueDate, now)
      )
    )
    .orderBy(tasks.dueDate);
}

export async function updateTask(taskId: string, userId: number, updates: Partial<InsertTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(tasks)
    .set(updates)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}

export async function deleteTask(taskId: string, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}

export async function markTaskDone(taskId: string, userId: number, done: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(tasks)
    .set({
      completed: done ? 1 : 0,
      completedAt: done ? new Date() : null,
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}

export async function movePriority(taskId: string, userId: number, priority: "UI" | "UNI" | "NUI" | "NUNI") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(tasks)
    .set({ priority })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}



export async function deleteAllUserTasks(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(tasks).where(eq(tasks.userId, userId));
  return { success: true };
}

