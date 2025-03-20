import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { JSX, useEffect, useState } from "react";
import { setupAxiosInterceptors, getCurrentUser } from "./services/authService";
import UsersPage from "./pages/UsersPage";
import UserFormPage from "./pages/UserFormPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";
import Footer from "./components/Footer";

setupAxiosInterceptors();

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser?.user);
    setLoading(false);
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children, requiredRoles = [] }: { children: JSX.Element, requiredRoles?: string[] }) => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
    }

    return children;
  };

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<div className="unauthorized">You don't have permission to access this page</div>} />
          <Route path="/" element={<Navigate to="/users" />} />

          {/* Protected routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <ProtectedRoute requiredRoles={["admin", "editor"]}>
                <UserFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/edit/:id"
            element={
              <ProtectedRoute requiredRoles={["admin", "editor"]}>
                <UserFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage setUser={setUser} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;