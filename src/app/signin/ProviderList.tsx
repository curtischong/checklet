"use client";
import Google from "@public/logos/google.svg";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

interface Props {
  providers: Awaited<ReturnType<typeof getProviders>>;
}
export default function ProviderList({ providers }: Props) {
  if (!providers) {
    return <div>No providers available</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="space-y-4">
        {Object.values(providers).map((provider) => (
          <button
            key={provider.name}
            onClick={() => signIn(provider.id)}
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
        ))}
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
