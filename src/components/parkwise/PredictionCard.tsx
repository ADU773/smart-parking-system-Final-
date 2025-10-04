"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getPrediction, getParkingData } from "@/lib/actions/parking";
import type { ParkingSpot, ApiParkingSpot } from "@/lib/types";

const formSchema = z.object({
  timeframe: z.string().min(3, "Please enter a timeframe (e.g., 'next 30 minutes')."),
});

const initialParkingSpots: ParkingSpot[] = [
    { id: "A1", status: "available" }, { id: "A2", status: "available" },
    { id: "A3", status: "available" }, { id: "A4", status: "available" },
    { id: "A5", status: "available" }, { id: "A6", status: "available" },
    { id: "B1", status: "available" }, { id: "B2", status: "available" },
    { id: "B3", status: "available" }, { id: "B4", status: "available" },
    { id: "B5", status: "available" }, { id: "B6", status: "available" },
    { id: "C1", status: "available" }, { id: "C2", status: "available" },
    { id: "C3", status: "available" }, { id: "C4", status: "available" },
    { id: "C5", status: "available" }, { id: "C6", status: "available" },
    { id: "D1", status: "available" }, { id: "D2", status: "available" },
    { id: "D3", status: "available" }, { id: "D4", status: "available" },
    { id: "D5", status: "available" }, { id: "D6", status: "available" },
];

export function PredictionCard() {
  const [spots, setSpots] = useState<ParkingSpot[]>(initialParkingSpots);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeframe: "in the next 30 minutes",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    
    const result = await getPrediction(spots, values.timeframe);
    
    if (result.success) {
      setPrediction(result.prediction);
    } else {
      setError(result.error ?? "An unknown error occurred.");
    }
    setIsLoading(false);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-primary" />
          <CardTitle>Availability Prediction</CardTitle>
        </div>
        <CardDescription>
          Use AI to predict parking availability for a future time.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeframe</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'next hour'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={isLoading} size="sm" className="w-full sm:w-auto sm:text-sm md:text-base md:h-10 md:px-4 md:py-2">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Predict Availability
            </Button>
            {(prediction || error) && (
               <div className="p-4 bg-muted/50 rounded-lg w-full">
                  {prediction && (
                      <>
                          <p className="font-semibold text-primary">AI Prediction:</p>
                          <p className="text-sm text-foreground">{prediction}</p>
                      </>
                  )}
                  {error && (
                      <p className="font-semibold text-destructive">{error}</p>
                  )}
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
