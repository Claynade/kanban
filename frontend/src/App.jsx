import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./layout/MainLayout";
import { useAuth } from "./context/AuthContext";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const TaskPage = lazy(() => import("./pages/TaskPage"));
const Home = lazy(() => import("./pages/Home"));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
  </div>
);

// Protected routes layout
const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

// Routes that should only be accessible to non-authenticated users
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect authenticated users to their default route
  return user ? <Navigate to="/projects" replace /> : children;
};

const App = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Home route with conditional rendering based on auth state */}
        <Route
          path="/"
          element={user ? <Navigate to="/projects" replace /> : <Home />}
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route path="/projects" element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path=":id" element={<ProjectPage />} />
          <Route path=":id/:taskId" element={<TaskPage />} />
        </Route>

        {/* Legacy route - redirect to new URL structure */}
        <Route
          path="/dashboard/*"
          element={<Navigate to="/projects" replace />}
        />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
