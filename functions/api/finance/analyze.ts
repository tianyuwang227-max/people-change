import { DEFAULT_FINANCE_ENTRIES, DEFAULT_FINANCE_GOALS } from "../../_lib/constants";
import { ensureDatabase } from "../../_lib/db";
import { buildFinanceAdvice } from "../../_lib/finance";
import { todayInShanghai } from "../../_lib/date";
import { createStructuredResponse, hasOpenAIConfig } from "../../_lib/openai";

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    ...init,
  });
}

export const onRequestPost: PagesFunction = async (context) => {
  const db = await ensureDatabase(context.env);
  const fallbackAdvice = buildFinanceAdvice(
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
  );

  if (!db) {
    return json({
      ok: true,
      provider: "fallback",
      advice: fallbackAdvice,
    });
  }

  const currentMonth = todayInShanghai().slice(0, 7);
  const [entriesRes, goalsRes] = await Promise.all([
    db.prepare(
      `SELECT category, type, amount
       FROM finance_entries
       WHERE entry_month = ?`,
    ).bind(currentMonth).all<{ category: string; type: "income" | "expense"; amount: number }>(),
    db.prepare(
      `SELECT goal_key, current_amount, target_amount
       FROM finance_goals`,
    ).all<{ goal_key: string; current_amount: number; target_amount: number }>(),
  ]);

  const goalPayload = goalsRes.results.map((goal) => ({
    key: goal.goal_key,
    currentAmount: goal.current_amount,
    targetAmount: goal.target_amount,
  }));
  const heuristicAdvice = buildFinanceAdvice(entriesRes.results, goalPayload);
  const totalIncome = entriesRes.results
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpense = entriesRes.results
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const byCategory = entriesRes.results
    .filter((entry) => entry.type === "expense")
    .reduce<Record<string, number>>((acc, entry) => {
      acc[entry.category] = (acc[entry.category] ?? 0) + entry.amount;
      return acc;
    }, {});

  const advice =
    (await createStructuredResponse<typeof heuristicAdvice>({
      env: context.env,
      schemaName: "finance_advice",
      schema: {
        type: "object",
        properties: {
          headline: { type: "string" },
          summary: { type: "string" },
          opportunities: {
            type: "array",
            items: { type: "string" },
          },
          actions: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["headline", "summary", "opportunities", "actions"],
        additionalProperties: false,
      },
      input: [
        {
          role: "system",
          content:
            "你是一位冷静、具体、重视执行的中文财务顾问。请根据用户的当月收支结构给出务实的节流建议，重点是可执行而不是空泛。",
        },
        {
          role: "user",
          content: [
            "请根据下面这份个人财务数据输出 JSON。",
            `本月收入总额：${totalIncome}`,
            `本月支出总额：${totalExpense}`,
            `支出分类：${JSON.stringify(byCategory)}`,
            `目标：${JSON.stringify(goalPayload)}`,
            "要求：headline 1 条；summary 1 段；opportunities 3 条；actions 4 条；语言具体，优先给实际省钱办法。",
          ].join("\n"),
        },
      ],
    }).catch(() => null)) ?? heuristicAdvice;

  return json({
    ok: true,
    provider: hasOpenAIConfig(context.env) && advice !== heuristicAdvice ? "openai" : "fallback",
    advice,
  });
};
