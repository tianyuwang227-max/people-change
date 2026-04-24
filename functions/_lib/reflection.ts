import { DEFAULT_REFLECTION_PROMPTS } from "./constants";

interface ReflectionInput {
  summary: string;
  wins: string;
  blockers: string;
  mood: string;
}

function splitIdeas(input: string) {
  return input
    .split(/[\n,，。；;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pickOrFallback(items: string[], fallback: string[]) {
  return items.length > 0 ? items : fallback;
}

export function buildReflectionPrompts() {
  return DEFAULT_REFLECTION_PROMPTS;
}

export function createReflectionAnalysis(input: ReflectionInput) {
  const winIdeas = splitIdeas(input.wins);
  const blockerIdeas = splitIdeas(input.blockers);
  const summaryIdeas = splitIdeas(input.summary);
  const moodText = input.mood.trim() || "普通";

  const strengths = pickOrFallback(winIdeas, [
    "今天至少有一个动作是真正向前推进的，不只是表面忙碌。",
    "你愿意把问题讲清楚，这本身就是复盘质量的起点。",
  ]).slice(0, 3);

  const bottlenecks = pickOrFallback(blockerIdeas, [
    "今天的阻力更像是节奏管理问题，而不是能力天花板。",
    "开始动作之前缺少清晰的第一步，导致推进被拖慢。",
  ]).slice(0, 3);

  const focusAnchor = summaryIdeas[0] ?? "把最关键的任务提前到高能时段";

  return {
    title: "今日复盘分析",
    summary: `你今天的状态核心不是“做得够不够多”，而是节奏是否围绕真正重要的事展开。当前情绪偏向“${moodText}”，最值得守住的推进线索是：${focusAnchor}。`,
    strengths,
    bottlenecks,
    followUps: [
      `如果明天只保住一件推进动作，它应该是什么？先围绕“${focusAnchor}”回答。`,
      "今天最容易分散你的触发器是什么，能不能在环境层面把它提前切断？",
      "有没有哪个任务看起来重要，其实只是让你感觉自己很忙？",
    ],
    tomorrowActions: [
      "明天醒来后 10 分钟内确认唯一最重要时间块，不重新犹豫。",
      "把一个卡点拆成 25 分钟内能完成的最小动作。",
      "晚间用 3 句话复盘：推进了什么、为什么卡住、明天先做什么。",
    ],
  };
}
