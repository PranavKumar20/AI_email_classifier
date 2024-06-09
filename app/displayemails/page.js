"use client"
import { signOut, useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'

const DisplayEmails = () => {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState([]);
  const [classifiedEmails, setClassifiedEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [numEmails, setNumEmails] = useState(10);
  const [geminiApiKey, setGeminiApiKey] = useState('');

  useEffect(() => {
    if (status === "authenticated" && session) {
      fetchEmails(session.accessToken, numEmails);
    }
  }, [status, session, numEmails]);

  const fetchEmails = async (token, numEmails) => {
    setLoading(true);
    try {
      const response = await fetch('/api/gmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, numEmails })
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

  const labelEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/labelEmails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey: geminiApiKey, emails })
      });

      if (!response.ok) {
        throw new Error('Failed to label emails');
      }

      const data = await response.json();
      const classified = data.classifiedEmails;

      // Map the classified emails to include the original email data
      const mergedEmails = classified.map(classifiedEmail => {
        const originalEmail = emails.find(email => email.id === classifiedEmail.id);
        return {
          ...originalEmail,
          category: classifiedEmail.category
        };
      });

      setClassifiedEmails(mergedEmails);
    } catch (error) {
      console.error('Error labeling emails:', error);
    }
    setLoading(false);
  };

  if (status === "loading") {
    return <p>Loading....</p>
  }

  if (status === "authenticated") {
    return (
      <div className="p-6">
        <div className="mb-4">
          <label htmlFor="numEmails" className="block text-sm font-medium text-gray-700">Number of Recent Emails:</label>
          <input 
            type="number" 
            id="numEmails" 
            value={numEmails} 
            onChange={(e) => setNumEmails(e.target.value)} 
            className="mt-1 p-2 border border-gray-300 rounded shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700">Google Generative AI API Key:</label>
          <input 
            type="text" 
            id="geminiApiKey" 
            value={geminiApiKey} 
            onChange={(e) => setGeminiApiKey(e.target.value)} 
            className="mt-1 p-2 border border-gray-300 rounded shadow-sm"
          />
        </div>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={labelEmails}
          disabled={!geminiApiKey}
        >
          Label Emails
        </button>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded mb-4"
          onClick={() => signOut("google")}
        >
          Logout
        </button>
        {loading ? <p>Loading emails...</p> : (
          <ul className="space-y-2">
            {(classifiedEmails.length > 0 ? classifiedEmails : emails).map((email, index) => (
              <li key={index} className="p-4 bg-gray-100 rounded shadow">
                <p className="font-bold">{email.subject}</p>
                <p>{email.snippet}</p>
                {email.category && <p className="italic">{email.category}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return <p className="text-center text-lg">You need to log in to view your emails.</p>
}

export default DisplayEmails;