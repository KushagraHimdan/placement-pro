import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentLayout from "./components/StudentLayout";
import DrivesList from "./pages/student/DrivesList";
import MyApplications from "./pages/student/MyApplications";
import Profile from "./pages/student/Profile";
import TPOLayout from "./components/TPOLayout";
import PostDrive from "./pages/tpo/PostDrive";
import TPODrivesList from "./pages/tpo/DrivesList";
import DriveDetail from './pages/tpo/DriveDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DrivesList />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="/tpo"
        element={
          <ProtectedRoute allowedRoles={["tpo"]}>
            <TPOLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TPODrivesList />} />
        <Route path="post-drive" element={<PostDrive />} />
        <Route path="drives/:driveId" element={<DriveDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
