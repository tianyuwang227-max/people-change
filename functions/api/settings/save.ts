import { ensureDatabase } from "../../_lib/db";

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
  const payload = (await context.request.json().catch(() => null)) as
    | {
        brand?: { eyebrow: string; title: string; tagline: string; reminder: string };
        modules?: Array<{ id: string; isVisible: boolean; position: number }>;
        habits?: Array<{ id: string; name: string; isActive: boolean; position: number }>;
        terminalLog?: string[];
      }
    | null;

  if (!db || !payload) {
    return json({ ok: false }, { status: 400 });
  }

  const now = new Date().toISOString();

  if (payload.brand) {
    await db.batch([
      db.prepare(
        `INSERT INTO app_settings (setting_key, setting_value, updated_at)
         VALUES ('brand_eyebrow', ?, ?)
         ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = excluded.updated_at`,
      ).bind(payload.brand.eyebrow, now),
      db.prepare(
        `INSERT INTO app_settings (setting_key, setting_value, updated_at)
         VALUES ('brand_title', ?, ?)
         ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = excluded.updated_at`,
      ).bind(payload.brand.title, now),
      db.prepare(
        `INSERT INTO app_settings (setting_key, setting_value, updated_at)
         VALUES ('brand_tagline', ?, ?)
         ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = excluded.updated_at`,
      ).bind(payload.brand.tagline, now),
      db.prepare(
        `INSERT INTO app_settings (setting_key, setting_value, updated_at)
         VALUES ('system_reminder', ?, ?)
         ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = excluded.updated_at`,
      ).bind(payload.brand.reminder, now),
    ]);
  }

  if (payload.terminalLog) {
    await db
      .prepare(
        `INSERT INTO app_settings (setting_key, setting_value, updated_at)
         VALUES ('terminal_log', ?, ?)
         ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = excluded.updated_at`,
      )
      .bind(JSON.stringify(payload.terminalLog), now)
      .run();
  }

  if (payload.modules) {
    await db.batch(
      payload.modules.map((module) =>
        db
          .prepare(
            `INSERT INTO module_preferences (module_id, is_visible, position, updated_at)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(module_id) DO UPDATE SET
               is_visible = excluded.is_visible,
               position = excluded.position,
               updated_at = excluded.updated_at`,
          )
          .bind(module.id, module.id === "settings" ? 1 : module.isVisible ? 1 : 0, module.position, now),
      ),
    );
  }

  if (payload.habits) {
    await db.batch(
      payload.habits.map((habit) =>
        db
          .prepare(
            `UPDATE habit_definitions
             SET name = ?, is_active = ?, position = ?, updated_at = ?
             WHERE id = ?`,
          )
          .bind(habit.name, habit.isActive ? 1 : 0, habit.position, now, habit.id),
      ),
    );
  }

  return json({ ok: true });
};
