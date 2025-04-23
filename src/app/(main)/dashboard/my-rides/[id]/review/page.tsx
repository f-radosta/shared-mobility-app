import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, Star } from "lucide-react";
import { ReviewForm } from "@/components/rides/review-form";

export default async function LeaveReviewPage({
  params,
}: {
  params: { id: string };
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
  
  // Check if the ride is completed
  if (ride.status !== "COMPLETED") {
    redirect(`/dashboard/my-rides/${ride.id}`);
  }
  
  // Check if the user has already left a review
  if (ride.reviews.length > 0) {
    redirect(`/dashboard/my-rides/${ride.id}`);
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href={`/dashboard/my-rides/${ride.id}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Ride Details
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Leave a Review</h1>
          <p className="text-gray-500 mt-2">
            Share your experience with {ride.vehicle.user.name} and their {ride.vehicle.make} {ride.vehicle.model}.
          </p>
        </div>
        
        <div className="p-6">
          <ReviewForm rideId={ride.id} driverId={ride.vehicle.userId} />
        </div>
      </div>
    </div>
  );
}
