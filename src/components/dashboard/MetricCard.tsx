import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  progress?: number;
  color?: "primary" | "success" | "warning" | "danger";
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  change = 0,
  progress = 0,
  color = "primary",
}: MetricCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "danger":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  const getChangeIcon = () => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  return (
    <Card className="bg-white w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{value}</div>
          <div className="flex items-center gap-1 text-sm">
            {Math.abs(change)}%{getChangeIcon()}
          </div>
        </div>
        <Progress
          value={progress}
          className="mt-4"
          indicatorClassName={getColorClasses()}
        />
      </CardContent>
    </Card>
  );
};

export default MetricCard;
