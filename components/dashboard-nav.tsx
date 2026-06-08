"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Newspaper,
  PlusCircle,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface StaffProfile {
  id: string
  full_name: string
  role: string
}

interface DashboardNavProps {
  user: User
  staffProfile: StaffProfile
}

const navItems = [
  { icon: LayoutDashboard, label: "ड्यासबोर्ड", href: "/staff/dashboard" },
  { icon: Newspaper, label: "सबै लेखहरू", href: "/staff/dashboard/articles" },
  { icon: PlusCircle, label: "नयाँ लेख", href: "/staff/dashboard/articles/new" },
]

export function DashboardNav({ user, staffProfile }: DashboardNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/staff/login")
    router.refresh()
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Manthan Khabar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h1 className="font-bold text-primary">मन्थन खबर</h1>
            <p className="text-xs text-muted-foreground">कर्मचारी पोर्टल</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{staffProfile.full_name}</p>
            <p className="text-xs text-muted-foreground capitalize">{staffProfile.role}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          साइन आउट
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Manthan Khabar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-bold text-primary">कर्मचारी पोर्टल</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-72 bg-card border-r border-border flex-col">
        <NavContent />
      </aside>
    </>
  )
}
