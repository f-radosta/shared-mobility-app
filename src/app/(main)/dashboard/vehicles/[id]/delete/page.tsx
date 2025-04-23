import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import DeleteVehicleForm from "@/components/vehicles/delete-vehicle-form";

export default async function DeleteVehiclePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // Check if user is a driver
  if (session.user.role !== "DRIVER") {
    redirect("/dashboard");
  }
  
  // Fetch the vehicle
  const vehicle = await db.vehicle.findUnique({
    where: { id: params.id },
    include: {
      rides: {
        where: {
          status: {
            in: ["REQUESTED", "ACCEPTED", "IN_PROGRESS"],
          },
        },
        select: { id: true },
      },
    },
  });
  
  // If vehicle not found, show 404
  if (!vehicle) {
    notFound();
  }
  
  // Check if the user owns this vehicle
  if (vehicle.userId !== session.user.id) {
    redirect("/dashboard/vehicles");
  }
  
  // Check if there are active rides
  const hasActiveRides = vehicle.rides && vehicle.rides.length > 0;
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Delete Vehicle</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          Are you sure you want to delete this vehicle?
        </h2>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </p>
          <p className="text-gray-700">License Plate: {vehicle.licensePlate}</p>
        </div>
        
        {hasActiveRides ? (
          <div className="rounded-md bg-yellow-50 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This vehicle has active ride requests or ongoing rides.
                    You cannot delete it until all rides are completed or canceled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    This action cannot be undone. This will permanently delete the
                    vehicle and all associated data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <Link
            href={`/dashboard/vehicles/${vehicle.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
          
          {!hasActiveRides && <DeleteVehicleForm vehicleId={vehicle.id} />}
        </div>
      </div>
    </div>
  );
}
