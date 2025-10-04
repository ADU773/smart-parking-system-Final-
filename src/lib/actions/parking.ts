"use server";

import { predictFutureSpotAvailability } from "@/ai/flows/predict-future-spot-availability";
import type { ParkingSpot, ApiParkingSpot } from "@/lib/types";

const API_URL = "https://pe50vomx54.execute-api.us-east-1.amazonaws.com/status";

export async function getParkingData(): Promise<ApiParkingSpot[] | null> {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add caching strategy
      next: { revalidate: 5 }
    });

    if (!res.ok) {
      // Log more details about the error
      console.error(`API request failed with status: ${res.status}`);
      const errorBody = await res.text();
      console.error(`Error body: ${errorBody}`);
      return null;
    }
    
    const data = await res.json();
    
    // The API returns a body property which is an array of slot statuses
    return data.body;
  } catch (err) {
    console.error("Error fetching parking slots from server action:", err);
    return null;
  }
}

export async function getPrediction(
  currentSpots: ParkingSpot[],
  timeframe: string
) {
  try {
    const occupiedCount = currentSpots.filter(
      (spot) => spot.status === "occupied"
    ).length;
    const availableCount = currentSpots.length - occupiedCount;
    
    const historicalData = `Historically, the parking lot experiences peak hours between 8-10 AM and 4-6 PM on weekdays. Occupancy is lower on weekends.`;
    const currentTrends = `Currently, ${occupiedCount} out of ${currentSpots.length} spots are occupied. ${availableCount} spots are available. The time is ${new Date().toLocaleTimeString()}.`;

    const result = await predictFutureSpotAvailability({
      historicalData,
      currentTrends,
      timeframe,
    });

    return { success: true, prediction: result.predictedAvailability };
  } catch (error) {
    console.error("Error getting prediction:", error);
    return { success: false, error: "Failed to get prediction." };
  }
}
