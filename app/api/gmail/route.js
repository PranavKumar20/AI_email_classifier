import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { token, numEmails } = await request.json();
  console.log("token:", token);
  console.log("numEmails:", numEmails);

  try {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({ access_token: token });

    const gmail = google.gmail({ version: 'v1', auth });

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: numEmails,
    });

    const messages = response.data.messages;

    if (!messages) {
      return NextResponse.json({ emails: [] }, { status: 200 });
    }

    const emailPromises = messages.map(async (message) => {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });
      return {
        id: msg.data.id,
        snippet: msg.data.snippet,
        subject: msg.data.payload.headers.find(header => header.name === 'Subject')?.value || 'No Subject',
      };
    });

    const emailResults = await Promise.all(emailPromises);

    return NextResponse.json({ emails: emailResults }, { status: 200 });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Error fetching emails' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST to fetch emails' }, { status: 200 });
}
