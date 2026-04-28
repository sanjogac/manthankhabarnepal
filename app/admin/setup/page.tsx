'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function AdminSetup() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleMakeStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      
      // Get the user by email using the admin API
      const response = await fetch('/api/make-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user')
      }

      setMessage({
        type: 'success',
        text: `User ${email} has been marked as staff! They can now access the dashboard.`,
      })
      setEmail('')
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">मन्थन खबर नेपाल</h1>
            <p className="text-sm text-muted-foreground">Admin Setup - Make User Staff</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Make User a Staff Member</CardTitle>
              <CardDescription>
                Enter the email of the user you want to give staff access to the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMakeStaff} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">User Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full font-medium">
                  {loading ? 'Processing...' : 'Make Staff Member'}
                </Button>
              </form>

              {message && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
