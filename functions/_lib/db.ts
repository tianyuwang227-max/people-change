import {
  DEFAULT_APP_BRAND,
  DEFAULT_MODULE_PREFERENCES,
  DEFAULT_PROJECTS,
  DEFAULT_DAILY_PLAN,
  DEFAULT_HABITS,
  DEFAULT_FINANCE_ENTRIES,
  DEFAULT_FINANCE_GOALS,
  DEFAULT_BODY_ENTRIES,
  DEFAULT_LEARNING_BLOCKS,
  DEFAULT_LEARNING_TODOS,
  DEFAULT_LEARNING_WEEKLY_GOALS,
  DEFAULT_TERMINAL_LOG,
  DEFAULT_WEEKLY_PLAN,
} from "./constants";
import { datesForRecentDays, startOfWeek, todayInShanghai } from "./date";

interface EnvWithDB {
  DB?: D1Database;
}

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS habit_definitions (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS habit_checkins (
    id TEXT PRIMARY KEY,
    habit_id TEXT NOT NULL,
    check_date TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(habit_id, check_date),
    FOREIGN KEY (habit_id) REFERENCES habit_definitions(id)
  )`,
  `CREATE TABLE IF NOT EXISTS daily_plan_items (
    id TEXT PRIMARY KEY,
    plan_date TEXT NOT NULL,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS weekly_plan_items (
    id TEXT PRIMARY KEY,
    week_start TEXT NOT NULL,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS finance_snapshots (
    id TEXT PRIMARY KEY,
    month_key TEXT NOT NULL UNIQUE,
    income REAL NOT NULL DEFAULT 0,
    expense REAL NOT NULL DEFAULT 0,
    savings_progress INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS learning_time_blocks (
    id TEXT PRIMARY KEY,
    block_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    title TEXT NOT NULL,
    lane TEXT NOT NULL,
    energy TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    position INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS learning_todos (
    id TEXT PRIMARY KEY,
    todo_date TEXT NOT NULL,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS learning_weekly_goals (
    id TEXT PRIMARY KEY,
    week_start TEXT NOT NULL,
    title TEXT NOT NULL,
    target TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS reflection_entries (
    id TEXT PRIMARY KEY,
    entry_date TEXT NOT NULL,
    summary TEXT NOT NULL,
    wins TEXT NOT NULL,
    blockers TEXT NOT NULL,
    mood TEXT NOT NULL,
    analysis_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS finance_entries (
    id TEXT PRIMARY KEY,
    entry_date TEXT NOT NULL,
    entry_month TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL DEFAULT 0,
    note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS finance_goals (
    id TEXT PRIMARY KEY,
    goal_key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    current_amount REAL NOT NULL DEFAULT 0,
    target_amount REAL NOT NULL DEFAULT 0,
    target_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS body_entries (
    id TEXT PRIMARY KEY,
    entry_date TEXT NOT NULL UNIQUE,
    weight REAL NOT NULL DEFAULT 0,
    body_fat REAL NOT NULL DEFAULT 0,
    waist REAL NOT NULL DEFAULT 0,
    chest REAL NOT NULL DEFAULT 0,
    arm REAL NOT NULL DEFAULT 0,
    thigh REAL NOT NULL DEFAULT 0,
    sleep_hours REAL NOT NULL DEFAULT 0,
    energy INTEGER NOT NULL DEFAULT 0,
    nutrition_adherence INTEGER NOT NULL DEFAULT 0,
    training_completed INTEGER NOT NULL DEFAULT 0,
    note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS project_entries (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    screenshot TEXT NOT NULL DEFAULT '',
    tech_stack_json TEXT NOT NULL,
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    project_url TEXT NOT NULL DEFAULT '',
    commercial_display INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    updated_at_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS app_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS module_preferences (
    module_id TEXT PRIMARY KEY,
    is_visible INTEGER NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
  )`,
];

function buildId(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

function isCompletedForSeed(slug: string, date: string) {
  const day = Number(date.slice(-2));
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

async function seedHabitDefinitions(db: D1Database, timestamp: string) {
  await db.batch(
    DEFAULT_HABITS.map((habit) =>
      db
        .prepare(
          `INSERT INTO habit_definitions (id, slug, name, icon, color, position, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        )
        .bind(
          buildId("habit", habit.slug),
          habit.slug,
          habit.name,
          habit.icon,
          habit.color,
          habit.position,
          timestamp,
          timestamp,
        ),
    ),
  );
}

async function seedPlans(db: D1Database, timestamp: string) {
  const today = todayInShanghai();
  const weekStart = startOfWeek(today);

  await db.batch([
    ...DEFAULT_DAILY_PLAN.map((title, index) =>
      db
        .prepare(
          `INSERT INTO daily_plan_items (id, plan_date, title, completed, position, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(buildId("daily", `${today}-${index}`), today, title, index !== 1 ? 1 : 0, index, timestamp, timestamp),
    ),
    ...DEFAULT_WEEKLY_PLAN.map((title, index) =>
      db
        .prepare(
          `INSERT INTO weekly_plan_items (id, week_start, title, completed, position, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(buildId("weekly", `${weekStart}-${index}`), weekStart, title, index === 0 ? 1 : 0, index, timestamp, timestamp),
    ),
  ]);
}

async function seedFinanceSnapshots(db: D1Database, timestamp: string) {
  const baseYear = Number(todayInShanghai().slice(0, 4));
  const statements = ["01", "02", "03", "04"].map((month, index) =>
    db
      .prepare(
        `INSERT INTO finance_snapshots (id, month_key, income, expense, savings_progress, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(buildId("finance", month), `${baseYear}-${month}`, 7200 + index * 900, 4600 + index * 450, 20 + index * 4, timestamp, timestamp),
  );

  await db.batch(statements);
}

async function seedHabitCheckins(db: D1Database, timestamp: string) {
  const days = datesForRecentDays(35);
  const definitions = await db
    .prepare(`SELECT id, slug FROM habit_definitions ORDER BY position ASC`)
    .all<{ id: string; slug: string }>();

  const statements = definitions.results.flatMap((definition) =>
    days.map((date) =>
      db
        .prepare(
          `INSERT INTO habit_checkins (id, habit_id, check_date, completed, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          buildId("checkin", `${definition.slug}-${date}`),
          definition.id,
          date,
          isCompletedForSeed(definition.slug, date) ? 1 : 0,
          timestamp,
          timestamp,
        ),
    ),
  );

  await db.batch(statements);
}

async function seedLearningData(db: D1Database, timestamp: string) {
  const today = todayInShanghai();
  const weekStart = startOfWeek(today);

  await db.batch([
    ...DEFAULT_LEARNING_BLOCKS.map((block, index) =>
      db
        .prepare(
          `INSERT INTO learning_time_blocks
           (id, block_date, start_time, end_time, title, lane, energy, status, notes, position, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          buildId("learning-block", `${today}-${index}`),
          today,
          block.startTime,
          block.endTime,
          block.title,
          block.lane,
          block.energy,
          block.status,
          block.notes,
          index,
          timestamp,
          timestamp,
        ),
    ),
    ...DEFAULT_LEARNING_TODOS.map((title, index) =>
      db
        .prepare(
          `INSERT INTO learning_todos (id, todo_date, title, completed, position, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          buildId("learning-todo", `${today}-${index}`),
          today,
          title,
          index === 0 ? 1 : 0,
          index,
          timestamp,
          timestamp,
        ),
    ),
    ...DEFAULT_LEARNING_WEEKLY_GOALS.map((goal, index) =>
      db
        .prepare(
          `INSERT INTO learning_weekly_goals
           (id, week_start, title, target, progress, position, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          buildId("learning-goal", `${weekStart}-${index}`),
          weekStart,
          goal.title,
          goal.target,
          goal.progress,
          index,
          timestamp,
          timestamp,
        ),
    ),
  ]);
}

async function seedFinanceData(db: D1Database, timestamp: string) {
  await db.batch([
    ...DEFAULT_FINANCE_ENTRIES.map((entry, index) =>
      db
        .prepare(
          `INSERT INTO finance_entries
           (id, entry_date, entry_month, title, category, type, amount, note, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          buildId("finance-entry", `${entry.entryDate}-${index}`),
          entry.entryDate,
          entry.entryDate.slice(0, 7),
          entry.title,
          entry.category,
          entry.type,
          entry.amount,
          entry.note,
          timestamp,
          timestamp,
        ),
    ),
    ...DEFAULT_FINANCE_GOALS.map((goal) =>
      db
        .prepare(
          `INSERT INTO finance_goals
           (id, goal_key, title, current_amount, target_amount, target_date, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          buildId("finance-goal", goal.key),
          goal.key,
          goal.title,
          goal.currentAmount,
          goal.targetAmount,
          goal.targetDate,
          timestamp,
          timestamp,
        ),
    ),
  ]);
}

async function seedBodyData(db: D1Database, timestamp: string) {
  await db.batch(
    DEFAULT_BODY_ENTRIES.map((entry, index) =>
      db
        .prepare(
          `INSERT INTO body_entries
           (id, entry_date, weight, body_fat, waist, chest, arm, thigh, sleep_hours, energy, nutrition_adherence, training_completed, note, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          buildId("body-entry", `${entry.entryDate}-${index}`),
          entry.entryDate,
          entry.weight,
          entry.bodyFat,
          entry.waist,
          entry.chest,
          entry.arm,
          entry.thigh,
          entry.sleepHours,
          entry.energy,
          entry.nutritionAdherence,
          entry.trainingCompleted,
          entry.note,
          timestamp,
          timestamp,
        ),
    ),
  );
}

async function seedProjectData(db: D1Database, timestamp: string) {
  await db.batch(
    DEFAULT_PROJECTS.map((project, index) =>
      db
        .prepare(
          `INSERT INTO project_entries
           (id, title, summary, screenshot, tech_stack_json, problem, solution, project_url, commercial_display, status, updated_at_date, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          buildId("project", `${project.status}-${index}`),
          project.title,
          project.summary,
          project.screenshot,
          JSON.stringify(project.techStack),
          project.problem,
          project.solution,
          project.projectUrl,
          project.commercialDisplay ? 1 : 0,
          project.status,
          project.updatedAt,
          timestamp,
          timestamp,
        ),
    ),
  );
}

async function seedAppSettings(db: D1Database, timestamp: string) {
  await db.batch([
    db
      .prepare(
        `INSERT INTO app_settings (setting_key, setting_value, updated_at)
         VALUES (?, ?, ?)`,
      )
      .bind("brand_eyebrow", DEFAULT_APP_BRAND.eyebrow, timestamp),
    db
      .prepare(
        `INSERT INTO app_settings (setting_key, setting_value, updated_at)
         VALUES (?, ?, ?)`,
      )
      .bind("brand_title", DEFAULT_APP_BRAND.title, timestamp),
    db
      .prepare(
        `INSERT INTO app_settings (setting_key, setting_value, updated_at)
         VALUES (?, ?, ?)`,
      )
      .bind("brand_tagline", DEFAULT_APP_BRAND.tagline, timestamp),
    db
      .prepare(
        `INSERT INTO app_settings (setting_key, setting_value, updated_at)
         VALUES (?, ?, ?)`,
      )
      .bind("system_reminder", DEFAULT_APP_BRAND.reminder, timestamp),
    db
      .prepare(
        `INSERT INTO app_settings (setting_key, setting_value, updated_at)
         VALUES (?, ?, ?)`,
      )
      .bind("terminal_log", JSON.stringify(DEFAULT_TERMINAL_LOG), timestamp),
    ...DEFAULT_MODULE_PREFERENCES.map((item) =>
      db
        .prepare(
          `INSERT INTO module_preferences (module_id, is_visible, position, updated_at)
           VALUES (?, ?, ?, ?)`,
        )
        .bind(item.moduleId, item.isVisible, item.position, timestamp),
    ),
  ]);
}

export async function ensureDatabase(env: EnvWithDB) {
  const db = env.DB;
  if (!db) {
    return null;
  }

  for (const statement of SCHEMA_STATEMENTS) {
    await db.prepare(statement).run();
  }

  const existing = await db.prepare(`SELECT COUNT(*) as count FROM habit_definitions`).first<{ count: number }>();
  if ((existing?.count ?? 0) === 0) {
    const now = new Date().toISOString();
    await seedHabitDefinitions(db, now);
    await seedPlans(db, now);
    await seedFinanceSnapshots(db, now);
    await seedFinanceData(db, now);
    await seedHabitCheckins(db, now);
    await seedLearningData(db, now);
    await seedBodyData(db, now);
    await seedProjectData(db, now);
    await seedAppSettings(db, now);
  } else {
    const now = new Date().toISOString();
    const learningCount = await db.prepare(`SELECT COUNT(*) as count FROM learning_time_blocks`).first<{ count: number }>();
    if ((learningCount?.count ?? 0) === 0) {
      await seedLearningData(db, now);
    }
    const financeEntryCount = await db.prepare(`SELECT COUNT(*) as count FROM finance_entries`).first<{ count: number }>();
    if ((financeEntryCount?.count ?? 0) === 0) {
      await seedFinanceData(db, now);
    }
    const bodyCount = await db.prepare(`SELECT COUNT(*) as count FROM body_entries`).first<{ count: number }>();
    if ((bodyCount?.count ?? 0) === 0) {
      await seedBodyData(db, now);
    }
    const projectCount = await db.prepare(`SELECT COUNT(*) as count FROM project_entries`).first<{ count: number }>();
    if ((projectCount?.count ?? 0) === 0) {
      await seedProjectData(db, now);
    }
    const settingsCount = await db.prepare(`SELECT COUNT(*) as count FROM app_settings`).first<{ count: number }>();
    if ((settingsCount?.count ?? 0) === 0) {
      await seedAppSettings(db, now);
    }
    const modulePreferenceCount = await db.prepare(`SELECT COUNT(*) as count FROM module_preferences`).first<{ count: number }>();
    if ((modulePreferenceCount?.count ?? 0) === 0) {
      await db.batch(
        DEFAULT_MODULE_PREFERENCES.map((item) =>
          db
            .prepare(
              `INSERT INTO module_preferences (module_id, is_visible, position, updated_at)
               VALUES (?, ?, ?, ?)`,
            )
            .bind(item.moduleId, item.isVisible, item.position, now),
        ),
      );
    }
  }

  return db;
}
