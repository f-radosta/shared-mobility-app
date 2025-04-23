import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  User, 
  DollarSign,
  MessageSquare,
  Star
} from "lucide-react";
import { UpdateRideStatusForm } from "@/components/rides/update-ride-status-form";

export default async function RideDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // Fetch the ride with related data
  const ride = await db.ride.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          id: true,
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
              email: true,
            },
          },
        },
      },
      reviews: true,
    },
  });
  
  // If ride not found, show 404
  if (!ride) {
    notFound();
  }
  
  // Check if the user has permission to view this ride
  const isDriver = session.user.role === "DRIVER" && ride.vehicle.userId === session.user.id;
  const isPassenger = session.user.role === "PASSENGER" && ride.userId === session.user.id;
  
  if (!isDriver && !isPassenger) {
    redirect("/dashboard");
  }
  
  // Format the pickup time
  const pickupTime = ride.pickupTime ? new Date(ride.pickupTime) : null;
  const formattedDate = pickupTime ? pickupTime.toLocaleDateString() : 'Not specified';
  const formattedTime = pickupTime ? pickupTime.toLocaleTimeString() : 'Not specified';
  
  // Determine status color and label
  const statusConfig = {
    REQUESTED: { color: "bg-yellow-100 text-yellow-800", label: "Requested" },
    ACCEPTED: { color: "bg-blue-100 text-blue-800", label: "Accepted" },
    IN_PROGRESS: { color: "bg-indigo-100 text-indigo-800", label: "In Progress" },
    COMPLETED: { color: "bg-green-100 text-green-800", label: "Completed" },
    REJECTED: { color: "bg-red-100 text-red-800", label: "Rejected" },
    CANCELLED: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
  };
  
  const { color, label } = statusConfig[ride.status as keyof typeof statusConfig];
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/rides"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Rides
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Ride header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Ride Details</h1>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                  {label}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">${ride.price ? ride.price.toFixed(2) : '0.00'}</div>
          </div>
        </div>
        
        {/* Ride details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {ride.notes && (
                <div className="flex">
                  <MessageSquare className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Notes</div>
                    <div className="font-medium">{ride.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {isDriver ? "Passenger Information" : "Driver & Vehicle Information"}
            </h2>
            <div className="space-y-4">
              {isDriver ? (
                <div className="flex">
                  <User className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Passenger</div>
                    <div className="font-medium">{ride.user.name}</div>
                    <div className="text-sm text-gray-500">{ride.user.email}</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex">
                    <User className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Driver</div>
                      <div className="font-medium">{ride.vehicle.user.name}</div>
                      <div className="text-sm text-gray-500">{ride.vehicle.user.email}</div>
                    </div>
                  </div>
                  <div className="flex">
                    <Car className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Vehicle</div>
                      <div className="font-medium">{ride.vehicle.make} {ride.vehicle.model}</div>
                      <div className="text-sm text-gray-500">License Plate: {ride.vehicle.licensePlate}</div>
                    </div>
                  </div>
                </>
              )}
              <div className="flex">
                <DollarSign className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="font-medium">${ride.price ? ride.price.toFixed(2) : '0.00'}</div>
                </div>
              </div>
              
              {ride.reviews.length > 0 && (
                <div className="flex">
                  <Star className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Rating</div>
                    <div className="font-medium flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {ride.reviews[0].rating}
                    </div>
                    {ride.reviews[0].comment && (
                      <div className="text-sm text-gray-700 mt-1">
                        "{ride.reviews[0].comment}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Status update form for drivers */}
        {isDriver && ride.status !== "COMPLETED" && ride.status !== "REJECTED" && ride.status !== "CANCELLED" && (
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Update Ride Status</h2>
            <UpdateRideStatusForm rideId={ride.id} currentStatus={ride.status} />
          </div>
        )}
        
        {/* Review form for passengers */}
        {isPassenger && ride.status === "COMPLETED" && ride.reviews.length === 0 && (
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Leave a Review</h2>
            <p className="text-gray-500 mb-4">
              Your ride has been completed. Please leave a review for your driver.
            </p>
            <Link
              href={`/dashboard/rides/${ride.id}/review`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Leave a Review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
