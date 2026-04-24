import { ensureDatabase } from "../../../_lib/db";

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
    | { id?: string; completed?: boolean }
    | null;

  if (!requestBody?.id || typeof requestBody.completed !== "boolean") {
    return json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const db = await ensureDatabase(context.env);
  if (!db) {
    return json({ ok: true });
  }

  await db
    .prepare(`UPDATE learning_todos SET completed = ?, updated_at = ? WHERE id = ?`)
    .bind(requestBody.completed ? 1 : 0, new Date().toISOString(), requestBody.id)
    .run();

  return json({ ok: true });
};
