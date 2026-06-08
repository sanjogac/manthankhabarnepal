"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, Loader2, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function StaffLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("अमान्य इमेल वा पासवर्ड।")
        } else if (signInError.message.includes("Email not confirmed")) {
          // Auto-confirm user if not confirmed
          setError("इमेल प्रमाणित छैन। कृपया एडमिनलाई सम्पर्क गर्नुहोस्।")
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      // Check if user is a staff member
      const { data: staffProfile, error: profileError } = await supabase
        .from("staff_profiles")
        .select("*")
        .eq("id", data.user?.id)
        .single()

      if (profileError || !staffProfile) {
        // Create staff profile for the user
        const { error: insertError } = await supabase
          .from("staff_profiles")
          .insert({
            id: data.user?.id,
            full_name: email.split("@")[0],
            role: "ADMIN",
          })

        if (insertError) {
          await supabase.auth.signOut()
          setError("पहुँच अस्वीकृत। यो लगइन कर्मचारीहरूको लागि मात्र हो।")
          setLoading(false)
          return
        }
      }

      router.push("/staff/dashboard")
      router.refresh()
    } catch {
      setError("एउटा अप्रत्याशित त्रुटि भयो। कृपया पुन: प्रयास गर्नुहोस्।")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/95 to-primary/80 p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 -left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5" />
            <span>गृहपृष्ठमा फर्कनुहोस्</span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative w-40 h-40 mb-8"
          >
            <Image
              src="/images/logo.png"
              alt="Manthan Khabar"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-white text-center mb-4"
          >
            मन्थन खबर
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/80 text-center max-w-md"
          >
            कर्मचारी पोर्टल - समाचार लेखहरू व्यवस्थापन गर्नुहोस्, कथाहरू प्रकाशित गर्नुहोस्, र आफ्ना पाठकहरूलाई जानकार राख्नुहोस्।
          </motion.p>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-sm text-center">
            &copy; {new Date().getFullYear()} मन्थन खबर। सर्वाधिकार सुरक्षित।
          </p>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground mb-6">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">गृहपृष्ठमा फर्कनुहोस्</span>
            </Link>
            <div className="relative w-20 h-20">
              <Image
                src="/images/logo.png"
                alt="Manthan Khabar"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-primary mt-4">मन्थन खबर</h1>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">कर्मचारी लगइन</CardTitle>
              <CardDescription>
                ड्यासबोर्ड पहुँच गर्न आफ्नो प्रमाणहरू प्रविष्ट गर्नुहोस्
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">इमेल</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="staff@manthankhabar.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">पासवर्ड</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="पासवर्ड प्रविष्ट गर्नुहोस्"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      साइन इन हुँदैछ...
                    </>
                  ) : (
                    "साइन इन"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>खाता छैन?</p>
                <Link href="/staff/signup" className="text-primary hover:text-primary/80 font-medium">
                  नयाँ खाता बनाउनुहोस्
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
