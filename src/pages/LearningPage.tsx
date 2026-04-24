import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, Clock3, ListTodo, PlayCircle, Target } from "lucide-react";
import { getLearning, toggleLearningTodo, updateLearningBlockStatus } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { LearningBlockStatus, LearningModuleData } from "@/types/app";

const statusMeta: Record<
  LearningBlockStatus,
  { label: string; className: string; next: LearningBlockStatus }
> = {
  planned: {
    label: "Planned",
    className: "border-white/10 bg-black/20 text-steel",
    next: "active",
  },
  active: {
    label: "Active",
    className: "border-pulse/20 bg-pulse/10 text-pulse",
    next: "done",
  },
  done: {
    label: "Done",
    className: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
    next: "planned",
  },
};

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}

export function LearningPage() {
  const [data, setData] = useState<LearningModuleData | null>(null);
  const [pendingTodoId, setPendingTodoId] = useState<string | null>(null);
  const [pendingBlockId, setPendingBlockId] = useState<string | null>(null);

  useEffect(() => {
    void getLearning().then(setData);
  }, []);

  const progressCards = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      { label: "深度投入", value: formatMinutes(data.summary.focusMinutes), icon: Brain },
      { label: "待办完成", value: `${data.summary.completedTodos}/${data.summary.totalTodos}`, icon: ListTodo },
      { label: "周目标均值", value: `${data.summary.averageGoalProgress}%`, icon: Target },
      { label: "下一块", value: data.summary.nextBlockLabel, icon: PlayCircle },
    ];
  }, [data]);

  async function handleTodoToggle(id: string, completed: boolean) {
    if (!data) {
      return;
    }

    setPendingTodoId(id);
    const nextTodos = data.todos.map((todo) =>
      todo.id === id ? { ...todo, completed } : todo,
    );
    setData({
      ...data,
      todos: nextTodos,
      summary: {
        ...data.summary,
        completedTodos: nextTodos.filter((todo) => todo.completed).length,
      },
    });

    try {
      await toggleLearningTodo(id, completed);
    } finally {
      setPendingTodoId(null);
    }
  }

  async function handleBlockStatus(id: string, status: LearningBlockStatus) {
    if (!data) {
      return;
    }

    const nextStatus = statusMeta[status].next;
    const nextBlocks = data.blocks.map((block) =>
      block.id === id ? { ...block, status: nextStatus } : block,
    );
    setPendingBlockId(id);
    setData({
      ...data,
      blocks: nextBlocks,
      summary: {
        ...data.summary,
        nextBlockLabel: nextBlocks.find((block) => block.status !== "done")?.title ?? "今日已清空",
      },
    });

    try {
      await updateLearningBlockStatus(id, nextStatus);
    } finally {
      setPendingBlockId(null);
    }
  }

  if (!data) {
    return <div className="p-8 text-sm text-steel">Loading learning surface...</div>;
  }

  return (
    <div className="space-y-6 p-5 md:p-8">
      <SectionHeader
        title="学习管理"
        description="把一天拆成可执行的时间块，用更轻的任务面板承接推进，再用周目标防止努力被切碎。"
        action={
          <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white">
            今日节奏已加载
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {progressCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="panel-soft p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-2.5 text-gold">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm text-steel">{card.label}</p>
              </div>
              <p className="mt-4 text-3xl font-bold text-white break-words">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Time Blocks</p>
              <h3 className="mt-3 text-2xl font-bold text-white">今日时间块</h3>
            </div>
            <Clock3 className="h-5 w-5 text-pulse" />
          </div>

          <div className="mt-6 space-y-4">
            {data.blocks.map((block, index) => (
              <motion.button
                key={block.id}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-[26px] border border-white/10 bg-white/[0.03] p-5 text-left transition-colors hover:bg-white/[0.05]"
                initial={{ opacity: 0, y: 10 }}
                onClick={() => void handleBlockStatus(block.id, block.status)}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-steel">
                      {block.startTime} - {block.endTime}
                    </div>
                    <h4 className="mt-2 text-xl font-semibold text-white">{block.title}</h4>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">{block.notes}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.22em] text-steel">
                      {block.lane}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.22em] text-steel">
                      {block.energy}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em] ${statusMeta[block.status].className}`}>
                      {pendingBlockId === block.id ? "Syncing" : statusMeta[block.status].label}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <h3 className="text-xl font-bold text-white">今日待办</h3>
            </div>
            <div className="mt-5 space-y-3">
              {data.todos.map((todo) => (
                <button
                  key={todo.id}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition-colors hover:bg-white/[0.05]"
                  onClick={() => void handleTodoToggle(todo.id, !todo.completed)}
                >
                  <span className="text-sm text-white">{todo.title}</span>
                  <span
                    className={[
                      "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]",
                      todo.completed
                        ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                        : "border-white/10 bg-black/20 text-steel",
                    ].join(" ")}
                  >
                    {pendingTodoId === todo.id ? "Syncing" : todo.completed ? "Done" : "Todo"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-gold" />
              <h3 className="text-xl font-bold text-white">本周总目标</h3>
            </div>
            <div className="mt-5 space-y-4">
              {data.weeklyGoals.map((goal) => (
                <div key={goal.id}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white">{goal.title}</span>
                    <span className="text-steel">
                      {goal.progress}% · {goal.target}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pulse via-gold to-amber-200"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
