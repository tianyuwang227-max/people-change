import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Bolt, CircleCheckBig, Coins, Flame, FolderKanban, Timer } from "lucide-react";
import { getBootstrap } from "@/lib/api";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { BootstrapPayload } from "@/types/app";

const summaryCards = [
  { label: "今日完成", icon: CircleCheckBig, field: "completedHabits" as const, suffix: "项" },
  { label: "本周完成率", icon: Flame, field: "weeklyCompletion" as const, suffix: "%" },
  { label: "进行中项目", icon: FolderKanban, field: "activeProjects" as const, suffix: "个" },
  { label: "储蓄目标", icon: Coins, field: "savingsProgress" as const, suffix: "%" },
];

export function DashboardPage() {
  const [data, setData] = useState<BootstrapPayload | null>(null);

  useEffect(() => {
    void getBootstrap().then(setData);
  }, []);

  if (!data) {
    return <div className="p-8 text-sm text-steel">Loading control surface...</div>;
  }

  return (
    <div className="space-y-6 p-5 md:p-8">
      <SectionHeader
        title="Dashboard"
        description="简单直白地看见今天的节奏、推进状态和关键风险。先抓方向，再钻细节。"
        action={
          <div className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-gold">
            {dayjs(data.generatedAt).format("YYYY.MM.DD HH:mm")} Updated
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {data.dashboard.heroStats.map((item, index) => (
          <motion.div
            key={item.label}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: index * 0.06 }}
          >
            <MetricCard {...item} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Quick View</p>
              <h3 className="mt-3 text-2xl font-bold text-white">今日概况</h3>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-gold">
              <Bolt className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ field, icon: Icon, label, suffix }) => (
              <div key={field} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-2.5 text-pulse">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-steel">{label}</p>
                </div>
                <p className="mt-4 text-3xl font-bold text-white">
                  {data.dashboard.todaySummary[field]}
                  <span className="ml-1 text-base text-steel">{suffix}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 h-[280px] rounded-[28px] border border-white/10 bg-black/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">收支趋势</p>
                <p className="text-xs text-steel">给财务模块一个最小但清晰的入口</p>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-steel">
                CNY
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dashboard.financeTrend}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.48} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.42} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis axisLine={false} dataKey="month" stroke="#8fa2c7" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(8, 16, 30, 0.92)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "20px",
                  }}
                />
                <Area dataKey="income" fill="url(#incomeGradient)" stroke="#14b8a6" strokeWidth={2.4} />
                <Area dataKey="expense" fill="url(#expenseGradient)" stroke="#f97316" strokeWidth={2.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-pulse" />
              <h3 className="text-xl font-bold text-white">今日时间块</h3>
            </div>
            <div className="mt-5 space-y-3">
              {data.dashboard.timeBlocks.map((block) => (
                <div key={block.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{block.title}</span>
                    <span className="text-xs uppercase tracking-[0.24em] text-steel">{block.lane}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-steel">
                    <span>{block.time}</span>
                    <span>{block.energy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">本周目标</h3>
              <span className="text-xs uppercase tracking-[0.24em] text-gold">Weekly</span>
            </div>
            <div className="mt-5 space-y-4">
              {data.dashboard.weeklyGoals.map((goal) => (
                <div key={goal.id}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white">{goal.title}</span>
                    <span className="text-steel">{goal.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold via-amber-300 to-pulse"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-steel">{goal.target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Terminal Mirror</p>
            <h3 className="mt-3 text-2xl font-bold text-white">伪终端提示</h3>
          </div>
          <span className="rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-orange-200">
            Warning
          </span>
        </div>
        <div className="mt-5 rounded-[24px] border border-white/10 bg-[#050914] p-5 font-mono text-sm text-emerald-300">
          {data.dashboard.terminalLog.map((line) => (
            <div key={line} className="py-1">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
