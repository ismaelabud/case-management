import React, { useState } from "react";
import { CohortForm } from "@/components/forms/CohortForm";
import { CurriculumForm } from "@/components/forms/CurriculumForm";
import {
  Plus,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  dialogTitle?: string;
  dialogDescription?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  position?: "right" | "left";
}

const defaultActions: QuickAction[] = [
  {
    icon: <Plus className="h-5 w-5" />,
    label: "Add Cohort",
    dialogTitle: "Create New Cohort",
    dialogDescription: "Add a new cohort to the system",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    label: "Add Curriculum",
    dialogTitle: "Create New Curriculum",
    dialogDescription: "Add a new self-discovery journey curriculum",
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    label: "Schedule Session",
    dialogTitle: "Schedule New Session",
    dialogDescription: "Schedule a new mentoring session",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Generate Report",
    dialogTitle: "Generate Report",
    dialogDescription: "Create a new system report",
  },
];

const QuickActions = ({
  actions = defaultActions,
  position = "right",
}: QuickActionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      className={`hidden md:flex absolute ${position}-6 top-0 gap-3 bg-transparent z-50 items-center ${position === "right" ? "flex-row-reverse" : "flex-row"}`}
    >
      <Button
        variant="default"
        size="icon"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-12 w-12 rounded-full bg-white hover:bg-gray-50 shadow-lg border border-gray-200 text-[#1a365d] transition-all duration-200 hover:scale-105"
      >
        {position === "right" ? (
          isExpanded ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )
        ) : isExpanded ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </Button>

      <div
        className={`flex flex-col gap-3 transition-all duration-300 ${isExpanded ? "opacity-100 translate-x-0" : `opacity-0 ${position === "right" ? "translate-x-16" : "-translate-x-16"} pointer-events-none`}`}
      >
        <TooltipProvider>
          {actions.map((action, index) => (
            <Dialog key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white hover:bg-gray-50 shadow-lg border border-gray-200 text-[#1a365d] transition-all duration-200 hover:scale-105"
                    >
                      {action.icon}
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side={position === "right" ? "left" : "right"}>
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{action.dialogTitle}</DialogTitle>
                  <DialogDescription>
                    {action.dialogDescription}
                  </DialogDescription>
                </DialogHeader>
                {action.label === "Add Cohort" ? (
                  <CohortForm onSuccess={() => window.location.reload()} />
                ) : action.label === "Add Curriculum" ? (
                  <CurriculumForm onSuccess={() => window.location.reload()} />
                ) : (
                  <div className="p-4">
                    <p className="text-center text-gray-500">
                      Placeholder for {action.label} form
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default QuickActions;
