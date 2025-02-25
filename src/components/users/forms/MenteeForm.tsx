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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

const subcounties = [
  "likoni",
  "mvita",
  "kisauni",
  "nyali",
  "changamwe",
  "jomvu",
] as const;

export function MenteeForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subcounty: "",
    mentor_id: "",
    id_number: "",
    phone_number: "",
  });

  useEffect(() => {
    if (formData.subcounty) {
      const loadMentors = async () => {
        try {
          const data = await api.getMentorsBySubcounty(formData.subcounty);
          setMentors(data);
        } catch (error) {
          console.error("Error loading mentors:", error);
        }
      };
      loadMentors();
    } else {
      setMentors([]);
    }
  }, [formData.subcounty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createMentee(
        {
          name: formData.name,
          email: formData.email,
          subcounty: formData.subcounty as any,
          mentor_id: formData.mentor_id,
        },
        profilePicture,
      );
      onSuccess?.();
    } catch (error) {
      console.error("Error creating mentee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={previewUrl || undefined} />
          <AvatarFallback className="text-2xl">
            {formData.name ? formData.name[0].toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="profile-picture"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("profile-picture")?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Picture
          </Button>
        </div>
      </div>
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
            setFormData((prev) => ({
              ...prev,
              subcounty: value,
              mentor_id: "",
            }))
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

      {formData.subcounty && mentors.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="mentor">
            Select Mentor from {formData.subcounty}
          </Label>
          <Select
            value={formData.mentor_id}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, mentor_id: value }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select mentor" />
            </SelectTrigger>
            <SelectContent>
              {mentors.map((mentor) => (
                <SelectItem key={mentor.id} value={mentor.id}>
                  {mentor.name} ({mentor.menteeCount} mentees)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="id_number">ID Number</Label>
        <Input
          id="id_number"
          value={formData.id_number}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, id_number: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          value={formData.phone_number}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone_number: e.target.value }))
          }
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Mentee"}
      </Button>
    </form>
  );
}
