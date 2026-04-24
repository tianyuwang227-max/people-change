import { createMockPayload } from "../_lib/mock-data";
import { ensureDatabase } from "../_lib/db";
import { datesForRecentDays, monthKeysForRecentMonths, startOfWeek, todayInShanghai } from "../_lib/date";

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    ...init,
  });
}

function buildStreaks(definitions: Array<{ slug: string }>, checkins: Array<{ slug: string; check_date: string; completed: number }>, recentDays: string[]) {
  return Object.fromEntries(
    definitions.map((definition) => {
      let streak = 0;
      for (let index = recentDays.length - 1; index >= 0; index -= 1) {
        const found = checkins.find(
          (row) => row.slug === definition.slug && row.check_date === recentDays[index],
        );
        if (!found?.completed) {
          break;
        }
        streak += 1;
      }
      return [definition.slug, streak];
    }),
  );
}

function buildWeeklyRates(definitions: Array<{ slug: string }>, checkins: Array<{ slug: string; check_date: string; completed: number }>, recentWeek: string[]) {
  return Object.fromEntries(
    definitions.map((definition) => {
      const total = recentWeek.filter((day) =>
        checkins.some(
          (row) => row.slug === definition.slug && row.check_date === day && row.completed === 1,
        ),
      ).length;
      return [definition.slug, Math.round((total / recentWeek.length) * 100)];
    }),
  );
}

export const onRequestGet: PagesFunction = async (context) => {
  const db = await ensureDatabase(context.env);

  if (!db) {
    return json(createMockPayload());
  }

  const today = todayInShanghai();
  const weekStart = startOfWeek(today);
  const recent35Days = datesForRecentDays(35, today);
  const recent7Days = recent35Days.slice(-7);
  const monthKeys = monthKeysForRecentMonths(4);

  const [definitionsRes, todayCompletionsRes, recentCheckinsRes, dailyPlanRes, weeklyPlanRes, financeRes, financeGoalsRes, projectCountRes] =
    await Promise.all([
      db.prepare(`SELECT id, slug, name, icon, color, position, is_active as isActive FROM habit_definitions WHERE is_active = 1 ORDER BY position ASC`).all<{
        id: string;
        slug: string;
        name: string;
        icon: string;
        color: string;
        position: number;
        isActive: number;
      }>(),
      db.prepare(
        `SELECT d.slug, c.completed
         FROM habit_checkins c
         JOIN habit_definitions d ON d.id = c.habit_id
         WHERE c.check_date = ?`,
      ).bind(today).all<{ slug: string; completed: number }>(),
      db.prepare(
        `SELECT d.slug, c.check_date, c.completed
         FROM habit_checkins c
         JOIN habit_definitions d ON d.id = c.habit_id
         WHERE c.check_date >= ?`,
      ).bind(recent35Days[0]).all<{ slug: string; check_date: string; completed: number }>(),
      db.prepare(
        `SELECT id, title, completed
         FROM daily_plan_items
         WHERE plan_date = ?
         ORDER BY position ASC`,
      ).bind(today).all<{ id: string; title: string; completed: number }>(),
      db.prepare(
        `SELECT id, title, completed
         FROM weekly_plan_items
         WHERE week_start = ?
         ORDER BY position ASC`,
      ).bind(weekStart).all<{ id: string; title: string; completed: number }>(),
      db.prepare(
        `SELECT month_key, income, expense, savings_progress
         FROM finance_snapshots
         WHERE substr(month_key, 6, 2) IN (${monthKeys.map(() => "?").join(",")})
         ORDER BY month_key ASC`,
      ).bind(...monthKeys).all<{ month_key: string; income: number; expense: number; savings_progress: number }>(),
      db.prepare(
        `SELECT goal_key, current_amount, target_amount
         FROM finance_goals`,
      ).all<{ goal_key: string; current_amount: number; target_amount: number }>(),
      db.prepare(
        `SELECT COUNT(*) as count
         FROM project_entries
         WHERE status = 'active'`,
      ).first<{ count: number }>(),
    ]);

  const definitions = definitionsRes.results.map((row) => ({
    ...row,
    isActive: row.isActive === 1,
  }));
  const todayCompletions = Object.fromEntries(
    definitions.map((definition) => [
      definition.slug,
      todayCompletionsRes.results.some((item) => item.slug === definition.slug && item.completed === 1),
    ]),
  );
  const streaks = buildStreaks(definitions, recentCheckinsRes.results, recent35Days);
  const weeklyRates = buildWeeklyRates(definitions, recentCheckinsRes.results, recent7Days);

  const heatmap = recent35Days.map((date) => {
    const count = recentCheckinsRes.results.filter((row) => row.check_date === date && row.completed === 1).length;
    return {
      date,
      count,
      intensity: Math.min(4, Math.ceil(count / 2)),
    };
  });

  const averageWeeklyCompletion = Math.round(
    Object.values(weeklyRates).reduce((sum, value) => sum + value, 0) / definitions.length,
  );
  const bestStreak = Math.max(...Object.values(streaks));
  const completedHabits = Object.values(todayCompletions).filter(Boolean).length;
  const latestFinance =
    financeRes.results.length > 0
      ? financeRes.results[financeRes.results.length - 1]
      : undefined;
  const annualGoal = financeGoalsRes.results.find((goal) => goal.goal_key === "annual");
  const annualProgress =
    annualGoal && annualGoal.target_amount > 0
      ? Math.round((annualGoal.current_amount / annualGoal.target_amount) * 100)
      : latestFinance?.savings_progress ?? 31;
  const activeProjects = projectCountRes?.count ?? 3;

  return json({
    generatedAt: new Date().toISOString(),
    dashboard: {
      heroStats: [
        {
          label: "今日完成",
          value: `${completedHabits} / ${definitions.length}`,
          detail: "节奏继续向上",
          tone: "gold",
        },
        {
          label: "本周胜率",
          value: `${averageWeeklyCompletion}%`,
          detail: "执行稳定增长",
          tone: "teal",
        },
        {
          label: "最佳连击",
          value: `${bestStreak} 天`,
          detail: "长期行为最值得守",
          tone: "orange",
        },
        {
          label: "储蓄进度",
          value: `${annualProgress}%`,
          detail: "给财务模块一个起点",
          tone: "slate",
        },
      ],
      todaySummary: {
        completedHabits,
        totalHabits: definitions.length,
        weeklyCompletion: averageWeeklyCompletion,
        bestStreak,
        activeProjects,
        savingsProgress: annualProgress,
      },
      timeBlocks: [
        { id: "tb-1", time: "06:30 - 07:00", title: "晨间启动 + 早起复位", energy: "恢复", lane: "生活" },
        { id: "tb-2", time: "08:30 - 10:30", title: "React 学习冲刺", energy: "专注", lane: "学习" },
        { id: "tb-3", time: "14:00 - 16:00", title: "逆命者首页开发", energy: "推进", lane: "执行" },
        { id: "tb-4", time: "22:00 - 22:30", title: "读书 + 复盘预热", energy: "恢复", lane: "生活" },
      ],
      weeklyGoals: [
        { id: "g1", title: "完成 Dashboard 与习惯模块", progress: 72, target: "本周 MVP" },
        { id: "g2", title: "连续 5 天 6:30 前起床", progress: 60, target: "自律节奏" },
        { id: "g3", title: "本周输出 1 个可展示项目", progress: 45, target: "作品沉淀" },
      ],
      financeTrend: financeRes.results.map((entry) => ({
        month: entry.month_key.slice(-2),
        income: entry.income,
        expense: entry.expense,
      })),
      terminalLog: [
        "[10:24:17] scanning willpower.core ... ready",
        "[10:24:19] habit engine synced with D1 cache",
        "[10:24:23] warning: future-self feedback loop below desired threshold",
        "[10:24:24] action: rebuild momentum from today's first completed block",
      ],
    },
    habits: {
      definitions,
      todayDate: today,
      completions: todayCompletions,
      streaks,
      weeklyRates,
      heatmap,
      dailyPlan: dailyPlanRes.results.map((item) => ({
        id: item.id,
        title: item.title,
        completed: item.completed === 1,
      })),
      weeklyPlan: weeklyPlanRes.results.map((item) => ({
        id: item.id,
        title: item.title,
        completed: item.completed === 1,
      })),
    },
  });
};
