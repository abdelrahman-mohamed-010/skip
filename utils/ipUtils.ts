/**
 * Utility functions for IP address handling
 */

interface GeoInfo {
  city?: string;
  country?: string;
  region?: string;
}

/**
 * Get geolocation information for an IP address
 * Uses ipinfo.io service which has a free tier of 50K requests per month
 */
export async function getClientIPInfo(ip: string): Promise<GeoInfo> {
  try {
    // Skip geolocation for localhost or private IPs
    if (ip === 'unknown' || ip.startsWith('127.') || ip === '::1' || ip.startsWith('192.168.')) {
      return { country: 'Unknown', city: 'Unknown' };
    }

    const token = process.env.IPINFO_TOKEN;
    const url = token 
      ? `https://ipinfo.io/${ip}?token=${token}` 
      : `https://ipinfo.io/${ip}/json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch IP info: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      city: data.city,
      country: data.country,
      region: data.region
    };
  } catch (error) {
    console.error('Error fetching IP geolocation:', error);
    return { country: 'Unknown', city: 'Unknown' };
  }
} 