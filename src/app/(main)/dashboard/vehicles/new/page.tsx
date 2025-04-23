import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import VehicleForm from "@/components/vehicles/vehicle-form";

export default async function NewVehiclePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // Check if user is a driver
  if (session.user.role !== "DRIVER") {
    redirect("/dashboard");
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Vehicle</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <VehicleForm />
      </div>
    </div>
  );
}
