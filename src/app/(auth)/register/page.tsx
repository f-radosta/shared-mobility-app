"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";

// Metadata is handled in layout.tsx for client components

export default function RegisterPage() {
  const router = useRouter();
  
  const handleSuccess = () => {
    router.push("/login?registered=true");
  };

  return (
    <div className="mx-auto flex flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your information to create an account
        </p>
      </div>
      
      <RegisterForm onSuccess={handleSuccess} />
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
