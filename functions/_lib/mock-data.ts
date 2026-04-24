import { DEFAULT_DAILY_PLAN, DEFAULT_HABITS, DEFAULT_WEEKLY_PLAN } from "./constants";
import { datesForRecentDays, monthKeysForRecentMonths, todayInShanghai } from "./date";

function isCompleted(slug: string, date: string) {
  const [, , dayString] = date.split("-");
  const day = Number(dayString);

  if (slug === "fitness") {
    return day % 2 === 0 || day % 5 === 0;
  }
  if (slug === "editing") {
    return day % 4 === 0;
  }
  if (slug === "wake-early") {
    return day % 6 !== 0;
  }
  if (slug === "project") {
    return day % 3 !== 0;
  }
  return day % 5 !== 0;
}

function getCurrentStreak(slug: string, days: string[]) {
  let streak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (!isCompleted(slug, days[index])) {
      break;
    }
    streak += 1;
  }
  return streak;
}

function getWeeklyRate(slug: string, days: string[]) {
  const total = days.filter((day) => isCompleted(slug, day)).length;
  return Math.round((total / days.length) * 100);
}

export function createMockPayload() {
  const today = todayInShanghai();
  const recent35Days = datesForRecentDays(35, today);
  const recent7Days = recent35Days.slice(-7);

  const completions = Object.fromEntries(
    DEFAULT_HABITS.map((habit) => [habit.slug, isCompleted(habit.slug, today)]),
  );

  return {
    generatedAt: new Date().toISOString(),
    dashboard: {
      heroStats: [
        { label: "今日完成", value: `${Object.values(completions).filter(Boolean).length} / ${DEFAULT_HABITS.length}`, detail: "节奏继续向上", tone: "gold" },
        { label: "本周胜率", value: `${Math.round(DEFAULT_HABITS.reduce((sum, habit) => sum + getWeeklyRate(habit.slug, recent7Days), 0) / DEFAULT_HABITS.length)}%`, detail: "执行稳定增长", tone: "teal" },
        { label: "最佳连击", value: `${Math.max(...DEFAULT_HABITS.map((habit) => getCurrentStreak(habit.slug, recent35Days)))} 天`, detail: "长期行为最值得守", tone: "orange" },
        { label: "储蓄进度", value: "31%", detail: "给财务模块一个起点", tone: "slate" },
      ],
      todaySummary: {
        completedHabits: Object.values(completions).filter(Boolean).length,
        totalHabits: DEFAULT_HABITS.length,
        weeklyCompletion: Math.round(DEFAULT_HABITS.reduce((sum, habit) => sum + getWeeklyRate(habit.slug, recent7Days), 0) / DEFAULT_HABITS.length),
        bestStreak: Math.max(...DEFAULT_HABITS.map((habit) => getCurrentStreak(habit.slug, recent35Days))),
        activeProjects: 3,
        savingsProgress: 31,
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
      financeTrend: monthKeysForRecentMonths(4).map((month, index) => ({
        month,
        income: 7200 + index * 900,
        expense: 4600 + index * 450,
      })),
      terminalLog: [
        "[10:24:17] scanning willpower.core ... ready",
        "[10:24:19] habit engine synced with D1 cache",
        "[10:24:23] warning: future-self feedback loop below desired threshold",
        "[10:24:24] action: rebuild momentum from today's first completed block",
      ],
    },
    habits: {
      definitions: DEFAULT_HABITS.map((habit) => ({
        id: `habit-${habit.slug}`,
        slug: habit.slug,
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        position: habit.position,
        isActive: true,
      })),
      todayDate: today,
      completions,
      streaks: Object.fromEntries(
        DEFAULT_HABITS.map((habit) => [habit.slug, getCurrentStreak(habit.slug, recent35Days)]),
      ),
      weeklyRates: Object.fromEntries(
        DEFAULT_HABITS.map((habit) => [habit.slug, getWeeklyRate(habit.slug, recent7Days)]),
      ),
      heatmap: recent35Days.map((date) => {
        const count = DEFAULT_HABITS.filter((habit) => isCompleted(habit.slug, date)).length;
        return {
          date,
          count,
          intensity: Math.min(4, Math.ceil(count / 2)),
        };
      }),
      dailyPlan: DEFAULT_DAILY_PLAN.map((title, index) => ({
        id: `daily-${index + 1}`,
        title,
        completed: index !== 1,
      })),
      weeklyPlan: DEFAULT_WEEKLY_PLAN.map((title, index) => ({
        id: `weekly-${index + 1}`,
        title,
        completed: index === 0,
      })),
    },
  };
}
