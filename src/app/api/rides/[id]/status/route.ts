import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for ride status update
const statusUpdateSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  reason: z.string().optional(),
});

// PATCH /api/rides/[id]/status - Update ride status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Parse and validate the request body
    const body = await request.json();
    const validationResult = statusUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Get the ride
    const ride = await db.ride.findUnique({
      where: { id: params.id },
      include: {
        vehicle: {
          select: {
            userId: true,
          },
        },
      },
    });
    
    if (!ride) {
      return NextResponse.json(
        { message: "Ride not found" },
        { status: 404 }
      );
    }
    
    // Check authorization based on role and status change
    if (session.user.role === "DRIVER") {
      // Only the vehicle owner can update the ride status
      if (ride.vehicle.userId !== session.user.id) {
        return NextResponse.json(
          { message: "You don't have permission to update this ride" },
          { status: 403 }
        );
      }
      
      // Validate status transitions for driver
      const validTransitions: Record<string, string[]> = {
        "REQUESTED": ["ACCEPTED", "REJECTED"],
        "ACCEPTED": ["IN_PROGRESS", "CANCELLED"],
        "IN_PROGRESS": ["COMPLETED", "CANCELLED"],
      };
      
      const currentStatus = ride.status;
      const newStatus = validationResult.data.status;
      
      if (!validTransitions[currentStatus]?.includes(newStatus)) {
        return NextResponse.json(
          { message: `Cannot change status from ${currentStatus} to ${newStatus}` },
          { status: 400 }
        );
      }
    } else if (session.user.role === "PASSENGER") {
      // Passengers can only cancel their own rides
      if (ride.userId !== session.user.id) {
        return NextResponse.json(
          { message: "You don't have permission to update this ride" },
          { status: 403 }
        );
      }
      
      // Passengers can only cancel rides that are not completed or already cancelled
      if (validationResult.data.status !== "CANCELLED" || 
          ["COMPLETED", "CANCELLED", "REJECTED"].includes(ride.status)) {
        return NextResponse.json(
          { message: "Passengers can only cancel pending or accepted rides" },
          { status: 400 }
        );
      }
    }
    
    // Update the ride status
    const updatedRide = await db.ride.update({
      where: { id: params.id },
      data: {
        status: validationResult.data.status,
        // If the ride is rejected or cancelled, store the reason
        ...(["REJECTED", "CANCELLED"].includes(validationResult.data.status) && {
          notes: validationResult.data.reason || ride.notes,
        }),
        // If the ride is completed, set the completedAt field
        ...(validationResult.data.status === "COMPLETED" && {
          completedAt: new Date(),
        }),
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
    
    return NextResponse.json(updatedRide);
  } catch (error) {
    console.error("Error updating ride status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
