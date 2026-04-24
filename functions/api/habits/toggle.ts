import { ensureDatabase } from "../../_lib/db";
import { createMockPayload } from "../../_lib/mock-data";

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
    | { slug?: string; date?: string; completed?: boolean }
    | null;

  if (!requestBody?.slug || !requestBody.date || typeof requestBody.completed !== "boolean") {
    return json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const db = await ensureDatabase(context.env);

  if (!db) {
    return json({ ok: true, payload: createMockPayload() });
  }

  const now = new Date().toISOString();
  const definition = await db
    .prepare(`SELECT id FROM habit_definitions WHERE slug = ? LIMIT 1`)
    .bind(requestBody.slug)
    .first<{ id: string }>();

  if (!definition) {
    return json({ ok: false, error: "Habit definition not found" }, { status: 404 });
  }

  await db
    .prepare(
      `INSERT INTO habit_checkins (id, habit_id, check_date, completed, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(habit_id, check_date)
       DO UPDATE SET completed = excluded.completed, updated_at = excluded.updated_at`,
    )
    .bind(
      `checkin-${requestBody.slug}-${requestBody.date}`,
      definition.id,
      requestBody.date,
      requestBody.completed ? 1 : 0,
      now,
      now,
    )
    .run();

  return json({ ok: true });
};
