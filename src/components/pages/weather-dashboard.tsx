import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";

const Weatherdashboard = () => {
  const { coordinates, error, getLocation, isLoading } = useGeolocation();

  console.log(coordinates);
  console.log(error);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button variant={"outline"} size={"icon"}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Weatherdashboard;
