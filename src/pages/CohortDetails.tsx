import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { AssignMentorForm } from "@/components/forms/AssignMentorForm";
import { AssignMenteeForm } from "@/components/forms/AssignMenteeForm";

export default function CohortDetails() {
  const { id } = useParams();
  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCohort();
  }, [id]);

  const loadCohort = async () => {
    try {
      const data = await api.getCohort(id);
      setCohort(data);
    } catch (error) {
      console.error("Error loading cohort:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMentor = async (mentorId: string) => {
    try {
      await api.removeMentorFromCohort(id, mentorId);
      loadCohort();
    } catch (error) {
      console.error("Error removing mentor:", error);
    }
  };

  const handleRemoveMentee = async (menteeId: string) => {
    try {
      await api.updateMentee(menteeId, { cohort_id: null });
      loadCohort();
    } catch (error) {
      console.error("Error removing mentee:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!cohort) return <div>Cohort not found</div>;

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>{cohort.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Start Date</h3>
              <p>{format(new Date(cohort.start_date), "MMM d, yyyy")}</p>
            </div>
            <div>
              <h3 className="font-medium">End Date</h3>
              <p>{format(new Date(cohort.end_date), "MMM d, yyyy")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Mentors</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Assign Mentor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Mentor to Cohort</DialogTitle>
                </DialogHeader>
                <AssignMentorForm cohortId={id} onSuccess={loadCohort} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mentees</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohort.mentors?.map((mentor) => (
                <TableRow key={mentor.id}>
                  <TableCell>{mentor.name}</TableCell>
                  <TableCell>{mentor.email}</TableCell>
                  <TableCell>{mentor.mentee_count || 0}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMentor(mentor.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Mentees</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Assign Mentee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Mentee to Cohort</DialogTitle>
                </DialogHeader>
                <AssignMenteeForm cohortId={id} onSuccess={loadCohort} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohort.mentees?.map((mentee) => (
                <TableRow key={mentee.id}>
                  <TableCell>{mentee.name}</TableCell>
                  <TableCell>{mentee.email}</TableCell>
                  <TableCell>{mentee.mentor?.name || "Not Assigned"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMentee(mentee.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
