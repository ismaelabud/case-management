import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Props {
  cohortId: string;
  onSuccess?: () => void;
}

export function AssignMentorForm({ cohortId, onSuccess }: Props) {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      const data = await api.getMentors();
      setMentors(data);
    } catch (error) {
      console.error("Error loading mentors:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.assignMentorToCohort(cohortId, selectedMentor);
      onSuccess?.();
    } catch (error) {
      console.error("Error assigning mentor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mentor">Select Mentor</Label>
        <Select
          value={selectedMentor}
          onValueChange={setSelectedMentor}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a mentor" />
          </SelectTrigger>
          <SelectContent>
            {mentors.map((mentor) => (
              <SelectItem key={mentor.id} value={mentor.id}>
                {mentor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Assigning..." : "Assign Mentor"}
      </Button>
    </form>
  );
}
