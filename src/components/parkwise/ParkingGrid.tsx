"use client";

import { useState, useEffect, useMemo } from "react";
import type { ParkingSpot, ApiParkingSpot } from "@/lib/types";
import { ParkingSpotTile } from "./ParkingSpot";
import { PredictionCard } from "./PredictionCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getParkingData } from "@/lib/actions/parking";

const initialParkingSpots: ParkingSpot[] = [
    { id: "A1", status: "available" }, { id: "A7", status: "available" },
    { id: "A2", status: "available" }, { id: "A8", status: "available" },
    { id: "A3", status: "available" }, { id: "A9", status: "available" },
    { id: "A4", status: "available" }, { id: "A10", status: "available" },
    { id: "A5", status: "available" }, { id: "A11", status: "available" },
    { id: "A6", status: "available" }, { id: "A12", status: "available" },
    { id: "B1", status: "available" }, { id: "B7", status: "available" },
    { id: "B2", status: "available" }, { id: "B8", status: "available" },
    { id: "B3", status: "available" }, { id: "B9", status: "available" },
    { id: "B4", status: "available" }, { id: "B10", status: "available" },
    { id: "B5", status: "available" }, { id: "B11", status: "available" },
    { id: "B6", status: "available" }, { id: "B12", status: "available" },
];

export function ParkingGrid() {
  const [spots, setSpots] = useState<ParkingSpot[]>(initialParkingSpots);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchData = async () => {
      try {
        const apiSpots: ApiParkingSpot[] | null = await getParkingData();
        if (!apiSpots) {
          console.error("Failed to fetch parking data or data is empty.");
          return;
        }

        setSpots((currentSpots) => {
          return currentSpots.map(spot => {
            const apiSpot = apiSpots.find(s => s.slotid === spot.id);
            if (apiSpot) {
              return { ...spot, status: apiSpot.occupied ? 'occupied' : 'available' };
            }
            return spot;
          });
        });

      } catch (err) {
        console.error("Error fetching parking slots:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [isClient]);

  const { leftSpots, rightSpots, availableCount, occupiedCount } = useMemo(() => {
    const left = spots.filter((_, i) => i < 12);
    const right = spots.filter((_, i) => i >= 12);
    const occupied = spots.filter(s => s.status === 'occupied').length;
    return {
      leftSpots: left,
      rightSpots: right,
      availableCount: spots.length - occupied,
      occupiedCount: occupied,
    };
  }, [spots]);

  if (!isClient) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row justify-center gap-8">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton key={index} className="w-32 h-24 rounded-lg" />
              ))}
            </div>
             <div className="flex items-center justify-center">
                <Skeleton className="w-px h-full bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton key={index} className="w-32 h-24 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Parking Lot Status</CardTitle>
          <CardDescription>Real-time view of parking spot availability.</CardDescription>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-accent" />
              <span>Available: {availableCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span>Occupied: {occupiedCount}</span>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <CardContent className="grid grid-cols-[1fr_auto_1fr] justify-center gap-4 md:gap-8 py-6 min-w-[600px]">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 justify-items-end">
              {leftSpots.map((spot) => (
                <ParkingSpotTile key={spot.id} spot={spot} />
              ))}
            </div>
            <div className="flex flex-col items-center justify-around gap-4">
               <p className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">Driveway</p>
            </div>
             <div className="grid grid-cols-2 gap-2 sm:gap-4 justify-items-start">
              {rightSpots.map((spot) => (
                <ParkingSpotTile key={spot.id} spot={spot} />
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
      
      <PredictionCard />
    </div>
  );
}
