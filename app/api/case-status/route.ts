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
  
  const response = await axios.post<TokenResponse>('https://api-int.uscis.gov/oauth/accesstoken', 
    `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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
    
    const response = await axios.get<CaseStatusResponse>(
      `https://api-int.uscis.gov/case-status/${receiptNumber}`,
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