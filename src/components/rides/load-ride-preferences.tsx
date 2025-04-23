"use client";

import { useState, useEffect } from "react";
import { BookmarkIcon, X } from "lucide-react";

interface RidePreference {
  pickupLocation: string;
  dropoffLocation: string;
  vehicleId?: string;
  name: string;
}

interface LoadRidePreferencesProps {
  onSelectPreference: (preference: RidePreference) => void;
}

export function LoadRidePreferences({ onSelectPreference }: LoadRidePreferencesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [savedPreferences, setSavedPreferences] = useState<RidePreference[]>([]);

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

  const handleDelete = (index: number) => {
    const updatedPreferences = [...savedPreferences];
    updatedPreferences.splice(index, 1);
    
    // Update localStorage
    localStorage.setItem("ridePreferences", JSON.stringify(updatedPreferences));
    setSavedPreferences(updatedPreferences);
  };

  const handleSelect = (preference: RidePreference) => {
    onSelectPreference(preference);
    setIsOpen(false);
  };

  if (savedPreferences.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <BookmarkIcon className="h-4 w-4 mr-2" />
        {isOpen ? "Hide Saved Rides" : "Load Saved Ride"}
      </button>

      {isOpen && (
        <div className="mt-3 border rounded-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="text-sm font-medium text-gray-700">Your Saved Rides</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {savedPreferences.map((preference, index) => (
              <li key={index} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50">
                <button
                  type="button"
                  onClick={() => handleSelect(preference)}
                  className="flex-1 text-left"
                >
                  <p className="font-medium text-gray-900">{preference.name}</p>
                  <p className="text-sm text-gray-500">
                    {preference.pickupLocation} to {preference.dropoffLocation}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="ml-4 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
