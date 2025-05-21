"use client";
import { useUserStore } from "@/store/userStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchUser } = useUserStore();
  
  useEffect(() => {
    const toHome = async (token: string) => {
      if (token) {
        localStorage.setItem('accessToken', token);
        await fetchUser();
        router.push('/');
      }
    }
    
    // receive jwt token from url param: token 
    const token = searchParams.get('token');
    
    if (!token) {
      return router.push('error');
    }

    toHome(token);
  }, [router, searchParams, fetchUser]);

  return <div>Processing......</div>;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
