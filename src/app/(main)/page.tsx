import Link from "next/link";
import { Car, MapPin, Shield, Users } from "lucide-react";

export default function HomePage() {

  return (
    <div>
      {/* Hero section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Modern Shared Mobility Platform
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connect with drivers and passengers in your area for convenient,
            affordable, and sustainable transportation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-md font-medium text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-md font-medium text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diverse Vehicles</h3>
              <p className="text-gray-600">
                Choose from a wide range of vehicles to suit your needs and
                preferences.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Convenient Rides</h3>
              <p className="text-gray-600">
                Request rides easily and track your journey in real-time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Your safety and data security are our top priorities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Join a growing community of drivers and passengers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our platform today and experience the future of shared mobility.
          </p>
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium text-lg inline-block"
          >
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  );
}
