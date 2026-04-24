import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
  BookOpenText,
  Clapperboard,
  CodeXml,
  Dumbbell,
  HeartHandshake,
  Languages,
  Laptop,
  MoonStar,
  Sunrise,
  Wallet,
} from "lucide-react";
import { getBootstrap, toggleHabit } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { BootstrapPayload, HabitDefinition } from "@/types/app";

const iconMap = {
  Sunrise,
  Languages,
  CodeXml,
  Laptop,
  Clapperboard,
  Dumbbell,
  BookOpenText,
  Wallet,
  HeartHandshake,
  MoonStar,
} as const;

const weekdayLabels = ["一", "二", "三", "四", "五", "六", "日"];

function getHabitIcon(definition: HabitDefinition) {
  return iconMap[definition.icon as keyof typeof iconMap] ?? Sunrise;
}

export function HabitsPage() {
  const [data, setData] = useState<BootstrapPayload | null>(null);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  useEffect(() => {
    void getBootstrap().then(setData);
  }, []);

  const habitData = data?.habits;

  const totalCompleted = useMemo(() => {
    if (!habitData) {
      return 0;
    }
    return Object.values(habitData.completions).filter(Boolean).length;
  }, [habitData]);

  async function handleToggle(slug: string) {
    if (!data) {
      return;
    }

    const nextCompleted = !data.habits.completions[slug];
    setPendingSlug(slug);
    setData({
      ...data,
      habits: {
        ...data.habits,
        completions: {
          ...data.habits.completions,
          [slug]: nextCompleted,
        },
      },
    });

    try {
      await toggleHabit(slug, data.habits.todayDate, nextCompleted);
    } finally {
      setPendingSlug(null);
    }
  }

  if (!habitData) {
    return <div className="p-8 text-sm text-steel">Loading habit engine...</div>;
  }

  return (
    <div className="space-y-6 p-5 md:p-8">
      <SectionHeader
        title="习惯打卡"
        description="先把执行链路做轻：勾选完成、看见连续天数、看见本周完成率、看见月度热力图。"
        action={
          <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white">
            今天 {dayjs(habitData.todayDate).format("M 月 D 日")}
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="panel-soft p-5">
              <p className="text-sm text-steel">今日打卡</p>
              <p className="mt-3 text-4xl font-bold text-white">{totalCompleted}</p>
              <p className="mt-2 text-sm text-steel">总共 {habitData.definitions.length} 项</p>
            </div>
            <div className="panel-soft p-5">
              <p className="text-sm text-steel">本周均值</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {Math.round(
                  Object.values(habitData.weeklyRates).reduce((sum, value) => sum + value, 0) /
                    Object.values(habitData.weeklyRates).length,
                )}
                %
              </p>
              <p className="mt-2 text-sm text-steel">维持节奏，不求花哨</p>
            </div>
            <div className="panel-soft p-5">
              <p className="text-sm text-steel">最佳连击</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {Math.max(...Object.values(habitData.streaks))}
                <span className="ml-1 text-lg text-steel">天</span>
              </p>
              <p className="mt-2 text-sm text-steel">当前最稳的是长期动作</p>
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Daily Tracking</p>
                <h3 className="mt-3 text-2xl font-bold text-white">追踪项</h3>
              </div>
              <div className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gold">
                Tap to complete
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {habitData.definitions.map((habit, index) => {
                const Icon = getHabitIcon(habit);
                const completed = habitData.completions[habit.slug];
                return (
                  <motion.button
                    key={habit.slug}
                    animate={{ opacity: 1, y: 0 }}
                    className={[
                      "group rounded-[26px] border p-5 text-left transition-all duration-300",
                      completed
                        ? "border-emerald-300/25 bg-emerald-500/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]",
                    ].join(" ")}
                    initial={{ opacity: 0, y: 10 }}
                    onClick={() => void handleToggle(habit.slug)}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-2xl border border-white/10 p-3"
                          style={{ backgroundColor: `${habit.color}18`, color: habit.color }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{habit.name}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.22em] text-steel">
                            连续 {habitData.streaks[habit.slug] ?? 0} 天
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]",
                          completed
                            ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-200"
                            : "border-white/10 bg-black/20 text-steel",
                        ].join(" ")}
                      >
                        {pendingSlug === habit.slug ? "Syncing" : completed ? "Done" : "Pending"}
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-steel">本周完成率</span>
                        <span className="text-white">{habitData.weeklyRates[habit.slug] ?? 0}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${habitData.weeklyRates[habit.slug] ?? 0}%`,
                            background: `linear-gradient(90deg, ${habit.color}, rgba(255,255,255,0.95))`,
                          }}
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <h3 className="text-xl font-bold text-white">日计划</h3>
            <div className="mt-4 space-y-3">
              {habitData.dailyPlan.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <span className="text-sm text-white">{item.title}</span>
                  <span className={item.completed ? "text-emerald-300" : "text-steel"}>
                    {item.completed ? "完成" : "待推进"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="text-xl font-bold text-white">周计划</h3>
            <div className="mt-4 space-y-3">
              {habitData.weeklyPlan.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <span className="text-sm text-white">{item.title}</span>
                  <span className={item.completed ? "text-emerald-300" : "text-steel"}>
                    {item.completed ? "已推进" : "未完成"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">月度热力图</h3>
              <div className="flex gap-2 text-[11px] text-steel">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div key={level} className="flex items-center gap-1">
                    <span
                      className="h-3 w-3 rounded-sm border border-white/10"
                      style={{
                        background:
                          level === 0
                            ? "rgba(255,255,255,0.04)"
                            : `rgba(250, 204, 21, ${0.15 + level * 0.16})`,
                      }}
                    />
                    {level === 0 ? "低" : level === 4 ? "高" : ""}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekdayLabels.map((label) => (
                <div key={label} className="pb-1 text-center text-[11px] uppercase tracking-[0.24em] text-steel">
                  {label}
                </div>
              ))}
              {habitData.heatmap.map((cell) => (
                <div
                  key={cell.date}
                  className="group relative aspect-square rounded-xl border border-white/5"
                  style={{
                    background:
                      cell.intensity === 0
                        ? "rgba(255,255,255,0.04)"
                        : `rgba(250, 204, 21, ${0.12 + cell.intensity * 0.14})`,
                  }}
                  title={`${cell.date} · ${cell.count} 项完成`}
                >
                  <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100 group-hover:ring-1 group-hover:ring-white/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
