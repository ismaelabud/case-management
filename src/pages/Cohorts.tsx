import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CohortForm } from "@/components/forms/CohortForm";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const Cohorts = () => {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      const data = await api.getCohorts();
      setCohorts(data);
    } catch (error) {
      console.error("Error fetching cohorts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch cohorts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCohortCreated = () => {
    setDialogOpen(false);
    fetchCohorts();
  };

  const getStatusColor = (status) => {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-screen bg-[#f7f9fc] overflow-hidden">
      <main className="overflow-y-auto p-4 md:p-8 relative">
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#1a365d]">Cohorts</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Cohort</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Cohort</DialogTitle>
                </DialogHeader>
                <CohortForm onSuccess={handleCohortCreated} />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Cohorts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subcounty</TableHead>
                      <TableHead>Mentors</TableHead>
                      <TableHead>Mentees</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cohorts.length > 0 ? (
                      cohorts.map((cohort) => (
                        <TableRow key={cohort.id}>
                          <TableCell className="font-medium">
                            {cohort.name}
                          </TableCell>
                          <TableCell>
                            {format(new Date(cohort.start_date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {format(new Date(cohort.end_date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(cohort.status)}
                              variant="outline"
                            >
                              {cohort.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {cohort.subcounty
                              ? cohort.subcounty.charAt(0).toUpperCase() +
                                cohort.subcounty.slice(1)
                              : "Not specified"}
                          </TableCell>
                          <TableCell>
                            {cohort.mentors?.length || cohort.mentor_count || 0}
                          </TableCell>
                          <TableCell>
                            {cohort.mentees?.length || cohort.mentee_count || 0}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/cohorts/${cohort.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-muted-foreground"
                        >
                          No cohorts found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Cohorts;
