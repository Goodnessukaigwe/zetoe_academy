/**
 * Test page to verify Supabase connection
 * Access at: http://localhost:3000/test-connection
 */

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { logger } from '@/lib/logger';

export default function TestConnectionPage() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [message, setMessage] = useState('Testing connection...')
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    try {
      const supabase = createClient()
      
      // Test 1: Check if client is created
      if (!supabase) {
        throw new Error('Failed to create Supabase client')
      }

      // Test 2: Try to fetch from courses table
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .limit(5)

      if (error) {
        throw new Error(`Database query failed: ${error.message}`)
      }

      // Test 3: Check auth status
      const { data: { user } } = await supabase.auth.getUser()

      setStatus('success')
      setMessage('✅ Supabase connection successful!')
      setCourses(data || [])
      
      logger.log('Connection test passed', {
        context: {
          coursesFound: data?.length || 0,
          userAuthenticated: !!user,
          user: user
        }
      })

    } catch (error: any) {
      setStatus('error')
      setMessage(`❌ Connection failed: ${error.message}`)
      logger.error('Connection test failed', { error })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Supabase Connection Test
          </h1>

          {/* Status Message */}
          <div className={`p-4 rounded-md mb-6 ${
            status === 'testing' ? 'bg-blue-50 border border-blue-200' :
            status === 'success' ? 'bg-green-50 border border-green-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm font-medium ${
              status === 'testing' ? 'text-blue-800' :
              status === 'success' ? 'text-green-800' :
              'text-red-800'
            }`}>
              {message}
            </p>
          </div>

          {/* Environment Variables Check */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Environment Variables
            </h2>
            <div className="space-y-2">
              <CheckItem
                label="NEXT_PUBLIC_SUPABASE_URL"
                value={process.env.NEXT_PUBLIC_SUPABASE_URL}
              />
              <CheckItem
                label="NEXT_PUBLIC_SUPABASE_ANON_KEY"
                value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
              />
            </div>
          </div>

          {/* Courses Data */}
          {status === 'success' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Courses Found ({courses.length})
              </h2>
              {courses.length > 0 ? (
                <div className="space-y-2">
                  {courses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded p-3">
                      <p className="font-medium text-gray-900">{course.name}</p>
                      <p className="text-sm text-gray-600">{course.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Price: ₦{course.price?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  No courses found. Run <code className="bg-gray-100 px-2 py-1 rounded">supabase/sample-data.sql</code> to add sample data.
                </p>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Next Steps:
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>If connection failed, check your <code>.env.local</code> file</li>
              <li>Make sure you ran <code>supabase/schema.sql</code> in Supabase</li>
              <li>Optionally run <code>supabase/sample-data.sql</code> for test data</li>
              <li>Check the browser console for detailed error messages</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={testConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Test Again
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckItem({ label, value }: { label: string; value?: string }) {
  const isSet = !!value && value !== 'your-project-url' && value !== 'your-anon-key'
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${isSet ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-xs text-gray-500">
        {isSet ? '✓ Set' : '✗ Not set or using default'}
      </span>
    </div>
  )
}
