import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Edit, Trash2, ArrowLeft, Calendar, Users, Car } from "lucide-react";

export default async function VehicleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // Fetch the vehicle
  const vehicle = await db.vehicle.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      rides: {
        where: {
          status: {
            in: ["REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED"],
          },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
  
  // If vehicle not found, show 404
  if (!vehicle) {
    notFound();
  }
  
  // Check if the user owns this vehicle or is a passenger
  const isOwner = vehicle.userId === session.user.id;
  const isPassenger = session.user.role === "PASSENGER";
  
  if (!isOwner && !isPassenger) {
    redirect("/dashboard");
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/vehicles"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Vehicles
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Vehicle header */}
        <div className="relative h-64 bg-gray-200">
          {vehicle.imageUrl ? (
            <Image
              src={vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Car className="h-24 w-24 text-gray-400" />
            </div>
          )}
          
          {/* Actions overlay for owner */}
          {isOwner && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <Link
                href={`/dashboard/vehicles/${vehicle.id}/edit`}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <Edit className="h-5 w-5 text-gray-600" />
              </Link>
              <Link
                href={`/dashboard/vehicles/${vehicle.id}/delete`}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <Trash2 className="h-5 w-5 text-red-600" />
              </Link>
            </div>
          )}
        </div>
        
        {/* Vehicle details */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">
            {vehicle.make} {vehicle.model}
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <span>{vehicle.capacity} passengers</span>
            </div>
            <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              {vehicle.vehicleType}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{vehicle.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">License Plate</h2>
            <p className="text-gray-700">{vehicle.licensePlate}</p>
          </div>
          
          {/* Owner info (only visible to passengers) */}
          {isPassenger && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Driver Information</h2>
              <p className="text-gray-700">{vehicle.user.name || "Driver"}</p>
              <p className="text-gray-500">{vehicle.user.email}</p>
            </div>
          )}
          
          {/* Recent rides (only visible to owner) */}
          {isOwner && vehicle.rides && vehicle.rides.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
              <div className="divide-y">
                {vehicle.rides.map((ride) => (
                  <div key={ride.id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{ride.user.name || ride.user.email}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(ride.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            ride.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : ride.status === "ACCEPTED" || ride.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {ride.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm">
                      From: {ride.pickupLocation}
                    </p>
                    <p className="text-sm">
                      To: {ride.dropoffLocation}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  href="/dashboard/rides"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View all rides
                </Link>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="mt-8 flex justify-between">
            <Link
              href="/dashboard/vehicles"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
            >
              Back to Vehicles
            </Link>
            
            {isOwner ? (
              <Link
                href={`/dashboard/vehicles/${vehicle.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Vehicle
              </Link>
            ) : (
              <Link
                href={`/dashboard/rides/new?vehicleId=${vehicle.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Request Ride
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
