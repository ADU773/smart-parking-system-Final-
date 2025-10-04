import { Car } from "lucide-react";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center gap-3">
        <Car className="h-8 w-8" />
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          ParkWise
        </h1>
      </div>
    </header>
  );
}
