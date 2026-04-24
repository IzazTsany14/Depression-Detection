import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Registration } from "./pages/Registration";
import { Login } from "./pages/Login";
import { ResetPassword } from "./pages/ResetPassword";
import { Questionnaire } from "./pages/Questionnaire";
import { GuestResult } from "./pages/GuestResult";
import { RegisteredResult } from "./pages/RegisteredResult";
import { Guide } from "./pages/Guide";
import { Dashboard } from "./pages/Dashboard";
import { About } from "./pages/About";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminUserManagement } from "./pages/AdminUserManagement";
import { AdminReports } from "./pages/AdminReports";
import { AdminStatistics } from "./pages/AdminStatistics";
import { AdminProfile } from "./pages/AdminProfile";
import { BKDashboard } from "./pages/BKDashboard";
import { BKStudentCases } from "./pages/BKStudentCases";
import { BKCounselingSchedule } from "./pages/BKCounselingSchedule";
import { BKMedicalRecords } from "./pages/BKMedicalRecords";
import { BKProfile } from "./pages/BKProfile";
import { StudentProfile } from "./pages/StudentProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/registration",
    Component: Registration,
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
    path: "/student/profile",
    Component: StudentProfile,
  },
]);