import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const subcounties = [
  "likoni",
  "mvita",
  "kisauni",
  "nyali",
  "changamwe",
  "jomvu",
] as const;

export function CohortForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subcounty: "",
    start_date: "",
    end_date: "",
    curriculum_id: "",
  });

  const [curriculums, setCurriculums] = useState([]);

  useEffect(() => {
    const loadCurriculums = async () => {
      try {
        const data = await api.getCurriculums();
        setCurriculums(data);
      } catch (error) {
        console.error("Error loading curriculums:", error);
      }
    };
    loadCurriculums();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createCohort({
        name: formData.name,
        subcounty: formData.subcounty as any,
        status: "pending",
        start_date: formData.start_date,
        end_date: formData.end_date,
        curriculum_id: formData.curriculum_id,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating cohort:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Cohort Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subcounty">Subcounty</Label>
        <Select
          value={formData.subcounty}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, subcounty: value }))
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select subcounty" />
          </SelectTrigger>
          <SelectContent>
            {subcounties.map((subcounty) => (
              <SelectItem key={subcounty} value={subcounty}>
                {subcounty.charAt(0).toUpperCase() + subcounty.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="start_date">Start Date</Label>
        <Input
          id="start_date"
          type="date"
          value={formData.start_date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, start_date: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="end_date">End Date</Label>
        <Input
          id="end_date"
          type="date"
          value={formData.end_date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, end_date: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="curriculum">Curriculum</Label>
        <Select
          value={formData.curriculum_id}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, curriculum_id: value }))
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select curriculum" />
          </SelectTrigger>
          <SelectContent>
            {curriculums.map((curriculum) => (
              <SelectItem key={curriculum.id} value={curriculum.id}>
                {curriculum.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Cohort"}
      </Button>
    </form>
  );
}
