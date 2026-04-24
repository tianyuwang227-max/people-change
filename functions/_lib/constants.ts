export const DEFAULT_HABITS = [
  { slug: "wake-early", name: "早起", icon: "Sunrise", color: "#facc15", position: 0 },
  { slug: "words", name: "背单词", icon: "Languages", color: "#38bdf8", position: 1 },
  { slug: "react", name: "React 学习", icon: "CodeXml", color: "#14b8a6", position: 2 },
  { slug: "project", name: "做项目", icon: "Laptop", color: "#fb7185", position: 3 },
  { slug: "editing", name: "剪视频", icon: "Clapperboard", color: "#f97316", position: 4 },
  { slug: "fitness", name: "健身", icon: "Dumbbell", color: "#22c55e", position: 5 },
  { slug: "reading", name: "读书", icon: "BookOpenText", color: "#c084fc", position: 6 },
  { slug: "finance", name: "记账", icon: "Wallet", color: "#60a5fa", position: 7 },
  { slug: "relationship", name: "和女朋友沟通", icon: "HeartHandshake", color: "#f472b6", position: 8 },
  { slug: "sleep", name: "睡眠", icon: "MoonStar", color: "#94a3b8", position: 9 },
] as const;

export const DEFAULT_DAILY_PLAN = [
  "上午完成 React 学习时间块",
  "下午推进逆命者首页",
  "晚间 30 分钟读书",
];

export const DEFAULT_WEEKLY_PLAN = [
  "本周输出 1 个完整页面",
  "本周健身至少 4 次",
  "本周支出复盘一次",
];

export const DEFAULT_LEARNING_BLOCKS = [
  {
    startTime: "06:30",
    endTime: "07:00",
    title: "晨间启动与计划校准",
    lane: "生活",
    energy: "恢复",
    status: "done",
    notes: "短启动，避免一醒来就进入混乱状态。",
  },
  {
    startTime: "08:30",
    endTime: "10:30",
    title: "React 深度学习",
    lane: "学习",
    energy: "专注",
    status: "active",
    notes: "跟着真实项目推进，而不是只看资料。",
  },
  {
    startTime: "14:00",
    endTime: "16:00",
    title: "逆命者功能开发",
    lane: "执行",
    energy: "推进",
    status: "planned",
    notes: "把今天最值得推进的代码放在这里。",
  },
  {
    startTime: "21:30",
    endTime: "22:00",
    title: "读书与收束",
    lane: "生活",
    energy: "恢复",
    status: "planned",
    notes: "给一天一个缓冲的收尾。",
  },
] as const;

export const DEFAULT_LEARNING_TODOS = [
  "整理今天的时间块",
  "完成一个 React 知识点的实践",
  "推进当前项目的一个关键功能",
  "晚间复盘今天的推进情况",
];

export const DEFAULT_LEARNING_WEEKLY_GOALS = [
  { title: "本周累计 10 小时深度学习", target: "10h", progress: 68 },
  { title: "本周完成 1 个可演示页面", target: "1 page", progress: 74 },
  { title: "本周把待办执行率保持在 70% 以上", target: "70%", progress: 62 },
];

export const DEFAULT_REFLECTION_PROMPTS = [
  "今天真正推进了什么，而不只是看起来很忙？",
  "今天最卡的点是什么，它暴露了哪种系统问题？",
  "如果只允许明天修正一件事，最值得修正什么？",
];

export const DEFAULT_FINANCE_ENTRIES = [
  { entryDate: "2026-04-03", title: "产品设计兼职", category: "收入来源", type: "income", amount: 4200, note: "本月第一笔外包收入。" },
  { entryDate: "2026-04-10", title: "前端开发结算", category: "收入来源", type: "income", amount: 6000, note: "项目阶段性结算。" },
  { entryDate: "2026-04-02", title: "房租与水电", category: "固定支出", type: "expense", amount: 2600, note: "本月基础生活成本。" },
  { entryDate: "2026-04-06", title: "和女朋友约会", category: "恋爱开销", type: "expense", amount: 980, note: "吃饭和看展。" },
  { entryDate: "2026-04-08", title: "工具订阅", category: "工具订阅", type: "expense", amount: 328, note: "设计、AI 与代码工具。" },
  { entryDate: "2026-04-12", title: "健身与补剂", category: "成长投入", type: "expense", amount: 540, note: "训练卡与补剂补货。" },
  { entryDate: "2026-04-15", title: "日常吃饭与通勤", category: "日常支出", type: "expense", amount: 1450, note: "餐饮与交通。" },
] as const;

export const DEFAULT_FINANCE_GOALS = [
  { key: "savings", title: "储蓄目标", currentAmount: 62000, targetAmount: 120000, targetDate: "2026-12-31" },
  { key: "annual", title: "年度目标", currentAmount: 155000, targetAmount: 240000, targetDate: "2026-12-31" },
  { key: "three-year", title: "3 年累计目标", currentAmount: 155000, targetAmount: 500000, targetDate: "2028-12-31" },
] as const;

export const DEFAULT_BODY_ENTRIES = [
  { entryDate: "2026-04-18", weight: 76.2, bodyFat: 18.6, waist: 82.5, chest: 98.4, arm: 34.1, thigh: 56.2, sleepHours: 7.2, energy: 7, nutritionAdherence: 83, trainingCompleted: 1, note: "训练完成，晚间状态不错。" },
  { entryDate: "2026-04-19", weight: 76.0, bodyFat: 18.5, waist: 82.3, chest: 98.6, arm: 34.1, thigh: 56.3, sleepHours: 6.8, energy: 6, nutritionAdherence: 78, trainingCompleted: 0, note: "睡眠偏少，下午有点散。" },
  { entryDate: "2026-04-20", weight: 75.9, bodyFat: 18.4, waist: 82.1, chest: 98.7, arm: 34.2, thigh: 56.3, sleepHours: 7.5, energy: 8, nutritionAdherence: 85, trainingCompleted: 1, note: "训练和饮食都比较稳。" },
  { entryDate: "2026-04-21", weight: 75.8, bodyFat: 18.2, waist: 81.9, chest: 98.7, arm: 34.2, thigh: 56.4, sleepHours: 7.1, energy: 7, nutritionAdherence: 82, trainingCompleted: 0, note: "恢复日，精神尚可。" },
  { entryDate: "2026-04-22", weight: 75.7, bodyFat: 18.1, waist: 81.8, chest: 98.9, arm: 34.3, thigh: 56.5, sleepHours: 7.8, energy: 8, nutritionAdherence: 88, trainingCompleted: 1, note: "训练质量高，状态在线。" },
  { entryDate: "2026-04-23", weight: 75.6, bodyFat: 17.9, waist: 81.6, chest: 99.0, arm: 34.3, thigh: 56.6, sleepHours: 7.4, energy: 8, nutritionAdherence: 86, trainingCompleted: 1, note: "节奏很稳，睡眠回来了。" },
  { entryDate: "2026-04-24", weight: 75.5, bodyFat: 17.8, waist: 81.4, chest: 99.1, arm: 34.4, thigh: 56.7, sleepHours: 7.6, energy: 8, nutritionAdherence: 87, trainingCompleted: 0, note: "今天主打恢复，但整体状态不错。" },
] as const;

export const DEFAULT_PROJECTS = [
  {
    title: "逆命者",
    summary: "一个以个人成长和执行力为核心的人生控制台，整合习惯、学习、复盘、财务和身体数据。",
    screenshot: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    techStack: ["Vite", "React", "TypeScript", "Tailwind", "Cloudflare Pages", "D1"],
    problem: "多模块产品很容易在信息架构和视觉层面失控，最后变成一堆散面板。",
    solution: "先固定控制台式布局和数据模型，再逐个把模块从占位升级成真实功能，保证节奏和一致性。",
    projectUrl: "https://example.com/reverse-fate",
    commercialDisplay: true,
    status: "active",
    updatedAt: "2026-04-24",
  },
  {
    title: "React 学习冲刺看板",
    summary: "围绕学习时间块、任务推进和周目标做成的轻量学习系统，用来避免学习内容失焦。",
    screenshot: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    techStack: ["React", "TypeScript", "Framer Motion"],
    problem: "以前的学习记录停留在待办层，缺少时间块和结果输出的绑定。",
    solution: "把时间块、任务和周目标聚在一起，让学习不只是输入，而是有明确推进线。",
    projectUrl: "https://example.com/react-sprint-board",
    commercialDisplay: false,
    status: "active",
    updatedAt: "2026-04-18",
  },
  {
    title: "个人财务视图",
    summary: "围绕收入、支出、目标和节流建议做成的财务控制台原型，帮助快速定位资金压力点。",
    screenshot: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    techStack: ["React", "Recharts", "Cloudflare Functions"],
    problem: "记账不难，难的是从账本里看出哪些支出最值得收缩。",
    solution: "补了分类趋势、目标进度和建议模块，把抽象数字变成可行动的反馈。",
    projectUrl: "https://example.com/finance-view",
    commercialDisplay: true,
    status: "completed",
    updatedAt: "2026-04-10",
  },
  {
    title: "作品集展示页",
    summary: "一个面向个人项目展示的作品集页面，用于沉淀做过的项目、技术栈和解决问题的方式。",
    screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    techStack: ["React", "CSS", "Static Hosting"],
    problem: "以前的项目做完后很快散掉，没有形成可复用的展示资产。",
    solution: "把项目故事、截图、技术栈和商业展示状态一起记录下来，方便后续复用。",
    projectUrl: "https://example.com/portfolio",
    commercialDisplay: true,
    status: "completed",
    updatedAt: "2026-03-30",
  },
] as const;

export const DEFAULT_APP_BRAND = {
  eyebrow: "Reverse Fate Console",
  title: "逆命者",
  tagline: "你的人生控制台。记录节奏，修正偏航，给明天更硬的推进力。",
  reminder: "今天的起点不是情绪，而是第一个被完成的时间块。先动，再谈状态。",
} as const;

export const DEFAULT_TERMINAL_LOG = [
  "[core] loading discipline.config ... ok",
  "[ui] syncing motion profile ... ok",
  "[habit-engine] sampling weekly consistency ... ok",
  "[error] momentum drift detected: sleep debt above threshold",
  "[advice] reduce midnight scroll loop and protect wake-up anchor",
] as const;

export const DEFAULT_MODULE_PREFERENCES = [
  { moduleId: "dashboard", isVisible: 1, position: 0 },
  { moduleId: "habits", isVisible: 1, position: 1 },
  { moduleId: "learning", isVisible: 1, position: 2 },
  { moduleId: "reflection", isVisible: 1, position: 3 },
  { moduleId: "finance", isVisible: 1, position: 4 },
  { moduleId: "body", isVisible: 1, position: 5 },
  { moduleId: "projects", isVisible: 1, position: 6 },
  { moduleId: "settings", isVisible: 1, position: 7 },
] as const;
