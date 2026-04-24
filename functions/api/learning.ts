import { DEFAULT_LEARNING_BLOCKS, DEFAULT_LEARNING_TODOS, DEFAULT_LEARNING_WEEKLY_GOALS } from "../_lib/constants";
import { ensureDatabase } from "../_lib/db";
import { startOfWeek, todayInShanghai } from "../_lib/date";

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    ...init,
  });
}

function minutesBetween(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
}

function createFallbackPayload() {
  const today = todayInShanghai();
  const weekStart = startOfWeek(today);
  const completedTodos = DEFAULT_LEARNING_TODOS.filter((_, index) => index === 0).length;
  const focusMinutes = DEFAULT_LEARNING_BLOCKS.filter((block) => block.energy === "专注" || block.energy === "推进")
    .reduce((sum, block) => sum + minutesBetween(block.startTime, block.endTime), 0);

  return {
    todayDate: today,
    blocks: DEFAULT_LEARNING_BLOCKS.map((block, index) => ({
      id: `learning-block-${index}`,
      date: today,
      startTime: block.startTime,
      endTime: block.endTime,
      title: block.title,
      lane: block.lane,
      energy: block.energy,
      status: block.status,
      notes: block.notes,
    })),
    todos: DEFAULT_LEARNING_TODOS.map((title, index) => ({
      id: `learning-todo-${index}`,
      title,
      completed: index === 0,
    })),
    weeklyGoals: DEFAULT_LEARNING_WEEKLY_GOALS.map((goal, index) => ({
      id: `learning-goal-${weekStart}-${index}`,
      title: goal.title,
      target: goal.target,
      progress: goal.progress,
    })),
    summary: {
      focusMinutes,
      completedTodos,
      totalTodos: DEFAULT_LEARNING_TODOS.length,
      averageGoalProgress: Math.round(
        DEFAULT_LEARNING_WEEKLY_GOALS.reduce((sum, goal) => sum + goal.progress, 0) /
          DEFAULT_LEARNING_WEEKLY_GOALS.length,
      ),
      nextBlockLabel: DEFAULT_LEARNING_BLOCKS.find((block) => block.status !== "done")?.title ?? "今日已清空",
    },
  };
}

export const onRequestGet: PagesFunction = async (context) => {
  const db = await ensureDatabase(context.env);
  if (!db) {
    return json(createFallbackPayload());
  }

  const today = todayInShanghai();
  const weekStart = startOfWeek(today);

  const [blocksRes, todosRes, goalsRes] = await Promise.all([
    db.prepare(
      `SELECT id, block_date, start_time, end_time, title, lane, energy, status, notes
       FROM learning_time_blocks
       WHERE block_date = ?
       ORDER BY position ASC`,
    ).bind(today).all<{
      id: string;
      block_date: string;
      start_time: string;
      end_time: string;
      title: string;
      lane: "学习" | "执行" | "生活";
      energy: "专注" | "推进" | "恢复";
      status: "planned" | "active" | "done";
      notes: string;
    }>(),
    db.prepare(
      `SELECT id, title, completed
       FROM learning_todos
       WHERE todo_date = ?
       ORDER BY position ASC`,
    ).bind(today).all<{ id: string; title: string; completed: number }>(),
    db.prepare(
      `SELECT id, title, target, progress
       FROM learning_weekly_goals
       WHERE week_start = ?
       ORDER BY position ASC`,
    ).bind(weekStart).all<{ id: string; title: string; target: string; progress: number }>(),
  ]);

  const blocks = blocksRes.results.map((block) => ({
    id: block.id,
    date: block.block_date,
    startTime: block.start_time,
    endTime: block.end_time,
    title: block.title,
    lane: block.lane,
    energy: block.energy,
    status: block.status,
    notes: block.notes,
  }));
  const todos = todosRes.results.map((todo) => ({
    id: todo.id,
    title: todo.title,
    completed: todo.completed === 1,
  }));
  const weeklyGoals = goalsRes.results;

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const focusMinutes = blocks
    .filter((block) => block.energy === "专注" || block.energy === "推进")
    .reduce((sum, block) => sum + minutesBetween(block.startTime, block.endTime), 0);

  return json({
    todayDate: today,
    blocks,
    todos,
    weeklyGoals,
    summary: {
      focusMinutes,
      completedTodos,
      totalTodos: todos.length,
      averageGoalProgress:
        weeklyGoals.length > 0
          ? Math.round(weeklyGoals.reduce((sum, goal) => sum + goal.progress, 0) / weeklyGoals.length)
          : 0,
      nextBlockLabel: blocks.find((block) => block.status !== "done")?.title ?? "今日已清空",
    },
  });
};
