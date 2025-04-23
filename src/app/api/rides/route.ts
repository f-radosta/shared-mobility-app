import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for ride creation/request
const rideRequestSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  pickupLocation: z.string().min(3, "Pickup location is required"),
  dropoffLocation: z.string().min(3, "Dropoff location is required"),
  pickupTime: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    },
    { message: "Pickup time must be a valid future date" }
  ),
  notes: z.string().optional(),
});

// GET /api/rides - Get all rides for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build the where clause based on user role
    let where: any = {};
    
    if (session.user.role === "PASSENGER") {
      // Passengers see their own rides
      where.userId = session.user.id;
    } else if (session.user.role === "DRIVER") {
      // Drivers see rides for their vehicles
      const vehicles = await db.vehicle.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
        },
      });
      
      const vehicleIds = vehicles.map(vehicle => vehicle.id);
      
      where.vehicleId = {
        in: vehicleIds,
      };
    }
    
    // Add status filter if provided
    if (status) {
      where.status = status;
    }
    
    // Get rides with pagination
    const rides = await db.ride.findMany({
      where,
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
            userId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });
    
    // Get total count for pagination
    const totalRides = await db.ride.count({ where });
    
    return NextResponse.json({
      rides,
      pagination: {
        total: totalRides,
        page,
        limit,
        totalPages: Math.ceil(totalRides / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching rides:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/rides - Create a new ride request (for passengers)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Only passengers can request rides
    if (session.user.role !== "PASSENGER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // Parse and validate the request body
    const body = await request.json();
    const validationResult = rideRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Verify that the user exists in the database
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please log out and log in again." },
        { status: 404 }
      );
    }
    
    // Verify that the vehicle exists and is available
    const vehicle = await db.vehicle.findUnique({
      where: {
        id: validationResult.data.vehicleId,
        available: true,
      },
    });
    
    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found or not available" },
        { status: 404 }
      );
    }
    
    // Calculate a simple price based on a random base fare
    // In a real app, this would use distance, time, and other factors
    const baseFare = 5.0;
    const pricePerKm = 1.5;
    const estimatedDistance = Math.random() * 20; // Random distance between 0-20 km
    const price = baseFare + (pricePerKm * estimatedDistance);
    
    // Create the ride request
    const ride = await db.ride.create({
      data: {
        userId: session.user.id,
        vehicleId: validationResult.data.vehicleId,
        pickupLocation: validationResult.data.pickupLocation,
        dropoffLocation: validationResult.data.dropoffLocation,
        pickupTime: new Date(validationResult.data.pickupTime),
        notes: validationResult.data.notes || "",
        status: "REQUESTED",
        price: parseFloat(price.toFixed(2)),
      },
    });
    
    return NextResponse.json(ride, { status: 201 });
  } catch (error) {
    console.error("Error creating ride request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
