import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BrainCircuit, CircleDollarSign, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { analyzeFinance, getFinance } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { FinanceAdvice, FinanceModuleData } from "@/types/app";

function formatCurrency(value: number) {
  return `¥${value.toLocaleString("zh-CN")}`;
}

export function FinancePage() {
  const [data, setData] = useState<FinanceModuleData | null>(null);
  const [advice, setAdvice] = useState<FinanceAdvice | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [provider, setProvider] = useState<"openai" | "fallback">("fallback");

  useEffect(() => {
    void getFinance().then((payload) => {
      setData(payload);
      setAdvice(payload.advice);
    });
  }, []);

  async function handleAnalyze() {
    setIsAnalyzing(true);
    try {
      const result = await analyzeFinance();
      setAdvice(result.advice);
      setProvider(result.provider ?? "fallback");
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (!data) {
    return <div className="p-8 text-sm text-steel">Loading finance control...</div>;
  }

  return (
    <div className="space-y-6 p-5 md:p-8">
      <SectionHeader
        title="财务"
        description="看清收入来源、支出去向和目标进度，再用 AI 把可节省的空间具体拆出来。"
        action={
          <button
            className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold/15"
            onClick={() => void handleAnalyze()}
          >
            {isAnalyzing ? "分析中..." : "重新分析支出"}
          </button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {[
          { label: "本月收入", value: formatCurrency(data.summary.monthIncome), icon: TrendingUp },
          { label: "本月支出", value: formatCurrency(data.summary.monthExpense), icon: TrendingDown },
          { label: "本月结余", value: formatCurrency(data.summary.balance), icon: PiggyBank },
          { label: "储蓄率", value: `${data.summary.savingsRate}%`, icon: CircleDollarSign },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="panel-soft p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-2.5 text-gold">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm text-steel">{card.label}</p>
              </div>
              <p className="mt-4 text-3xl font-bold text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Income & Expense Trend</p>
                <h3 className="mt-3 text-2xl font-bold text-white">月收入趋势 / 月支出趋势</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.22em] text-steel">
                CNY
              </span>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div className="h-[260px] rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="mb-3 text-sm font-medium text-white">月收入趋势</div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trends}>
                    <defs>
                      <linearGradient id="financeIncome" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.46} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.04} />
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
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Area dataKey="income" fill="url(#financeIncome)" stroke="#14b8a6" strokeWidth={2.4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[260px] rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="mb-3 text-sm font-medium text-white">月支出趋势</div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trends}>
                    <defs>
                      <linearGradient id="financeExpense" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.46} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.04} />
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
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Area dataKey="expense" fill="url(#financeExpense)" stroke="#f97316" strokeWidth={2.4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">支出去向</h3>
              <span className="text-xs uppercase tracking-[0.22em] text-steel">Current Month</span>
            </div>
            <div className="mt-5 h-[280px] rounded-[24px] border border-white/10 bg-black/20 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.breakdown}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis axisLine={false} dataKey="category" stroke="#8fa2c7" tickLine={false} />
                  <YAxis axisLine={false} stroke="#8fa2c7" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(8, 16, 30, 0.92)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "20px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="amount" fill="#facc15" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {data.breakdown.map((item) => (
                <div key={item.category} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{item.category}</span>
                    <span className="text-sm text-steel">{item.share}%</span>
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">{formatCurrency(item.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-5 w-5 text-gold" />
              <h3 className="text-xl font-bold text-white">AI 财务分析</h3>
            </div>
            <div className="mt-3 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-steel">
              {provider === "openai" ? "OpenAI" : "Fallback"}
            </div>
            {advice ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-[24px] border border-gold/20 bg-gold/10 p-5">
                  <div className="text-lg font-semibold text-white">{advice.headline}</div>
                  <p className="mt-3 text-sm leading-7 text-white/80">{advice.summary}</p>
                </div>
                <div>
                  <div className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-steel">可节省空间</div>
                  <div className="space-y-2">
                    {advice.opportunities.map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-steel">具体方法</div>
                  <div className="space-y-2">
                    {advice.actions.map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="panel p-6">
            <h3 className="text-xl font-bold text-white">目标进度</h3>
            <div className="mt-5 space-y-4">
              {data.goals.map((goal) => (
                <div key={goal.id}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white">{goal.title}</span>
                    <span className="text-steel">{goal.progress}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold via-amber-300 to-pulse"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-steel">
                    <span>{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</span>
                    <span>{goal.targetDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="text-xl font-bold text-white">近期记录</h3>
            <div className="mt-5 space-y-3">
              {data.records.map((record) => (
                <div key={record.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{record.title}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.22em] text-steel">
                        {record.entryDate} · {record.category}
                      </div>
                    </div>
                    <div className={record.type === "income" ? "text-pulse" : "text-ember"}>
                      {record.type === "income" ? "+" : "-"}
                      {formatCurrency(record.amount)}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-steel">{record.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
