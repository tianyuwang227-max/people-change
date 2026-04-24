import { useEffect, useState } from "react";
import { BadgeCheck, FolderKanban, Globe, Hammer, Sparkles } from "lucide-react";
import { getProjects } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ProjectRecord, ProjectsModuleData } from "@/types/app";

function ProjectCard({ project, tone }: { project: ProjectRecord; tone: "active" | "completed" }) {
  return (
    <div className="panel overflow-hidden">
      <div
        className="h-44 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(8,16,30,0.06), rgba(8,16,30,0.5)), url(${project.screenshot})` }}
      />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-steel">
              {tone === "active" ? "正在做" : "已完成"}
            </div>
            <h3 className="mt-2 text-2xl font-bold text-white">{project.title}</h3>
          </div>
          <span
            className={[
              "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]",
              project.commercialDisplay
                ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                : "border-white/10 bg-black/20 text-steel",
            ].join(" ")}
          >
            {project.commercialDisplay ? "可商用展示" : "内部沉淀"}
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-steel">{project.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-sm font-medium text-white">遇到的问题</div>
            <p className="mt-2 text-sm leading-6 text-steel">{project.problem}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-sm font-medium text-white">解决方法</div>
            <p className="mt-2 text-sm leading-6 text-steel">{project.solution}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.22em] text-steel">Updated {project.updatedAt}</div>
          <a
            className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold/15"
            href={project.projectUrl}
            rel="noreferrer"
            target="_blank"
          >
            查看链接
          </a>
        </div>
      </div>
    </div>
  );
}

export function ProjectsPage() {
  const [data, setData] = useState<ProjectsModuleData | null>(null);

  useEffect(() => {
    void getProjects().then(setData);
  }, []);

  if (!data) {
    return <div className="p-8 text-sm text-steel">Loading projects vault...</div>;
  }

  return (
    <div className="space-y-6 p-5 md:p-8">
      <SectionHeader
        title="项目与作品"
        description="把项目做成真正能积累的资产。这里既记录推进，也记录问题、解法、技术栈和是否适合对外展示。"
        action={
          <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white">
            Portfolio Vault
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {[
          { label: "进行中项目", value: `${data.summary.activeCount}`, icon: FolderKanban },
          { label: "已完成项目", value: `${data.summary.completedCount}`, icon: BadgeCheck },
          { label: "可展示项目", value: `${data.summary.commercialReadyCount}`, icon: Globe },
          { label: "输出率", value: `${data.summary.shippingRate}%`, icon: Sparkles },
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
          <div className="flex items-center gap-3">
            <Hammer className="h-5 w-5 text-gold" />
            <h2 className="text-2xl font-bold text-white">正在做的项目</h2>
          </div>
          <div className="space-y-6">
            {data.activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} tone="active" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-5 w-5 text-pulse" />
            <h2 className="text-2xl font-bold text-white">已完成项目</h2>
          </div>
          <div className="space-y-6">
            {data.completedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} tone="completed" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
