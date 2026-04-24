interface FinanceEntryLike {
  category: string;
  type: "income" | "expense";
  amount: number;
}

interface FinanceGoalLike {
  key: string;
  currentAmount: number;
  targetAmount: number;
}

interface FinanceAdvice {
  headline: string;
  summary: string;
  opportunities: string[];
  actions: string[];
}

export function buildFinanceAdvice(entries: FinanceEntryLike[], goals: FinanceGoalLike[]): FinanceAdvice {
  const expenses = entries.filter((entry) => entry.type === "expense");
  const totalExpense = expenses.reduce((sum, entry) => sum + entry.amount, 0);

  const relationshipSpend = expenses
    .filter((entry) => entry.category === "恋爱开销")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const toolsSpend = expenses
    .filter((entry) => entry.category === "工具订阅")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const dailySpend = expenses
    .filter((entry) => entry.category === "日常支出")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const annualGoal = goals.find((goal) => goal.key === "annual");
  const threeYearGoal = goals.find((goal) => goal.key === "three-year");
  const annualGap = annualGoal ? Math.max(annualGoal.targetAmount - annualGoal.currentAmount, 0) : 0;
  const threeYearGap = threeYearGoal ? Math.max(threeYearGoal.targetAmount - threeYearGoal.currentAmount, 0) : 0;

  const opportunities = [
    relationshipSpend > totalExpense * 0.18
      ? "恋爱开销占比已经偏高，适合把高频消费改成更有体验感但更低成本的安排。"
      : "恋爱开销目前还在可控范围，但依然建议提前设定每月预算上限。",
    toolsSpend > 300
      ? "工具订阅已经形成稳定外流，优先清理低频工具，合并重复能力。"
      : "工具订阅还不算重，但最好每月固定复查一次使用频率。",
    dailySpend > 1200
      ? "日常支出可通过固定餐饮预算和通勤打包策略进一步压缩。"
      : "日常支出处在相对健康区，但仍可通过固定周预算防止后半月失控。",
  ];

  const actions = [
    "给恋爱开销单独设一个月度上限，并提前选出低成本但体验好的约会方案。",
    "把工具订阅按‘必须 / 可替代 / 很少用’重新分组，本周至少取消一个低频订阅。",
    `如果想更接近年度目标，当前还差约 ${annualGap.toLocaleString("zh-CN")} 元，需要把每月结余再抬高。`,
    `距离 50 万目标还差约 ${threeYearGap.toLocaleString("zh-CN")} 元，最重要的是提升稳定结余，而不是偶发冲刺。`,
  ];

  return {
    headline: "先保住结余质量，再追求收入增长。",
    summary:
      "你的财务状态已经有明确目标感，但目前最值得优化的不是“赚更多”这个抽象命题，而是先把可控支出压到更稳，让储蓄曲线更连续。",
    opportunities,
    actions,
  };
}
