import React from "react";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import CohortManagement from "@/components/dashboard/CohortManagement";
import SubcountyDistribution from "@/components/dashboard/SubcountyDistribution";

const Dashboard = () => {
  return (
    <div className="h-screen bg-[#f7f9fc] overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <h1 className="text-3xl font-bold text-[#1a365d]">Dashboard</h1>
            <div className="text-sm text-gray-500">Welcome back, Admin</div>
          </div>

          <MetricsGrid />

          <SubcountyDistribution />

          <div className="relative">
            <CohortManagement />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
