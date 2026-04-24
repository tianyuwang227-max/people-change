import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Bot, BrainCircuit, ChevronRight, Sparkles } from "lucide-react";
import { analyzeReflection, getReflection } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ReflectionEntry, ReflectionModuleData } from "@/types/app";

const initialForm = {
  summary: "",
  wins: "",
  blockers: "",
  mood: "",
};

export function ReflectionPage() {
  const [data, setData] = useState<ReflectionModuleData | null>(null);
  const [form, setForm] = useState(initialForm);
  const [analysis, setAnalysis] = useState<ReflectionEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provider, setProvider] = useState<"openai" | "fallback">("fallback");

  useEffect(() => {
    void getReflection().then((payload) => {
      setData(payload);
      if (payload.history[0]) {
        setAnalysis(payload.history[0]);
      }
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await analyzeReflection(form);
      setAnalysis(result.entry);
      setProvider(result.provider ?? "fallback");
      setData((current) =>
        current
          ? {
              ...current,
              history: [result.entry, ...current.history.filter((item) => item.id !== result.entry.id)].slice(0, 6),
            }
          : current,
      );
      setForm(initialForm);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!data) {
    return <div className="p-8 text-sm text-steel">Loading reflection engine...</div>;
  }

  return (
    <div className="space-y-6 p-5 md:p-8">
      <SectionHeader
        title="AI 复盘"
        description="用结构化输入把今天讲清楚，再由服务端分析给出问题、追问和明天真正值得执行的动作。"
        action={
          <div className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-gold">
            Structured Analysis
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-5 w-5 text-pulse" />
              <h3 className="text-xl font-bold text-white">复盘引导</h3>
            </div>
            <div className="mt-5 space-y-3">
              {data.promptGuide.map((prompt) => (
                <div
                  key={prompt}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white"
                >
                  {prompt}
                </div>
              ))}
            </div>
          </div>

          <form className="panel p-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-gold" />
                <h3 className="text-xl font-bold text-white">提交今日复盘</h3>
              </div>
              <button
                className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold/15"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "分析中..." : "开始分析"}
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {[
                { key: "summary", label: "今天发生了什么", placeholder: "例如：推进了首页，但下午注意力被打散。" },
                { key: "wins", label: "今天做对了什么", placeholder: "例如：完成了关键页面结构，至少保住了一个主任务。" },
                { key: "blockers", label: "今天卡在哪里", placeholder: "例如：任务切换过多，被消息和杂事反复打断。" },
                { key: "mood", label: "今天的情绪状态", placeholder: "例如：疲惫、平稳、焦躁但清醒。" },
              ].map((field) => (
                <label key={field.key} className="block">
                  <div className="mb-2 text-sm font-medium text-white">{field.label}</div>
                  <textarea
                    className="min-h-[104px] w-full rounded-[22px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-steel focus:border-gold/30"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                  />
                </label>
              ))}
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-gold" />
                <h3 className="text-xl font-bold text-white">分析结果</h3>
              </div>
              {analysis ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.24em] text-steel">
                    {analysis.entryDate}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-steel">
                    {provider === "openai" ? "OpenAI" : "Fallback"}
                  </span>
                </div>
              ) : null}
            </div>

            {analysis ? (
              <div className="mt-5 space-y-5">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <h4 className="text-lg font-semibold text-white">{analysis.analysis.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-steel">{analysis.analysis.summary}</p>
                </div>

                {[
                  { title: "今天的强项", items: analysis.analysis.strengths },
                  { title: "核心阻力", items: analysis.analysis.bottlenecks },
                  { title: "AI 追问", items: analysis.analysis.followUps },
                  { title: "明日动作", items: analysis.analysis.tomorrowActions },
                ].map((section) => (
                  <div key={section.title}>
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-steel">
                      {section.title}
                    </h4>
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white"
                        >
                          <ChevronRight className="mt-1 h-4 w-4 flex-none text-gold" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[24px] border border-dashed border-white/15 bg-black/20 p-6 text-sm text-steel">
                先在左侧填一份今天的复盘，分析结果会出现在这里。
              </div>
            )}
          </div>

          <div className="panel p-6">
            <h3 className="text-xl font-bold text-white">最近记录</h3>
            <div className="mt-5 space-y-3">
              {data.history.map((entry, index) => (
                <motion.button
                  key={entry.id}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:bg-white/[0.05]"
                  initial={{ opacity: 0, x: -10 }}
                  onClick={() => setAnalysis(entry)}
                  transition={{ delay: index * 0.04 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">{entry.entryDate}</div>
                    <span className="text-xs uppercase tracking-[0.22em] text-steel">{entry.mood}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-steel">{entry.summary}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
