import { supabase } from "./supabase";
import { Database } from "@/types/supabase";

type Cohort = Database["public"]["Tables"]["cohorts"]["Row"];
type Mentor = Database["public"]["Tables"]["mentors"]["Row"];
type Mentee = Database["public"]["Tables"]["mentees"]["Row"];

export const api = {
  // Curriculums
  getCurriculums: async () => {
    const { data, error } = await supabase.from("curriculums").select("*");
    if (error) throw error;
    return data;
  },

  createCurriculum: async (curriculum: { title: string; content: any }) => {
    const { data, error } = await supabase
      .from("curriculums")
      .insert(curriculum)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Cohorts
  getCohorts: async () => {
    const { data, error } = await supabase.from("cohorts").select(`
        *,
        cohort_mentors!inner(mentor_id),
        mentors!inner(*),
        mentees(*)
      `);
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

  updateMentor: async (id: string, updates: Partial<Mentor>) => {
    const { data, error } = await supabase
      .from("mentors")
      .update(updates)
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

  createMentor: async (mentor: Omit<Mentor, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("mentors")
      .insert(mentor)
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

  updateMentee: async (id: string, updates: Partial<Mentee>) => {
    const { data, error } = await supabase
      .from("mentees")
      .update(updates)
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
  ) => {
    const { data, error } = await supabase
      .from("mentees")
      .insert(mentee)
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
};
