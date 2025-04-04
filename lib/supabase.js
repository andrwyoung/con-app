import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzwtzocapyabuiierhzr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6d3R6b2NhcHlhYnVpaWVyaHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNzE4NDEsImV4cCI6MjA1ODk0Nzg0MX0.V2ZHZCsGaJ0bgaqGnFcFlTBZXQ_bMnJQQyf3eZGD2MI'

export const supabase = createClient(supabaseUrl, supabaseKey);
