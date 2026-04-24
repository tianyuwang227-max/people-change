import { ensureDatabase } from "../../_lib/db";
import { createReflectionAnalysis } from "../../_lib/reflection";
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
  const requestBody = (await context.request.json().catch(() => null)) as
    | { summary?: string; wins?: string; blockers?: string; mood?: string }
    | null;

  if (
    !requestBody?.summary?.trim() ||
    !requestBody.wins?.trim() ||
    !requestBody.blockers?.trim() ||
    !requestBody.mood?.trim()
  ) {
    return json({ ok: false, error: "请先填写完整的复盘信息。" }, { status: 400 });
  }

  const fallbackAnalysis = createReflectionAnalysis({
    summary: requestBody.summary,
    wins: requestBody.wins,
    blockers: requestBody.blockers,
    mood: requestBody.mood,
  });
  const analysis =
    (await createStructuredResponse<typeof fallbackAnalysis>({
      env: context.env,
      schemaName: "reflection_analysis",
      schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          strengths: {
            type: "array",
            items: { type: "string" },
          },
          bottlenecks: {
            type: "array",
            items: { type: "string" },
          },
          followUps: {
            type: "array",
            items: { type: "string" },
          },
          tomorrowActions: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["title", "summary", "strengths", "bottlenecks", "followUps", "tomorrowActions"],
        additionalProperties: false,
      },
      input: [
        {
          role: "system",
          content:
            "你是一位严谨但支持性的个人成长复盘教练。请根据用户当天的输入，输出中文 JSON。重点给出真实问题、可执行建议和明天的具体动作，不要空泛鸡汤。",
        },
        {
          role: "user",
          content: [
            "请分析下面这份今日复盘，并严格输出 JSON。",
            `今天发生了什么：${requestBody.summary.trim()}`,
            `今天做对了什么：${requestBody.wins.trim()}`,
            `今天卡在哪里：${requestBody.blockers.trim()}`,
            `今天的情绪状态：${requestBody.mood.trim()}`,
            "要求：strengths、bottlenecks、followUps、tomorrowActions 各输出 3 条，语言简洁、具体、可执行。",
          ].join("\n"),
        },
      ],
    }).catch(() => null)) ?? fallbackAnalysis;

  const db = await ensureDatabase(context.env);
  const today = todayInShanghai();
  const id = `reflection-${today}-${Date.now()}`;
  const now = new Date().toISOString();

  if (db) {
    await db
      .prepare(
        `INSERT INTO reflection_entries
         (id, entry_date, summary, wins, blockers, mood, analysis_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        today,
        requestBody.summary.trim(),
        requestBody.wins.trim(),
        requestBody.blockers.trim(),
        requestBody.mood.trim(),
        JSON.stringify(analysis),
        now,
        now,
      )
      .run();
  }

  return json({
    ok: true,
    provider: hasOpenAIConfig(context.env) && analysis !== fallbackAnalysis ? "openai" : "fallback",
    entry: {
      id,
      entryDate: today,
      summary: requestBody.summary.trim(),
      wins: requestBody.wins.trim(),
      blockers: requestBody.blockers.trim(),
      mood: requestBody.mood.trim(),
      analysis,
    },
  });
};
