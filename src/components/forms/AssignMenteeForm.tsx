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
import { useToast } from "@/components/ui/use-toast";

interface Props {
  cohortId: string;
  onSuccess?: () => void;
}

export function AssignMenteeForm({ cohortId, onSuccess }: Props) {
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadMentees = async () => {
      try {
        const data = await api.getMentees();
        // Filter out mentees that are already assigned to a cohort
        const unassignedMentees = data.filter((mentee) => !mentee.cohort_id);
        setMentees(unassignedMentees);
      } catch (error) {
        console.error("Error loading mentees:", error);
        toast({
          title: "Error",
          description: "Failed to load mentees",
          variant: "destructive",
        });
      }
    };

    loadMentees();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentee) return;

    setLoading(true);
    try {
      await api.updateMentee(selectedMentee, { cohort_id: cohortId });
      setSelectedMentee("");
      toast({
        title: "Success",
        description: "Mentee assigned to cohort successfully",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error assigning mentee:", error);
      toast({
        title: "Error",
        description: "Failed to assign mentee to cohort",
        variant: "destructive",
      });
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
          <SelectTrigger id="mentee">
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

      <Button type="submit" disabled={loading || !selectedMentee}>
        {loading ? "Assigning..." : "Assign Mentee"}
      </Button>
    </form>
  );
}
