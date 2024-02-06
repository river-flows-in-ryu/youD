'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function Page() {
  const pathname=usePathname();
  console.log(pathname);
  return (
    <div>
      zzzzfwfwf
    </div>
    
  )
}
