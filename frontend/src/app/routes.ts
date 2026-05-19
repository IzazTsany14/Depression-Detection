import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { ResetPassword } from "./pages/ResetPassword";
import { Questionnaire } from "./pages/Questionnaire";
import { GuestResult } from "./pages/GuestResult";
import { RegisteredResult } from "./pages/RegisteredResult";
import { Guide } from "./pages/Guide";
import { About } from "./pages/About";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUserManagement } from "./pages/admin/AdminUserManagement";
import { AdminReports } from "./pages/admin/AdminReports";
import { AdminStatistics } from "./pages/admin/AdminStatistics";
import { AdminProfile } from "./pages/admin/AdminProfile";
import { AdminQuestionManagement } from "./pages/admin/AdminQuestionManagement";
import { BKDashboard } from "./pages/bk/BKDashboard";
import { BKStudentCases } from "./pages/bk/BKStudentCases";
import { BKCounselingSchedule } from "./pages/bk/BKCounselingSchedule";
import { BKMedicalRecords } from "./pages/bk/BKMedicalRecords";
import { BKProfile } from "./pages/bk/BKProfile";
import { BKQuestionManagement } from "./pages/bk/BKQuestionManagement";
import { Dashboard } from "./pages/mahasiswa/Dashboard";
import { StudentProfile } from "./pages/mahasiswa/StudentProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/questionnaire",
    Component: Questionnaire,
  },
  {
    path: "/result/guest",
    Component: GuestResult,
  },
  {
    path: "/result/registered",
    Component: RegisteredResult,
  },
  {
    path: "/guide",
    Component: Guide,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/users",
    Component: AdminUserManagement,
  },
  {
    path: "/admin/reports",
    Component: AdminReports,
  },
  {
    path: "/admin/statistics",
    Component: AdminStatistics,
  },
  {
    path: "/admin/profile",
    Component: AdminProfile,
  },
  {
    path: "/admin/questions",
    Component: AdminQuestionManagement,
  },
  {
    path: "/bk",
    Component: BKDashboard,
  },
  {
    path: "/bk/cases",
    Component: BKStudentCases,
  },
  {
    path: "/bk/schedule",
    Component: BKCounselingSchedule,
  },
  {
    path: "/bk/medical-records",
    Component: BKMedicalRecords,
  },
  {
    path: "/bk/profile",
    Component: BKProfile,
  },
  {
    path: "/bk/questions",
    Component: BKQuestionManagement,
  },
  {
    path: "/student/profile",
    Component: StudentProfile,
  },
]);
