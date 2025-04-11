import { NextResponse } from 'next/server';
import axios from 'axios';

type TokenResponse = {
  access_token: string;
  expires_in: string;
  token_type: string;
};

type CaseStatusResponse = {
  case_status: {
    receiptNumber: string;
    formType: string;
    submittedDate: string;
    current_case_status_text_en: string;
    current_case_status_desc_en: string;
    hist_case_status: Array<{
      date: string;
      completed_text_en: string;
      completed_text_es: string;
    }> | null;
  };
  message: string;
};

async function getAccessToken(): Promise<string> {
  const clientId = process.env.USCIS_CLIENT_ID;
  const clientSecret = process.env.USCIS_CLIENT_SECRET;
  const apiUrl = process.env.USCIS_API_URL;

  if (!apiUrl) {
    throw new Error('USCIS_API_URL environment variable is not set.');
  }
  if (!clientId) {
    throw new Error('USCIS_CLIENT_ID environment variable is not set.');
  }
  if (!clientSecret) {
    throw new Error('USCIS_CLIENT_SECRET environment variable is not set.');
  }
  
  const tokenUrl = `${apiUrl}/oauth/accesstoken`; // Construct token URL

  const response = await axios.post<TokenResponse>(tokenUrl, // Use constructed token URL
    `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }
  );

  return response.data.access_token;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const receiptNumber = searchParams.get('receiptNumber');

  if (!receiptNumber) {
    return NextResponse.json({ message: 'Receipt number is required' }, { status: 400 });
  }

  try {
    const accessToken = await getAccessToken();
    
    const apiUrl = process.env.USCIS_API_URL;
    if (!apiUrl) {
      // This should ideally not happen due to the check in getAccessToken, but adding for safety
      throw new Error('USCIS_API_URL environment variable is not set.');
    }
    // Construct case status URL directly from the base URL
    const caseStatusUrl = `${apiUrl}/case-status/${receiptNumber}`;

    const response = await axios.get<CaseStatusResponse>(
      caseStatusUrl, // Use the constructed case status URL
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    console.log('USCIS API Response:', response.data);
    console.log('Historical Data in Response:', response.data.case_status?.hist_case_status);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching case status:', error);
    return NextResponse.json({ message: 'Error fetching case status. Please make sure you have the correct receipt number' }, { status: 500 });
  }
} 