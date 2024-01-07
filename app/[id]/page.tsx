// Import necessary modules
import { supabase } from "@/lib/supabase";
import { redirect } from 'next/navigation'

// Function to fetch the link data
async function fetchLink(id: string) {
  if (!id) return null;
  const res = await supabase.from('links').select().match({ id: parseInt(id) }).single();

  if (res.error || res.data === null) return null;
  return res.data;
}

// Server Component with revalidate set to 0
export const revalidate = 0; // Set revalidate to 0 to fetch real-time data on each request

export default async function Profile({ params }: Readonly<{ params: any }>) {
  // Fetch the link data
  const team = await fetchLink(params.id);

  // Check if the team data is available
  if (team) {
    redirect(team.link);
  } else {
    redirect('/not-found');
  }

  return <></>;
}
