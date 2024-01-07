import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";

interface DashboardProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<null | User>>;
}

export default function Dashboard({ user, setUser }: DashboardProps) {
  const [link, setLink] = useState<{
    created_at: string;
    id: number;
    link: string;
  } | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [newLink, setNewLink] = useState<string>(""); // State to store the edited link

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    else setUser(null);
  };

  const desiredId = 1; // Replace with the actual ID you want to fetch

  useEffect(() => {
    const getLink = async () => {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('id', desiredId);

      if (error) {
        console.log("Error fetching link:", error);
      } else {
        if (data && data.length > 0) {
          setLink(data[0]);
          setNewLink(data[0].link); // Set initial link value for editing
        }
        setLoading(false);
      }
    };

    getLink();
  }, [desiredId]);

  const handleEditToggle = () => {
    setEdit(!edit);
  };

  const handleSave = async () => {
    // Update the link in the database
    const { error } = await supabase
      .from('links')
      .update({ link: newLink })
      .eq('id', desiredId);

    if (error) {
      console.log("Error updating link:", error);
    } else {
      // Update the local link state and exit edit mode
      setLink((prevLink) => ({
        ...prevLink!,
        link: newLink,
      }));
      setEdit(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-5xl text-emerald-200 font-bold text-center">
        Link manager
      </h1>
      {link ? (
        <div>
          <p className="mt-4 text-emerald-200 text-center text-xl">
            Device ID: {link.id}
          </p>
          {edit ? (
            <div>
              <input
                className="mt-4 px-4 py-2 border-2 text-emerald-400 placeholder-emerald-600 bg-emerald-950 border-emerald-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                type="text"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
              />
              <button
                className="mt-2 px-4 py-2 bg-emerald-400 text-emerald-950 font-bold rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <p className="mt-4 text-emerald-200 text-center text-xl">
                Link: {link.link}
              </p>
              <button
                className="mt-2 px-4 py-2 bg-emerald-400 text-emerald-950 font-bold rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                onClick={handleEditToggle}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-4 text-emerald-200 text-center text-xl">
          No link found for the specified ID.
        </p>
      )}
      <button
        className="mt-4 w-full py-3 bg-red-400 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
