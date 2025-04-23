import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {session.user.name || session.user.email}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-medium text-indigo-800 mb-2">Your Role</h3>
            <p className="text-indigo-600">
              {session.user.role === "DRIVER" ? "Driver" : "Passenger"}
            </p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-medium text-indigo-800 mb-2">Account ID</h3>
            <p className="text-indigo-600 truncate">{session.user.id}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">What you can do:</h3>
          {session.user.role === "DRIVER" ? (
            <ul className="list-disc pl-5 space-y-1">
              <li>Manage your vehicles</li>
              <li>Accept or reject ride requests</li>
              <li>View your ride history</li>
            </ul>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              <li>Browse available vehicles</li>
              <li>Request rides</li>
              <li>View your ride history</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
