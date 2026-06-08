"use client"

import { motion } from "framer-motion"
import { Newspaper, CheckCircle, FileEdit } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardStatsProps {
  stats: {
    total: number
    published: number
    drafts: number
  }
}

const statItems = [
  {
    key: "total",
    label: "कुल लेखहरू",
    icon: Newspaper,
    color: "bg-primary/10 text-primary",
  },
  {
    key: "published",
    label: "प्रकाशित",
    icon: CheckCircle,
    color: "bg-green-100 text-green-600",
  },
  {
    key: "drafts",
    label: "ड्राफ्टहरू",
    icon: FileEdit,
    color: "bg-secondary/20 text-secondary-foreground",
  },
]

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {stats[item.key as keyof typeof stats]}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
