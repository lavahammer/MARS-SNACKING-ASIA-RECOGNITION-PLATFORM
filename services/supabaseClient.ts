import { createClient } from '@supabase/supabase-js';

// Credentials provided for the Mars Snacking Asia project
const supabaseUrl = 'https://cnhumeulltwagvmdwqeg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuaHVtZXVsbHR3YWd2bWR3cWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4Mzc1MTcsImV4cCI6MjA3NTQxMzUxN30.0qNMTsMEoLnj7X8MQqgIb1_OUwQMA_aNtmdplmTXRmw';

// Initializing the client with confirmed credentials
export const supabase = createClient(supabaseUrl, supabaseKey);