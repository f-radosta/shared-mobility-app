import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import VehicleForm from "@/components/vehicles/vehicle-form";

export default async function EditVehiclePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // Check if user is a driver
  if (session.user.role !== "DRIVER") {
    redirect("/dashboard");
  }
  
  // Fetch the vehicle
  const vehicle = await db.vehicle.findUnique({
    where: { id: params.id },
  });
  
  // If vehicle not found, show 404
  if (!vehicle) {
    notFound();
  }
  
  // Check if the user owns this vehicle
  if (vehicle.userId !== session.user.id) {
    redirect("/dashboard/vehicles");
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Vehicle</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <VehicleForm vehicle={vehicle} />
      </div>
    </div>
  );
}
