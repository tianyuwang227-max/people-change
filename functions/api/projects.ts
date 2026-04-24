import { DEFAULT_PROJECTS } from "../_lib/constants";
import { ensureDatabase } from "../_lib/db";

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    ...init,
  });
}

function buildPayload(
  projects: Array<{
    id: string;
    title: string;
    summary: string;
    screenshot: string;
    tech_stack_json: string;
    problem: string;
    solution: string;
    project_url: string;
    commercial_display: number;
    status: "active" | "completed";
    updated_at_date: string;
  }>,
) {
  const mapped = projects.map((project) => ({
    id: project.id,
    title: project.title,
    summary: project.summary,
    screenshot: project.screenshot,
    techStack: JSON.parse(project.tech_stack_json) as string[],
    problem: project.problem,
    solution: project.solution,
    projectUrl: project.project_url,
    commercialDisplay: project.commercial_display === 1,
    status: project.status,
    updatedAt: project.updated_at_date,
  }));

  const activeProjects = mapped.filter((project) => project.status === "active");
  const completedProjects = mapped.filter((project) => project.status === "completed");
  const commercialReadyCount = mapped.filter((project) => project.commercialDisplay).length;
  const shippingRate =
    mapped.length === 0 ? 0 : Math.round((completedProjects.length / mapped.length) * 100);

  return {
    summary: {
      activeCount: activeProjects.length,
      completedCount: completedProjects.length,
      commercialReadyCount,
      shippingRate,
    },
    activeProjects,
    completedProjects,
  };
}

export const onRequestGet: PagesFunction = async (context) => {
  const db = await ensureDatabase(context.env);

  if (!db) {
    return json(
      buildPayload(
        DEFAULT_PROJECTS.map((project, index) => ({
          id: `project-${index}`,
          title: project.title,
          summary: project.summary,
          screenshot: project.screenshot,
          tech_stack_json: JSON.stringify(project.techStack),
          problem: project.problem,
          solution: project.solution,
          project_url: project.projectUrl,
          commercial_display: project.commercialDisplay ? 1 : 0,
          status: project.status,
          updated_at_date: project.updatedAt,
        })),
      ),
    );
  }

  const projects = await db.prepare(
    `SELECT id, title, summary, screenshot, tech_stack_json, problem, solution, project_url, commercial_display, status, updated_at_date
     FROM project_entries
     ORDER BY updated_at_date DESC, created_at DESC`,
  ).all<{
    id: string;
    title: string;
    summary: string;
    screenshot: string;
    tech_stack_json: string;
    problem: string;
    solution: string;
    project_url: string;
    commercial_display: number;
    status: "active" | "completed";
    updated_at_date: string;
  }>();

  return json(buildPayload(projects.results));
};
