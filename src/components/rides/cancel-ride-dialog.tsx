"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface CancelRideDialogProps {
  rideId: string;
  showDialog: boolean;
}

export function CancelRideDialog({ rideId, showDialog }: CancelRideDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize dialog state based on props
  useEffect(() => {
    setIsOpen(showDialog);
  }, [showDialog]);

  // Close dialog and navigate back to rides list
  const handleClose = () => {
    setIsOpen(false);
    router.push("/dashboard/my-rides");
  };

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
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900">Cancel this ride?</h3>
        <p className="mt-2 text-sm text-gray-500">
          This action cannot be undone. The driver will be notified that you have cancelled this ride request.
        </p>
        
        {error && (
          <div className="mt-3 p-3 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            No, Keep Ride
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <X className="h-4 w-4 mr-2" />
            {isLoading ? "Cancelling..." : "Yes, Cancel Ride"}
          </button>
        </div>
      </div>
    </div>
  );
}
