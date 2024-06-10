"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Login from '../components/Login'

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
      {isLoggedIn ? <Welcome /> : <Login onLogin={handleLogin} />}
    </main>
  )
}

const Welcome = () => {
  return <div className='text-2xl font-medium text-center' >
    <div>Welcome! you are logged in.</div>
    <div>Redirecting you to the Emails page</div>
  </div>
}
