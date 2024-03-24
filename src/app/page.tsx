import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8 pb-10">Welcome to our Application</h1>
      <div className="flex space-x-4">
        <Link href="/register">

            <Button>Register</Button>
 
        </Link>
        <Link href="/login">
        
            <Button>Login</Button>
     
        </Link>
      </div>
    </div>
  )
}
