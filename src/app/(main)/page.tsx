"use client";
import { getProfile } from "@/api/user";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        return profile;
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        throw error;
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/globe.svg"
          alt="logo"
          width={150}
          height={150}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Rating Everything
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
        </ol>
      </main>
    </div>
  );
}
