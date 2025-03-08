/* eslint-disable @typescript-eslint/no-explicit-any */
import { getClientIPInfo } from "./ipUtils";

type UserEventType = "call_click" | "chat_start" | "form_submit";

type EventMetadata = {
  userId?: string;
  location?: string;
  userAgent?: string;
  path?: string;
  ip?: string;
  geoInfo?: {
    city?: string;
    country?: string;
  };
} & Record<string, any>;

const GRAFANA_USERNAME = "1120495";
const GRAFANA_URL = "https://logs-prod-036.grafana.net/loki/api/v1/push";

export const log = async (
  level: "info" | "error" | "warn",
  message: string,
  metadata?: Record<string, any>
) => {
  let enrichedMetadata = { ...metadata };

  // If IP is provided, fetch geo information
  if (metadata?.ip) {
    const geoInfo = await getClientIPInfo(metadata.ip);
    enrichedMetadata = {
      ...enrichedMetadata,
      geoInfo,
    };
  }

  if (!process.env.GRAFANA_API_KEY) {
    console.log(`[${level}] ${message}`, enrichedMetadata);
    return;
  }

  const timestamp = new Date().getTime() * 1000000; // Nanoseconds

  const labels = {
    level,
    app: "skiplegal-api",
    env: process.env.VERCEL_ENV || "development",
    source: "vercel",
  };

  const payload = {
    streams: [
      {
        stream: labels,
        values: [
          [
            timestamp.toString(),
            JSON.stringify({
              message,
              ...enrichedMetadata,
            }),
          ],
        ],
      },
    ],
  };

  try {
    // Using the exact format from the Grafana docs
    const auth = Buffer.from(
      `${GRAFANA_USERNAME}:${process.env.GRAFANA_API_KEY}`
    ).toString("base64");

    const response = await fetch(GRAFANA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
        "X-Scope-OrgID": GRAFANA_USERNAME,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Grafana logging failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: GRAFANA_URL,
        authType: "Basic",
        username: GRAFANA_USERNAME,
      });
    }
  } catch (error) {
    console.error("Failed to send log to Grafana:", error);
  }
};

export const logUserEvent = async (
  eventType: UserEventType,
  metadata: EventMetadata = {}
) => {
  const enrichedMetadata = {
    ...metadata,
    timestamp: new Date().toISOString(),
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : "server",
    path: typeof window !== "undefined" ? window.location.pathname : "",
  };

  await log("info", `User Event: ${eventType}`, enrichedMetadata);
};
