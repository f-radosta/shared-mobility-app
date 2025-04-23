import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Schema for vehicle creation/update
const vehicleSchema = z.object({
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
  // We'll handle image validation separately since it's a file
  imageUrl: z.string().optional(),
});

// GET /api/vehicles - Get all vehicles for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Only drivers can access vehicles
    if (session.user.role !== "DRIVER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // Get query parameters for pagination, filtering, and search
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const vehicleType = searchParams.get("vehicleType") || undefined;
    const orderBy = searchParams.get("orderBy") || "updatedAt";
    const order = searchParams.get("order") || "desc";
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build the where clause for filtering
    const where: any = {
      userId: session.user.id,
    };
    
    // Add search condition if provided
    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { licensePlate: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    
    // Add vehicle type filter if provided
    if (vehicleType) {
      where.vehicleType = vehicleType;
    }
    
    // Get vehicles with pagination
    const vehicles = await db.vehicle.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [orderBy]: order },
    });
    
    // Get total count for pagination
    const totalVehicles = await db.vehicle.count({ where });
    
    return NextResponse.json({
      vehicles,
      pagination: {
        total: totalVehicles,
        page,
        limit,
        totalPages: Math.ceil(totalVehicles / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Only drivers can create vehicles
    if (session.user.role !== "DRIVER") {
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
    const validationResult = vehicleSchema.safeParse(data);
    
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
    
    // Create the vehicle
    const vehicle = await db.vehicle.create({
      data: {
        userId: session.user.id,
        make: validationResult.data.make,
        model: validationResult.data.model,
        year: validationResult.data.year,
        licensePlate: validationResult.data.licensePlate,
        capacity: validationResult.data.capacity,
        description: validationResult.data.description,
        vehicleType: validationResult.data.vehicleType,
        imageUrl: imageUrl || validationResult.data.imageUrl || null,
      },
    });
    
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
