"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // receive jwt token from url param: token 
    const token = searchParams.get('token');
    
    if (!token) {
      return router.push('error');
    }
  
    
    if (token) {
      localStorage.setItem('accessToken', token);
      router.push('/');
    }
  }, [router, searchParams]);

  return <div>Processing......</div>;
}
