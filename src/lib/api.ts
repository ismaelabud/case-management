import { supabase } from "./supabase";
import { Database } from "@/types/supabase";
import { v4 as uuidv4 } from "uuid";

type Cohort = Database["public"]["Tables"]["cohorts"]["Row"];
type Mentor = Database["public"]["Tables"]["mentors"]["Row"];
type Mentee = Database["public"]["Tables"]["mentees"]["Row"];

const uploadProfilePicture = async (file: File) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from("profile-pictures")
    .upload(fileName, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-pictures").getPublicUrl(fileName);

  return publicUrl;
};

export const api = {
  // Cohorts
  getCohorts: async () => {
    const { data, error } = await supabase.from("cohorts").select(`
        *,
        mentors:cohort_mentors(mentors(*)),
        mentees(*)
      `);
    if (error) throw error;
    return data.map((cohort) => ({
      ...cohort,
      mentor_count: cohort.mentors?.length || 0,
      mentee_count: cohort.mentees?.length || 0,
    }));
  },

  getCohort: async (id: string) => {
    const { data, error } = await supabase
      .from("cohorts")
      .select(
        `
        *,
        mentors:cohort_mentors(mentors(*)),
        mentees(*)
      `,
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  createCohort: async (
    cohort: Omit<Cohort, "id" | "created_at" | "updated_at">,
  ) => {
    const { data, error } = await supabase
      .from("cohorts")
      .insert(cohort)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Mentors
  getMentorById: async (id: string) => {
    const { data, error } = await supabase
      .from("mentors")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  updateMentor: async (
    id: string,
    updates: Partial<Mentor>,
    profilePicture?: File,
  ) => {
    let profile_picture_url = updates.profile_picture_url;
    if (profilePicture) {
      profile_picture_url = await uploadProfilePicture(profilePicture);
    }
    const { data, error } = await supabase
      .from("mentors")
      .update({ ...updates, profile_picture_url })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getMentors: async () => {
    const { data, error } = await supabase.from("mentors").select(`
        *,
        mentees!mentor_id (*)
      `);
    if (error) throw error;
    return data.map((mentor) => ({
      ...mentor,
      menteeCount: mentor.mentees?.length || 0,
    }));
  },

  getMentorsBySubcounty: async (subcounty: string) => {
    const { data, error } = await supabase
      .from("mentors")
      .select(
        `
        *,
        cohort_mentors!left (cohort_id),
        cohorts!cohort_mentors (mentees (id))
      `,
      )
      .eq("subcounty", subcounty);
    if (error) throw error;
    return data.map((mentor) => ({
      ...mentor,
      menteeCount:
        mentor.cohorts?.reduce(
          (acc, cohort) => acc + (cohort?.mentees?.length || 0),
          0,
        ) || 0,
    }));
  },

  createMentor: async (
    mentor: Omit<Mentor, "id" | "created_at">,
    profilePicture?: File,
  ) => {
    let profile_picture_url = null;
    if (profilePicture) {
      profile_picture_url = await uploadProfilePicture(profilePicture);
    }
    const { data, error } = await supabase
      .from("mentors")
      .insert({ ...mentor, profile_picture_url })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Mentees
  getMenteeById: async (id: string) => {
    const { data, error } = await supabase
      .from("mentees")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  updateMentee: async (
    id: string,
    updates: Partial<Mentee>,
    profilePicture?: File,
  ) => {
    let profile_picture_url = updates.profile_picture_url;
    if (profilePicture) {
      profile_picture_url = await uploadProfilePicture(profilePicture);
    }
    const { data, error } = await supabase
      .from("mentees")
      .update({ ...updates, profile_picture_url })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getMentees: async () => {
    const { data, error } = await supabase.from("mentees").select(`
        *,
        mentor:mentors!mentor_id (*)
      `);
    if (error) throw error;
    return data;
  },

  createMentee: async (
    mentee: Omit<Mentee, "id" | "created_at"> & { mentor_id?: string },
    profilePicture?: File,
  ) => {
    let profile_picture_url = null;
    if (profilePicture) {
      profile_picture_url = await uploadProfilePicture(profilePicture);
    }
    const { data, error } = await supabase
      .from("mentees")
      .insert({ ...mentee, profile_picture_url })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Cohort-Mentor assignments
  assignMentorToCohort: async (cohortId: string, mentorId: string) => {
    const { error } = await supabase
      .from("cohort_mentors")
      .insert({ cohort_id: cohortId, mentor_id: mentorId });
    if (error) throw error;
  },

  removeMentorFromCohort: async (cohortId: string, mentorId: string) => {
    const { error } = await supabase
      .from("cohort_mentors")
      .delete()
      .match({ cohort_id: cohortId, mentor_id: mentorId });
    if (error) throw error;
  },
};
