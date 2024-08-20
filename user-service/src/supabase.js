// src/supabase.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://clfnsaeksbtdkoaugqcc.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZm5zYWVrc2J0ZGtvYXVncWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwNzM3NTYsImV4cCI6MjAzOTY0OTc1Nn0.JX0s6PaGFKx1AIzVGWbOiPCugOeepV1xEzOvgzkqoqc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = supabase;
