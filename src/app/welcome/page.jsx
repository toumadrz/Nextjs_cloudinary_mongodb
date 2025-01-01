"use client"
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation';
import React from 'react'

function WelcomePage() {
  const {data:session,status} = useSession();
  
  // if (!session) {
  //   redirect("/login")
  // }
  return (
    <div className='container text-center fs-1 mt-5 text-primary'>
      <h1>Welcome {session?.user?.name}</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>
    </div>
  )
}

export default WelcomePage
