"use client";

import { Car } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ParkingSpot } from "@/lib/types";

type ParkingSpotProps = {
  spot: ParkingSpot;
};

export function ParkingSpotTile({ spot }: ParkingSpotProps) {
  const isAvailable = spot.status === "available";

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 shadow-sm transition-all duration-500 ease-in-out transform hover:scale-105 w-24 h-16 sm:w-28 sm:h-20",
        isAvailable
          ? "bg-card border-accent"
          : "bg-muted border-destructive"
      )}
    >
      {isAvailable ? (
        <div className="text-center">
          <span className="font-bold text-accent text-lg">{spot.id}</span>
          <span className="text-xs text-accent/80 hidden sm:block">Available</span>
        </div>
      ) : (
        <div className="text-center flex flex-col items-center justify-center">
          <Car
            className="h-6 w-6 sm:h-8 sm:w-8 text-destructive transition-transform duration-300"
            aria-label="Occupied"
          />
           <span className="font-bold text-muted-foreground text-sm mt-1">{spot.id}</span>
        </div>
      )}
      <div
        className={cn(
          "absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full transition-colors duration-500",
          isAvailable ? "bg-accent" : "bg-destructive"
        )}
      />
    </div>
  );
}
