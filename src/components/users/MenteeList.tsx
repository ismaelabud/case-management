import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MenteeForm } from "@/components/users/forms/MenteeForm";
import { Pagination } from "@/components/ui/pagination";

export function MenteeList() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredMentees = mentees.filter(
    (mentee) =>
      mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentee.subcounty.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredMentees.length / itemsPerPage);
  const paginatedMentees = filteredMentees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    loadMentees();
  }, []);

  const loadMentees = async () => {
    try {
      const data = await api.getMentees();
      setMentees(data);
    } catch (error) {
      console.error("Error loading mentees:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Mentees</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Mentee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Mentee</DialogTitle>
                <DialogDescription>
                  Create a new mentee profile in the system.
                </DialogDescription>
              </DialogHeader>
              <MenteeForm onSuccess={loadMentees} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search mentees..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subcounty</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMentees.map((mentee) => (
                <TableRow key={mentee.id}>
                  <TableCell className="font-medium">{mentee.name}</TableCell>
                  <TableCell>{mentee.email}</TableCell>
                  <TableCell>{mentee.subcounty}</TableCell>
                  <TableCell>
                    {mentee.mentor ? mentee.mentor.name : "Not Assigned"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/users/mentee/${mentee.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}
