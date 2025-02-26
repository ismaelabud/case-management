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

export function AssignMenteeForm({ cohortId, onSuccess }: Props) {
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMentees();
  }, []);

  const loadMentees = async () => {
    try {
      const data = await api.getMentees();
      setMentees(data.filter((mentee) => !mentee.cohort_id));
    } catch (error) {
      console.error("Error loading mentees:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.updateMentee(selectedMentee, { cohort_id: cohortId });
      onSuccess?.();
    } catch (error) {
      console.error("Error assigning mentee:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mentee">Select Mentee</Label>
        <Select
          value={selectedMentee}
          onValueChange={setSelectedMentee}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a mentee" />
          </SelectTrigger>
          <SelectContent>
            {mentees.map((mentee) => (
              <SelectItem key={mentee.id} value={mentee.id}>
                {mentee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Assigning..." : "Assign Mentee"}
      </Button>
    </form>
  );
}
