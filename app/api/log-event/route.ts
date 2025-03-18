import { NextRequest, NextResponse } from 'next/server';
import { log, enrichWithIPInfo } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Extract the request body
    const body = await request.json();
    const { eventType, level, message, metadata } = body;
    
    // Get client IP from request headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Enrich the log data with IP information
    const enrichedData = await enrichWithIPInfo(metadata || {}, ip);
    
    if (eventType === 'generic' && level && message) {
      // Handle generic log events
      await log(level, message, enrichedData);
    } else if (eventType) {
      // Handle user events
      await log('info', `User Event: ${eventType}`, enrichedData);
    } else {
      return NextResponse.json({ error: 'Invalid log format' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging event:', error);
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
  }
}  