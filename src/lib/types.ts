import { Database } from "@/types/supabase";

export type MombasaSubcounty = Database["public"]["Enums"]["mombasa_subcounty"];
export type CohortStatus = Database["public"]["Enums"]["cohort_status"];

export interface CohortWithDetails {
  id: string;
  name: string;
  status: CohortStatus;
  subcounty: MombasaSubcounty;
  mentors: {
    id: string;
    name: string;
    email: string;
    subcounty: MombasaSubcounty;
  }[];
  mentees: {
    id: string;
    name: string;
    email: string;
    subcounty: MombasaSubcounty;
  }[];
  created_at: string;
  updated_at: string;
}
