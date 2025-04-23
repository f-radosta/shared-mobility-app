"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: number;
  description: string;
  vehicleType: string;
}

export default function VehicleForm({ vehicle = null }: { vehicle?: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(vehicle?.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    defaultValues: vehicle ? {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      capacity: vehicle.capacity,
      description: vehicle.description,
      vehicleType: vehicle.vehicleType,
    } : {
      year: new Date().getFullYear(),
      capacity: 4,
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const onSubmit = async (data: VehicleFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      // Add image file if present
      if (imageFile) {
        formData.append("image", imageFile);
      }
      
      // Determine if we're creating or updating
      const url = vehicle 
        ? `/api/vehicles/${vehicle.id}` 
        : "/api/vehicles";
      
      const method = vehicle ? "PUT" : "POST";
      
      // Send the request
      const response = await fetch(url, {
        method,
        body: formData,
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to save vehicle");
      }
      
      // Redirect to vehicles list on success
      router.push("/dashboard/vehicles");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Vehicle Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vehicle Image
        </label>
        
        {imagePreview ? (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={imagePreview}
              alt="Vehicle preview"
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload an image</span>
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">
            Make
          </label>
          <input
            id="make"
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            {...register("make", {
              required: "Make is required",
            })}
          />
          {errors.make && (
            <p className="mt-1 text-sm text-red-600">{errors.make.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            id="model"
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            {...register("model", {
              required: "Model is required",
            })}
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <input
            id="year"
            type="number"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            {...register("year", {
              required: "Year is required",
              min: {
                value: 1900,
                message: "Year must be at least 1900",
              },
              max: {
                value: new Date().getFullYear() + 1,
                message: `Year cannot be greater than ${new Date().getFullYear() + 1}`,
              },
            })}
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
            License Plate
          </label>
          <input
            id="licensePlate"
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            {...register("licensePlate", {
              required: "License plate is required",
            })}
          />
          {errors.licensePlate && (
            <p className="mt-1 text-sm text-red-600">{errors.licensePlate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
            Passenger Capacity
          </label>
          <input
            id="capacity"
            type="number"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            {...register("capacity", {
              required: "Capacity is required",
              min: {
                value: 1,
                message: "Capacity must be at least 1",
              },
              max: {
                value: 50,
                message: "Capacity cannot exceed 50",
              },
            })}
          />
          {errors.capacity && (
            <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
            Vehicle Type
          </label>
          <select
            id="vehicleType"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            {...register("vehicleType", {
              required: "Vehicle type is required",
            })}
          >
            <option value="">Select vehicle type</option>
            <option value="SEDAN">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="HATCHBACK">Hatchback</option>
            <option value="MINIVAN">Minivan</option>
            <option value="PICKUP">Pickup Truck</option>
            <option value="VAN">Van</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.vehicleType && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder="Provide details about your vehicle, such as features, condition, etc."
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 20,
              message: "Description must be at least 20 characters",
            },
          })}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : vehicle ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </div>
    </form>
  );
}
