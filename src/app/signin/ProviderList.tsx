"use client";
import Google from "@public/logos/google.svg";
import Image from "next/image";
// import supabase from '@supabase/supabase-js'
import {signInWithOAuth} from '@supabase/supabase-js'

export default function ProviderList() {

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="space-y-4">
          <button
            onClick={() => {
              supabase.auth.signInWithOAuth({
                provider: 'google',
              })
            }}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <span className="font-medium text-gray-700">
              Sign in with {provider.name}
            </span>
            {/* Customize the logo for each provider */}
            <Image
              src={getProviderLogo(provider.id)}
              alt={`${provider.name} logo`}
              className="w-6 h-6 ml-4"
              width={40}
              height={40}
            />
          </button>
      </div>
    </div>
  );
}

// Utility function to get provider logos based on the provider ID
function getProviderLogo(providerId: string): string {
  switch (providerId) {
    case "google":
      return Google.src;
  }
  return "unknown url";
}
