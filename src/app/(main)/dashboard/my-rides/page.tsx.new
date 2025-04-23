import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Calendar, MapPin, Clock, User, Star } from "lucide-react";
import { RidesPagination } from "@/components/rides/rides-pagination";

export default async function PassengerRidesPage({
  searchParams,
}: {
  searchParams: { tab?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // Only passengers should access this page
  if (session.user.role !== "PASSENGER") {
    redirect("/dashboard");
  }
  
  // Get the active tab from the URL or default to "requested"
  const activeTab = searchParams.tab || "requested";
  
  // Get the current page from the URL or default to 1
  const currentPage = parseInt(searchParams.page || "1");
  const pageSize = 2; // Reduced page size to make pagination more visible
  
  // Fetch requested rides (pending and accepted) with pagination
  const requestedRides = await db.ride.findMany({
    where: {
      userId: session.user.id,
      status: {
        in: ["REQUESTED", "ACCEPTED"],
      },
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: {
      vehicle: {
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
    orderBy: {
      createdAt: "desc",
    },
  });
  
  // Count total requested rides for pagination
  const totalRequestedRides = await db.ride.count({
    where: {
      userId: session.user.id,
      status: {
        in: ["REQUESTED", "ACCEPTED"],
      },
    },
  });
  
  // Fetch active rides (in progress) with pagination
  const activeRides = await db.ride.findMany({
    where: {
      userId: session.user.id,
      status: "IN_PROGRESS",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: {
      vehicle: {
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
    orderBy: {
      createdAt: "desc",
    },
  });
  
  // Count total active rides for pagination
  const totalActiveRides = await db.ride.count({
    where: {
      userId: session.user.id,
      status: "IN_PROGRESS",
    },
  });
  
  // Fetch completed rides (completed, cancelled, rejected) with pagination
  const completedRides = await db.ride.findMany({
    where: {
      userId: session.user.id,
      status: {
        in: ["COMPLETED", "CANCELLED", "REJECTED"],
      },
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: {
      vehicle: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  
  // Sort rides by creation date (newest first)
  requestedRides.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  activeRides.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  completedRides.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  // Count total completed rides for pagination
  const totalCompletedRides = await db.ride.count({
    where: {
      userId: session.user.id,
      status: {
        in: ["COMPLETED", "CANCELLED", "REJECTED"],
      },
    },
  });
  
  // Calculate total pages for each tab
  const totalRequestedPages = Math.ceil(totalRequestedRides / pageSize);
  const totalActivePages = Math.ceil(totalActiveRides / pageSize);
  const totalCompletedPages = Math.ceil(totalCompletedRides / pageSize);
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Rides</h1>
        <Link
          href="/dashboard/request-ride"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Request a Ride
        </Link>
      </div>
      
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="requested">
            Requested Rides ({totalRequestedRides})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active Rides ({totalActiveRides})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Ride History ({totalCompletedRides})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="requested" className="space-y-6">
          {requestedRides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">You have no requested rides.</p>
              <Link
                href="/dashboard/request-ride"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Request a Ride
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requestedRides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ride.status === "REQUESTED" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {ride.status === "REQUESTED" ? "Pending" : "Accepted"}
                        </span>
                        <h3 className="text-lg font-medium mt-2">
                          {ride.pickupLocation} to {ride.dropoffLocation}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{ride.pickupTime ? new Date(ride.pickupTime).toLocaleString() : 'Not specified'}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Car className="h-4 w-4 mr-1" />
                          <span>{ride.vehicle.make} {ride.vehicle.model}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <User className="h-4 w-4 mr-1" />
                          <span>{ride.vehicle.user.name}</span>
                        </div>
                        <div className="mt-2 font-medium">
                          ${ride.price ? ride.price.toFixed(2) : '0.00'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/dashboard/my-rides/${ride.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      {ride.status === "REQUESTED" && (
                        <Link
                          href={`/dashboard/my-rides/${ride.id}?action=cancel`}
                          className="ml-4 text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Cancel Request
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination for Requested Rides */}
          {totalRequestedPages > 1 && (
            <RidesPagination 
              currentPage={currentPage} 
              totalPages={totalRequestedPages} 
              activeTab="requested" 
            />
          )}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-6">
          {activeRides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">You have no active rides.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          In Progress
                        </span>
                        <h3 className="text-lg font-medium mt-2">
                          {ride.pickupLocation} to {ride.dropoffLocation}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{ride.pickupTime ? new Date(ride.pickupTime).toLocaleString() : 'Not specified'}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Car className="h-4 w-4 mr-1" />
                          <span>{ride.vehicle.make} {ride.vehicle.model}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <User className="h-4 w-4 mr-1" />
                          <span>{ride.vehicle.user.name}</span>
                        </div>
                        <div className="mt-2 font-medium">
                          ${ride.price ? ride.price.toFixed(2) : '0.00'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/dashboard/my-rides/${ride.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination for Active Rides */}
          {totalActivePages > 1 && (
            <RidesPagination 
              currentPage={currentPage} 
              totalPages={totalActivePages} 
              activeTab="active" 
            />
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6">
          {completedRides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">You have no completed rides.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedRides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ride.status === "COMPLETED" ? "bg-green-100 text-green-800" : 
                          ride.status === "CANCELLED" ? "bg-gray-100 text-gray-800" : 
                          "bg-red-100 text-red-800"
                        }`}>
                          {ride.status === "COMPLETED" ? "Completed" : 
                           ride.status === "CANCELLED" ? "Cancelled" : "Rejected"}
                        </span>
                        <h3 className="text-lg font-medium mt-2">
                          {ride.pickupLocation} to {ride.dropoffLocation}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{ride.pickupTime ? new Date(ride.pickupTime).toLocaleString() : 'Not specified'}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Car className="h-4 w-4 mr-1" />
                          <span>{ride.vehicle.make} {ride.vehicle.model}</span>
                        </div>
                        <div className="mt-2 font-medium">
                          ${ride.price ? ride.price.toFixed(2) : '0.00'}
                        </div>
                        {ride.reviews.length > 0 && (
                          <div className="mt-2 flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm">{ride.reviews[0].rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/dashboard/my-rides/${ride.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      {ride.status === "COMPLETED" && ride.reviews.length === 0 && (
                        <Link
                          href={`/dashboard/my-rides/${ride.id}/review`}
                          className="ml-4 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          Leave Review
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination for Completed Rides */}
          {totalCompletedPages > 1 && (
            <RidesPagination 
              currentPage={currentPage} 
              totalPages={totalCompletedPages} 
              activeTab="completed" 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
