import dayjs from "dayjs";
import type {
  AppSettingsData,
  BodyModuleData,
  BootstrapPayload,
  FinanceModuleData,
  LearningModuleData,
  ProjectsModuleData,
  ReflectionModuleData,
} from "@/types/app";

const today = dayjs();

const habitDefinitions = [
  ["wake-early", "早起", "Sunrise", "#facc15"],
  ["words", "背单词", "Languages", "#38bdf8"],
  ["react", "React 学习", "CodeXml", "#14b8a6"],
  ["project", "做项目", "Laptop", "#fb7185"],
  ["editing", "剪视频", "Clapperboard", "#f97316"],
  ["fitness", "健身", "Dumbbell", "#22c55e"],
  ["reading", "读书", "BookOpenText", "#c084fc"],
  ["finance", "记账", "Wallet", "#60a5fa"],
  ["relationship", "和女朋友沟通", "HeartHandshake", "#f472b6"],
  ["sleep", "睡眠", "MoonStar", "#94a3b8"],
] as const;

export function createMockBootstrap(): BootstrapPayload {
  const heatmap = Array.from({ length: 35 }, (_, index) => {
    const date = today.subtract(34 - index, "day");
    const count = Math.max(0, ((index * 3) % 8) + (index % 2 ? 1 : 0) - 1);
    return {
      date: date.format("YYYY-MM-DD"),
      count,
      intensity: Math.min(4, Math.ceil(count / 2)),
    };
  });

  const completions = Object.fromEntries(
    habitDefinitions.map(([slug], index) => [slug, index % 3 !== 0]),
  );

  return {
    generatedAt: today.toISOString(),
    dashboard: {
      heroStats: [
        { label: "今日完成", value: "7 / 10", detail: "比昨天多 2 项", tone: "gold" },
        { label: "本周胜率", value: "78%", detail: "保持上扬", tone: "teal" },
        { label: "最佳连击", value: "19 天", detail: "健身处于稳定区", tone: "orange" },
        { label: "储蓄进度", value: "31%", detail: "离年度线还差 11%", tone: "slate" },
      ],
      todaySummary: {
        completedHabits: 7,
        totalHabits: 10,
        weeklyCompletion: 78,
        bestStreak: 19,
        activeProjects: 3,
        savingsProgress: 31,
      },
      timeBlocks: [
        { id: "1", time: "06:30 - 07:00", title: "晨间启动 + 早起复位", energy: "恢复", lane: "生活" },
        { id: "2", time: "08:30 - 10:30", title: "React 学习冲刺", energy: "专注", lane: "学习" },
        { id: "3", time: "14:00 - 16:00", title: "逆命者首页开发", energy: "推进", lane: "执行" },
        { id: "4", time: "22:00 - 22:30", title: "读书 + 复盘预热", energy: "恢复", lane: "生活" },
      ],
      weeklyGoals: [
        { id: "g1", title: "完成 Dashboard 与习惯模块", progress: 72, target: "本周 MVP" },
        { id: "g2", title: "连续 5 天 6:30 前起床", progress: 60, target: "自律节奏" },
        { id: "g3", title: "本周输出 1 个可展示项目", progress: 45, target: "作品沉淀" },
      ],
      financeTrend: [
        { month: "01", income: 7200, expense: 4600 },
        { month: "02", income: 8400, expense: 5100 },
        { month: "03", income: 9100, expense: 5600 },
        { month: "04", income: 10200, expense: 5900 },
      ],
      terminalLog: [
        "[10:24:17] scanning willpower.core ... ready",
        "[10:24:19] habit engine synced with D1 cache",
        "[10:24:23] warning: future-self feedback loop below desired threshold",
        "[10:24:24] action: rebuild momentum from today's first completed block",
      ],
    },
    habits: {
      definitions: habitDefinitions.map(([slug, name, icon, color], index) => ({
        id: `habit-${slug}`,
        slug,
        name,
        icon,
        color,
        position: index,
        isActive: true,
      })),
      todayDate: today.format("YYYY-MM-DD"),
      completions,
      streaks: {
        "wake-early": 5,
        words: 11,
        react: 8,
        project: 6,
        editing: 2,
        fitness: 19,
        reading: 14,
        finance: 10,
        relationship: 7,
        sleep: 9,
      },
      weeklyRates: {
        "wake-early": 71,
        words: 86,
        react: 71,
        project: 57,
        editing: 29,
        fitness: 86,
        reading: 100,
        finance: 57,
        relationship: 86,
        sleep: 71,
      },
      heatmap,
      dailyPlan: [
        { id: "dp-1", title: "上午完成 React 学习时间块", completed: true },
        { id: "dp-2", title: "下午推进逆命者首页", completed: false },
        { id: "dp-3", title: "晚间 30 分钟读书", completed: true },
      ],
      weeklyPlan: [
        { id: "wp-1", title: "本周输出 1 个完整页面", completed: true },
        { id: "wp-2", title: "本周健身至少 4 次", completed: false },
        { id: "wp-3", title: "本周支出复盘一次", completed: false },
      ],
    },
  };
}

export function createMockLearning(): LearningModuleData {
  return {
    todayDate: today.format("YYYY-MM-DD"),
    blocks: [
      {
        id: "lb-1",
        date: today.format("YYYY-MM-DD"),
        startTime: "06:30",
        endTime: "07:00",
        title: "晨间启动与计划校准",
        lane: "生活",
        energy: "恢复",
        status: "done",
        notes: "短启动，避免刚醒来就进入混乱状态。",
      },
      {
        id: "lb-2",
        date: today.format("YYYY-MM-DD"),
        startTime: "08:30",
        endTime: "10:30",
        title: "React 深度学习",
        lane: "学习",
        energy: "专注",
        status: "active",
        notes: "围绕真实组件拆解状态和数据流。",
      },
      {
        id: "lb-3",
        date: today.format("YYYY-MM-DD"),
        startTime: "14:00",
        endTime: "16:00",
        title: "逆命者功能开发",
        lane: "执行",
        energy: "推进",
        status: "planned",
        notes: "先攻克今天最值得上线的功能。",
      },
      {
        id: "lb-4",
        date: today.format("YYYY-MM-DD"),
        startTime: "21:30",
        endTime: "22:00",
        title: "读书与收束",
        lane: "生活",
        energy: "恢复",
        status: "planned",
        notes: "让收尾变成明天的准备。",
      },
    ],
    todos: [
      { id: "lt-1", title: "整理今天的时间块", completed: true },
      { id: "lt-2", title: "完成一个 React 知识点的实践", completed: false },
      { id: "lt-3", title: "推进当前项目的一个关键功能", completed: false },
      { id: "lt-4", title: "晚间复盘今天的推进情况", completed: false },
    ],
    weeklyGoals: [
      { id: "lg-1", title: "本周累计 10 小时深度学习", target: "10h", progress: 68 },
      { id: "lg-2", title: "本周完成 1 个可演示页面", target: "1 page", progress: 74 },
      { id: "lg-3", title: "本周把待办执行率保持在 70% 以上", target: "70%", progress: 62 },
    ],
    summary: {
      focusMinutes: 240,
      completedTodos: 1,
      totalTodos: 4,
      averageGoalProgress: 68,
      nextBlockLabel: "React 深度学习",
    },
  };
}

export function createMockReflection(): ReflectionModuleData {
  return {
    todayDate: today.format("YYYY-MM-DD"),
    promptGuide: [
      "今天真正推进了什么，而不只是看起来很忙？",
      "今天最卡的点是什么，它暴露了哪种系统问题？",
      "如果只允许明天修正一件事，最值得修正什么？",
    ],
    history: [
      {
        id: "reflection-1",
        entryDate: today.format("YYYY-MM-DD"),
        summary: "今天把首页结构跑通了，但下午注意力被杂事切散。",
        wins: "完成了 Dashboard 主要布局，明确了视觉方向。",
        blockers: "中途切任务过多，下午深度工作时段保护不够。",
        mood: "有点疲惫，但还算清醒",
        analysis: {
          title: "今日复盘分析",
          summary:
            "今天的核心问题不是没有行动，而是高价值行动被切碎了。真正有价值的推进已经发生，接下来要保护它。",
          strengths: ["视觉方向已经稳定", "关键模块有真实进展", "你对问题来源有明确感知"],
          bottlenecks: ["深度工作时间块不够完整", "任务切换偏多", "杂事侵入核心时段"],
          followUps: [
            "明天最先保住的一个时间块是什么？",
            "哪类杂事最容易切断你的推进线？",
            "有没有能提前批量处理的小任务？",
          ],
          tomorrowActions: [
            "上午先完成最重的功能，不先回消息和杂务。",
            "给下午任务只保留一个主目标。",
            "晚上用 3 句话做最小复盘。",
          ],
        },
      },
    ],
  };
}

export function createMockFinance(): FinanceModuleData {
  const trends = [
    { month: "01", income: 7200, expense: 4600 },
    { month: "02", income: 8400, expense: 5100 },
    { month: "03", income: 9100, expense: 5600 },
    { month: "04", income: 10200, expense: 5898 },
  ];

  return {
    currency: "CNY",
    summary: {
      monthIncome: 10200,
      monthExpense: 5898,
      balance: 4302,
      savingsRate: 42,
      annualGoalProgress: 65,
      threeYearGoalProgress: 31,
    },
    trends,
    breakdown: [
      { category: "固定支出", amount: 2600, share: 44 },
      { category: "恋爱开销", amount: 980, share: 17 },
      { category: "工具订阅", amount: 328, share: 6 },
      { category: "成长投入", amount: 540, share: 9 },
      { category: "日常支出", amount: 1450, share: 24 },
    ],
    records: [
      {
        id: "fr-1",
        entryDate: "2026-04-10",
        title: "前端开发结算",
        category: "收入来源",
        type: "income",
        amount: 6000,
        note: "项目阶段性结算。",
      },
      {
        id: "fr-2",
        entryDate: "2026-04-06",
        title: "和女朋友约会",
        category: "恋爱开销",
        type: "expense",
        amount: 980,
        note: "吃饭和看展。",
      },
      {
        id: "fr-3",
        entryDate: "2026-04-08",
        title: "工具订阅",
        category: "工具订阅",
        type: "expense",
        amount: 328,
        note: "设计、AI 与代码工具。",
      },
      {
        id: "fr-4",
        entryDate: "2026-04-02",
        title: "房租与水电",
        category: "固定支出",
        type: "expense",
        amount: 2600,
        note: "本月基础生活成本。",
      },
    ],
    goals: [
      {
        id: "fg-1",
        key: "savings",
        title: "储蓄目标",
        currentAmount: 62000,
        targetAmount: 120000,
        progress: 52,
        targetDate: "2026-12-31",
      },
      {
        id: "fg-2",
        key: "annual",
        title: "年度目标",
        currentAmount: 155000,
        targetAmount: 240000,
        progress: 65,
        targetDate: "2026-12-31",
      },
      {
        id: "fg-3",
        key: "three-year",
        title: "3 年累计目标",
        currentAmount: 155000,
        targetAmount: 500000,
        progress: 31,
        targetDate: "2028-12-31",
      },
    ],
    advice: {
      headline: "先保住结余质量，再追求收入增长。",
      summary:
        "你的财务状态已经有目标感，接下来最值得优化的是让可控支出更稳，尤其是恋爱开销和工具订阅的结构。",
      opportunities: [
        "恋爱开销目前不算失控，但已经足够高，适合做月度预算。",
        "工具订阅可以按使用频率做一次清仓，优先删掉低频工具。",
        "日常支出如果继续走高，会直接侵蚀本月结余。",
      ],
      actions: [
        "给恋爱开销设一个月度上限，并提前准备更低成本的约会方案。",
        "本周至少取消 1 个低频工具订阅。",
        "把餐饮和通勤改成周预算，不再按当天感觉消费。",
      ],
    },
  };
}

export function createMockBody(): BodyModuleData {
  return {
    summary: {
      weight: 75.5,
      bodyFat: 17.8,
      trainingFrequency: 4,
      nutritionAdherence: 84,
      sleepAverage: 7.3,
      energyAverage: 7.4,
    },
    trends: [
      { date: "04-18", weight: 76.2, bodyFat: 18.6, sleepHours: 7.2, energy: 7 },
      { date: "04-19", weight: 76.0, bodyFat: 18.5, sleepHours: 6.8, energy: 6 },
      { date: "04-20", weight: 75.9, bodyFat: 18.4, sleepHours: 7.5, energy: 8 },
      { date: "04-21", weight: 75.8, bodyFat: 18.2, sleepHours: 7.1, energy: 7 },
      { date: "04-22", weight: 75.7, bodyFat: 18.1, sleepHours: 7.8, energy: 8 },
      { date: "04-23", weight: 75.6, bodyFat: 17.9, sleepHours: 7.4, energy: 8 },
      { date: "04-24", weight: 75.5, bodyFat: 17.8, sleepHours: 7.6, energy: 8 },
    ],
    measurements: [
      { key: "waist", label: "腰围", value: 81.4, unit: "cm", delta: -1.1 },
      { key: "chest", label: "胸围", value: 99.1, unit: "cm", delta: 0.7 },
      { key: "arm", label: "手臂围度", value: 34.4, unit: "cm", delta: 0.3 },
      { key: "thigh", label: "腿围", value: 56.7, unit: "cm", delta: 0.5 },
    ],
    weeklyCards: [
      { label: "训练频率", value: "4 / 7 天", progress: 100, tone: "gold" },
      { label: "饮食执行", value: "84%", progress: 84, tone: "teal" },
      { label: "睡眠质量", value: "7.3 h", progress: 91, tone: "slate" },
      { label: "精力状态", value: "7.4 / 10", progress: 74, tone: "orange" },
    ],
    notes: [
      { id: "bn-1", date: "2026-04-24", title: "75.5 kg · 17.8% 体脂", detail: "今天主打恢复，但整体状态不错。" },
      { id: "bn-2", date: "2026-04-23", title: "75.6 kg · 17.9% 体脂", detail: "节奏很稳，睡眠回来了。" },
      { id: "bn-3", date: "2026-04-22", title: "75.7 kg · 18.1% 体脂", detail: "训练质量高，状态在线。" },
      { id: "bn-4", date: "2026-04-21", title: "75.8 kg · 18.2% 体脂", detail: "恢复日，精神尚可。" },
    ],
  };
}

export function createMockProjects(): ProjectsModuleData {
  return {
    summary: {
      activeCount: 2,
      completedCount: 2,
      commercialReadyCount: 3,
      shippingRate: 50,
    },
    activeProjects: [
      {
        id: "project-active-1",
        title: "逆命者",
        summary: "一个以个人成长和执行力为核心的人生控制台，整合习惯、学习、复盘、财务和身体数据。",
        screenshot: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
        techStack: ["Vite", "React", "TypeScript", "Tailwind", "Cloudflare Pages", "D1"],
        problem: "多模块产品很容易在信息架构和视觉层面失控。",
        solution: "先固定控制台骨架，再逐个把模块从占位升级成真实功能。",
        projectUrl: "https://example.com/reverse-fate",
        commercialDisplay: true,
        status: "active",
        updatedAt: "2026-04-24",
      },
      {
        id: "project-active-2",
        title: "React 学习冲刺看板",
        summary: "围绕时间块、任务推进和周目标做成的学习系统，用来避免学习内容失焦。",
        screenshot: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
        techStack: ["React", "TypeScript", "Framer Motion"],
        problem: "学习记录以前停留在待办层，缺少时间块和结果输出的绑定。",
        solution: "把时间块、任务和周目标聚在一起，让学习变得可追踪。",
        projectUrl: "https://example.com/react-sprint-board",
        commercialDisplay: false,
        status: "active",
        updatedAt: "2026-04-18",
      },
    ],
    completedProjects: [
      {
        id: "project-completed-1",
        title: "个人财务视图",
        summary: "围绕收入、支出、目标和节流建议做成的财务控制台原型。",
        screenshot: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
        techStack: ["React", "Recharts", "Cloudflare Functions"],
        problem: "很难从账本里看出哪些支出最值得收缩。",
        solution: "补了分类趋势、目标进度和建议模块，把数字变成行动。",
        projectUrl: "https://example.com/finance-view",
        commercialDisplay: true,
        status: "completed",
        updatedAt: "2026-04-10",
      },
      {
        id: "project-completed-2",
        title: "作品集展示页",
        summary: "一个面向个人项目展示的作品集页面，用于沉淀项目、技术栈和问题解法。",
        screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
        techStack: ["React", "CSS", "Static Hosting"],
        problem: "项目做完后很快散掉，没有形成可复用的展示资产。",
        solution: "把项目故事、截图、技术栈和展示状态一起记录下来。",
        projectUrl: "https://example.com/portfolio",
        commercialDisplay: true,
        status: "completed",
        updatedAt: "2026-03-30",
      },
    ],
  };
}

export function createMockSettings(): AppSettingsData {
  return {
    brand: {
      eyebrow: "Reverse Fate Console",
      title: "逆命者",
      tagline: "你的人生控制台。记录节奏，修正偏航，给明天更硬的推进力。",
      reminder: "今天的起点不是情绪，而是第一个被完成的时间块。先动，再谈状态。",
    },
    modules: [
      { id: "dashboard", isVisible: true, position: 0 },
      { id: "habits", isVisible: true, position: 1 },
      { id: "learning", isVisible: true, position: 2 },
      { id: "reflection", isVisible: true, position: 3 },
      { id: "finance", isVisible: true, position: 4 },
      { id: "body", isVisible: true, position: 5 },
      { id: "projects", isVisible: true, position: 6 },
      { id: "settings", isVisible: true, position: 7 },
    ],
    habits: createMockBootstrap().habits.definitions,
    terminalLog: [
      "[core] loading discipline.config ... ok",
      "[ui] syncing motion profile ... ok",
      "[habit-engine] sampling weekly consistency ... ok",
      "[error] momentum drift detected: sleep debt above threshold",
      "[advice] reduce midnight scroll loop and protect wake-up anchor",
    ],
  };
}
