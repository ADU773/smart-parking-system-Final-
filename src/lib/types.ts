export type ParkingSpotStatus = "available" | "occupied";

export type ParkingSpot = {
  id: string;
  status: ParkingSpotStatus;
};

// Represents the structure of the data coming from the API for a single spot.
export type ApiParkingSpot = {
  slotid: string;
  occupied: boolean;
};
