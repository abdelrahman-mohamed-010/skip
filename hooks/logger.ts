/* eslint-disable @typescript-eslint/no-explicit-any */
const GRAFANA_USERNAME = '1120495';
const GRAFANA_URL = 'https://logs-prod-036.grafana.net/loki/api/v1/push';

export const log = async (
  level: 'info' | 'error' | 'warn',
  message: string,
  metadata?: Record<string, any>
) => {
  if (!process.env.GRAFANA_API_KEY) {
    console.log(`[${level}] ${message}`, metadata);
    return;
  }

  const timestamp = new Date().getTime() * 1000000; // Nanoseconds
  
  const labels = {
    level,
    app: "skiplegal-api",
    env: process.env.VERCEL_ENV || 'development',
    source: "vercel"
  };

  const payload = {
    streams: [{
      stream: labels,
      values: [
        [
          timestamp.toString(),
          JSON.stringify({
            message,
            ...metadata
          })
        ]
      ]
    }]
  };

  try {
    // Using the exact format from the Grafana docs
    const auth = Buffer.from(`${GRAFANA_USERNAME}:${process.env.GRAFANA_API_KEY}`).toString('base64');
    
    const response = await fetch(GRAFANA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'X-Scope-OrgID': GRAFANA_USERNAME
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grafana logging failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: GRAFANA_URL,
        authType: 'Basic',
        username: GRAFANA_USERNAME
      });
    }
  } catch (error) {
    console.error('Failed to send log to Grafana:', error);
  }
}; 