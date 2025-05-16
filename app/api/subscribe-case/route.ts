import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, caseNumber } = body;

    if (!email || !caseNumber) {
      return NextResponse.json(
        { error: 'Email and case number are required' },
        { status: 400 }
      );
    }

    console.log(`Attempting to subscribe: ${email} for case ${caseNumber}`);
    
    // Get the backend URL from environment variables
    const backendUrl = process.env.CASE_SUBSCRIPTION_API_URL;
    console.log('Environment variable CASE_SUBSCRIPTION_API_URL:', backendUrl);
    
    if (!backendUrl) {
      console.error('CASE_SUBSCRIPTION_API_URL environment variable is not set');
      return NextResponse.json(
        { error: 'Backend service configuration error' },
        { status: 500 }
      );
    }
    
    try {
      const fullUrl = `${backendUrl}/add-uscis-case-to-ctct`;
      console.log('Connecting to full URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          case_number: caseNumber
        })
      });

      console.log(`Backend response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend error response: ${errorText}`);
        return NextResponse.json(
          { error: `Backend service error: ${response.status} ${errorText || response.statusText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('Subscription successful:', data);
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Network error when connecting to backend:', fetchError);
      return NextResponse.json(
        { error: 'Unable to connect to the backend service. Please ensure the service is running.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error in subscribe-case route:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
} 