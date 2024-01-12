// Home component
'use client';
import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/Login';
import SignUp from '@/components/Signup';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [showSignUp, setShowSignUp] = useState(false);
    const [authCheckComplete, setAuthCheckComplete] = useState(false); // New state for auth check

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setAuthCheckComplete(true); // Set to true after checking user
        };
        checkUser();
    }, []);

    if (!authCheckComplete) {
        return <div>Loading...</div>; // Or any other loading indicator
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {user ? (
                <Dashboard user={user} setUser={setUser} />
            ) : (
                <>
                    {showSignUp ? (
                        <SignUp setUser={setUser} />
                    ) : (
                        <Login setUser={setUser} />
                    )}
                    <button
                        className="mt-4 text-emerald-200"
                        onClick={() => setShowSignUp(!showSignUp)}
                    >
                        {showSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
                    </button>
                </>
            )}
        </main>
    );
}
