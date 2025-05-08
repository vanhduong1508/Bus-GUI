"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Filter } from "lucide-react"
import {
  type VeXe,
  type LichChay,
  type BaoTriXe,
  type TuyenXe,
  loadFromLocalStorage,
  writeCSVData,
} from "@/lib/csv-utils"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { toast } from "@/components/ui/use-toast"
import { vi } from "date-fns/locale"

export default function BaoCaoPage() {
  const [veXeList, setVeXeList] = useState<VeXe[]>([])
  const [lichChayList, setLichChayList] = useState<LichChay[]>([])
  const [baoTriList, setBaoTriList] = useState<BaoTriXe[]>([])
  const [tuyenXeList, setTuyenXeList] = useState<TuyenXe[]>([])

  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [selectedTuyen, setSelectedTuyen] = useState<string>("all")

  const [doanhThuData, setDoanhThuData] = useState<any[]>([])
  const [chiPhiData, setChiPhiData] = useState<any[]>([])
  const [tuyenXeData, setTuyenXeData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A"
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return dateString
      }
      return format(date, "dd/MM/yyyy", { locale: vi })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString || "N/A"
    }
  }

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedVeXe = loadFromLocalStorage<VeXe>("veXe")
    const loadedLichChay = loadFromLocalStorage<LichChay>("lichChay")
    const loadedBaoTri = loadFromLocalStorage<BaoTriXe>("baoTri")
    const loadedTuyenXe = loadFromLocalStorage<TuyenXe>("tuyenXe")

    if (loadedVeXe.length > 0) setVeXeList(loadedVeXe)
    if (loadedLichChay.length > 0) setLichChayList(loadedLichChay)
    if (loadedBaoTri.length > 0) setBaoTriList(loadedBaoTri)
    if (loadedTuyenXe.length > 0) setTuyenXeList(loadedTuyenXe)

    try {
      // Set default date range to current month
      const today = new Date()
      if (isNaN(today.getTime())) {
        throw new Error("Invalid current date")
      }

      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      if (isNaN(firstDayOfMonth.getTime()) || isNaN(lastDayOfMonth.getTime())) {
        throw new Error("Invalid month dates")
      }

      const startDateStr = firstDayOfMonth.toISOString().split("T")[0]
      const endDateStr = lastDayOfMonth.toISOString().split("T")[0]

      setStartDate(startDateStr)
      setEndDate(endDateStr)

      // Generate initial reports
      generateReports(loadedVeXe, loadedLichChay, loadedBaoTri, loadedTuyenXe, startDateStr, endDateStr, "all")
    } catch (error) {
      console.error("Error setting up date range:", error)
      // Set fallback dates (current date)
      const today = new Date()
      const todayStr = today.toISOString().split("T")[0]
      setStartDate(todayStr)
      setEndDate(todayStr)

      toast({
        title: "Lỗi",
        description: "Có lỗi khi thiết lập khoảng thời gian. Đã đặt về ngày hiện tại.",
        variant: "destructive",
      })
    }
  }, [])

  const generateReports = (
    veXeData: VeXe[],
    lichChayData: LichChay[],
    baoTriData: BaoTriXe[],
    tuyenXeData: TuyenXe[],
    start: string,
    end: string,
    tuyen: string,
  ) => {
    try {
      setIsLoading(true)

      // Validate date inputs
      if (!start || !end) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn khoảng thời gian hợp lệ.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Filter data by date range and tuyen if selected
      const startDate = new Date(start)
      const endDate = new Date(end)

      // Validate date objects
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        toast({
          title: "Lỗi",
          description: "Định dạng ngày không hợp lệ.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      endDate.setHours(23, 59, 59, 999) // End of the day

      // Filter ve xe data
      const filteredVeXe = veXeData.filter((ve) => {
        try {
          const veDate = new Date(ve.thoi_gian_dat)
          if (isNaN(veDate.getTime())) return false

          const inDateRange = veDate >= startDate && veDate <= endDate

          if (tuyen === "all") return inDateRange

          // Find the lich chay to get the tuyen
          const lichChay = lichChayData.find((lc) => lc.ma_lich_chay === ve.ma_lich_chay)
          return inDateRange && lichChay && lichChay.ma_tuyen === tuyen
        } catch (error) {
          console.error("Error filtering ve xe:", error)
          return false
        }
      })

      // Filter bao tri data
      const filteredBaoTri = baoTriData.filter((bt) => {
        try {
          const btDate = new Date(bt.ngay_thuc_hien)
          if (isNaN(btDate.getTime())) return false

          return btDate >= startDate && btDate <= endDate
        } catch (error) {
          console.error("Error filtering bao tri:", error)
          return false
        }
      })

      // Generate doanh thu data (by day)
      const doanhThuByDay = new Map<string, number>()

      filteredVeXe.forEach((ve) => {
        try {
          const veDate = new Date(ve.thoi_gian_dat)
          if (isNaN(veDate.getTime())) return

          const date = format(veDate, "dd/MM/yyyy")
          const currentAmount = doanhThuByDay.get(date) || 0
          doanhThuByDay.set(date, currentAmount + ve.gia_tien)
        } catch (error) {
          console.error("Error processing ve xe for doanh thu:", error)
        }
      })

      const doanhThuArray = Array.from(doanhThuByDay.entries()).map(([date, amount]) => ({
        date,
        amount,
      }))

      // Sort by date
      doanhThuArray.sort((a, b) => {
        try {
          const dateA = new Date(a.date.split("/").reverse().join("-"))
          const dateB = new Date(b.date.split("/").reverse().join("-"))
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0

          return dateA.getTime() - dateB.getTime()
        } catch (error) {
          console.error("Error sorting doanh thu:", error)
          return 0
        }
      })

      setDoanhThuData(doanhThuArray)

      // Generate chi phi data (by day)
      const chiPhiByDay = new Map<string, number>()

      filteredBaoTri.forEach((bt) => {
        try {
          const btDate = new Date(bt.ngay_thuc_hien)
          if (isNaN(btDate.getTime())) return

          const date = format(btDate, "dd/MM/yyyy")
          const currentAmount = chiPhiByDay.get(date) || 0
          chiPhiByDay.set(date, currentAmount + bt.chi_phi)
        } catch (error) {
          console.error("Error processing bao tri for chi phi:", error)
        }
      })

      const chiPhiArray = Array.from(chiPhiByDay.entries()).map(([date, amount]) => ({
        date,
        amount,
      }))

      // Sort by date
      chiPhiArray.sort((a, b) => {
        try {
          const dateA = new Date(a.date.split("/").reverse().join("-"))
          const dateB = new Date(b.date.split("/").reverse().join("-"))
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0

          return dateA.getTime() - dateB.getTime()
        } catch (error) {
          console.error("Error sorting chi phi:", error)
          return 0
        }
      })

      setChiPhiData(chiPhiArray)

      // Generate tuyen xe data (by tuyen)
      const tuyenXeStats = new Map<string, number>()

      filteredVeXe.forEach((ve) => {
        try {
          const lichChay = lichChayData.find((lc) => lc.ma_lich_chay === ve.ma_lich_chay)
          if (lichChay) {
            const tuyenName = tuyenXeData.find((t) => t.ma_tuyen === lichChay.ma_tuyen)?.ten_tuyen || lichChay.ma_tuyen
            const currentCount = tuyenXeStats.get(tuyenName) || 0
            tuyenXeStats.set(tuyenName, currentCount + 1)
          }
        } catch (error) {
          console.error("Error processing ve xe for tuyen xe stats:", error)
        }
      })

      const tuyenXeArray = Array.from(tuyenXeStats.entries()).map(([name, value]) => ({
        name,
        value,
      }))

      setTuyenXeData(tuyenXeArray)
    } catch (error) {
      console.error("Error generating reports:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo báo cáo. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn khoảng thời gian hợp lệ.",
        variant: "destructive",
      })
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: "Lỗi",
        description: "Ngày bắt đầu phải trước ngày kết thúc.",
        variant: "destructive",
      })
      return
    }

    generateReports(veXeList, lichChayList, baoTriList, tuyenXeList, startDate, endDate, selectedTuyen)

    toast({
      title: "Đã cập nhật báo cáo",
      description: "Báo cáo đã được cập nhật theo bộ lọc mới.",
    })
  }

  const handleExportDoanhThu = () => {
    try {
      if (doanhThuData.length === 0) {
        toast({
          title: "Không có dữ liệu",
          description: "Không có dữ liệu doanh thu để xuất.",
          variant: "destructive",
        })
        return
      }

      const exportData = doanhThuData.map((item) => ({
        Ngay: item.date,
        DoanhThu: item.amount,
      }))

      writeCSVData(exportData, `bao-cao-doanh-thu-${startDate}-${endDate}.csv`)

      toast({
        title: "Xuất báo cáo thành công",
        description: "Báo cáo doanh thu đã được xuất thành công.",
      })
    } catch (error) {
      console.error("Error exporting revenue report:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xuất báo cáo doanh thu.",
        variant: "destructive",
      })
    }
  }

  const handleExportChiPhi = () => {
    try {
      if (chiPhiData.length === 0) {
        toast({
          title: "Không có dữ liệu",
          description: "Không có dữ liệu chi phí để xuất.",
          variant: "destructive",
        })
        return
      }

      const exportData = chiPhiData.map((item) => ({
        Ngay: item.date,
        ChiPhi: item.amount,
      }))

      writeCSVData(exportData, `bao-cao-chi-phi-${startDate}-${endDate}.csv`)

      toast({
        title: "Xuất báo cáo thành công",
        description: "Báo cáo chi phí đã được xuất thành công.",
      })
    } catch (error) {
      console.error("Error exporting cost report:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xuất báo cáo chi phí.",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  const totalDoanhThu = doanhThuData.reduce((sum, item) => sum + item.amount, 0)
  const totalChiPhi = chiPhiData.reduce((sum, item) => sum + item.amount, 0)
  const loiNhuan = totalDoanhThu - totalChiPhi

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Báo Cáo Thống Kê</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ Lọc Báo Cáo</CardTitle>
          <CardDescription>Chọn khoảng thời gian và tuyến xe để lọc dữ liệu báo cáo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Từ Ngày</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Đến Ngày</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tuyen">Tuyến Xe</Label>
              <Select value={selectedTuyen} onValueChange={setSelectedTuyen}>
                <SelectTrigger id="tuyen">
                  <SelectValue placeholder="Tất cả tuyến xe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tuyến xe</SelectItem>
                  {tuyenXeList.map((tuyen) => (
                    <SelectItem key={tuyen.ma_tuyen} value={tuyen.ma_tuyen}>
                      {tuyen.ten_tuyen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleFilterChange} className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Đang xử lý..."
                ) : (
                  <>
                    <Filter className="mr-2 h-4 w-4" /> Lọc Dữ Liệu
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDoanhThu)}</div>
            <p className="text-xs text-muted-foreground">
              Trong khoảng từ {startDate ? formatDate(startDate) : "N/A"} đến {endDate ? formatDate(endDate) : "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Chi Phí</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalChiPhi)}</div>
            <p className="text-xs text-muted-foreground">
              Trong khoảng từ {startDate ? formatDate(startDate) : "N/A"} đến {endDate ? formatDate(endDate) : "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lợi Nhuận</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${loiNhuan >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(loiNhuan)}
            </div>
            <p className="text-xs text-muted-foreground">
              Trong khoảng từ {startDate ? formatDate(startDate) : "N/A"} đến {endDate ? formatDate(endDate) : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="doanh-thu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="doanh-thu">Doanh Thu</TabsTrigger>
          <TabsTrigger value="chi-phi">Chi Phí</TabsTrigger>
          <TabsTrigger value="tuyen-xe">Thống Kê Tuyến Xe</TabsTrigger>
        </TabsList>
        <TabsContent value="doanh-thu" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Báo Cáo Doanh Thu</CardTitle>
                <CardDescription>Doanh thu theo ngày trong khoảng thời gian đã chọn</CardDescription>
              </div>
              <Button variant="outline" onClick={handleExportDoanhThu} disabled={doanhThuData.length === 0}>
                <Download className="mr-2 h-4 w-4" /> Xuất CSV
              </Button>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px]">
                {doanhThuData.length > 0 ? (
                  <ChartContainer
                    config={{
                      amount: {
                        label: "Doanh Thu",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <BarChart
                      accessibilityLayer
                      data={doanhThuData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Không có dữ liệu doanh thu trong khoảng thời gian này</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chi-phi" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Báo Cáo Chi Phí</CardTitle>
                <CardDescription>Chi phí bảo trì theo ngày trong khoảng thời gian đã chọn</CardDescription>
              </div>
              <Button variant="outline" onClick={handleExportChiPhi} disabled={chiPhiData.length === 0}>
                <Download className="mr-2 h-4 w-4" /> Xuất CSV
              </Button>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px]">
                {chiPhiData.length > 0 ? (
                  <ChartContainer
                    config={{
                      amount: {
                        label: "Chi Phí",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <BarChart accessibilityLayer data={chiPhiData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Không có dữ liệu chi phí trong khoảng thời gian này</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tuyen-xe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thống Kê Tuyến Xe</CardTitle>
              <CardDescription>Số lượng vé bán ra theo từng tuyến xe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {tuyenXeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tuyenXeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {tuyenXeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Không có dữ liệu tuyến xe trong khoảng thời gian này</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
