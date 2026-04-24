import { DEFAULT_APP_BRAND, DEFAULT_MODULE_PREFERENCES, DEFAULT_TERMINAL_LOG } from "../_lib/constants";
import { ensureDatabase } from "../_lib/db";

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

  if (!db) {
    return json({
      brand: DEFAULT_APP_BRAND,
      modules: DEFAULT_MODULE_PREFERENCES.map((item) => ({
        id: item.moduleId,
        isVisible: item.isVisible === 1,
        position: item.position,
      })),
      habits: [],
      terminalLog: [...DEFAULT_TERMINAL_LOG],
    });
  }

  const [settingsRes, modulesRes, habitsRes] = await Promise.all([
    db.prepare(
      `SELECT setting_key, setting_value
       FROM app_settings`,
    ).all<{ setting_key: string; setting_value: string }>(),
    db.prepare(
      `SELECT module_id, is_visible, position
       FROM module_preferences
       ORDER BY position ASC`,
    ).all<{ module_id: string; is_visible: number; position: number }>(),
    db.prepare(
      `SELECT id, slug, name, icon, color, position, is_active as isActive
       FROM habit_definitions
       ORDER BY position ASC`,
    ).all<{
      id: string;
      slug: string;
      name: string;
      icon: string;
      color: string;
      position: number;
      isActive: number;
    }>(),
  ]);

  const settingsMap = Object.fromEntries(
    settingsRes.results.map((row) => [row.setting_key, row.setting_value]),
  );

  return json({
    brand: {
      eyebrow: settingsMap.brand_eyebrow ?? DEFAULT_APP_BRAND.eyebrow,
      title: settingsMap.brand_title ?? DEFAULT_APP_BRAND.title,
      tagline: settingsMap.brand_tagline ?? DEFAULT_APP_BRAND.tagline,
      reminder: settingsMap.system_reminder ?? DEFAULT_APP_BRAND.reminder,
    },
    modules: modulesRes.results.map((item) => ({
      id: item.module_id,
      isVisible: item.is_visible === 1,
      position: item.position,
    })),
    habits: habitsRes.results.map((item) => ({
      ...item,
      isActive: item.isActive === 1,
    })),
    terminalLog: settingsMap.terminal_log
      ? (JSON.parse(settingsMap.terminal_log) as string[])
      : [...DEFAULT_TERMINAL_LOG],
  });
};
