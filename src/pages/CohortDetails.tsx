import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignMentorForm } from "@/components/forms/AssignMentorForm";
import { AssignMenteeForm } from "@/components/forms/AssignMenteeForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function CohortDetails() {
  const { id } = useParams();
  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCohort = async () => {
      try {
        const data = await api.getCohort(id);
        setCohort(data);
      } catch (error) {
        console.error("Error fetching cohort:", error);
        toast({
          title: "Error",
          description: "Failed to fetch cohort details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCohort();
  }, [id, toast]);

  const handleAssignSuccess = async () => {
    try {
      const data = await api.getCohort(id);
      setCohort(data);
      toast({
        title: "Success",
        description: "User assigned to cohort successfully",
      });
    } catch (error) {
      console.error("Error refreshing cohort data:", error);
    }
  };

  const handleRemoveMentor = async (mentorId) => {
    try {
      await api.removeMentorFromCohort(id, mentorId);
      const data = await api.getCohort(id);
      setCohort(data);
      toast({
        title: "Success",
        description: "Mentor removed from cohort",
      });
    } catch (error) {
      console.error("Error removing mentor:", error);
      toast({
        title: "Error",
        description: "Failed to remove mentor",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMentee = async (menteeId) => {
    try {
      await api.updateMentee(menteeId, { cohort_id: null });
      const data = await api.getCohort(id);
      setCohort(data);
      toast({
        title: "Success",
        description: "Mentee removed from cohort",
      });
    } catch (error) {
      console.error("Error removing mentee:", error);
      toast({
        title: "Error",
        description: "Failed to remove mentee",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!cohort) return <div>Cohort not found</div>;

  const mentors = cohort.mentors?.map((m) => m.mentors) || [];
  const mentees = cohort.mentees || [];

  return (
    <div className="h-screen bg-[#f7f9fc] overflow-hidden">
      <main className="overflow-y-auto p-4 md:p-8 relative">
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#1a365d]">{cohort.name}</h1>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/cohorts">Back to Cohorts</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cohort Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Start Date:</span>{" "}
                  {format(new Date(cohort.start_date), "MMMM d, yyyy")}
                </div>
                <div>
                  <span className="font-medium">End Date:</span>{" "}
                  {format(new Date(cohort.end_date), "MMMM d, yyyy")}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {cohort.status}
                </div>
                <div>
                  <span className="font-medium">Subcounty:</span>{" "}
                  {cohort.subcounty}
                </div>
                <div>
                  <span className="font-medium">Mentors:</span> {mentors.length}
                </div>
                <div>
                  <span className="font-medium">Mentees:</span> {mentees.length}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Assign Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="mentors">
                  <TabsList className="mb-4">
                    <TabsTrigger value="mentors">Assign Mentor</TabsTrigger>
                    <TabsTrigger value="mentees">Assign Mentee</TabsTrigger>
                  </TabsList>
                  <TabsContent value="mentors">
                    <AssignMentorForm
                      cohortId={id}
                      onSuccess={handleAssignSuccess}
                    />
                  </TabsContent>
                  <TabsContent value="mentees">
                    <AssignMenteeForm
                      cohortId={id}
                      onSuccess={handleAssignSuccess}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Mentors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mentors.length > 0 ? (
                        mentors.map((mentor) => (
                          <TableRow key={mentor.id}>
                            <TableCell className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={mentor.profile_picture_url}
                                  alt={mentor.name}
                                />
                                <AvatarFallback>
                                  {mentor.name[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {mentor.name}
                            </TableCell>
                            <TableCell>{mentor.email}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/users/mentor/${mentor.id}`}>
                                    View Profile
                                  </Link>
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRemoveMentor(mentor.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-muted-foreground"
                          >
                            No mentors assigned yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mentees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mentees.length > 0 ? (
                        mentees.map((mentee) => (
                          <TableRow key={mentee.id}>
                            <TableCell className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={mentee.profile_picture_url}
                                  alt={mentee.name}
                                />
                                <AvatarFallback>
                                  {mentee.name[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {mentee.name}
                            </TableCell>
                            <TableCell>{mentee.email}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/users/mentee/${mentee.id}`}>
                                    View Profile
                                  </Link>
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRemoveMentee(mentee.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-muted-foreground"
                          >
                            No mentees assigned yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
