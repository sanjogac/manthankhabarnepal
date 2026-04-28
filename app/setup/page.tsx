'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const initializeDatabase = async () => {
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Database tables created successfully!')
      } else {
        setError(data.message || 'Failed to initialize database')
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while initializing the database'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/manthan-logo.jpg" alt="Manthan Khabar" className="w-24 h-24 mx-auto mb-4" />
          <CardTitle>Database Setup Required</CardTitle>
          <CardDescription>
            Initialize your Nepali news platform database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-900 mb-2">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Click the button below to create database tables</li>
              <li>Tables will be created in your Supabase database</li>
              <li>You&apos;ll be able to add news articles after setup</li>
            </ol>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <Button
            onClick={initializeDatabase}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Initializing...' : 'Initialize Database'}
          </Button>

          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                View News
              </Button>
            </Link>
            <Link href="/auth/login" className="flex-1">
              <Button variant="outline" className="w-full">
                Staff Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
