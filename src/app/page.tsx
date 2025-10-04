import { Header } from "@/components/parkwise/Header";
import { ParkingGrid } from "@/components/parkwise/ParkingGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="py-8">
        <ParkingGrid />
      </main>
    </div>
  );
}
