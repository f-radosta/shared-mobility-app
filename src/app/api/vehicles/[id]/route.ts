import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Schema for vehicle update
const vehicleUpdateSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number()
    .min(1900, "Year must be at least 1900")
    .max(new Date().getFullYear() + 1, `Year cannot be greater than ${new Date().getFullYear() + 1}`),
  licensePlate: z.string().min(1, "License plate is required"),
  capacity: z.coerce.number()
    .min(1, "Capacity must be at least 1")
    .max(50, "Capacity cannot exceed 50"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  imageUrl: z.string().optional(),
});

// GET /api/vehicles/[id] - Get a specific vehicle
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const vehicle = await db.vehicle.findUnique({
      where: { id: params.id },
    });
    
    if (!vehicle) {
      return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
    }
    
    // Check if the user owns this vehicle or is a passenger
    if (vehicle.userId !== session.user.id && session.user.role !== "PASSENGER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/vehicles/[id] - Update a vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Check if the vehicle exists
    const vehicle = await db.vehicle.findUnique({
      where: { id: params.id },
    });
    
    if (!vehicle) {
      return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
    }
    
    // Check if the user owns this vehicle
    if (vehicle.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // Parse and handle the request body with file upload
    const formData = await request.formData();
    
    // Extract the image file if present
    const imageFile = formData.get("image") as File | null;
    let imageUrl: string | null = null;
    
    // Handle image upload if a file was provided
    if (imageFile && imageFile.size > 0) {
      try {
        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(imageFile.type)) {
          return NextResponse.json(
            { message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
            { status: 400 }
          );
        }
        
        // Validate file size (10MB max)
        if (imageFile.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            { message: "File too large. Maximum size is 10MB." },
            { status: 400 }
          );
        }
        
        // Generate a unique filename
        const fileExt = imageFile.name.split(".").pop() || "jpg";
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = path.join(process.cwd(), "public", "uploads", "vehicles", fileName);
        
        // Convert the file to an ArrayBuffer
        const buffer = await imageFile.arrayBuffer();
        
        // Write the file to disk
        await writeFile(filePath, Buffer.from(buffer));
        
        // Set the image URL to the public path
        imageUrl = `/uploads/vehicles/${fileName}`;
      } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
          { message: "Error uploading file" },
          { status: 500 }
        );
      }
    }
    
    // Extract other form data
    const data = Object.fromEntries(
      Array.from(formData.entries()).filter(([key]) => key !== "image")
    );
    
    // Validate the data
    const validationResult = vehicleUpdateSchema.safeParse(data);
    
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
    
    // Update the vehicle
    const updatedVehicle = await db.vehicle.update({
      where: { id: params.id },
      data: {
        make: validationResult.data.make,
        model: validationResult.data.model,
        year: validationResult.data.year,
        licensePlate: validationResult.data.licensePlate,
        capacity: validationResult.data.capacity,
        description: validationResult.data.description,
        vehicleType: validationResult.data.vehicleType,
        // Use the new image if uploaded, otherwise keep existing or use the URL from form
        imageUrl: imageUrl || validationResult.data.imageUrl || vehicle.imageUrl,
      },
    });
    
    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/vehicles/[id] - Delete a vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Check if the vehicle exists
    const vehicle = await db.vehicle.findUnique({
      where: { id: params.id },
    });
    
    if (!vehicle) {
      return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
    }
    
    // Check if the user owns this vehicle
    if (vehicle.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // Check if there are any active rides associated with this vehicle
    const activeRides = await db.ride.count({
      where: {
        vehicleId: params.id,
        status: {
          in: ["REQUESTED", "ACCEPTED", "IN_PROGRESS"],
        },
      },
    });
    
    if (activeRides > 0) {
      return NextResponse.json(
        { message: "Cannot delete vehicle with active rides" },
        { status: 400 }
      );
    }
    
    // Delete the vehicle
    await db.vehicle.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
