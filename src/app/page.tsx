'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-8 p-6">
        <h1 className="text-5xl font-bold text-blue-900">
          Welcome to MySchedule
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Manage your time efficiently with our intuitive scheduling platform. 
          Plan your days, organize meetings, and stay on top of your schedule.
        </p>

        <div className="flex gap-4 justify-center">
          {session ? (
            <button
              onClick={() => router.push('/calendar')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Calendar
            </button>
          ) : (
            <>
              <Link 
                href="/login"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-black">Easy Scheduling</h3>
            <p className="text-gray-600">Create and manage your schedules with just a few clicks</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-black">Smart Calendar</h3>
            <p className="text-gray-600">View your schedule in daily, weekly, or monthly formats</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-black">Responsive Design</h3>
            <p className="text-gray-600">Access your schedule from any device, anywhere</p>
          </div>
        </div>
      </div>
    </main>
  )
}
