import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import WeatherSkeleton from "../loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  useForecastQuery,
  useReverseQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import CurrentWeather from "../current-weather";

export function WeatherDashboard() {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseQuery(coordinates);
  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };
  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather.</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Fail to fetch weather data. please try again</p>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="w-fit"
            disabled={weatherQuery.isFetching || forecastQuery.isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                weatherQuery.isFetching ? "animate-spin" : ""
              }`}
            />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button variant={"outline"} size={"icon"} onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className=" grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {weatherQuery.data && (
            <CurrentWeather
              data={weatherQuery.data}
              locationName={locationName}
            />
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
}
