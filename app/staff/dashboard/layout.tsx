import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/staff/login")
  }

  // Verify user is a staff member
  const { data: staffProfile } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!staffProfile) {
    redirect("/staff/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} staffProfile={staffProfile} />
      <main className="lg:pl-72">{children}</main>
    </div>
  )
}
