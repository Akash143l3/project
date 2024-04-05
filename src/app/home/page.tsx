"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

function redirectToLogin() {
    window.location.href = '/';
}

function logout() {
    // Clear authentication status from session storage
    sessionStorage.removeItem('isAuthenticated');
    // Redirect to the login page
    redirectToLogin();
}

export default function Home() {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Check if authentication is done
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');

        // If not authenticated, redirect to the login page
        if (!isAuthenticated) {
            redirectToLogin();
        } else {
            // Fetch user's name from the database
            axios.post('http://127.0.0.1:5000/login')// Replace '/api/user/name' with your actual API endpoint
                .then(response => {
                    setUserName(response.data.userName);
                    console.log(response) // Assuming the response contains the user's name
                })
                .catch(error => {
                    console.error('Error fetching user name:', error);
                });
        }
    }, []);

    return (
        <div className="flex flex-col pt-60 gap-10 items-center h-full w-full">
            <div>
                <h1 className='text-2xl font-semibold'>Welcome {userName}</h1>
            </div>
            <Button onClick={logout}>Logout</Button>
        </div>
    );
}
