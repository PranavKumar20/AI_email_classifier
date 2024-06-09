"use client"
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

const Login = ({ onLogin }) => {
  const [randomText, setRandomText] = useState('');

  const handleLogin = () => {
    if (randomText) {
      onLogin(randomText);
      signIn("google");
    }
  }

  return (
    <div>
      <label htmlFor="randomText">Random Text:</label>
      <input
        type="text"
        id="randomText"
        value={randomText}
        onChange={(e) => setRandomText(e.target.value)}
      />
      <button
        onClick={handleLogin}
        disabled={!randomText}
      >
        Login with Google
      </button>
    </div>
  )
}

export default Login;
