import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CohortWithDetails } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

interface CohortData {
  id: string;
  name: string;
  mentorName: string;
  menteeCount: number;
  subcounty: MombasaSubcounty;
  status: "active" | "completed" | "pending";
}

interface CohortManagementProps {
  cohorts?: CohortData[];
}

type MombasaSubcounty =
  | "likoni"
  | "mvita"
  | "kisauni"
  | "nyali"
  | "changamwe"
  | "jomvu";

const defaultCohorts: CohortData[] = [
  {
    id: "1",
    name: "Spring 2024 Cohort",
    mentorName: "Jane Smith",
    menteeCount: 15,
    subcounty: "mvita",
    status: "active",
  },
  {
    id: "2",
    name: "Winter 2023 Cohort",
    mentorName: "John Doe",
    menteeCount: 12,
    subcounty: "kisauni",
    status: "completed",
  },
  {
    id: "3",
    name: "Summer 2024 Cohort",
    mentorName: "Alice Johnson",
    menteeCount: 18,
    subcounty: "nyali",
    status: "pending",
  },
];

const CohortManagement = () => {
  const [cohorts, setCohorts] = useState<CohortWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCohorts = async () => {
      try {
        const data = await api.getCohorts();
        setCohorts(data);
      } catch (error) {
        console.error("Error loading cohorts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCohorts();
  }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="bg-white w-full">
      <CardHeader>
        <CardTitle>Cohort Management</CardTitle>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search cohorts..." className="pl-10" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Cohort Name</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Mentees</TableHead>
                <TableHead>Subcounty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohorts.map((cohort) => (
                <TableRow key={cohort.id}>
                  <TableCell className="font-medium">{cohort.name}</TableCell>
                  <TableCell>{cohort.mentorName}</TableCell>
                  <TableCell>{cohort.menteeCount}</TableCell>
                  <TableCell>{cohort.subcounty}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(cohort.status)}
                    >
                      {cohort.status.charAt(0).toUpperCase() +
                        cohort.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CohortManagement;
