"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import { type XeBuyt, loadFromLocalStorage, saveToLocalStorage, type LichChay } from "@/lib/csv-utils"
import { Badge } from "@/components/ui/badge"
import { XeBuytStatusDetail } from "@/components/xe-buyt-status-detail"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface TrangThaiXe {
  trang_thai: "san_sang" | "dang_chay" | "bao_tri" | "hong_hoc"
  ma_lich_chay?: string | null
  thoi_gian_cap_nhat: string
}

interface TuyenXe {
  ma_tuyen_xe: string
  ten_tuyen_xe: string
  // ... other properties
}

// Custom hook để thiết lập interval an toàn
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>()

  // Ghi nhớ callback mới nhất
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Thiết lập interval
  useEffect(() => {
    function tick() {
      savedCallback.current?.()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default function XeBuytPage() {
  const [xeBuytList, setXeBuytList] = useState<XeBuyt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newXeBuyt, setNewXeBuyt] = useState<XeBuyt>({
    bien_so_xe: "",
    loai_xe: "",
    suc_chua: 0,
  })
  const [editingXeBuyt, setEditingXeBuyt] = useState<XeBuyt | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [xeBuytToDelete, setXeBuytToDelete] = useState<string | null>(null)
  const [lichChayList, setLichChayList] = useState<LichChay[]>([])
  const [tuyenXeList, setTuyenXeList] = useState<TuyenXe[]>([])

  // Thay thế biến busStatuses cũ bằng state
  const [busStatuses, setBusStatuses] = useState<Record<string, TrangThaiXe>>({})

  const { toast } = useToast()

  const updateBusStatus = (bienSoXe: string, trangThai: "san_sang" | "dang_chay" | "bao_tri" | "hong_hoc") => {
    const updatedStatuses = { ...busStatuses }
    updatedStatuses[bienSoXe] = {
      trang_thai: trangThai,
      thoi_gian_cap_nhat: new Date().toISOString(),
    }

    setBusStatuses(updatedStatuses)
    saveToLocalStorage("trangThaiXe", updatedStatuses)

    toast({
      title: "Cập nhật trạng thái",
      description: `Đã cập nhật trạng thái xe ${bienSoXe} thành ${getStatusText(trangThai)}`,
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "dang_chay":
        return "Đang Chạy"
      case "san_sang":
        return "Sẵn Sàng"
      case "bao_tri":
        return "Bảo Trì"
      case "hong_hoc":
        return "Hỏng Hóc"
      default:
        return "Không Xác Định"
    }
  }

  const checkAndUpdateBusStatus = useCallback(() => {
    if (lichChayList.length === 0 || xeBuytList.length === 0) return

    console.log("Đang kiểm tra trạng thái xe buýt...", new Date().toLocaleTimeString())

    const now = new Date()
    // Lấy trạng thái hiện tại trực tiếp từ state thay vì dùng dependency
    const currentStatuses = { ...busStatuses }
    let hasChanges = false

    // Kiểm tra từng xe buýt
    xeBuytList.forEach((xe) => {
      console.log(
        `Kiểm tra xe ${xe.bien_so_xe}, trạng thái hiện tại:`,
        currentStatuses[xe.bien_so_xe]?.trang_thai || "chưa có",
      )

      // Tìm lịch chạy hiện tại hoặc sắp tới của xe
      const currentSchedules = lichChayList.filter((lc) => lc.bien_so_xe === xe.bien_so_xe)
      console.log(`Xe ${xe.bien_so_xe} có ${currentSchedules.length} lịch chạy`)

      if (currentSchedules.length === 0) {
        // Nếu xe không có lịch chạy và chưa có trạng thái, đặt là sẵn sàng
        if (!currentStatuses[xe.bien_so_xe]) {
          currentStatuses[xe.bien_so_xe] = {
            trang_thai: "san_sang",
            thoi_gian_cap_nhat: now.toISOString(),
          }
          hasChanges = true
          console.log(`Xe ${xe.bien_so_xe} không có lịch chạy, đặt trạng thái mặc định: sẵn sàng`)
        }
        return
      }

      // Kiểm tra từng lịch chạy của xe
      let foundActiveSchedule = false
      for (const lichChay of currentSchedules) {
        try {
          console.log(
            `Kiểm tra lịch chạy ${lichChay.ma_lich_chay} cho xe ${xe.bien_so_xe}:`,
            lichChay.ngay_chay,
            lichChay.gio_xuat_phat,
            lichChay.gio_ket_thuc,
          )

          // Phân tích ngày và giờ từ lịch chạy
          const scheduleDate = new Date(lichChay.ngay_chay)

          // Tạo đối tượng Date đầy đủ cho thời gian bắt đầu và kết thúc
          const [startHour, startMinute] = lichChay.gio_xuat_phat.split(":").map(Number)
          const [endHour, endMinute] = lichChay.gio_ket_thuc.split(":").map(Number)

          const startDateTime = new Date(scheduleDate)
          startDateTime.setHours(startHour, startMinute, 0, 0)

          const endDateTime = new Date(scheduleDate)
          endDateTime.setHours(endHour, endMinute, 0, 0)

          // Nếu thời gian kết thúc < thời gian bắt đầu, giả định là ngày hôm sau
          if (endDateTime < startDateTime) {
            endDateTime.setDate(endDateTime.getDate() + 1)
          }

          // Thêm 15 phút chuẩn bị trước giờ xuất phát
          const prepTime = new Date(startDateTime)
          prepTime.setMinutes(prepTime.getMinutes() - 15)

          console.log(`Xe ${xe.bien_so_xe}, lịch chạy ${lichChay.ma_lich_chay}:`)
          console.log(`- Thời gian hiện tại: ${now.toLocaleString()}`)
          console.log(`- Thời gian chuẩn bị: ${prepTime.toLocaleString()}`)
          console.log(`- Thời gian bắt đầu: ${startDateTime.toLocaleString()}`)
          console.log(`- Thời gian kết thúc: ${endDateTime.toLocaleString()}`)

          // Kiểm tra xem hiện tại có trong khoảng thời gian chạy không
          const isInPrepTime = now >= prepTime && now < startDateTime
          const isInActiveTime = now >= startDateTime && now <= endDateTime

          console.log(`- Đang trong thời gian chuẩn bị: ${isInPrepTime}`)
          console.log(`- Đang trong thời gian chạy: ${isInActiveTime}`)

          if (isInPrepTime || isInActiveTime) {
            foundActiveSchedule = true

            // Nếu trong thời gian chuẩn bị (15 phút trước giờ xuất phát)
            if (isInPrepTime) {
              // Chỉ cập nhật nếu trạng thái hiện tại không phải đang chuẩn bị
              if (
                !currentStatuses[xe.bien_so_xe] ||
                currentStatuses[xe.bien_so_xe].trang_thai !== "san_sang" ||
                currentStatuses[xe.bien_so_xe].ma_lich_chay !== lichChay.ma_lich_chay
              ) {
                console.log(`Cập nhật xe ${xe.bien_so_xe} sang trạng thái: sẵn sàng (chuẩn bị cho lịch chạy)`)
                currentStatuses[xe.bien_so_xe] = {
                  trang_thai: "san_sang",
                  ma_lich_chay: lichChay.ma_lich_chay,
                  thoi_gian_cap_nhat: now.toISOString(),
                }
                hasChanges = true
              }
            }
            // Nếu đã đến hoặc qua giờ xuất phát và chưa đến giờ kết thúc
            else if (isInActiveTime) {
              // Chỉ cập nhật nếu trạng thái hiện tại không phải đang chạy
              if (
                !currentStatuses[xe.bien_so_xe] ||
                currentStatuses[xe.bien_so_xe].trang_thai !== "dang_chay" ||
                currentStatuses[xe.bien_so_xe].ma_lich_chay !== lichChay.ma_lich_chay
              ) {
                console.log(`Cập nhật xe ${xe.bien_so_xe} sang trạng thái: đang chạy`)
                currentStatuses[xe.bien_so_xe] = {
                  trang_thai: "dang_chay",
                  ma_lich_chay: lichChay.ma_lich_chay,
                  thoi_gian_cap_nhat: now.toISOString(),
                }
                hasChanges = true
              }
            }
            break // Đã tìm thấy lịch chạy hiện tại, không cần kiểm tra thêm
          }
        } catch (error) {
          console.error(`Lỗi khi xử lý lịch chạy cho xe ${xe.bien_so_xe}:`, error)
        }
      }

      // Nếu không có lịch chạy hiện tại và xe đang ở trạng thái "đang chạy", chuyển về "sẵn sàng"
      if (!foundActiveSchedule) {
        if (currentStatuses[xe.bien_so_xe]?.trang_thai === "dang_chay") {
          console.log(`Xe ${xe.bien_so_xe} không có lịch chạy hiện tại, chuyển từ đang chạy sang sẵn sàng`)
          currentStatuses[xe.bien_so_xe] = {
            trang_thai: "san_sang",
            thoi_gian_cap_nhat: now.toISOString(),
          }
          hasChanges = true
        } else if (!currentStatuses[xe.bien_so_xe]) {
          // Nếu xe chưa có trạng thái, đặt là sẵn sàng
          console.log(`Xe ${xe.bien_so_xe} chưa có trạng thái, đặt mặc định: sẵn sàng`)
          currentStatuses[xe.bien_so_xe] = {
            trang_thai: "san_sang",
            thoi_gian_cap_nhat: now.toISOString(),
          }
          hasChanges = true
        }
      }
    })

    if (hasChanges) {
      console.log("Có thay đổi trạng thái, cập nhật state và localStorage")
      setBusStatuses(currentStatuses)
      saveToLocalStorage("trangThaiXe", currentStatuses)
    } else {
      console.log("Không có thay đổi trạng thái")
    }
  }, [lichChayList, xeBuytList, busStatuses])

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedData = loadFromLocalStorage<XeBuyt>("xeBuyt")
    const loadedLichChay = loadFromLocalStorage<LichChay>("lichChay")
    const loadedTrangThaiXe = loadFromLocalStorage<Record<string, TrangThaiXe>>("trangThaiXe")
    const loadedTuyenXe = loadFromLocalStorage<TuyenXe>("tuyenXe")

    if (loadedData.length > 0) {
      setXeBuytList(loadedData)
    } else {
      // Initialize with sample data if no data exists
      const sampleData: XeBuyt[] = [
        {
          bien_so_xe: "29A-12345",
          loai_xe: "Xe 29 chỗ",
          suc_chua: 29,
        },
        {
          bien_so_xe: "29B-67890",
          loai_xe: "Xe 45 chỗ",
          suc_chua: 45,
        },
        {
          bien_so_xe: "29C-54321",
          loai_xe: "Xe giường nằm",
          suc_chua: 40,
        },
      ]
      setXeBuytList(sampleData)
      saveToLocalStorage("xeBuyt", sampleData)
    }

    if (loadedLichChay.length > 0) {
      setLichChayList(loadedLichChay)
    } else {
      // Tạo dữ liệu mẫu cho lịch chạy nếu chưa có
      const today = new Date()
      const todayStr = today.toISOString().split("T")[0]

      // Tạo lịch chạy cho hôm nay
      const sampleLichChay: LichChay[] = [
        {
          ma_lich_chay: "LC001",
          ngay_chay: todayStr,
          gio_xuat_phat: "07:30",
          gio_ket_thuc: "09:30",
          ma_tai_xe: "TX001",
          bien_so_xe: "29A-12345",
          ma_tuyen: "TX001",
        },
        {
          ma_lich_chay: "LC002",
          ngay_chay: todayStr,
          gio_xuat_phat: "10:00",
          gio_ket_thuc: "12:00",
          ma_tai_xe: "TX002",
          bien_so_xe: "29B-67890",
          ma_tuyen: "TX002",
        },
        {
          ma_lich_chay: "LC003",
          ngay_chay: todayStr,
          // Tạo lịch chạy gần với thời gian hiện tại để dễ kiểm tra
          gio_xuat_phat: `${today.getHours()}:${today.getMinutes() + 5}`,
          gio_ket_thuc: `${today.getHours() + 1}:${today.getMinutes()}`,
          ma_tai_xe: "TX003",
          bien_so_xe: "29C-54321",
          ma_tuyen: "TX003",
        },
      ]

      setLichChayList(sampleLichChay)
      saveToLocalStorage("lichChay", sampleLichChay)
      console.log("Đã tạo dữ liệu mẫu cho lịch chạy:", sampleLichChay)
    }

    if (loadedTrangThaiXe && Object.keys(loadedTrangThaiXe).length > 0) {
      setBusStatuses(loadedTrangThaiXe)
    } else {
      // Khởi tạo trạng thái mặc định nếu không có dữ liệu
      const defaultStatuses: Record<string, TrangThaiXe> = {}
      loadedData.forEach((xe) => {
        defaultStatuses[xe.bien_so_xe] = {
          trang_thai: "san_sang",
          thoi_gian_cap_nhat: new Date().toISOString(),
        }
      })
      setBusStatuses(defaultStatuses)
      saveToLocalStorage("trangThaiXe", defaultStatuses)
    }

    if (loadedTuyenXe.length > 0) {
      setTuyenXeList(loadedTuyenXe)
    }

    // Sử dụng setTimeout để đảm bảo state đã được cập nhật trước khi gọi checkAndUpdateBusStatus
    const timer = setTimeout(() => {
      checkAndUpdateBusStatus()
    }, 1000)

    return () => clearTimeout(timer)
  }, []) // Mảng dependencies rỗng để chỉ chạy một lần khi mount

  // Thiết lập interval để kiểm tra trạng thái xe mỗi 30 giây
  useInterval(() => {
    checkAndUpdateBusStatus()
  }, 30000)

  const handleAddXeBuyt = () => {
    // Validate form
    if (!newXeBuyt.bien_so_xe || !newXeBuyt.loai_xe) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc (Biển số xe và Loại xe)")
      return
    }

    // Check for duplicate bien_so_xe
    if (xeBuytList.some((item) => item.bien_so_xe === newXeBuyt.bien_so_xe)) {
      alert("Biển số xe đã tồn tại. Vui lòng chọn biển số xe khác.")
      return
    }

    const updatedList = [...xeBuytList, newXeBuyt]
    setXeBuytList(updatedList)
    saveToLocalStorage("xeBuyt", updatedList)
    setNewXeBuyt({
      bien_so_xe: "",
      loai_xe: "",
      suc_chua: 0,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditXeBuyt = () => {
    if (!editingXeBuyt) return

    const updatedList = xeBuytList.map((item) => (item.bien_so_xe === editingXeBuyt.bien_so_xe ? editingXeBuyt : item))

    setXeBuytList(updatedList)
    saveToLocalStorage("xeBuyt", updatedList)
    setIsEditDialogOpen(false)
  }

  const handleDeleteXeBuyt = () => {
    if (!xeBuytToDelete) return

    const updatedList = xeBuytList.filter((item) => item.bien_so_xe !== xeBuytToDelete)

    setXeBuytList(updatedList)
    saveToLocalStorage("xeBuyt", updatedList)
    setIsDeleteDialogOpen(false)
    setXeBuytToDelete(null)
  }

  const filteredXeBuyt = xeBuytList.filter(
    (item) =>
      item.bien_so_xe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.loai_xe.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (xe: XeBuyt) => {
    const status = busStatuses[xe.bien_so_xe]?.trang_thai || "san_sang"

    switch (status) {
      case "dang_chay":
        return <Badge className="bg-green-500">Đang Chạy</Badge>
      case "san_sang":
        return <Badge className="bg-blue-500">Sẵn Sàng</Badge>
      case "bao_tri":
        return <Badge className="bg-yellow-500">Bảo Trì</Badge>
      case "hong_hoc":
        return <Badge className="bg-red-500">Hỏng Hóc</Badge>
      default:
        return <Badge className="bg-gray-500">Không Xác Định</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Xe Buýt</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm Xe Buýt
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm xe buýt..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Xe Buýt</CardTitle>
          <CardDescription>Quản lý thông tin các xe buýt trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biển Số Xe</TableHead>
                <TableHead>Loại Xe</TableHead>
                <TableHead>Sức Chứa</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredXeBuyt.map((xeBuyt) => (
                <React.Fragment key={xeBuyt.bien_so_xe}>
                  <TableRow>
                    <TableCell className="font-medium">{xeBuyt.bien_so_xe}</TableCell>
                    <TableCell>{xeBuyt.loai_xe}</TableCell>
                    <TableCell>{xeBuyt.suc_chua} chỗ</TableCell>
                    <TableCell>{getStatusBadge(xeBuyt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateBusStatus(xeBuyt.bien_so_xe, "san_sang")}>
                            Đặt trạng thái: Sẵn Sàng
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateBusStatus(xeBuyt.bien_so_xe, "dang_chay")}>
                            Đặt trạng thái: Đang Chạy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateBusStatus(xeBuyt.bien_so_xe, "bao_tri")}>
                            Đặt trạng thái: Bảo Trì
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateBusStatus(xeBuyt.bien_so_xe, "hong_hoc")}>
                            Đặt trạng thái: Hỏng Hóc
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingXeBuyt(xeBuyt)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            Chỉnh sửa thông tin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setXeBuytToDelete(xeBuyt.bien_so_xe)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            Xóa xe buýt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {busStatuses[xeBuyt.bien_so_xe]?.trang_thai === "dang_chay" && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0 border-t-0">
                        <XeBuytStatusDetail
                          bienSoXe={xeBuyt.bien_so_xe}
                          trangThai={busStatuses[xeBuyt.bien_so_xe]?.trang_thai || "san_sang"}
                          maLichChay={busStatuses[xeBuyt.bien_so_xe]?.ma_lich_chay}
                          lichChayList={lichChayList}
                          tuyenXeList={tuyenXeList}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
              {filteredXeBuyt.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Không tìm thấy xe buýt nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Xe Buýt Mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho xe buýt mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bien_so_xe" className="text-right">
                Biển Số Xe
              </Label>
              <Input
                id="bien_so_xe"
                value={newXeBuyt.bien_so_xe}
                onChange={(e) => setNewXeBuyt({ ...newXeBuyt, bien_so_xe: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loai_xe" className="text-right">
                Loại Xe
              </Label>
              <Input
                id="loai_xe"
                value={newXeBuyt.loai_xe}
                onChange={(e) => setNewXeBuyt({ ...newXeBuyt, loai_xe: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suc_chua" className="text-right">
                Sức Chứa
              </Label>
              <Input
                id="suc_chua"
                type="number"
                value={newXeBuyt.suc_chua}
                onChange={(e) =>
                  setNewXeBuyt({
                    ...newXeBuyt,
                    suc_chua: Number.parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddXeBuyt}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Xe Buýt</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho xe buýt</DialogDescription>
          </DialogHeader>
          {editingXeBuyt && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_bien_so_xe" className="text-right">
                  Biển Số Xe
                </Label>
                <Input id="edit_bien_so_xe" value={editingXeBuyt.bien_so_xe} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_loai_xe" className="text-right">
                  Loại Xe
                </Label>
                <Input
                  id="edit_loai_xe"
                  value={editingXeBuyt.loai_xe}
                  onChange={(e) =>
                    setEditingXeBuyt({
                      ...editingXeBuyt,
                      loai_xe: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_suc_chua" className="text-right">
                  Sức Chứa
                </Label>
                <Input
                  id="edit_suc_chua"
                  type="number"
                  value={editingXeBuyt.suc_chua}
                  onChange={(e) =>
                    setEditingXeBuyt({
                      ...editingXeBuyt,
                      suc_chua: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditXeBuyt}>Lưu Thay Đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa xe buýt này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteXeBuyt}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
