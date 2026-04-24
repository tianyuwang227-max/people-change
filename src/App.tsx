import { Route, Routes } from "react-router-dom";
import { AppSettingsProvider } from "@/context/AppSettingsContext";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { HabitsPage } from "@/pages/HabitsPage";
import { LearningPage } from "@/pages/LearningPage";
import { ReflectionPage } from "@/pages/ReflectionPage";
import { FinancePage } from "@/pages/FinancePage";
import { BodyPage } from "@/pages/BodyPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { SettingsPage } from "@/pages/SettingsPage";

export default function App() {
  return (
    <AppSettingsProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/reflection" element={<ReflectionPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/body" element={<BodyPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AppSettingsProvider>
  );
}
