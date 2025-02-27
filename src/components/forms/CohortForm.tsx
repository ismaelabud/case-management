import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/types/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CohortForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    subcounty: "likoni" as Database["public"]["Enums"]["mombasa_subcounty"],
    status: "pending" as Database["public"]["Enums"]["cohort_status"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createCohort({
        name: formData.name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        subcounty: formData.subcounty,
        status: formData.status,
      });
      toast({
        title: "Success",
        description: "Cohort created successfully",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating cohort:", error);
      toast({
        title: "Error",
        description: "Failed to create cohort",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
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
        <Label htmlFor="subcounty">Subcounty</Label>
        <Select
          value={formData.subcounty}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              subcounty:
                value as Database["public"]["Enums"]["mombasa_subcounty"],
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select subcounty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="likoni">Likoni</SelectItem>
            <SelectItem value="mvita">Mvita</SelectItem>
            <SelectItem value="kisauni">Kisauni</SelectItem>
            <SelectItem value="nyali">Nyali</SelectItem>
            <SelectItem value="changamwe">Changamwe</SelectItem>
            <SelectItem value="jomvu">Jomvu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              status: value as Database["public"]["Enums"]["cohort_status"],
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Cohort"}
      </Button>
    </form>
  );
}
