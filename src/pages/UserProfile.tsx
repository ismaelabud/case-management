import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import Sidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Upload } from "lucide-react";

const subcounties = [
  "likoni",
  "mvita",
  "kisauni",
  "nyali",
  "changamwe",
  "jomvu",
] as const;

const UserProfile = () => {
  const { type, id } = useParams();
  const [user, setUser] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subcounty: "",
    id_number: "",
    phone_number: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data =
          type === "mentor"
            ? await api.getMentorById(id)
            : await api.getMenteeById(id);
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          subcounty: data.subcounty,
          id_number: data.id_number || "",
          phone_number: data.phone_number || "",
        });

        if (type === "mentor") {
          const allMentees = await api.getMentees();
          const mentorMentees = allMentees.filter(
            (mentee) => mentee.mentor_id === id,
          );
          setMentees(mentorMentees);
        } else if (type === "mentee" && data.mentor_id) {
          const mentorData = await api.getMentorById(data.mentor_id);
          setMentor(mentorData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, type]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateFn = type === "mentor" ? api.updateMentor : api.updateMentee;
      const updatedUser = await updateFn(id, formData, profilePicture);
      setUser(updatedUser);
      setEditing(false);
      setProfilePicture(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f7f9fc] overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                {type === "mentor" ? "Mentor" : "Mentee"} Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src={previewUrl || user.profile_picture_url || undefined}
                    />
                    <AvatarFallback className="text-4xl">
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {editing && (
                    <div className="absolute bottom-0 right-0">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profile-picture"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={() =>
                          document.getElementById("profile-picture")?.click()
                        }
                        className="rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
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
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
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
                            {subcounty.charAt(0).toUpperCase() +
                              subcounty.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id_number">ID Number</Label>
                    <Input
                      id="id_number"
                      value={formData.id_number}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          id_number: e.target.value,
                        }))
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
                        setFormData((prev) => ({
                          ...prev,
                          phone_number: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Save Changes</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setProfilePicture(null);
                        setPreviewUrl(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <div className="mt-1">{user.name}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="mt-1">{user.email}</div>
                  </div>
                  <div>
                    <Label>Subcounty</Label>
                    <div className="mt-1">{user.subcounty}</div>
                  </div>
                  <div>
                    <Label>ID Number</Label>
                    <div className="mt-1">
                      {user.id_number || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <div className="mt-1">
                      {user.phone_number || "Not provided"}
                    </div>
                  </div>
                  <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                </div>
              )}

              {type === "mentor" && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Assigned Mentees
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Subcounty</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mentees.map((mentee) => (
                          <TableRow key={mentee.id}>
                            <TableCell className="font-medium">
                              {mentee.name}
                            </TableCell>
                            <TableCell>{mentee.email}</TableCell>
                            <TableCell>{mentee.subcounty}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/users/mentee/${mentee.id}`}>
                                  View Profile
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {mentees.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center text-muted-foreground"
                            >
                              No mentees assigned yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {type === "mentee" && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Assigned Mentor
                  </h3>
                  <div className="rounded-md border">
                    {mentor ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Subcounty</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">
                              {mentor.name}
                            </TableCell>
                            <TableCell>{mentor.email}</TableCell>
                            <TableCell>{mentor.subcounty}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/users/mentor/${mentor.id}`}>
                                  View Profile
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No mentor assigned yet
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
