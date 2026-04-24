import { motion } from "framer-motion";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";

interface ModulePlaceholderProps {
  title: string;
  eyebrow: string;
  description: string;
  bullets: string[];
}

export function ModulePlaceholder({
  bullets,
  description,
  eyebrow,
  title,
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-6 p-5 md:p-8">
      <div className="panel relative overflow-hidden p-8">
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="relative max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-4 text-4xl font-bold text-white">{title}</h2>
          <p className="mt-4 text-base leading-7 text-steel">{description}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="panel p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" />
            <h3 className="text-xl font-bold text-white">下一步能力</h3>
          </div>
          <div className="mt-5 space-y-3">
            {bullets.map((item, index) => (
              <motion.div
                key={item}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                initial={{ opacity: 0, x: -12 }}
                transition={{ delay: index * 0.06 }}
              >
                <span className="text-sm text-white">{item}</span>
                <ArrowRight className="h-4 w-4 text-steel" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-pulse" />
            <h3 className="text-xl font-bold text-white">当前状态</h3>
          </div>
          <p className="mt-4 text-sm leading-6 text-steel">
            这个模块已经在信息架构里占住了位置，后续会基于当前控制台风格继续向下实现，不需要再返工整体导航和视觉语言。
          </p>
          <div className="mt-6 rounded-3xl border border-pulse/20 bg-pulse/10 px-4 py-5">
            <p className="text-xs uppercase tracking-[0.28em] text-pulse">Build Queue</p>
            <p className="mt-2 text-lg font-semibold text-white">结构已稳定，等待功能细化。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
