"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface CancelRideButtonProps {
  rideId: string;
}

export function CancelRideButton({ rideId }: CancelRideButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rides/${rideId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "CANCELLED",
          reason: "Cancelled by passenger",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to cancel ride");
      }

      // Redirect to the rides page
      router.push("/dashboard/my-rides?tab=completed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-red-800">Cancel this ride?</h3>
        <p className="mt-1 text-sm text-red-700">
          This action cannot be undone. The driver will be notified.
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        <div className="mt-3 flex space-x-3">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isLoading ? "Cancelling..." : "Yes, Cancel Ride"}
          </button>
          <button
            onClick={() => setShowConfirmation(false)}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            No, Keep Ride
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirmation(true)}
      className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      <X className="h-4 w-4 mr-2" />
      Cancel Ride
    </button>
  );
}
