'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface SignUpProps {
    setUser: React.Dispatch<React.SetStateAction<null | User>>;
}

export default function SignUp({ setUser }: SignUpProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [deviceId, setDeviceId] = useState<string>(''); // New state for device ID
    const [error, setError] = useState<string | null>(null);


    
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Input validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError('Please enter a valid email address.');
        return;
    }
    if (password.length < 4) {
        setError('Password must be at least 8 characters long.');
        return;
    }
    if (!deviceId.match(/^[a-zA-Z0-9]+$/)) {
        setError('Invalid device ID format.');
        return;
    }

    try {
        // Check if the device is already registered with the given email
        const { data: existingLink, error: existingLinkError } = await supabase
            .from('links')
            .select('email')
            .eq('id', deviceId)
            .eq('email', email);

        if (existingLinkError) throw existingLinkError;

        if (existingLink && existingLink.length > 0) {
            setError('This device is already registered against this email.');
            return;
        }

        // Device ID validation logic
        const { data, error: linkError } = await supabase
            .from('links')
            .select('email')
            .eq('id', deviceId);

        if (linkError) throw linkError;

        if (data && data.length > 0) {
            if (data[0].email && data[0].email !== email) {
                setError('Device is already linked to another email. Please use email and password sign in.');
                return;
            }

            // Link the device with the new email if it's not already linked
            const { error: updateError } = await supabase
                .from('links')
                .update({ email })
                .match({ id: deviceId });

            if (updateError) throw updateError;
        } else {
            setError('Invalid device ID.');
            return;
        }

        // Proceed with the normal signup process
        const signUpResponse = await supabase.auth.signUp({ email, password });

        if (signUpResponse.error) throw signUpResponse.error;
        if (signUpResponse.data?.user) setUser(signUpResponse.data.user);
    } catch (err) {
        // Error handling
        if (err instanceof Error && err.message) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred during signup.');
        }
    }
};
    return (
        <React.Fragment>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-5xl text-emerald-200 font-bold text-center">Link Manager</h1>
                <p className="mt-4 text-emerald-200 text-center text-xl">Sign up for an account</p>
            </div>
            <div className="flex flex-col items-center justify-center">
                {error && <p className="error-message">{error}</p>}
                <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
                    <input
                        className="mt-4 px-4 py-2 border-2 text-emerald-400 placeholder-emerald-600 bg-emerald-950 border-emerald-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                        type="text"
                        placeholder="Device ID"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                    />
                    <input
                        className="mt-4 px-4 py-2 border-2 text-emerald-400 placeholder-emerald-600 bg-emerald-950 border-emerald-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="mt-4 px-4 py-2 border-2 text-emerald-400 placeholder-emerald-600 bg-emerald-950 border-emerald-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="mt-6 w-full py-3 bg-emerald-400 text-emerald-950 font-bold rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                        type="submit"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </React.Fragment>
    )
}






