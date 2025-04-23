import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for review creation
const reviewSchema = z.object({
  rideId: z.string(),
  driverId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Only passengers can create reviews
    if (session.user.role !== "PASSENGER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // Parse and validate the request body
    const body = await request.json();
    const validationResult = reviewSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Get the ride to verify ownership and status
    const ride = await db.ride.findUnique({
      where: { id: validationResult.data.rideId },
      include: {
        reviews: true,
      },
    });
    
    if (!ride) {
      return NextResponse.json(
        { message: "Ride not found" },
        { status: 404 }
      );
    }
    
    // Check if the user is the ride requester
    if (ride.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You can only review rides you requested" },
        { status: 403 }
      );
    }
    
    // Check if the ride is completed
    if (ride.status !== "COMPLETED") {
      return NextResponse.json(
        { message: "You can only review completed rides" },
        { status: 400 }
      );
    }
    
    // Check if a review already exists
    if (ride.reviews.length > 0) {
      return NextResponse.json(
        { message: "You have already reviewed this ride" },
        { status: 400 }
      );
    }
    
    // Create the review
    const review = await db.review.create({
      data: {
        userId: session.user.id,
        rideId: validationResult.data.rideId,
        rating: validationResult.data.rating,
        comment: validationResult.data.comment || "",
      },
    });
    
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
