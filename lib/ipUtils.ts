interface GeoInfo {
  city?: string;
  country?: string;
  region?: string;
}

// Cache object to store IP lookups
const ipCache: { [key: string]: { data: GeoInfo; timestamp: number } } = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function getClientIPInfo(ip: string): Promise<GeoInfo> {
  // Return cached result if available and not expired
  const cached = ipCache[ip];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,city,regionName`);
    const data = await response.json();
    
    if (data.status === 'success') {
      const geoInfo = {
        city: data.city,
        region: data.regionName,
        country: data.country
     
      };
      
      // Cache the result
      ipCache[ip] = {
        data: geoInfo,
        timestamp: Date.now()
      };
      
      return geoInfo;
    }
    return {};
  } catch (error) {
    console.error('Error fetching IP info:', error);
    return {};
  }
} 