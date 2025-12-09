import { createClient } from '@supabase/supabase-js';

// Vul hier je Supabase gegevens in
const SUPABASE_URL = 'https://ircfuvznefcekshziuqx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyY2Z1dnpuZWZjZWtzaHppdXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMDU1MjksImV4cCI6MjA4MDg4MTUyOX0.vTcizEzLjYAP9mex7jpDBGcueehtaTtwSWcliXz2JY8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
