"use client"
import { signIn, useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Login = ({ onLogin }) => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/displayemails');
    } else {
      setGeminiApiKey('');
    }
  }, [status, router]);

  const handleLogin = () => {
    if (geminiApiKey) {
      localStorage.setItem('geminiApiKey', geminiApiKey);
      onLogin(geminiApiKey);
      signIn("google");
    }
  }

  return (
    <div className='flex text-center items-center justify-center min-h-screen'>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="font-medium text-2xl mb-6">Welcome to AI Email Classifier</div>
        <div className="text-lg mb-6">Please enter the API key to continue</div>
        <div className="flex flex-col mb-6">
          <label htmlFor="geminiApiKey" className="text-lg mb-2">Google Generative AI API Key:</label>
          <input
            type="text"
            id="geminiApiKey"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={!geminiApiKey}
          className="bg-blue-500 text-white text-lg rounded w-full py-3 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Login with Google
        </button>
      </div>
    </div>
  )
}

export default Login;
