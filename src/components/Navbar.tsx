'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">MySchedule</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link href="/features" className="text-gray-600 hover:text-blue-600">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
              Pricing
            </Link>
            {session ? (
              <>
                <Link href="/calendar" className="text-gray-600 hover:text-blue-600">
                  Calendar
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/features"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              Pricing
            </Link>
            {session ? (
              <>
                <Link
                  href="/calendar"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                >
                  Calendar
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
