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
    | { id?: string; status?: "planned" | "active" | "done" }
    | null;

  if (!requestBody?.id || !requestBody.status) {
    return json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const db = await ensureDatabase(context.env);
  if (!db) {
    return json({ ok: true });
  }

  await db
    .prepare(`UPDATE learning_time_blocks SET status = ?, updated_at = ? WHERE id = ?`)
    .bind(requestBody.status, new Date().toISOString(), requestBody.id)
    .run();

  return json({ ok: true });
};
