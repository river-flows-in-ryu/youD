"use client";
import { Suspense, useEffect, useState } from "react";

export default function Home() {
  const [isTrue, setIsTrue] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTrue(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isTrue)
    return (
      <main className="flex min-h-screen flex-col items-center">
        <div>zz</div>
      </main>
    );
}
