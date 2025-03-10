/*
* https://developer.uscis.gov/api/case-status
*/

import type { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CaseStatusResponse | { message: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { receiptNumber } = req.query;

  if (!receiptNumber) {
    return res.status(400).json({ message: 'Receipt number is required' });
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

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching case status:', error);
    res.status(500).json({ message: 'Error fetching case status' });
  }
} 