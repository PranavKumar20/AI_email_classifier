"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Login from '../component/Login'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const router = useRouter();

  const handleLogin = (key) => {
    localStorage.setItem('geminiApiKey', key);
    setIsLoggedIn(true);
    setApiKey(key);
    router.push('/displayemails');
  }

  return (
    <main className="flex justify-center min-h-screen items-center">
      {isLoggedIn ? <p>Welcome! You are logged in.</p> : <Login onLogin={handleLogin} />}
    </main>
  )
}
