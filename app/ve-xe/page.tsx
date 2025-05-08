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
import { Plus, Pencil, Trash2, Search, Download } from "lucide-react"
import {
  type VeXe,
  type LichChay,
  type HanhKhach,
  type TuyenXe,
  loadFromLocalStorage,
  saveToLocalStorage,
  writeCSVData,
} from "@/lib/csv-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function VeXePage() {
  const [veXeList, setVeXeList] = useState<VeXe[]>([])
  const [lichChayList, setLichChayList] = useState<LichChay[]>([])
  const [hanhKhachList, setHanhKhachList] = useState<HanhKhach[]>([])
  const [tuyenXeList, setTuyenXeList] = useState<TuyenXe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newVeXe, setNewVeXe] = useState<VeXe>({
    ma_ve: "",
    so_ghe: "",
    gia_tien: 0,
    ma_hanh_khach: "",
    ma_lich_chay: "",
    thoi_gian_dat: new Date().toISOString(),
  })
  const [editingVeXe, setEditingVeXe] = useState<VeXe | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [veXeToDelete, setVeXeToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedVeXe = loadFromLocalStorage<VeXe>("veXe")
    const loadedLichChay = loadFromLocalStorage<LichChay>("lichChay")
    const loadedTuyenXe = loadFromLocalStorage<TuyenXe>("tuyenXe")

    // Sample data for hành khách
    const sampleHanhKhach: HanhKhach[] = [
      {
        ma_hanh_khach: "HK001",
        ho_ten: "Lê Văn C",
        so_dien_thoai: "0987654321",
        email: "levanc@example.com",
      },
      {
        ma_hanh_khach: "HK002",
        ho_ten: "Phạm Thị D",
        so_dien_thoai: "0976543210",
        email: "phamthid@example.com",
      },
    ]
    setHanhKhachList(sampleHanhKhach)

    if (loadedLichChay.length > 0) {
      setLichChayList(loadedLichChay)
    }

    if (loadedTuyenXe.length > 0) {
      setTuyenXeList(loadedTuyenXe)
    }

    if (loadedVeXe.length > 0) {
      setVeXeList(loadedVeXe)
    } else {
      // Initialize with sample data if no data exists
      const sampleData: VeXe[] = [
        {
          ma_ve: "VE001",
          so_ghe: "A01",
          gia_tien: 50000,
          ma_hanh_khach: "HK001",
          ma_lich_chay: "LC001",
          thoi_gian_dat: "2023-05-14T10:30:00",
        },
        {
          ma_ve: "VE002",
          so_ghe: "B05",
          gia_tien: 50000,
          ma_hanh_khach: "HK002",
          ma_lich_chay: "LC002",
          thoi_gian_dat: "2023-05-14T14:15:00",
        },
      ]
      setVeXeList(sampleData)
      saveToLocalStorage("veXe", sampleData)
    }
  }, [])

  const handleAddVeXe = () => {
    // Generate a unique ID for the new ticket
    const newId = `VE${String(veXeList.length + 1).padStart(3, "0")}`
    const veXeWithId = { ...newVeXe, ma_ve: newId }

    const updatedList = [...veXeList, veXeWithId]
    setVeXeList(updatedList)
    saveToLocalStorage("veXe", updatedList)
    setNewVeXe({
      ma_ve: "",
      so_ghe: "",
      gia_tien: 0,
      ma_hanh_khach: "",
      ma_lich_chay: "",
      thoi_gian_dat: new Date().toISOString(),
    })
    setIsAddDialogOpen(false)
  }

  const handleEditVeXe = () => {
    if (!editingVeXe) return

    const updatedList = veXeList.map((item) => (item.ma_ve === editingVeXe.ma_ve ? editingVeXe : item))

    setVeXeList(updatedList)
    saveToLocalStorage("veXe", updatedList)
    setIsEditDialogOpen(false)
  }

  const handleDeleteVeXe = () => {
    if (!veXeToDelete) return

    const updatedList = veXeList.filter((item) => item.ma_ve !== veXeToDelete)

    setVeXeList(updatedList)
    saveToLocalStorage("veXe", updatedList)
    setIsDeleteDialogOpen(false)
    setVeXeToDelete(null)
  }

  const handleExportCSV = () => {
    try {
      if (veXeList.length === 0) {
        alert("Không có dữ liệu để xuất")
        return
      }
      writeCSVData(veXeList, "ve-xe.csv")
    } catch (error) {
      console.error("Error exporting CSV:", error)
      alert("Có lỗi xảy ra khi xuất file CSV. Vui lòng thử lại.")
    }
  }

  const filteredVeXe = veXeList.filter(
    (item) =>
      item.ma_ve.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ma_lich_chay.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ma_hanh_khach.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getLichChayInfo = (maLichChay: string) => {
    const lichChay = lichChayList.find((lc) => lc.ma_lich_chay === maLichChay)
    if (!lichChay) return maLichChay

    const tuyen = tuyenXeList.find((t) => t.ma_tuyen === lichChay.ma_tuyen)
    const tuyenName = tuyen ? tuyen.ten_tuyen : lichChay.ma_tuyen

    return `${formatDate(lichChay.ngay_chay)} ${lichChay.gio_xuat_phat} - ${tuyenName}`
  }

  const getHanhKhachName = (maHanhKhach: string) => {
    const hanhKhach = hanhKhachList.find((hk) => hk.ma_hanh_khach === maHanhKhach)
    return hanhKhach ? hanhKhach.ho_ten : maHanhKhach
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return dateString
      }
      return format(date, "dd/MM/yyyy", { locale: vi })
    } catch (error) {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Vé Xe</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Xuất CSV
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Thêm Vé Xe
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm vé xe..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Vé Xe</CardTitle>
          <CardDescription>Quản lý thông tin các vé xe đã bán</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Vé</TableHead>
                <TableHead>Số Ghế</TableHead>
                <TableHead>Giá Tiền</TableHead>
                <TableHead>Hành Khách</TableHead>
                <TableHead className="hidden md:table-cell">Lịch Chạy</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVeXe.map((veXe) => (
                <TableRow key={veXe.ma_ve}>
                  <TableCell className="font-medium">{veXe.ma_ve}</TableCell>
                  <TableCell>{veXe.so_ghe}</TableCell>
                  <TableCell>{formatCurrency(veXe.gia_tien)}</TableCell>
                  <TableCell>{getHanhKhachName(veXe.ma_hanh_khach)}</TableCell>
                  <TableCell className="hidden md:table-cell">{getLichChayInfo(veXe.ma_lich_chay)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingVeXe(veXe)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setVeXeToDelete(veXe.ma_ve)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVeXe.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Không tìm thấy vé xe nào
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
            <DialogTitle>Thêm Vé Xe Mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho vé xe mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="so_ghe" className="text-right">
                Số Ghế
              </Label>
              <Input
                id="so_ghe"
                value={newVeXe.so_ghe}
                onChange={(e) => setNewVeXe({ ...newVeXe, so_ghe: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gia_tien" className="text-right">
                Giá Tiền
              </Label>
              <Input
                id="gia_tien"
                type="number"
                value={newVeXe.gia_tien}
                onChange={(e) => setNewVeXe({ ...newVeXe, gia_tien: Number.parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ma_hanh_khach" className="text-right">
                Hành Khách
              </Label>
              <Select
                value={newVeXe.ma_hanh_khach}
                onValueChange={(value) => setNewVeXe({ ...newVeXe, ma_hanh_khach: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn hành khách" />
                </SelectTrigger>
                <SelectContent>
                  {hanhKhachList.map((hk) => (
                    <SelectItem key={hk.ma_hanh_khach} value={hk.ma_hanh_khach}>
                      {hk.ho_ten} - {hk.so_dien_thoai}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ma_lich_chay" className="text-right">
                Lịch Chạy
              </Label>
              <Select
                value={newVeXe.ma_lich_chay}
                onValueChange={(value) => setNewVeXe({ ...newVeXe, ma_lich_chay: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn lịch chạy" />
                </SelectTrigger>
                <SelectContent>
                  {lichChayList.map((lc) => (
                    <SelectItem key={lc.ma_lich_chay} value={lc.ma_lich_chay}>
                      {getLichChayInfo(lc.ma_lich_chay)}
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
            <Button onClick={handleAddVeXe}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Vé Xe</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho vé xe</DialogDescription>
          </DialogHeader>
          {editingVeXe && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_ve" className="text-right">
                  Mã Vé
                </Label>
                <Input id="edit_ma_ve" value={editingVeXe.ma_ve} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_so_ghe" className="text-right">
                  Số Ghế
                </Label>
                <Input
                  id="edit_so_ghe"
                  value={editingVeXe.so_ghe}
                  onChange={(e) =>
                    setEditingVeXe({
                      ...editingVeXe,
                      so_ghe: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_gia_tien" className="text-right">
                  Giá Tiền
                </Label>
                <Input
                  id="edit_gia_tien"
                  type="number"
                  value={editingVeXe.gia_tien}
                  onChange={(e) =>
                    setEditingVeXe({
                      ...editingVeXe,
                      gia_tien: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_hanh_khach" className="text-right">
                  Hành Khách
                </Label>
                <Select
                  value={editingVeXe.ma_hanh_khach}
                  onValueChange={(value) => setEditingVeXe({ ...editingVeXe, ma_hanh_khach: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn hành khách" />
                  </SelectTrigger>
                  <SelectContent>
                    {hanhKhachList.map((hk) => (
                      <SelectItem key={hk.ma_hanh_khach} value={hk.ma_hanh_khach}>
                        {hk.ho_ten} - {hk.so_dien_thoai}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_lich_chay" className="text-right">
                  Lịch Chạy
                </Label>
                <Select
                  value={editingVeXe.ma_lich_chay}
                  onValueChange={(value) => setEditingVeXe({ ...editingVeXe, ma_lich_chay: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn lịch chạy" />
                  </SelectTrigger>
                  <SelectContent>
                    {lichChayList.map((lc) => (
                      <SelectItem key={lc.ma_lich_chay} value={lc.ma_lich_chay}>
                        {getLichChayInfo(lc.ma_lich_chay)}
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
            <Button onClick={handleEditVeXe}>Lưu Thay Đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa vé xe này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteVeXe}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
