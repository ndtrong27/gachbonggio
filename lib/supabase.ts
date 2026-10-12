import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yxzlcvhprkdctoeqjmrw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4emxjdmhwcmtkY3RvZXFqbXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NzM0OTUsImV4cCI6MjEwNzM0OTQ5NX0.KsobajGV0yiyzmDX1M_YxfVAvOfKmRVPB0V0r0Hq6Dk";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
