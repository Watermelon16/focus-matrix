import { getDb } from "./db";
import { tasks } from "../drizzle/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";

export async function getStatsForPeriod(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  const db = await getDb();
  if (!db) return { total: 0, completed: 0, pending: 0, completionRate: 0, byPriority: { UI: { total: 0, completed: 0 }, UNI: { total: 0, completed: 0 }, NUI: { total: 0, completed: 0 }, NUNI: { total: 0, completed: 0 } } };
  
  const userIdInt = parseInt(userId);
  const userTasks = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userIdInt),
        gte(tasks.dueDate, startDate),
        lte(tasks.dueDate, endDate)
      )
    );

  const total = userTasks.length;
  const completed = userTasks.filter((t: any) => t.completed === 1).length;
  const pending = total - completed;

  const byPriority = {
    UI: userTasks.filter((t: any) => t.priority === "UI"),
    UNI: userTasks.filter((t: any) => t.priority === "UNI"),
    NUI: userTasks.filter((t: any) => t.priority === "NUI"),
    NUNI: userTasks.filter((t: any) => t.priority === "NUNI"),
  };

  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  return {
    total,
    completed,
    pending,
    completionRate: Math.round(completionRate * 10) / 10,
    byPriority: {
      UI: {
        total: byPriority.UI.length,
        completed: byPriority.UI.filter((t: any) => t.completed === 1).length,
      },
      UNI: {
        total: byPriority.UNI.length,
        completed: byPriority.UNI.filter((t: any) => t.completed === 1).length,
      },
      NUI: {
        total: byPriority.NUI.length,
        completed: byPriority.NUI.filter((t: any) => t.completed === 1).length,
      },
      NUNI: {
        total: byPriority.NUNI.length,
        completed: byPriority.NUNI.filter((t: any) => t.completed === 1).length,
      },
    },
  };
}

export async function getDailyStats(userId: string, days: number) {
  const db = await getDb();
  if (!db) return [];
  
  const userIdInt = parseInt(userId);
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const result = await db
    .select({
      date: sql<string>`DATE(due_date)`,
      total: sql<number>`COUNT(*)`,
      completed: sql<number>`SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END)`,
    })
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userIdInt),
        gte(tasks.dueDate, cutoffDate)
      )
    )
    .groupBy(sql`DATE(due_date)`)
    .orderBy(sql`DATE(due_date)`);

  return result;
}

export async function getProductivityScore(userId: string, days: number) {
  const stats = await getDailyStats(userId, days);
  
  if (stats.length === 0) return 0;

  const totalCompleted = stats.reduce((sum: number, day: any) => sum + Number(day.completed), 0);
  const totalTasks = stats.reduce((sum: number, day: any) => sum + Number(day.total), 0);
  
  const completionRate = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;
  
  // Score based on completion rate and consistency
  const consistency = stats.length / days; // How many days had tasks
  const score = (completionRate * 0.7 + consistency * 100 * 0.3);
  
  return Math.round(score);
}

export async function getStreak(userId: string) {
  const dailyStats = await getDailyStats(userId, 365);
  
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const dayStat = dailyStats.find((s: any) => s.date === dateStr);
    
    if (dayStat && Number(dayStat.completed) > 0) {
      tempStreak++;
      if (i === 0) currentStreak = tempStreak;
    } else {
      if (tempStreak > maxStreak) maxStreak = tempStreak;
      tempStreak = 0;
    }
  }
  
  if (tempStreak > maxStreak) maxStreak = tempStreak;
  
  return { currentStreak, maxStreak };
}

