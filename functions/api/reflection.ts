import { buildReflectionPrompts } from "../_lib/reflection";
import { ensureDatabase } from "../_lib/db";
import { todayInShanghai } from "../_lib/date";

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    ...init,
  });
}

export const onRequestGet: PagesFunction = async (context) => {
  const db = await ensureDatabase(context.env);
  const today = todayInShanghai();

  if (!db) {
    return json({
      todayDate: today,
      promptGuide: buildReflectionPrompts(),
      history: [],
    });
  }

  const entries = await db.prepare(
    `SELECT id, entry_date, summary, wins, blockers, mood, analysis_json
     FROM reflection_entries
     ORDER BY entry_date DESC, created_at DESC
     LIMIT 6`,
  ).all<{
    id: string;
    entry_date: string;
    summary: string;
    wins: string;
    blockers: string;
    mood: string;
    analysis_json: string;
  }>();

  return json({
    todayDate: today,
    promptGuide: buildReflectionPrompts(),
    history: entries.results.map((entry) => ({
      id: entry.id,
      entryDate: entry.entry_date,
      summary: entry.summary,
      wins: entry.wins,
      blockers: entry.blockers,
      mood: entry.mood,
      analysis: JSON.parse(entry.analysis_json),
    })),
  });
};
