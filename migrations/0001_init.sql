CREATE TABLE IF NOT EXISTS habit_definitions (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS habit_checkins (
  id TEXT PRIMARY KEY,
  habit_id TEXT NOT NULL,
  check_date TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(habit_id, check_date),
  FOREIGN KEY (habit_id) REFERENCES habit_definitions(id)
);

CREATE TABLE IF NOT EXISTS daily_plan_items (
  id TEXT PRIMARY KEY,
  plan_date TEXT NOT NULL,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS weekly_plan_items (
  id TEXT PRIMARY KEY,
  week_start TEXT NOT NULL,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS finance_snapshots (
  id TEXT PRIMARY KEY,
  month_key TEXT NOT NULL UNIQUE,
  income REAL NOT NULL DEFAULT 0,
  expense REAL NOT NULL DEFAULT 0,
  savings_progress INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_time_blocks (
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
);

CREATE TABLE IF NOT EXISTS learning_todos (
  id TEXT PRIMARY KEY,
  todo_date TEXT NOT NULL,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_weekly_goals (
  id TEXT PRIMARY KEY,
  week_start TEXT NOT NULL,
  title TEXT NOT NULL,
  target TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reflection_entries (
  id TEXT PRIMARY KEY,
  entry_date TEXT NOT NULL,
  summary TEXT NOT NULL,
  wins TEXT NOT NULL,
  blockers TEXT NOT NULL,
  mood TEXT NOT NULL,
  analysis_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS finance_entries (
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
);

CREATE TABLE IF NOT EXISTS finance_goals (
  id TEXT PRIMARY KEY,
  goal_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  current_amount REAL NOT NULL DEFAULT 0,
  target_amount REAL NOT NULL DEFAULT 0,
  target_date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS body_entries (
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
);

CREATE TABLE IF NOT EXISTS project_entries (
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
);

CREATE TABLE IF NOT EXISTS app_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS module_preferences (
  module_id TEXT PRIMARY KEY,
  is_visible INTEGER NOT NULL DEFAULT 1,
  position INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);
