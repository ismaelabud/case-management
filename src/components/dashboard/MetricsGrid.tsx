import React, { useEffect, useState } from "react";
import MetricCard from "./MetricCard";
import { api } from "@/lib/api";

interface MetricsGridProps {
  metrics?: {
    title: string;
    value: string | number;
    change: number;
    progress: number;
    color: "primary" | "success" | "warning" | "danger";
  }[];
}

const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  const [mentorCount, setMentorCount] = useState(0);
  const [menteeCount, setMenteeCount] = useState(0);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [mentors, mentees] = await Promise.all([
          api.getMentors(),
          api.getMentees(),
        ]);
        setMentorCount(mentors.length);
        setMenteeCount(mentees.length);
      } catch (error) {
        console.error("Error loading counts:", error);
      }
    };
    loadCounts();
  }, []);

  const defaultMetrics = [
    {
      title: "Active Cohorts",
      value: 12,
      change: 8,
      progress: 75,
      color: "primary" as const,
    },
    {
      title: "Total Mentors",
      value: mentorCount,
      change: 5,
      progress: 80,
      color: "success" as const,
    },
    {
      title: "Total Mentees",
      value: menteeCount,
      change: 12,
      progress: 85,
      color: "success" as const,
    },
    {
      title: "Overall Progress",
      value: "92%",
      change: 5,
      progress: 92,
      color: "success" as const,
    },
  ];

  const displayMetrics = metrics || defaultMetrics;

  return (
    <div className="bg-gray-50 p-6 rounded-lg w-full overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {displayMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            progress={metric.progress}
            color={metric.color}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricsGrid;
