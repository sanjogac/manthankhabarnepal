"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

const categories = [
  { label: "राजनीति", href: "/?category=politics" },
  { label: "व्यापार", href: "/?category=business" },
  { label: "खेलकुद", href: "/?category=sports" },
  { label: "मनोरञ्जन", href: "/?category=entertainment" },
  { label: "प्रविधि", href: "/?category=technology" },
]

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="Manthan Khabar"
                width={50}
                height={50}
                className="rounded-full bg-white p-1"
              />
              <div>
                <h3 className="text-xl font-bold">मन्थन खबर</h3>
                <p className="text-xs text-white/70">तपाईंको दैनिक समाचार स्रोत</p>
              </div>
            </Link>
            <p className="text-sm text-white/80 mb-4">
              तपाईंलाई महत्त्वपूर्ण कुराहरूको बारेमा जानकारी राख्न सही र निष्पक्ष समाचार कभरेज प्रदान गर्दै।
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-secondary">विषयहरू</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="text-sm text-white/80 hover:text-secondary transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-secondary">द्रुत लिंकहरू</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-white/80 hover:text-secondary transition-colors">
                  हाम्रो बारेमा
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white/80 hover:text-secondary transition-colors">
                  सम्पर्क
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-white/80 hover:text-secondary transition-colors">
                  गोपनीयता नीति
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-white/80 hover:text-secondary transition-colors">
                  सेवाका सर्तहरू
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-secondary">सम्पर्क गर्नुहोस्</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/80">
                <Mail className="h-4 w-4 text-secondary" />
                manthankhabarnepal@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <Phone className="h-4 w-4 text-secondary" />
                +977 9744546105
              </li>
              <li className="flex items-start gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <span>पोखरा, नेपाल</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} मन्थन खबर। सर्वाधिकार सुरक्षित।
          </p>
        </div>
      </div>
    </footer>
  )
}
