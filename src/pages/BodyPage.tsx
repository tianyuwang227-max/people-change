import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, BedDouble, Dumbbell, HeartPulse } from "lucide-react";
import { getBody } from "@/lib/api";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { BodyModuleData } from "@/types/app";

function formatDelta(value: number) {
  if (value > 0) {
    return `+${value}`;
  }
  return `${value}`;
}

export function BodyPage() {
  const [data, setData] = useState<BodyModuleData | null>(null);

  useEffect(() => {
    void getBody().then(setData);
  }, []);

  if (!data) {
    return <div className="p-8 text-sm text-steel">Loading body metrics...</div>;
  }

  return (
    <div className="space-y-6 p-5 md:p-8">
      <SectionHeader
        title="身体数据"
        description="把体重、体脂、围度、训练、睡眠和精力放在一个面板里看，目标不是焦虑，而是更清楚地理解身体反馈。"
        action={
          <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white">
            过去 7 天
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="体重" value={`${data.summary.weight} kg`} detail="继续缓慢向下，不要急拉。" tone="gold" />
        <MetricCard label="体脂" value={`${data.summary.bodyFat}%`} detail="节奏健康，维持即可。" tone="teal" />
        <MetricCard label="训练频率" value={`${data.summary.trainingFrequency} 次`} detail="本周至少守住 4 次。" tone="orange" />
        <MetricCard label="睡眠均值" value={`${data.summary.sleepAverage} h`} detail="睡眠是恢复效率的地基。" tone="slate" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Weight & Body Fat</p>
                <h3 className="mt-3 text-2xl font-bold text-white">体重 / 体脂趋势</h3>
              </div>
              <Activity className="h-5 w-5 text-gold" />
            </div>
            <div className="mt-6 h-[320px] rounded-[24px] border border-white/10 bg-black/20 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trends}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis axisLine={false} dataKey="date" stroke="#8fa2c7" tickLine={false} />
                  <YAxis axisLine={false} stroke="#8fa2c7" tickLine={false} yAxisId="left" />
                  <YAxis axisLine={false} orientation="right" stroke="#8fa2c7" tickLine={false} yAxisId="right" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(8, 16, 30, 0.92)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "20px",
                    }}
                  />
                  <Legend />
                  <Line dataKey="weight" name="体重" stroke="#facc15" strokeWidth={2.4} yAxisId="left" />
                  <Line dataKey="bodyFat" name="体脂" stroke="#14b8a6" strokeWidth={2.4} yAxisId="right" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Recovery State</p>
                <h3 className="mt-3 text-2xl font-bold text-white">睡眠 / 精力变化</h3>
              </div>
              <BedDouble className="h-5 w-5 text-pulse" />
            </div>
            <div className="mt-6 h-[300px] rounded-[24px] border border-white/10 bg-black/20 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trends}>
                  <defs>
                    <linearGradient id="sleepGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.42} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis axisLine={false} dataKey="date" stroke="#8fa2c7" tickLine={false} />
                  <YAxis axisLine={false} stroke="#8fa2c7" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(8, 16, 30, 0.92)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "20px",
                    }}
                  />
                  <Area dataKey="sleepHours" fill="url(#sleepGradient)" name="睡眠小时" stroke="#60a5fa" strokeWidth={2.2} />
                  <Line dataKey="energy" name="精力评分" stroke="#f97316" strokeWidth={2.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <Dumbbell className="h-5 w-5 text-gold" />
              <h3 className="text-xl font-bold text-white">本周执行卡</h3>
            </div>
            <div className="mt-5 space-y-4">
              {data.weeklyCards.map((card) => (
                <div key={card.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white">{card.label}</span>
                    <span className="text-steel">{card.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold via-amber-300 to-pulse"
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <HeartPulse className="h-5 w-5 text-pulse" />
              <h3 className="text-xl font-bold text-white">围度变化</h3>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {data.measurements.map((item) => (
                <div key={item.key} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="text-sm text-steel">{item.label}</div>
                  <div className="mt-2 text-2xl font-bold text-white">
                    {item.value}
                    <span className="ml-1 text-sm text-steel">{item.unit}</span>
                  </div>
                  <div className={`mt-2 text-sm ${item.delta <= 0 ? "text-pulse" : "text-gold"}`}>
                    {formatDelta(item.delta)} {item.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="text-xl font-bold text-white">身体日志</h3>
            <div className="mt-5 space-y-3">
              {data.notes.map((note) => (
                <div key={note.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">{note.title}</div>
                    <span className="text-xs uppercase tracking-[0.22em] text-steel">{note.date}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-steel">{note.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
