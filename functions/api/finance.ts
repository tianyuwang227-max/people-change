import { DEFAULT_FINANCE_ENTRIES, DEFAULT_FINANCE_GOALS } from "../_lib/constants";
import { ensureDatabase } from "../_lib/db";
import { buildFinanceAdvice } from "../_lib/finance";
import { todayInShanghai } from "../_lib/date";

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    ...init,
  });
}

function getFallbackPayload() {
  const trends = [
    { month: "01", income: 7200, expense: 4600 },
    { month: "02", income: 8400, expense: 5100 },
    { month: "03", income: 9100, expense: 5600 },
    { month: "04", income: 10200, expense: 5898 },
  ];
  const monthIncome = trends[trends.length - 1].income;
  const monthExpense = trends[trends.length - 1].expense;
  const goals = DEFAULT_FINANCE_GOALS.map((goal) => ({
    id: `finance-goal-${goal.key}`,
    key: goal.key,
    title: goal.title,
    currentAmount: goal.currentAmount,
    targetAmount: goal.targetAmount,
    progress: Math.round((goal.currentAmount / goal.targetAmount) * 100),
    targetDate: goal.targetDate,
  }));
  const expenseEntries = DEFAULT_FINANCE_ENTRIES.filter((entry) => entry.type === "expense");
  const totalExpense = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return {
    currency: "CNY" as const,
    summary: {
      monthIncome,
      monthExpense,
      balance: monthIncome - monthExpense,
      savingsRate: Math.round(((monthIncome - monthExpense) / monthIncome) * 100),
      annualGoalProgress: goals.find((goal) => goal.key === "annual")?.progress ?? 0,
      threeYearGoalProgress: goals.find((goal) => goal.key === "three-year")?.progress ?? 0,
    },
    trends,
    breakdown: ["固定支出", "恋爱开销", "工具订阅", "成长投入", "日常支出"].map((category) => {
      const amount = expenseEntries
        .filter((entry) => entry.category === category)
        .reduce((sum, entry) => sum + entry.amount, 0);
      return {
        category,
        amount,
        share: totalExpense === 0 ? 0 : Math.round((amount / totalExpense) * 100),
      };
    }),
    records: DEFAULT_FINANCE_ENTRIES.map((entry, index) => ({
      id: `finance-entry-${index}`,
      entryDate: entry.entryDate,
      title: entry.title,
      category: entry.category,
      type: entry.type,
      amount: entry.amount,
      note: entry.note,
    })),
    goals,
    advice: buildFinanceAdvice(
      DEFAULT_FINANCE_ENTRIES.map((entry) => ({
        category: entry.category,
        type: entry.type,
        amount: entry.amount,
      })),
      DEFAULT_FINANCE_GOALS.map((goal) => ({
        key: goal.key,
        currentAmount: goal.currentAmount,
        targetAmount: goal.targetAmount,
      })),
    ),
  };
}

export const onRequestGet: PagesFunction = async (context) => {
  const db = await ensureDatabase(context.env);
  if (!db) {
    return json(getFallbackPayload());
  }

  const currentMonth = todayInShanghai().slice(0, 7);
  const [snapshotRes, entriesRes, goalsRes] = await Promise.all([
    db.prepare(
      `SELECT month_key, income, expense, savings_progress
       FROM finance_snapshots
       ORDER BY month_key ASC
       LIMIT 12`,
    ).all<{ month_key: string; income: number; expense: number; savings_progress: number }>(),
    db.prepare(
      `SELECT id, entry_date, title, category, type, amount, note
       FROM finance_entries
       WHERE entry_month = ?
       ORDER BY entry_date DESC, amount DESC`,
    ).bind(currentMonth).all<{
      id: string;
      entry_date: string;
      title: string;
      category: string;
      type: "income" | "expense";
      amount: number;
      note: string;
    }>(),
    db.prepare(
      `SELECT id, goal_key, title, current_amount, target_amount, target_date
       FROM finance_goals
       ORDER BY created_at ASC`,
    ).all<{
      id: string;
      goal_key: string;
      title: string;
      current_amount: number;
      target_amount: number;
      target_date: string;
    }>(),
  ]);

  const trends = snapshotRes.results.map((entry) => ({
    month: entry.month_key.slice(-2),
    income: entry.income,
    expense: entry.expense,
  }));
  const latest = snapshotRes.results.length > 0 ? snapshotRes.results[snapshotRes.results.length - 1] : undefined;
  const goals = goalsRes.results.map((goal) => ({
    id: goal.id,
    key: goal.goal_key,
    title: goal.title,
    currentAmount: goal.current_amount,
    targetAmount: goal.target_amount,
    progress: goal.target_amount === 0 ? 0 : Math.round((goal.current_amount / goal.target_amount) * 100),
    targetDate: goal.target_date,
  }));
  const expenseEntries = entriesRes.results.filter((entry) => entry.type === "expense");
  const totalExpense = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const categories = ["固定支出", "恋爱开销", "工具订阅", "成长投入", "日常支出"];

  return json({
    currency: "CNY",
    summary: {
      monthIncome: latest?.income ?? 0,
      monthExpense: latest?.expense ?? 0,
      balance: (latest?.income ?? 0) - (latest?.expense ?? 0),
      savingsRate:
        latest && latest.income > 0
          ? Math.round(((latest.income - latest.expense) / latest.income) * 100)
          : 0,
      annualGoalProgress: goals.find((goal) => goal.key === "annual")?.progress ?? 0,
      threeYearGoalProgress: goals.find((goal) => goal.key === "three-year")?.progress ?? 0,
    },
    trends,
    breakdown: categories.map((category) => {
      const amount = expenseEntries
        .filter((entry) => entry.category === category)
        .reduce((sum, entry) => sum + entry.amount, 0);
      return {
        category,
        amount,
        share: totalExpense === 0 ? 0 : Math.round((amount / totalExpense) * 100),
      };
    }),
    records: entriesRes.results.map((entry) => ({
      id: entry.id,
      entryDate: entry.entry_date,
      title: entry.title,
      category: entry.category,
      type: entry.type,
      amount: entry.amount,
      note: entry.note,
    })),
    goals,
    advice: buildFinanceAdvice(
      entriesRes.results.map((entry) => ({
        category: entry.category,
        type: entry.type,
        amount: entry.amount,
      })),
      goals.map((goal) => ({
        key: goal.key,
        currentAmount: goal.currentAmount,
        targetAmount: goal.targetAmount,
      })),
    ),
  });
};
