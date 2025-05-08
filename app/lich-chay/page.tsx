"use client"

import { useState, useEffect } from "react"
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
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import {
  type LichChay,
  type TuyenXe,
  type XeBuyt,
  type TaiXe,
  loadFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/csv-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function LichChayPage() {
  const [lichChayList, setLichChayList] = useState<LichChay[]>([])
  const [tuyenXeList, setTuyenXeList] = useState<TuyenXe[]>([])
  const [xeBuytList, setXeBuytList] = useState<XeBuyt[]>([])
  const [taiXeList, setTaiXeList] = useState<TaiXe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newLichChay, setNewLichChay] = useState<LichChay>({
    ma_lich_chay: "",
    ngay_chay: "",
    gio_xuat_phat: "",
    gio_ket_thuc: "",
    ma_tai_xe: "",
    bien_so_xe: "",
    ma_tuyen: "",
  })
  const [editingLichChay, setEditingLichChay] = useState<LichChay | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [lichChayToDelete, setLichChayToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedLichChay = loadFromLocalStorage<LichChay>("lichChay")
    const loadedTuyenXe = loadFromLocalStorage<TuyenXe>("tuyenXe")
    const loadedXeBuyt = loadFromLocalStorage<XeBuyt>("xeBuyt")

    // Sample data for tài xế
    const sampleTaiXe: TaiXe[] = [
      {
        ma_tai_xe: "TX001",
        ho_ten: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        cccd: "001201012345",
        so_dien_thoai: "0901234567",
        so_nam_kinh_nghiem: 5,
        ma_bang_lai: "B2-12345",
        ngay_cap_bang_lai: "2018-05-15",
      },
      {
        ma_tai_xe: "TX002",
        ho_ten: "Trần Thị B",
        email: "tranthib@example.com",
        cccd: "001201054321",
        so_dien_thoai: "0912345678",
        so_nam_kinh_nghiem: 3,
        ma_bang_lai: "B2-54321",
        ngay_cap_bang_lai: "2020-03-10",
      },
    ]
    setTaiXeList(sampleTaiXe)

    if (loadedTuyenXe.length > 0) {
      setTuyenXeList(loadedTuyenXe)
    }

    if (loadedXeBuyt.length > 0) {
      setXeBuytList(loadedXeBuyt)
    }

    if (loadedLichChay.length > 0) {
      setLichChayList(loadedLichChay)
    } else {
      // Initialize with sample data if no data exists
      const sampleData: LichChay[] = [
        {
          ma_lich_chay: "LC001",
          ngay_chay: "2023-05-15",
          gio_xuat_phat: "07:30",
          gio_ket_thuc: "09:30",
          ma_tai_xe: "TX001",
          bien_so_xe: "29A-12345",
          ma_tuyen: "TX001",
        },
        {
          ma_lich_chay: "LC002",
          ngay_chay: "2023-05-15",
          gio_xuat_phat: "10:00",
          gio_ket_thuc: "12:00",
          ma_tai_xe: "TX002",
          bien_so_xe: "29B-67890",
          ma_tuyen: "TX002",
        },
      ]
      setLichChayList(sampleData)
      saveToLocalStorage("lichChay", sampleData)
    }
  }, [])

  const handleAddLichChay = () => {
    // Validate form
    if (
      !newLichChay.ngay_chay ||
      !newLichChay.gio_xuat_phat ||
      !newLichChay.ma_tuyen ||
      !newLichChay.bien_so_xe ||
      !newLichChay.ma_tai_xe
    ) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc")
      return
    }

    setIsLoading(true)

    try {
      // Generate a unique ID for the new schedule
      const newId = `LC${String(lichChayList.length + 1).padStart(3, "0")}`
      const lichChayWithId = { ...newLichChay, ma_lich_chay: newId }

      const updatedList = [...lichChayList, lichChayWithId]
      setLichChayList(updatedList)
      saveToLocalStorage("lichChay", updatedList)
      setNewLichChay({
        ma_lich_chay: "",
        ngay_chay: "",
        gio_xuat_phat: "",
        gio_ket_thuc: "",
        ma_tai_xe: "",
        bien_so_xe: "",
        ma_tuyen: "",
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding schedule:", error)
      alert("Có lỗi xảy ra khi thêm lịch chạy. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditLichChay = () => {
    if (!editingLichChay) return

    const updatedList = lichChayList.map((item) =>
      item.ma_lich_chay === editingLichChay.ma_lich_chay ? editingLichChay : item,
    )

    setLichChayList(updatedList)
    saveToLocalStorage("lichChay", updatedList)
    setIsEditDialogOpen(false)
  }

  const handleDeleteLichChay = () => {
    if (!lichChayToDelete) return

    const updatedList = lichChayList.filter((item) => item.ma_lich_chay !== lichChayToDelete)

    setLichChayList(updatedList)
    saveToLocalStorage("lichChay", updatedList)
    setIsDeleteDialogOpen(false)
    setLichChayToDelete(null)
  }

  const filteredLichChay = lichChayList.filter(
    (item) =>
      item.ma_lich_chay.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ma_tuyen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bien_so_xe.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getTuyenXeName = (maTuyen: string) => {
    const tuyen = tuyenXeList.find((t) => t.ma_tuyen === maTuyen)
    return tuyen ? tuyen.ten_tuyen : maTuyen
  }

  const getTaiXeName = (maTaiXe: string) => {
    const taiXe = taiXeList.find((t) => t.ma_tai_xe === maTaiXe)
    return taiXe ? taiXe.ho_ten : maTaiXe
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Lịch Chạy</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm Lịch Chạy
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm lịch chạy..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Lịch Chạy</CardTitle>
          <CardDescription>Quản lý thông tin các lịch chạy xe buýt trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Lịch Chạy</TableHead>
                <TableHead>Ngày Chạy</TableHead>
                <TableHead>Giờ Xuất Phát</TableHead>
                <TableHead>Tuyến Xe</TableHead>
                <TableHead className="hidden md:table-cell">Biển Số Xe</TableHead>
                <TableHead className="hidden md:table-cell">Tài Xế</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLichChay.map((lichChay) => (
                <TableRow key={lichChay.ma_lich_chay}>
                  <TableCell className="font-medium">{lichChay.ma_lich_chay}</TableCell>
                  <TableCell>{formatDate(lichChay.ngay_chay)}</TableCell>
                  <TableCell>{lichChay.gio_xuat_phat}</TableCell>
                  <TableCell>{getTuyenXeName(lichChay.ma_tuyen)}</TableCell>
                  <TableCell className="hidden md:table-cell">{lichChay.bien_so_xe}</TableCell>
                  <TableCell className="hidden md:table-cell">{getTaiXeName(lichChay.ma_tai_xe)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingLichChay(lichChay)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setLichChayToDelete(lichChay.ma_lich_chay)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLichChay.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Không tìm thấy lịch chạy nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm Lịch Chạy Mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho lịch chạy mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ngay_chay" className="text-right">
                Ngày Chạy
              </Label>
              <Input
                id="ngay_chay"
                type="date"
                value={newLichChay.ngay_chay}
                onChange={(e) => setNewLichChay({ ...newLichChay, ngay_chay: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gio_xuat_phat" className="text-right">
                Giờ Xuất Phát
              </Label>
              <Input
                id="gio_xuat_phat"
                type="time"
                value={newLichChay.gio_xuat_phat}
                onChange={(e) => setNewLichChay({ ...newLichChay, gio_xuat_phat: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gio_ket_thuc" className="text-right">
                Giờ Kết Thúc
              </Label>
              <Input
                id="gio_ket_thuc"
                type="time"
                value={newLichChay.gio_ket_thuc}
                onChange={(e) => setNewLichChay({ ...newLichChay, gio_ket_thuc: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ma_tuyen" className="text-right">
                Tuyến Xe
              </Label>
              <Select
                value={newLichChay.ma_tuyen}
                onValueChange={(value) => setNewLichChay({ ...newLichChay, ma_tuyen: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn tuyến xe" />
                </SelectTrigger>
                <SelectContent>
                  {tuyenXeList.map((tuyen) => (
                    <SelectItem key={tuyen.ma_tuyen} value={tuyen.ma_tuyen}>
                      {tuyen.ten_tuyen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bien_so_xe" className="text-right">
                Xe Buýt
              </Label>
              <Select
                value={newLichChay.bien_so_xe}
                onValueChange={(value) => setNewLichChay({ ...newLichChay, bien_so_xe: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn xe buýt" />
                </SelectTrigger>
                <SelectContent>
                  {xeBuytList.map((xe) => (
                    <SelectItem key={xe.bien_so_xe} value={xe.bien_so_xe}>
                      {xe.bien_so_xe} - {xe.loai_xe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ma_tai_xe" className="text-right">
                Tài Xế
              </Label>
              <Select
                value={newLichChay.ma_tai_xe}
                onValueChange={(value) => setNewLichChay({ ...newLichChay, ma_tai_xe: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn tài xế" />
                </SelectTrigger>
                <SelectContent>
                  {taiXeList.map((taiXe) => (
                    <SelectItem key={taiXe.ma_tai_xe} value={taiXe.ma_tai_xe}>
                      {taiXe.ho_ten}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddLichChay} disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Lịch Chạy</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho lịch chạy</DialogDescription>
          </DialogHeader>
          {editingLichChay && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_lich_chay" className="text-right">
                  Mã Lịch Chạy
                </Label>
                <Input id="edit_ma_lich_chay" value={editingLichChay.ma_lich_chay} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ngay_chay" className="text-right">
                  Ngày Chạy
                </Label>
                <Input
                  id="edit_ngay_chay"
                  type="date"
                  value={editingLichChay.ngay_chay}
                  onChange={(e) =>
                    setEditingLichChay({
                      ...editingLichChay,
                      ngay_chay: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_gio_xuat_phat" className="text-right">
                  Giờ Xuất Phát
                </Label>
                <Input
                  id="edit_gio_xuat_phat"
                  type="time"
                  value={editingLichChay.gio_xuat_phat}
                  onChange={(e) =>
                    setEditingLichChay({
                      ...editingLichChay,
                      gio_xuat_phat: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_gio_ket_thuc" className="text-right">
                  Giờ Kết Thúc
                </Label>
                <Input
                  id="edit_gio_ket_thuc"
                  type="time"
                  value={editingLichChay.gio_ket_thuc}
                  onChange={(e) =>
                    setEditingLichChay({
                      ...editingLichChay,
                      gio_ket_thuc: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_tuyen" className="text-right">
                  Tuyến Xe
                </Label>
                <Select
                  value={editingLichChay.ma_tuyen}
                  onValueChange={(value) => setEditingLichChay({ ...editingLichChay, ma_tuyen: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn tuyến xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {tuyenXeList.map((tuyen) => (
                      <SelectItem key={tuyen.ma_tuyen} value={tuyen.ma_tuyen}>
                        {tuyen.ten_tuyen}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_bien_so_xe" className="text-right">
                  Xe Buýt
                </Label>
                <Select
                  value={editingLichChay.bien_so_xe}
                  onValueChange={(value) => setEditingLichChay({ ...editingLichChay, bien_so_xe: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn xe buýt" />
                  </SelectTrigger>
                  <SelectContent>
                    {xeBuytList.map((xe) => (
                      <SelectItem key={xe.bien_so_xe} value={xe.bien_so_xe}>
                        {xe.bien_so_xe} - {xe.loai_xe}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_tai_xe" className="text-right">
                  Tài Xế
                </Label>
                <Select
                  value={editingLichChay.ma_tai_xe}
                  onValueChange={(value) => setEditingLichChay({ ...editingLichChay, ma_tai_xe: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn tài xế" />
                  </SelectTrigger>
                  <SelectContent>
                    {taiXeList.map((taiXe) => (
                      <SelectItem key={taiXe.ma_tai_xe} value={taiXe.ma_tai_xe}>
                        {taiXe.ho_ten}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditLichChay}>Lưu Thay Đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa lịch chạy này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteLichChay}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
