
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yfgyrfolsqpuejgfwvoj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3lyZm9sc3FwdWVqZ2Z3dm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODM0MzQsImV4cCI6MjA1NTk1OTQzNH0.AtSEV3MaH5AycQNqEtrK6uyd9YcXuj5sk2NViOC0jag'; 
export const supabase = createClient(supabaseUrl, supabaseKey);
