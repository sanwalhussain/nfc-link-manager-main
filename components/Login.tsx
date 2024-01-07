import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Login({ setUser }: LoginProps) {
    const [cardID, setCardID] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            }
        };
        getUser();
    }, [setUser]);

    const authenticateWithCardID = async () => {
        // Replace 'your_table' with your actual table name
        let { data: users, error } = await supabase
            .from('links')
            .select('*')
            .eq('id', cardID)
            .single();

        if (error || !users) {
            setErrorMessage('Authentication failed. Invalid Card ID.');
            return null;
        }

        return users;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');

        const user = await authenticateWithCardID();

        if (user) {
            setUser(user);
        }
    };

    return (
        <React.Fragment>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-5xl text-emerald-200 font-bold text-center">Link manager</h1>
                <p className="mt-4 text-emerald-200 text-center text-xl">Sign in with your Card ID</p>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
            <div className="flex flex-col items-center justify-center">
                <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
                    <input
                        className="mt-4 px-4 py-2 border-2 text-emerald-400 placeholder-emerald-600 bg-emerald-950 border-emerald-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                        type="text"
                        placeholder="Card ID"
                        value={cardID}
                        onChange={(e) => setCardID(e.target.value)}
                    />
                    <button
                        className="mt-6 w-full py-3 bg-emerald-400 text-emerald-950 font-bold rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                        type="submit"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </React.Fragment>
    );
}
