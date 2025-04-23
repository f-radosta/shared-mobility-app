"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Car, MapPin, Clock, DollarSign } from "lucide-react";
import { SaveRidePreferences } from "./save-ride-preferences";
import { LoadRidePreferences } from "./load-ride-preferences";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: number;
  vehicleType: string;
  imageUrl: string | null;
  user: {
    name: string;
    email: string;
  };
}

interface RequestRideFormProps {
  vehicles: Vehicle[];
  userId: string;
}

interface FormData {
  vehicleId: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  notes: string;
}

export function RequestRideForm({ vehicles, userId }: RequestRideFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // Watch form values to calculate price
  const pickupLocation = watch("pickupLocation");
  const dropoffLocation = watch("dropoffLocation");
  const vehicleId = watch("vehicleId");

  // Update selected vehicle when vehicleId changes
  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicle = vehicles.find((v) => v.id === e.target.value);
    setSelectedVehicle(vehicle || null);
    
    // Calculate estimated price based on vehicle type and locations
    if (vehicle && pickupLocation && dropoffLocation) {
      calculateEstimatedPrice(vehicle, pickupLocation, dropoffLocation);
    } else {
      setEstimatedPrice(null);
    }
  };

  // Calculate price when locations change
  const handleLocationChange = () => {
    if (selectedVehicle && pickupLocation && dropoffLocation) {
      calculateEstimatedPrice(selectedVehicle, pickupLocation, dropoffLocation);
    } else {
      setEstimatedPrice(null);
    }
  };

  // Simple price calculation (in a real app, this would be more sophisticated)
  const calculateEstimatedPrice = (
    vehicle: Vehicle,
    pickup: string,
    dropoff: string
  ) => {
    // This is a simplified calculation - in a real app, you'd use maps API
    // to calculate distance and more factors
    const basePrice = vehicle.vehicleType === "SEDAN" ? 15 : 
                     vehicle.vehicleType === "SUV" ? 20 :
                     vehicle.vehicleType === "HATCHBACK" ? 18 : 25;
    
    // Add some randomness based on location string length for demo purposes
    const locationFactor = (pickup.length + dropoff.length) / 20;
    
    const price = basePrice + locationFactor;
    setEstimatedPrice(parseFloat(price.toFixed(2)));
  };

  const handleLoadPreference = (preference: { pickupLocation: string; dropoffLocation: string; vehicleId?: string }) => {
    // Set form values from the saved preference
    setValue("pickupLocation", preference.pickupLocation);
    setValue("dropoffLocation", preference.dropoffLocation);
    
    if (preference.vehicleId) {
      setValue("vehicleId", preference.vehicleId);
      // Find the selected vehicle and update state
      const vehicle = vehicles.find(v => v.id === preference.vehicleId);
      if (vehicle) {
        setSelectedVehicle(vehicle);
      }
    }
    
    // Use setTimeout to ensure the form values are updated before calculating price
    setTimeout(() => {
      // Calculate the price based on the loaded preference
      if (preference.pickupLocation && preference.dropoffLocation) {
        // Simple distance calculation (mock implementation)
        const getRandomDistance = (min: number, max: number) => {
          return Math.floor(Math.random() * (max - min + 1) + min);
        };
        
        // Get a random distance between 3 and 15 km
        const distance = getRandomDistance(3, 15);
        
        // Calculate price based on distance and selected vehicle
        const basePrice = 5; // Base fare
        const perKmRate = selectedVehicle ? (selectedVehicle.vehicleType === "LUXURY" ? 2.5 : 1.5) : 1.5;
        const price = basePrice + distance * perKmRate;
        
        // Update the estimated price
        setEstimatedPrice(parseFloat(price.toFixed(2)));
      }
    }, 0);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Ensure pickup time is in the future
      const pickupDate = new Date(data.pickupTime);
      const now = new Date();
      
      if (pickupDate <= now) {
        setError("Pickup time must be in the future");
        setIsLoading(false);
        return;
      }

      // Add the estimated price to the request
      const requestData = {
        ...data,
        userId,
        price: estimatedPrice,
      };

      console.log('Sending ride request:', requestData);

      const response = await fetch("/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Ride request error:', errorData);
        throw new Error(errorData.message || "Failed to request ride");
      }

      // Redirect to the passenger's my-rides page
      router.push("/dashboard/my-rides");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Load Saved Ride Preferences */}
      <LoadRidePreferences onSelectPreference={handleLoadPreference} />
      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-1">
              Select Vehicle
            </label>
            <div className="relative">
              <select
                id="vehicleId"
                {...register("vehicleId", { required: "Please select a vehicle" })}
                onChange={handleVehicleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 pl-4"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.vehicleType}
                  </option>
                ))}
              </select>
              <Car className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.vehicleId && (
              <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>
            )}
          </div>

          {selectedVehicle && (
            <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h3 className="font-medium mb-2">Vehicle Details</h3>
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Driver:</span> {selectedVehicle.user.name}</p>
                <p><span className="font-medium">Vehicle:</span> {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</p>
                <p><span className="font-medium">License Plate:</span> {selectedVehicle.licensePlate}</p>
                <p><span className="font-medium">Capacity:</span> {selectedVehicle.capacity} passengers</p>
                <p><span className="font-medium">Type:</span> {selectedVehicle.vehicleType}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="mb-6">
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location
            </label>
            <div className="relative">
              <input
                id="pickupLocation"
                type="text"
                {...register("pickupLocation", { 
                  required: "Pickup location is required",
                  onChange: handleLocationChange
                })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 pl-4"
                placeholder="Enter pickup address"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.pickupLocation && (
              <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Dropoff Location
            </label>
            <div className="relative">
              <input
                id="dropoffLocation"
                type="text"
                {...register("dropoffLocation", { 
                  required: "Dropoff location is required",
                  onChange: handleLocationChange
                })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 pl-4"
                placeholder="Enter destination address"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.dropoffLocation && (
              <p className="mt-1 text-sm text-red-600">{errors.dropoffLocation.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Time
            </label>
            <div className="relative">
              <input
                id="pickupTime"
                type="datetime-local"
                {...register("pickupTime", { required: "Pickup time is required" })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 pl-4"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.pickupTime && (
              <p className="mt-1 text-sm text-red-600">{errors.pickupTime.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes (Optional)
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={3}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 pl-4"
          placeholder="Any special instructions for the driver?"
        />
      </div>

      {estimatedPrice !== null && (
        <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="font-medium">Estimated Price</h3>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600">
            ${estimatedPrice.toFixed(2)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Final price may vary based on actual distance and time.
          </p>
        </div>
      )}

      {/* Save Ride Preferences */}
      {watch("pickupLocation") && watch("dropoffLocation") && (
        <div className="mt-6 flex justify-end">
          <SaveRidePreferences
            pickupLocation={watch("pickupLocation")}
            dropoffLocation={watch("dropoffLocation")}
            vehicleId={watch("vehicleId")}
          />
        </div>
      )}
      
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? "Requesting..." : "Request Ride"}
        </button>
      </div>
    </form>
  );
}
