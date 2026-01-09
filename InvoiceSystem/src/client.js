import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const API_KEY = import.meta.env.VITE_PROJECT_API_KEY;
export const supabase = createClient(URL, API_KEY);