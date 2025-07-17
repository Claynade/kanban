import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const isSignedUp = localStorage.getItem("isSignedUp") === "true";
  return isSignedUp ? <MainLayout /> : <Navigate to="/Signup" replace />;
};

const PrivateLogin = () => {
  const isSignedUp = localStorage.getItem("isSignedUp") === "true";
  return isSignedUp ? <Navigate to="/" replace /> : <Login />;
};

const PrivateSignup = () => {
  const isSignedUp = localStorage.getItem("isSignedUp") === "true";
  return isSignedUp ? <Navigate to="/" replace /> : <Signup />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="project/:id" element={<ProjectPage />} />
      </Route>
      <Route path="/Signup" element={<PrivateSignup />} />
      <Route path="/Login" element={<PrivateLogin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
