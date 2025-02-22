import { useState } from "react";
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

export function MentorForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subcounty: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createMentor({
        name: formData.name,
        email: formData.email,
        subcounty: formData.subcounty as any,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating mentor:", error);
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Mentor"}
      </Button>
    </form>
  );
}
