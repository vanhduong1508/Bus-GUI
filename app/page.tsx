"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, Calendar, MapPin, MessageSquare, Ticket, User, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRoutes: 0,
    totalBuses: 0,
    totalDrivers: 0,
    totalSchedules: 0,
    totalPassengers: 0,
    totalTickets: 0,
    totalFeedback: 0,
  })

  const [ticketData, setTicketData] = useState([])
  const [routeData, setRouteData] = useState([])

  useEffect(() => {
    // In a real application, this would load data from CSV files
    // For now, we'll simulate loading with mock data
    const loadData = async () => {
      try {
        // Simulate loading data from CSV files
        setTimeout(() => {
          setStats({
            totalRoutes: 15,
            totalBuses: 42,
            totalDrivers: 38,
            totalSchedules: 120,
            totalPassengers: 1250,
            totalTickets: 3680,
            totalFeedback: 145,
          })

          setTicketData([
            { month: "Tháng 1", tickets: 320 },
            { month: "Tháng 2", tickets: 280 },
            { month: "Tháng 3", tickets: 310 },
            { month: "Tháng 4", tickets: 340 },
            { month: "Tháng 5", tickets: 380 },
            { month: "Tháng 6", tickets: 420 },
          ])

          setRouteData([
            { route: "Tuyến 01", passengers: 420 },
            { route: "Tuyến 02", passengers: 380 },
            { route: "Tuyến 03", passengers: 350 },
            { route: "Tuyến 04", passengers: 310 },
            { route: "Tuyến 05", passengers: 290 },
          ])
        }, 500)
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tuyến Xe</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoutes}</div>
            <p className="text-xs text-muted-foreground">tuyến đang hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Xe Buýt</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBuses}</div>
            <p className="text-xs text-muted-foreground">xe đang hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tài Xế</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrivers}</div>
            <p className="text-xs text-muted-foreground">tài xế đang làm việc</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lịch Chạy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchedules}</div>
            <p className="text-xs text-muted-foreground">lịch chạy trong tháng</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Thống Kê Vé Bán Ra</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                tickets: {
                  label: "Vé",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart accessibilityLayer data={ticketData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="tickets" fill="var(--color-tickets)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Tuyến Xe Phổ Biến</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                passengers: {
                  label: "Hành Khách",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart
                accessibilityLayer
                layout="vertical"
                data={routeData}
                margin={{ top: 10, right: 30, left: 50, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="route" type="category" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="passengers" fill="var(--color-passengers)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hành Khách</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPassengers}</div>
            <p className="text-xs text-muted-foreground">hành khách đã đăng ký</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vé Xe</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">vé đã bán</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phản Hồi</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedback}</div>
            <p className="text-xs text-muted-foreground">phản hồi từ khách hàng</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
