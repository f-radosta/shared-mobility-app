"use client";

import { useState, useEffect } from "react";
import { BookmarkIcon } from "lucide-react";

interface RidePreference {
  pickupLocation: string;
  dropoffLocation: string;
  vehicleId?: string;
  name: string;
}

interface SaveRidePreferencesProps {
  pickupLocation: string;
  dropoffLocation: string;
  vehicleId?: string;
}

export function SaveRidePreferences({
  pickupLocation,
  dropoffLocation,
  vehicleId,
}: SaveRidePreferencesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferenceName, setPreferenceName] = useState("");
  const [savedPreferences, setSavedPreferences] = useState<RidePreference[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    const storedPreferences = localStorage.getItem("ridePreferences");
    if (storedPreferences) {
      try {
        setSavedPreferences(JSON.parse(storedPreferences));
      } catch (e) {
        console.error("Failed to parse saved ride preferences", e);
      }
    }
  }, []);

  const handleSave = () => {
    if (!preferenceName.trim()) {
      setError("Please enter a name for this preference");
      return;
    }

    // Create new preference
    const newPreference: RidePreference = {
      pickupLocation,
      dropoffLocation,
      vehicleId,
      name: preferenceName.trim(),
    };

    // Add to existing preferences
    const updatedPreferences = [...savedPreferences, newPreference];
    
    // Save to localStorage
    try {
      localStorage.setItem("ridePreferences", JSON.stringify(updatedPreferences));
      setSavedPreferences(updatedPreferences);
      setPreferenceName("");
      setError(null);
      setIsModalOpen(false);
    } catch (e) {
      setError("Failed to save preference. Please try again.");
      console.error("Failed to save ride preference", e);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <BookmarkIcon className="h-4 w-4 mr-2" />
        Save as Favorite
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900">Save Ride Preference</h3>
            <p className="mt-2 text-sm text-gray-500">
              Save these locations for future rides. You can quickly select them later.
            </p>
            
            <div className="mt-4">
              <label htmlFor="preference-name" className="block text-sm font-medium text-gray-700">
                Name this preference
              </label>
              <input
                type="text"
                id="preference-name"
                value={preferenceName}
                onChange={(e) => setPreferenceName(e.target.value)}
                placeholder="e.g., Home to Work"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 pl-4"
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700">Pickup: {pickupLocation}</p>
              <p className="text-sm font-medium text-gray-700 mt-1">Dropoff: {dropoffLocation}</p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Preference
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
