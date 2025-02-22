import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import routes from "tempo-routes";

function App() {
  // Handle tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {tempoRoutes}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:type/:id" element={<UserProfile />} />
      </Routes>
    </Suspense>
  );
}

export default App;
