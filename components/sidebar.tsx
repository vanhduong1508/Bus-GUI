"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Bus,
  Calendar,
  ClipboardList,
  Home,
  MapPin,
  Menu,
  MessageSquare,
  Settings,
  Ticket,
  PenToolIcon as Tool,
  User,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Tuyến Xe", href: "/tuyen-xe", icon: MapPin },
  { name: "Điểm Dừng", href: "/diem-dung", icon: MapPin },
  { name: "Xe Buýt", href: "/xe-buyt", icon: Bus },
  { name: "Tài Xế", href: "/tai-xe", icon: User },
  { name: "Lịch Chạy", href: "/lich-chay", icon: Calendar },
  { name: "Vé Xe", href: "/ve-xe", icon: Ticket },
  { name: "Hành Khách", href: "/hanh-khach", icon: Users },
  { name: "Phản Hồi", href: "/phan-hoi", icon: MessageSquare },
  { name: "Bảo Trì", href: "/bao-tri", icon: Tool },
  { name: "Báo Cáo", href: "/bao-cao", icon: ClipboardList },
  { name: "Cài Đặt", href: "/cai-dat", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold">Bus Management</h1>
        </div>
        <nav className="space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Overlay to close sidebar on mobile */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
