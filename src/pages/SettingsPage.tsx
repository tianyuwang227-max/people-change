import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Save } from "lucide-react";
import { moduleNav } from "@/lib/modules";
import { useAppSettings } from "@/context/AppSettingsContext";

export function SettingsPage() {
  const { settings, persist } = useAppSettings();
  const [draft, setDraft] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const sortedModules = [...draft.modules].sort((left, right) => left.position - right.position);
  const sortedHabits = [...draft.habits].sort((left, right) => left.position - right.position);

  function moveModule(id: string, direction: -1 | 1) {
    const ordered = [...sortedModules];
    const index = ordered.findIndex((item) => item.id === id);
    const swapIndex = index + direction;
    if (index < 0 || swapIndex < 0 || swapIndex >= ordered.length) {
      return;
    }
    [ordered[index], ordered[swapIndex]] = [ordered[swapIndex], ordered[index]];
    setDraft({
      ...draft,
      modules: ordered.map((item, position) => ({ ...item, position })),
    });
  }

  function moveHabit(id: string, direction: -1 | 1) {
    const ordered = [...sortedHabits];
    const index = ordered.findIndex((item) => item.id === id);
    const swapIndex = index + direction;
    if (index < 0 || swapIndex < 0 || swapIndex >= ordered.length) {
      return;
    }
    [ordered[index], ordered[swapIndex]] = [ordered[swapIndex], ordered[index]];
    setDraft({
      ...draft,
      habits: ordered.map((item, position) => ({ ...item, position })),
    });
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await persist(draft);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6 p-5 md:p-8">
      <div className="panel p-8">
        <p className="eyebrow">Control Settings</p>
        <h2 className="mt-4 text-4xl font-bold text-white">设置</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-steel">
          这里现在已经不只是说明页了。你可以直接修改品牌文案、习惯项、模块顺序和显示状态，整个控制台会跟着一起变化。
        </p>
        <button
          className="mt-6 rounded-full border border-gold/20 bg-gold/10 px-5 py-2 text-sm font-medium text-gold transition hover:bg-gold/15"
          onClick={() => void handleSave()}
        >
          <span className="inline-flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "保存中..." : "保存设置"}
          </span>
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel p-6">
          <h3 className="text-xl font-bold text-white">品牌文案</h3>
          <div className="mt-5 space-y-4">
            {[
              { key: "eyebrow", label: "副标题眉文", value: draft.brand.eyebrow },
              { key: "title", label: "主标题", value: draft.brand.title },
              { key: "tagline", label: "站点说明", value: draft.brand.tagline },
              { key: "reminder", label: "系统提醒", value: draft.brand.reminder },
            ].map((field) => (
              <label key={field.key} className="block">
                <div className="mb-2 text-sm font-medium text-white">{field.label}</div>
                <textarea
                  className="min-h-[72px] w-full rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-steel focus:border-gold/30"
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      brand: {
                        ...draft.brand,
                        [field.key]: event.target.value,
                      },
                    })
                  }
                  value={field.value}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <h3 className="text-xl font-bold text-white">模块顺序与显示</h3>
            <div className="mt-5 space-y-3">
              {sortedModules.map((item, index) => {
                const moduleMeta = moduleNav.find((module) => module.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <div>
                      <div className="font-medium text-white">{moduleMeta?.title ?? item.id}</div>
                      <div className="text-xs text-steel">{moduleMeta?.subtitle}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white"
                        disabled={index === 0}
                        onClick={() => moveModule(item.id, -1)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white"
                        disabled={index === sortedModules.length - 1}
                        onClick={() => moveModule(item.id, 1)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        className={[
                          "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em]",
                          item.isVisible
                            ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                            : "border-white/10 bg-black/20 text-steel",
                        ].join(" ")}
                        disabled={item.id === "settings"}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            modules: draft.modules.map((module) =>
                              module.id === item.id
                                ? { ...module, isVisible: item.id === "settings" ? true : !module.isVisible }
                                : module,
                            ),
                          })
                        }
                      >
                        {item.isVisible ? "Visible" : "Hidden"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="text-xl font-bold text-white">习惯项配置</h3>
            <div className="mt-5 space-y-3">
              {sortedHabits.map((habit, index) => (
                <div
                  key={habit.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <input
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-gold/30"
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        habits: draft.habits.map((item) =>
                          item.id === habit.id ? { ...item, name: event.target.value } : item,
                        ),
                      })
                    }
                    value={habit.name}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white"
                      disabled={index === 0}
                      onClick={() => moveHabit(habit.id, -1)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white"
                      disabled={index === sortedHabits.length - 1}
                      onClick={() => moveHabit(habit.id, 1)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      className={[
                        "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em]",
                        habit.isActive
                          ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                          : "border-white/10 bg-black/20 text-steel",
                      ].join(" ")}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          habits: draft.habits.map((item) =>
                            item.id === habit.id ? { ...item, isActive: !item.isActive } : item,
                          ),
                        })
                      }
                    >
                      {habit.isActive ? "Active" : "Disabled"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">终端日志</h3>
              <span className="rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-orange-200">
                Critical
              </span>
            </div>

            <div className="mt-5 rounded-[24px] border border-white/10 bg-[#050914] p-5 font-mono text-sm text-emerald-300">
              {draft.terminalLog.map((line) => (
                <div key={line} className="py-1">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
