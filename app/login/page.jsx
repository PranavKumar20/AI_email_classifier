"use client"
import { signIn, signOut, useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'

const Login = () => {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [randomText, setRandomText] = useState('');

  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log(session.accessToken);
      fetchEmails(session.accessToken);
    }
  }, [status, session]);

  const fetchEmails = async (token) => {
    setLoading(true);
    try {
      const response = await fetch('/api/gmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }

      const data = await response.json();
      setEmails(data.emails);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
    setLoading(false);
  };

  if (status === "loading") {
    return <p>Loading....</p>
  }
  if (status === "authenticated") {
    return (
      <div>
        <p>Hi there</p>
        <button onClick={() => signOut("google")}>Logout</button>
        {loading ? <p>Loading emails...</p> : (
          <ul>
            {emails.map((email, index) => (
              <li key={index}>
                {email.snippet}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
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
        onClick={() => signIn("google")}
        disabled={!randomText}
      >
        Login with Google
      </button>
    </div>
  )
}

export default Login;
