import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, CheckCircle, User, MapPin, Calendar, Clock } from "lucide-react";
import { CompleteRideForm } from "@/components/rides/complete-ride-form";

export default async function CompleteRidePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // Only drivers can complete rides
  if (session.user.role !== "DRIVER") {
    redirect("/dashboard");
  }
  
  // Fetch the ride with related data
  const ride = await db.ride.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      vehicle: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  
  // If ride not found, show 404
  if (!ride) {
    notFound();
  }
  
  // Check if the user is the vehicle owner
  if (ride.vehicle.userId !== session.user.id) {
    redirect("/dashboard/rides");
  }
  
  // Check if the ride is in a state that can be completed
  if (ride.status !== "IN_PROGRESS") {
    redirect(`/dashboard/rides/${ride.id}`);
  }
  
  // Format the pickup time
  const pickupTime = ride.pickupTime ? new Date(ride.pickupTime) : null;
  const formattedDate = pickupTime ? pickupTime.toLocaleDateString() : 'Not specified';
  const formattedTime = pickupTime ? pickupTime.toLocaleTimeString() : 'Not specified';
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href={`/dashboard/rides/${ride.id}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Ride Details
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Complete Ride</h1>
          <p className="text-gray-500 mt-2">
            You are about to mark this ride as completed. This will finalize the ride and allow the passenger to leave a review.
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Trip Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Pickup Location</div>
                    <div className="font-medium">{ride.pickupLocation}</div>
                  </div>
                </div>
                <div className="flex">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Dropoff Location</div>
                    <div className="font-medium">{ride.dropoffLocation}</div>
                  </div>
                </div>
                <div className="flex">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">{formattedDate}</div>
                  </div>
                </div>
                <div className="flex">
                  <Clock className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Time</div>
                    <div className="font-medium">{formattedTime}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Passenger Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <User className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Passenger</div>
                    <div className="font-medium">{ride.user.name}</div>
                    <div className="text-sm text-gray-500">{ride.user.email}</div>
                  </div>
                </div>
                <div className="font-medium text-xl mt-4">
                  Price: ${ride.price ? ride.price.toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <CompleteRideForm rideId={ride.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
