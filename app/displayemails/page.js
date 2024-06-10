"use client"

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'

const DisplayEmails = () => {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState([]);
  const [classifiedEmails, setClassifiedEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [numEmails, setNumEmails] = useState(10);
  const router = useRouter();

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
      const apiKey = localStorage.getItem('geminiApiKey');
      const response = await fetch('/api/labelEmails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey, emails })
      });

      if (!response.ok) {
        throw new Error('Failed to label emails');
      }

      const data = await response.json();
      const classified = data.classifiedEmails;

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


  const handleSubmit = (e) => {
    e.preventDefault();
    fetchEmails(session.accessToken, numEmails);
  };
  const handleSignout = () => {
    signOut("google");
    router.push('/');
  }
  const handleUnlogged = () => {
    router.push("/");
  }

  if (status === "loading") {
    return <p>Loading....</p>
  }

  if (status === "authenticated") {
    return (
      <div className="p-6">
        <button
          className="bg-amber-400 text-white px-4 py-2 rounded mb-4 absolute top-4 right-4"
          onClick={handleSignout}
        >
          Logout
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="numEmails" className="block text-sm font-medium text-gray-700">Number of Recent Emails:</label>
            <div className="flex">
              <input
                type="number"
                id="numEmails"
                value={numEmails}
                onChange={(e) => setNumEmails(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded shadow-sm"
              />
            </div>
          </div>
        </form>
        <button
          className="bg-emerald-400 text-white px-4 py-2 rounded mb-4"
          onClick={labelEmails}
        >
          Label Emails
        </button>
        {loading ? <p>Loading emails...</p> : (
          <ul className="space-y-2">
            {(classifiedEmails.length > 0 ? classifiedEmails : emails).map((email, index) => (
              <li key={index} className="p-4 bg-gray-100 rounded shadow">
                <div className="flex justify-between">
                  <p className="font-bold">{email.subject}</p>
                  {email.category && (
                    <span className={`bg-${getColor(email.category)} px-2 py-1 rounded`}>
                      {/* //  <span className={`bg-black text-white px-2 py-1 rounded`}> */}
                      {email.category}
                    </span>
                  )}
                </div>
                <p>{email.snippet}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return <div className="text-center text-4xl flex justify-center">
    <div className='w-1/2 p-4 shadow-lg border border-black  sm:mt-10' >
      <div className='text-2xl p-2' >If you are being redirected after login then please wait</div>
      <div>You need to log in to view your emails</div>
      <div className='flex justify-center' >
        <div onClick={handleUnlogged} className='cursor-pointer border border-black p-3 bg-emerald-400 text-white rounded-md m-3 hover:bg-emerald-500'  >Go to login Page</div>
      </div>
    </div>
  </div>
}

const getColor = (category) => {
  switch (category) {
    case 'Marketing':
      return 'rose-400';
    case 'Important':
      return 'orange-500';
    case 'Promotional':
      return 'yellow-500';
    case 'Social':
      return 'pink-500';
    case 'General':
      return 'teal-500';
    default:
      return 'black';
  }
}

export default DisplayEmails;
