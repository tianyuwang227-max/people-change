export type ModuleId =
  | "dashboard"
  | "habits"
  | "learning"
  | "reflection"
  | "finance"
  | "body"
  | "projects"
  | "settings";

export interface HeroStat {
  label: string;
  value: string;
  detail: string;
  tone: "gold" | "teal" | "orange" | "slate";
}

export interface TimeBlock {
  id: string;
  time: string;
  title: string;
  energy: "专注" | "推进" | "恢复";
  lane: "学习" | "执行" | "生活";
}

export interface WeeklyGoal {
  id: string;
  title: string;
  progress: number;
  target: string;
}

export interface HabitDefinition {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  position: number;
  isActive: boolean;
}

export interface HeatmapCell {
  date: string;
  count: number;
  intensity: number;
}

export interface HabitPlanItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface HabitModuleData {
  definitions: HabitDefinition[];
  todayDate: string;
  completions: Record<string, boolean>;
  streaks: Record<string, number>;
  weeklyRates: Record<string, number>;
  heatmap: HeatmapCell[];
  dailyPlan: HabitPlanItem[];
  weeklyPlan: HabitPlanItem[];
}

export interface DashboardData {
  heroStats: HeroStat[];
  todaySummary: {
    completedHabits: number;
    totalHabits: number;
    weeklyCompletion: number;
    bestStreak: number;
    activeProjects: number;
    savingsProgress: number;
  };
  timeBlocks: TimeBlock[];
  weeklyGoals: WeeklyGoal[];
  financeTrend: Array<{ month: string; income: number; expense: number }>;
  terminalLog: string[];
}

export interface BootstrapPayload {
  generatedAt: string;
  dashboard: DashboardData;
  habits: HabitModuleData;
}

export type LearningBlockStatus = "planned" | "active" | "done";

export interface LearningTimeBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  lane: "学习" | "执行" | "生活";
  energy: "专注" | "推进" | "恢复";
  status: LearningBlockStatus;
  notes: string;
}

export interface LearningTodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface LearningWeeklyGoal {
  id: string;
  title: string;
  target: string;
  progress: number;
}

export interface LearningModuleData {
  todayDate: string;
  blocks: LearningTimeBlock[];
  todos: LearningTodo[];
  weeklyGoals: LearningWeeklyGoal[];
  summary: {
    focusMinutes: number;
    completedTodos: number;
    totalTodos: number;
    averageGoalProgress: number;
    nextBlockLabel: string;
  };
}

export interface ReflectionQuestion {
  label: string;
  answer: string;
}

export interface ReflectionAnalysis {
  title: string;
  summary: string;
  strengths: string[];
  bottlenecks: string[];
  followUps: string[];
  tomorrowActions: string[];
}

export interface ReflectionEntry {
  id: string;
  entryDate: string;
  summary: string;
  wins: string;
  blockers: string;
  mood: string;
  analysis: ReflectionAnalysis;
}

export interface ReflectionModuleData {
  todayDate: string;
  promptGuide: string[];
  history: ReflectionEntry[];
}

export interface FinanceTrendPoint {
  month: string;
  income: number;
  expense: number;
}

export interface FinanceCategoryBreakdown {
  category: string;
  amount: number;
  share: number;
}

export interface FinanceRecord {
  id: string;
  entryDate: string;
  title: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  note: string;
}

export interface FinanceGoal {
  id: string;
  key: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
  targetDate: string;
}

export interface FinanceAdvice {
  headline: string;
  summary: string;
  opportunities: string[];
  actions: string[];
}

export interface FinanceModuleData {
  currency: "CNY";
  summary: {
    monthIncome: number;
    monthExpense: number;
    balance: number;
    savingsRate: number;
    annualGoalProgress: number;
    threeYearGoalProgress: number;
  };
  trends: FinanceTrendPoint[];
  breakdown: FinanceCategoryBreakdown[];
  records: FinanceRecord[];
  goals: FinanceGoal[];
  advice: FinanceAdvice;
}

export interface BodyTrendPoint {
  date: string;
  weight: number;
  bodyFat: number;
  sleepHours: number;
  energy: number;
}

export interface BodyMeasurement {
  key: string;
  label: string;
  value: number;
  unit: string;
  delta: number;
}

export interface BodyWeeklyCard {
  label: string;
  value: string;
  progress: number;
  tone: "gold" | "teal" | "orange" | "slate";
}

export interface BodyNote {
  id: string;
  date: string;
  title: string;
  detail: string;
}

export interface BodyModuleData {
  summary: {
    weight: number;
    bodyFat: number;
    trainingFrequency: number;
    nutritionAdherence: number;
    sleepAverage: number;
    energyAverage: number;
  };
  trends: BodyTrendPoint[];
  measurements: BodyMeasurement[];
  weeklyCards: BodyWeeklyCard[];
  notes: BodyNote[];
}

export type ProjectStatus = "active" | "completed";

export interface ProjectRecord {
  id: string;
  title: string;
  summary: string;
  screenshot: string;
  techStack: string[];
  problem: string;
  solution: string;
  projectUrl: string;
  commercialDisplay: boolean;
  status: ProjectStatus;
  updatedAt: string;
}

export interface ProjectsModuleData {
  summary: {
    activeCount: number;
    completedCount: number;
    commercialReadyCount: number;
    shippingRate: number;
  };
  activeProjects: ProjectRecord[];
  completedProjects: ProjectRecord[];
}

export interface BrandSettings {
  eyebrow: string;
  title: string;
  tagline: string;
  reminder: string;
}

export interface ModulePreference {
  id: ModuleId;
  isVisible: boolean;
  position: number;
}

export interface AppSettingsData {
  brand: BrandSettings;
  modules: ModulePreference[];
  habits: HabitDefinition[];
  terminalLog: string[];
}
