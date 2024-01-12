
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { SaveIcon } from "./Icons/Save";
import { DeleteIcon } from "./Icons/Delete";
import { EditIcon } from "./Icons/Edit";

interface DashboardProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<null | User>>;
}

export default function Dashboard({ user, setUser }: Readonly<DashboardProps>) {
    const [links, setLinks] = useState<{ created_at: string; id: number; link: string; }[]>([]);
    const [edit, setEdit] = useState<number>(-1);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.log(error);
        else setUser(null);
    };

    const handleAdd = async () => {
        const { data, error } = await supabase.from('links').insert([{ link: 'https://google.com', email: user.email }]).select();
        if (error) console.log(error);
        if (data) setLinks([...links, ...data]);
    };

    useEffect(() => {
        const getLinks = async () => {
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .eq('email', user?.email);

            if (error) console.log(error);
            if (data && data?.length > 0) setLinks(data);
        };

        getLinks();
    }, [user]);

    return (
        <div className="dashboard-container">
            <h1 className="text-5xl text-emerald-200 font-bold text-center">Link Manager</h1>
            <p className="mt-4 text-emerald-200 text-center text-xl">Welcome, {user?.email}</p>

            <div className="card-container">
                {links.map((link, index) => (
                    <div key={link.id} className="neumorphic-card">
                        <img src="/card.svg" alt="Card" className="card-icon" />
                        <h5 className="card-title">ID: #{link.id}</h5>
                        <div className="card-text">
                            {edit === index ? (
                                <input
                                    className="edit-input px-4 py-2 border-2 text-emerald-400 placeholder-emerald-600 bg-emerald-950 border-emerald-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                                    type="text"
                                    value={link.link}
                                    onChange={(e) => setLinks(links.map((l, i) => i === index ? { ...l, link: e.target.value } : l))}
                                />
                            ) : (
                                <p>{link.link}</p>
                            )}
                        </div>
                        <div className="card-actions">
                            {edit === index ? (
                                <React.Fragment>
                                    <button className="save-button" onClick={() => {
                                        setEdit(-1);
                                        const updateLink = async () => {
                                            const { error } = await supabase.from('links').update({ link: link.link }).match({ id: link.id });
                                            if (error) console.log(error);
                                        };
                                        updateLink();
                                    }}>
                                        <SaveIcon />
                                    </button>
                                    <button className="cancel-button" onClick={() => setEdit(-1)}>
                                        <DeleteIcon />
                                    </button>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <button className="edit-button" onClick={() => setEdit(index)}>
                                        <EditIcon />
                                    </button>
                                    <button className="delete-button" onClick={() => {
                                        const deleteLink = async () => {
                                            const { error } = await supabase.from('links').delete().match({ id: link.id });
                                            if (error) console.log(error);
                                            else setLinks(links.filter((l, i) => i !== index));
                                        };
                                        deleteLink();
                                    }}>
                                        <DeleteIcon />
                                    </button>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button className="add-link-button mt-6 w-full py-3 bg-emerald-400 text-emerald-950 font-bold rounded-md focus:outline-none focus:ring-2 focus:border-transparent" onClick={handleAdd}>
                Add Link
            </button>
        </div>
    );
}
