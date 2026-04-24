import { DEFAULT_BODY_ENTRIES } from "../_lib/constants";
import { ensureDatabase } from "../_lib/db";

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    ...init,
  });
}

function average(numbers: number[]) {
  if (numbers.length === 0) {
    return 0;
  }
  return Number((numbers.reduce((sum, value) => sum + value, 0) / numbers.length).toFixed(1));
}

function buildPayload(
  entries: Array<{
    id: string;
    entry_date: string;
    weight: number;
    body_fat: number;
    waist: number;
    chest: number;
    arm: number;
    thigh: number;
    sleep_hours: number;
    energy: number;
    nutrition_adherence: number;
    training_completed: number;
    note: string;
  }>,
) {
  const sorted = [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date));
  const latest = sorted[sorted.length - 1];
  const earliest = sorted[0];
  const trainingFrequency = sorted.reduce((sum, entry) => sum + entry.training_completed, 0);
  const nutritionAverage = Math.round(average(sorted.map((entry) => entry.nutrition_adherence)));
  const sleepAverage = average(sorted.map((entry) => entry.sleep_hours));
  const energyAverage = average(sorted.map((entry) => entry.energy));

  return {
    summary: {
      weight: latest.weight,
      bodyFat: latest.body_fat,
      trainingFrequency,
      nutritionAdherence: nutritionAverage,
      sleepAverage,
      energyAverage,
    },
    trends: sorted.map((entry) => ({
      date: entry.entry_date.slice(5),
      weight: entry.weight,
      bodyFat: entry.body_fat,
      sleepHours: entry.sleep_hours,
      energy: entry.energy,
    })),
    measurements: [
      {
        key: "waist",
        label: "腰围",
        value: latest.waist,
        unit: "cm",
        delta: Number((latest.waist - earliest.waist).toFixed(1)),
      },
      {
        key: "chest",
        label: "胸围",
        value: latest.chest,
        unit: "cm",
        delta: Number((latest.chest - earliest.chest).toFixed(1)),
      },
      {
        key: "arm",
        label: "手臂围度",
        value: latest.arm,
        unit: "cm",
        delta: Number((latest.arm - earliest.arm).toFixed(1)),
      },
      {
        key: "thigh",
        label: "腿围",
        value: latest.thigh,
        unit: "cm",
        delta: Number((latest.thigh - earliest.thigh).toFixed(1)),
      },
    ],
    weeklyCards: [
      {
        label: "训练频率",
        value: `${trainingFrequency} / 7 天`,
        progress: Math.min(100, Math.round((trainingFrequency / 4) * 100)),
        tone: "gold",
      },
      {
        label: "饮食执行",
        value: `${nutritionAverage}%`,
        progress: nutritionAverage,
        tone: "teal",
      },
      {
        label: "睡眠质量",
        value: `${sleepAverage} h`,
        progress: Math.min(100, Math.round((sleepAverage / 8) * 100)),
        tone: "slate",
      },
      {
        label: "精力状态",
        value: `${energyAverage} / 10`,
        progress: Math.min(100, Math.round((energyAverage / 10) * 100)),
        tone: "orange",
      },
    ],
    notes: sorted
      .slice(-4)
      .reverse()
      .map((entry) => ({
        id: entry.id,
        date: entry.entry_date,
        title: `${entry.weight} kg · ${entry.body_fat}% 体脂`,
        detail: entry.note,
      })),
  };
}

export const onRequestGet: PagesFunction = async (context) => {
  const db = await ensureDatabase(context.env);

  if (!db) {
    return json(
      buildPayload(
        DEFAULT_BODY_ENTRIES.map((entry, index) => ({
          id: `body-entry-${index}`,
          entry_date: entry.entryDate,
          weight: entry.weight,
          body_fat: entry.bodyFat,
          waist: entry.waist,
          chest: entry.chest,
          arm: entry.arm,
          thigh: entry.thigh,
          sleep_hours: entry.sleepHours,
          energy: entry.energy,
          nutrition_adherence: entry.nutritionAdherence,
          training_completed: entry.trainingCompleted,
          note: entry.note,
        })),
      ),
    );
  }

  const entries = await db.prepare(
    `SELECT id, entry_date, weight, body_fat, waist, chest, arm, thigh, sleep_hours, energy, nutrition_adherence, training_completed, note
     FROM body_entries
     ORDER BY entry_date ASC`,
  ).all<{
    id: string;
    entry_date: string;
    weight: number;
    body_fat: number;
    waist: number;
    chest: number;
    arm: number;
    thigh: number;
    sleep_hours: number;
    energy: number;
    nutrition_adherence: number;
    training_completed: number;
    note: string;
  }>();

  return json(buildPayload(entries.results));
};
