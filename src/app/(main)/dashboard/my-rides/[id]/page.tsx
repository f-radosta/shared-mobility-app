import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, Car, User, MapPin, Calendar, Clock, DollarSign, Star, X } from "lucide-react";
import { CancelRideDialog } from "@/components/rides/cancel-ride-dialog";

export default async function PassengerRideDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { action?: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // Only passengers should access this page
  if (session.user.role !== "PASSENGER") {
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
  
  // Check if the user is the ride requester
  if (ride.userId !== session.user.id) {
    redirect("/dashboard/my-rides");
  }
  
  // Format the pickup time
  const pickupTime = ride.pickupTime ? new Date(ride.pickupTime) : null;
  const formattedDate = pickupTime ? pickupTime.toLocaleDateString() : 'Not specified';
  const formattedTime = pickupTime ? pickupTime.toLocaleTimeString() : 'Not specified';
  
  // Format the completed time if available
  const completedTime = ride.completedAt ? new Date(ride.completedAt) : null;
  const formattedCompletedDate = completedTime ? completedTime.toLocaleDateString() : null;
  const formattedCompletedTime = completedTime ? completedTime.toLocaleTimeString() : null;
  
  // Determine status color and label
  const statusConfig = {
    REQUESTED: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    ACCEPTED: { color: "bg-blue-100 text-blue-800", label: "Accepted" },
    IN_PROGRESS: { color: "bg-green-100 text-green-800", label: "In Progress" },
    COMPLETED: { color: "bg-green-100 text-green-800", label: "Completed" },
    CANCELLED: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
    REJECTED: { color: "bg-red-100 text-red-800", label: "Rejected" },
  };
  
  // Check if the user has already left a review
  const hasReview = ride.reviews.length > 0;
  
  // Show cancel dialog if action=cancel is in the URL
  const showCancelDialog = searchParams.action === "cancel" && ride.status === "REQUESTED";
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/my-rides"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to My Rides
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">Ride Details</h1>
                <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[ride.status].color}`}>
                  {statusConfig[ride.status].label}
                </span>
              </div>
              <p className="text-gray-500 mt-1">
                {ride.pickupLocation} to {ride.dropoffLocation}
              </p>
            </div>
            <div className="text-2xl font-bold mt-4 md:mt-0">${ride.price ? ride.price.toFixed(2) : '0.00'}</div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <div className="text-sm text-gray-500">Pickup Date</div>
                    <div className="font-medium">{formattedDate}</div>
                  </div>
                </div>
                <div className="flex">
                  <Clock className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Pickup Time</div>
                    <div className="font-medium">{formattedTime}</div>
                  </div>
                </div>
                {completedTime && (
                  <div className="flex">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Completed At</div>
                      <div className="font-medium">{formattedCompletedDate} {formattedCompletedTime}</div>
                    </div>
                  </div>
                )}
                <div className="flex">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="font-medium">${ride.price ? ride.price.toFixed(2) : '0.00'}</div>
                  </div>
                </div>
                {ride.notes && (
                  <div className="flex">
                    <div className="text-gray-400 mr-3">📝</div>
                    <div>
                      <div className="text-sm text-gray-500">Notes</div>
                      <div className="font-medium">{ride.notes}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Driver & Vehicle Information</h2>
              <div className="space-y-4">
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
                    <div className="font-medium">
                      {ride.vehicle.make} {ride.vehicle.model} ({ride.vehicle.year})
                    </div>
                    <div className="text-sm text-gray-500">
                      License Plate: {ride.vehicle.licensePlate}
                    </div>
                    <div className="text-sm text-gray-500">
                      Type: {ride.vehicle.vehicleType}
                    </div>
                  </div>
                </div>
                
                {hasReview && (
                  <div className="flex">
                    <Star className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Your Rating</div>
                      <div className="font-medium">
                        {ride.reviews[0].rating}/5
                      </div>
                      {ride.reviews[0].comment && (
                        <div className="text-sm mt-1">
                          "{ride.reviews[0].comment}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action buttons based on ride status */}
              <div className="mt-8 space-y-3">
                {ride.status === "REQUESTED" && (
                  <Link
                    href={`/dashboard/my-rides/${ride.id}?action=cancel`}
                    className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Ride
                  </Link>
                )}
                
                {ride.status === "COMPLETED" && !hasReview && (
                  <Link
                    href={`/dashboard/my-rides/${ride.id}/review`}
                    className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Leave a Review
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancel Ride Dialog */}
      {showCancelDialog && <CancelRideDialog rideId={ride.id} showDialog={true} />}
    </div>
  );
}
