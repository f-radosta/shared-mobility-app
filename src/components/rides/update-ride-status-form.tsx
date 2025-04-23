"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Play, Flag } from "lucide-react";

interface UpdateRideStatusFormProps {
  rideId: string;
  currentStatus: string;
}

export function UpdateRideStatusForm({ rideId, currentStatus }: UpdateRideStatusFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Define available actions based on current status
  const getAvailableActions = () => {
    switch (currentStatus) {
      case "REQUESTED":
        return [
          { status: "ACCEPTED", label: "Accept Ride", icon: CheckCircle, color: "bg-green-600 hover:bg-green-700" },
          { status: "REJECTED", label: "Reject Ride", icon: XCircle, color: "bg-red-600 hover:bg-red-700" },
        ];
      case "ACCEPTED":
        return [
          { status: "IN_PROGRESS", label: "Start Ride", icon: Play, color: "bg-blue-600 hover:bg-blue-700" },
          { status: "CANCELLED", label: "Cancel Ride", icon: XCircle, color: "bg-red-600 hover:bg-red-700" },
        ];
      case "IN_PROGRESS":
        return [
          { status: "COMPLETED", label: "Complete Ride", icon: Flag, color: "bg-green-600 hover:bg-green-700" },
        ];
      default:
        return [];
    }
  };

  const actions = getAvailableActions();

  const updateStatus = async (status: string, reason?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rides/${rideId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          reason,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update ride status");
      }

      // Refresh the page to show updated status
      router.refresh();
      
      // If we're completing the ride, redirect to the rides list
      if (status === "COMPLETED") {
        router.push("/dashboard/rides?tab=completed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (status: string) => {
    if (status === "REJECTED" || status === "CANCELLED") {
      setShowRejectForm(true);
    } else {
      updateStatus(status);
    }
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus(currentStatus === "REQUESTED" ? "REJECTED" : "CANCELLED", rejectReason);
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {showRejectForm ? (
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason (optional)
            </label>
            <textarea
              id="reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
              placeholder="Please provide a reason for rejecting this ride"
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isLoading ? "Processing..." : currentStatus === "REQUESTED" ? "Reject Ride" : "Cancel Ride"}
            </button>
            <button
              type="button"
              onClick={() => setShowRejectForm(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap gap-3">
          {actions.map((action) => (
            <button
              key={action.status}
              onClick={() => handleAction(action.status)}
              disabled={isLoading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${action.color} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
