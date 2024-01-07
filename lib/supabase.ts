import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jowhcvqejuahwkqhdjvs.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impvd2hjdnFlanVhaHdrcWhkanZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNDQ4MzE2NywiZXhwIjoyMDIwMDU5MTY3fQ.KRaK6EoUkcuMsHtvNgxKdeevvkapcYxVrKDxhuij71g";
export const supabase = createClient(supabaseUrl, supabaseKey);