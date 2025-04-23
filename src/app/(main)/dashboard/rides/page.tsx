import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowRight
} from "lucide-react";

export default async function RidesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // Get the active tab from query params or default to appropriate tab based on role
  const defaultTab = session.user.role === "DRIVER" ? "incoming" : "available";
  const activeTab = typeof searchParams.tab === 'string' ? searchParams.tab : defaultTab;
  
  // Different views based on user role
  if (session.user.role === "DRIVER") {
    // Fetch driver's vehicles to show incoming ride requests
    const vehicles = await db.vehicle.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        make: true,
        model: true,
      },
    });
    
    const vehicleIds = vehicles.map(vehicle => vehicle.id);
    
    // Fetch incoming ride requests for driver's vehicles
    const incomingRides = await db.ride.findMany({
      where: {
        vehicleId: {
          in: vehicleIds,
        },
        status: "REQUESTED",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            make: true,
            model: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // Fetch active rides (accepted or in progress)
    const activeRides = await db.ride.findMany({
      where: {
        vehicleId: {
          in: vehicleIds,
        },
        status: {
          in: ["ACCEPTED", "IN_PROGRESS"],
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            make: true,
            model: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    
    // Fetch completed rides
    const completedRides = await db.ride.findMany({
      where: {
        vehicleId: {
          in: vehicleIds,
        },
        status: "COMPLETED",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            make: true,
            model: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10, // Limit to recent 10 completed rides
    });
    
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Ride Management</h1>
        
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="incoming" asChild>
              <Link href="/dashboard/rides?tab=incoming" className={activeTab === "incoming" ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white" : ""}>
                Incoming Requests {incomingRides.length > 0 && <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">{incomingRides.length}</span>}
              </Link>
            </TabsTrigger>
            <TabsTrigger value="active" asChild>
              <Link href="/dashboard/rides?tab=active" className={activeTab === "active" ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white" : ""}>
                Active Rides {activeRides.length > 0 && <span className="ml-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs">{activeRides.length}</span>}
              </Link>
            </TabsTrigger>
            <TabsTrigger value="completed" asChild>
              <Link href="/dashboard/rides?tab=completed" className={activeTab === "completed" ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white" : ""}>
                Completed
              </Link>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="incoming" className="space-y-4">
            {incomingRides.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {incomingRides.map((ride) => (
                  <div key={ride.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {ride.pickupLocation} <ArrowRight className="inline h-4 w-4 mx-1" /> {ride.dropoffLocation}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <User className="h-4 w-4 mr-1" />
                          <span>{ride.user.name}</span>
                        </div>
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
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/rides/${ride.id}/accept`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Link>
                        <Link
                          href={`/dashboard/rides/${ride.id}/reject`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-100 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No incoming ride requests</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any pending ride requests at the moment.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            {activeRides.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {activeRides.map((ride) => (
                  <div key={ride.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {ride.pickupLocation} <ArrowRight className="inline h-4 w-4 mx-1" /> {ride.dropoffLocation}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <User className="h-4 w-4 mr-1" />
                          <span>{ride.user.name}</span>
                        </div>
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
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ride.status === "ACCEPTED" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {ride.status === "ACCEPTED" ? "Accepted" : "In Progress"}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {ride.status === "ACCEPTED" && (
                          <Link
                            href={`/dashboard/rides/${ride.id}/start`}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Start Ride
                          </Link>
                        )}
                        {ride.status === "IN_PROGRESS" && (
                          <Link
                            href={`/dashboard/rides/${ride.id}/complete`}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Complete Ride
                          </Link>
                        )}
                        <Link
                          href={`/dashboard/rides/${ride.id}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-100 flex items-center justify-center">
                  <Car className="h-6 w-6" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No active rides</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any active rides at the moment.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedRides.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {completedRides.map((ride) => (
                  <div key={ride.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {ride.pickupLocation} <ArrowRight className="inline h-4 w-4 mx-1" /> {ride.dropoffLocation}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <User className="h-4 w-4 mr-1" />
                          <span>{ride.user.name}</span>
                        </div>
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
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{ride.reviews[0].rating}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/dashboard/rides/${ride.id}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No completed rides</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't completed any rides yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  } else {
    // Passenger view will be implemented separately
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Rides</h1>
        <p>Passenger ride management interface will be implemented soon.</p>
      </div>
    );
  }
}
