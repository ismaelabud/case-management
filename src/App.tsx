import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import Home from "./components/home";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import Cohorts from "./pages/Cohorts";
import CohortDetails from "./pages/CohortDetails";
import routes from "tempo-routes";

function App() {
  // Handle tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<p>Loading...</p>}>
          {tempoRoutes}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:type/:id" element={<UserProfile />} />
            <Route path="/cohorts" element={<Cohorts />} />
            <Route path="/cohorts/:id" element={<CohortDetails />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
