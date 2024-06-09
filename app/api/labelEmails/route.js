import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export async function POST(request) {
  try {
    const { apiKey, emails } = await request.json();
    console.log('Received request with API key and emails:', { apiKey, emails });

    if (!apiKey || !emails) {
      console.error('API key or emails missing');
      return NextResponse.json({ error: 'API key and emails are required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('GoogleGenerativeAI instance created');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
    console.log('Generative model obtained');

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            { text: JSON.stringify({ emails }, null, 2) },
            { text: 'classify these mails based on the following labels and conditions' },
            { text: '1> Important: email that are personal or work-related and require immediate attention\n2> Promotional: emails related to sales, discounts and marketing campaigns\n3> Social: emails from social networks, friends and family\n4> Marketing: emails related to marketing, newsletters and notifications\n5> General: if none of the above' },
          ],
        },
        {
          role: 'user',
          parts: [
            { text: 'just return a json as\n"classifiedEmails":[\n{\n"id":"dkn8798jnsdkjn8",\n"category:"marketing"\n},\n]' },
          ],
        },
      ],
    });
    console.log('Chat session started');

    const result = await chatSession.sendMessage('Classify these emails');
    console.log('Message sent to chat session, awaiting response');

    const responseText = result.response.text();
    console.log('Response received:', responseText);

    // Extract the JSON part using a regular expression
    const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
    if (!jsonMatch || jsonMatch.length < 2) {
      throw new Error('Invalid response format');
    }
    const jsonResponse = jsonMatch[1].trim();
    console.log('Extracted JSON:', jsonResponse);

    const classifiedEmails = JSON.parse(jsonResponse).classifiedEmails;
    console.log('Classified emails:', classifiedEmails);

    return NextResponse.json({ classifiedEmails }, { status: 200 });
  } catch (error) {
    console.error('Error classifying emails:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  console.log('Passed through test');
  return NextResponse.json({ message: 'Hello from Next.js' }, { status: 200 });
}
