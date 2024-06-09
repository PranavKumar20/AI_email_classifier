"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Login from '../component/Login'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogin = (randomText) => {
    setIsLoggedIn(true);
    router.push('/displayemails');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isLoggedIn ? <p>Welcome! You are logged in.</p> : <Login onLogin={handleLogin} />}
    </main>
  )
}
