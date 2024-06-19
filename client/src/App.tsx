import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import LoginPage from "./pages/LoginPage";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import ChooseUser from "./pages/ChooseUser";

// Interface for user state
interface UserState {
  currentRole: "Admin" | "Student" | "Teacher" | null;
  // Add other user properties if needed
}

// Interface for the Redux root state
interface RootState {
  user: UserState;
}

const App: React.FC = () => {
  const { currentRole } = useSelector((state: RootState) => state.user);

  return (
    <Router>
      {currentRole === null && (
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/choose" element={<ChooseUser visitor="normal" />} />
          <Route path="/user/guest" element={<ChooseUser visitor="guest" />} />

          <Route path="/admin/login" element={<LoginPage role="Admin" />} />
          <Route path="/student/login" element={<LoginPage role="Student" />} />
          <Route path="/teacher/login" element={<LoginPage role="Teacher" />} />

          <Route path="/admin/register" element={<AdminRegisterPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}

      {currentRole === "Admin" && (
        <>
          <AdminDashboard />
        </>
      )}

      {currentRole === "Student" && (
        <>
          <StudentDashboard />
        </>
      )}

      {currentRole === "Teacher" && (
        <>
          <TeacherDashboard />
        </>
      )}
    </Router>
  );
};

export default App;
