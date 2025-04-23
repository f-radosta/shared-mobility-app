import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { RequestRideForm } from "@/components/rides/request-ride-form";
import { Vehicle as VehicleType } from "@/components/rides/request-ride-form";

export default async function RequestRidePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // Fetch available vehicles for the ride request
  const dbVehicles = await db.vehicle.findMany({
    where: {
      available: true,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  
  // Transform the database vehicles to match the expected Vehicle type
  const vehicles: VehicleType[] = dbVehicles.map(vehicle => ({
    id: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    licensePlate: vehicle.licensePlate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
    imageUrl: vehicle.imageUrl,
    user: {
      name: vehicle.user.name || 'Unknown Driver', // Handle null name
      email: vehicle.user.email
    }
  }));
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Request a Ride</h1>
        <p className="text-gray-500 mt-2">
          Fill out the form below to request a ride from one of our drivers.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <RequestRideForm vehicles={vehicles} userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
