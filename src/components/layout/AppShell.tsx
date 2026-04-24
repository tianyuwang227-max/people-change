import { AnimatePresence, motion } from "framer-motion";
import { BellDot, Flame, PanelLeftDashed, Sparkles } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { moduleNav } from "@/lib/modules";
import { useAppSettings } from "@/context/AppSettingsContext";

function getNavClass(isActive: boolean) {
  return [
    "group flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300",
    isActive
      ? "border-white/15 bg-white/[0.09] shadow-[0_18px_30px_rgba(15,23,42,0.18)]"
      : "border-white/5 bg-white/[0.025] hover:border-white/10 hover:bg-white/[0.05]",
  ].join(" ");
}

export function AppShell() {
  const location = useLocation();
  const { settings } = useAppSettings();
  const visibleModules = moduleNav
    .map((item) => {
      const preference = settings.modules.find((module) => module.id === item.id);
      return {
        ...item,
        position: preference?.position ?? 999,
        isVisible: preference?.isVisible ?? true,
      };
    })
    .filter((item) => item.isVisible || item.id === "settings")
    .sort((left, right) => left.position - right.position);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 text-mist md:px-6">
      <div className="absolute inset-0 -z-10 bg-grain opacity-90" />

      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] gap-4 lg:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="panel relative overflow-hidden p-5">
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-gold/15 to-transparent" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="eyebrow">{settings.brand.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-bold text-white">{settings.brand.title}</h1>
              <p className="mt-2 max-w-[220px] text-sm leading-6 text-steel">
                {settings.brand.tagline}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-gold">
              <Flame className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-steel">
              <span>Core Signal</span>
              <Sparkles className="h-4 w-4 text-pulse" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-xs text-steel">Momentum</p>
                <p className="mt-2 text-2xl font-bold text-white">78</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-xs text-steel">Focus</p>
                <p className="mt-2 text-2xl font-bold text-white">64</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-3">
            {visibleModules.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.id} className={({ isActive }) => getNavClass(isActive)} to={item.path}>
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "rounded-2xl border p-2.5 transition-colors",
                            isActive
                              ? "border-gold/30 bg-gold/10 text-gold"
                              : "border-white/10 bg-black/20 text-steel group-hover:text-white",
                          ].join(" ")}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{item.title}</div>
                          <div className="text-xs text-steel">{item.subtitle}</div>
                        </div>
                      </div>
                      <PanelLeftDashed className="h-4 w-4 text-steel/60" />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-6 rounded-[24px] border border-orange-400/20 bg-orange-500/10 p-4">
            <div className="flex items-center gap-3">
              <BellDot className="h-4 w-4 text-orange-300" />
              <p className="text-sm font-medium text-orange-100">系统提醒</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-orange-50/80">
              {settings.brand.reminder}
            </p>
          </div>
        </aside>

        <main className="panel min-h-[80vh] overflow-hidden">
          <div className="border-b border-white/10 px-5 py-4 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="eyebrow">Control Surface</p>
                <p className="mt-2 text-sm text-steel">
                  用最少的界面负担，换取更明确的推进感和复盘反馈。
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.32em] text-steel">
                {location.pathname === "/" ? "Dashboard Ready" : location.pathname.replace("/", "")}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
              exit={{ opacity: 0, y: 12 }}
              initial={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
