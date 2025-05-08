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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { type BaoTriXe, type XeBuyt, loadFromLocalStorage, saveToLocalStorage } from "@/lib/csv-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function BaoTriPage() {
  const [baoTriList, setBaoTriList] = useState<BaoTriXe[]>([])
  const [xeBuytList, setXeBuytList] = useState<XeBuyt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newBaoTri, setNewBaoTri] = useState<BaoTriXe>({
    ma_bao_tri: 0,
    bien_so_xe: "",
    ma_nhan_vien_ky_thuat: "",
    ngay_thuc_hien: new Date().toISOString().split("T")[0],
    noi_dung_sua_chua: "",
    chi_phi: 0,
    ngay_du_kien_hoan_thanh: "",
  })
  const [editingBaoTri, setEditingBaoTri] = useState<BaoTriXe | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [baoTriToDelete, setBaoTriToDelete] = useState<number | null>(null)

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedBaoTri = loadFromLocalStorage<BaoTriXe>("baoTri")
    const loadedXeBuyt = loadFromLocalStorage<XeBuyt>("xeBuyt")

    if (loadedXeBuyt.length > 0) {
      setXeBuytList(loadedXeBuyt)
    }

    if (loadedBaoTri.length > 0) {
      setBaoTriList(loadedBaoTri)
    } else {
      // Initialize with sample data if no data exists
      const sampleData: BaoTriXe[] = [
        {
          ma_bao_tri: 1,
          bien_so_xe: "29A-12345",
          ma_nhan_vien_ky_thuat: "NV001",
          ngay_thuc_hien: "2023-05-15",
          noi_dung_sua_chua: "Thay dầu động cơ, kiểm tra hệ thống phanh",
          chi_phi: 1500000,
          ngay_du_kien_hoan_thanh: "2023-05-16",
        },
        {
          ma_bao_tri: 2,
          bien_so_xe: "29B-67890",
          ma_nhan_vien_ky_thuat: "NV002",
          ngay_thuc_hien: "2023-05-18",
          noi_dung_sua_chua: "Sửa chữa hệ thống điều hòa, thay lọc gió",
          chi_phi: 2500000,
          ngay_du_kien_hoan_thanh: "2023-05-20",
        },
        {
          ma_bao_tri: 3,
          bien_so_xe: "29C-54321",
          ma_nhan_vien_ky_thuat: "NV001",
          ngay_thuc_hien: "2023-05-20",
          noi_dung_sua_chua: "Bảo dưỡng định kỳ 10.000km",
          chi_phi: 3000000,
          ngay_du_kien_hoan_thanh: "2023-05-21",
        },
      ]
      setBaoTriList(sampleData)
      saveToLocalStorage("baoTri", sampleData)
    }
  }, [])

  const handleAddBaoTri = () => {
    // Validate form
    if (!newBaoTri.bien_so_xe || !newBaoTri.ngay_thuc_hien || !newBaoTri.noi_dung_sua_chua) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc (Biển số xe, Ngày thực hiện, Nội dung sửa chữa)")
      return
    }

    // Generate a unique ID for the new maintenance record
    const newId = baoTriList.length > 0 ? Math.max(...baoTriList.map((item) => item.ma_bao_tri)) + 1 : 1
    const baoTriWithId = { ...newBaoTri, ma_bao_tri: newId }

    const updatedList = [...baoTriList, baoTriWithId]
    setBaoTriList(updatedList)
    saveToLocalStorage("baoTri", updatedList)
    setNewBaoTri({
      ma_bao_tri: 0,
      bien_so_xe: "",
      ma_nhan_vien_ky_thuat: "",
      ngay_thuc_hien: new Date().toISOString().split("T")[0],
      noi_dung_sua_chua: "",
      chi_phi: 0,
      ngay_du_kien_hoan_thanh: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditBaoTri = () => {
    if (!editingBaoTri) return

    const updatedList = baoTriList.map((item) => (item.ma_bao_tri === editingBaoTri.ma_bao_tri ? editingBaoTri : item))

    setBaoTriList(updatedList)
    saveToLocalStorage("baoTri", updatedList)
    setIsEditDialogOpen(false)
  }

  const handleDeleteBaoTri = () => {
    if (baoTriToDelete === null) return

    const updatedList = baoTriList.filter((item) => item.ma_bao_tri !== baoTriToDelete)

    setBaoTriList(updatedList)
    saveToLocalStorage("baoTri", updatedList)
    setIsDeleteDialogOpen(false)
    setBaoTriToDelete(null)
  }

  const filteredBaoTri = baoTriList.filter(
    (item) =>
      item.bien_so_xe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noi_dung_sua_chua.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ma_nhan_vien_ky_thuat.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Bảo Trì Xe</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm Bảo Trì
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm bảo trì..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Bảo Trì Xe</CardTitle>
          <CardDescription>Quản lý thông tin bảo trì và sửa chữa xe</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Bảo Trì</TableHead>
                <TableHead>Biển Số Xe</TableHead>
                <TableHead>Ngày Thực Hiện</TableHead>
                <TableHead className="hidden md:table-cell">Nội Dung</TableHead>
                <TableHead className="hidden md:table-cell">Chi Phí</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBaoTri.map((baoTri) => (
                <TableRow key={baoTri.ma_bao_tri}>
                  <TableCell className="font-medium">BT{String(baoTri.ma_bao_tri).padStart(3, "0")}</TableCell>
                  <TableCell>{baoTri.bien_so_xe}</TableCell>
                  <TableCell>{formatDate(baoTri.ngay_thuc_hien)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {baoTri.noi_dung_sua_chua.length > 50
                      ? `${baoTri.noi_dung_sua_chua.substring(0, 50)}...`
                      : baoTri.noi_dung_sua_chua}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatCurrency(baoTri.chi_phi)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingBaoTri(baoTri)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setBaoTriToDelete(baoTri.ma_bao_tri)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBaoTri.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Không tìm thấy bảo trì nào
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
            <DialogTitle>Thêm Bảo Trì Mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho bảo trì mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bien_so_xe" className="text-right">
                Biển Số Xe
              </Label>
              <Select
                value={newBaoTri.bien_so_xe}
                onValueChange={(value) => setNewBaoTri({ ...newBaoTri, bien_so_xe: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn xe" />
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
              <Label htmlFor="ma_nhan_vien_ky_thuat" className="text-right">
                Nhân Viên KT
              </Label>
              <Input
                id="ma_nhan_vien_ky_thuat"
                value={newBaoTri.ma_nhan_vien_ky_thuat}
                onChange={(e) => setNewBaoTri({ ...newBaoTri, ma_nhan_vien_ky_thuat: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ngay_thuc_hien" className="text-right">
                Ngày Thực Hiện
              </Label>
              <Input
                id="ngay_thuc_hien"
                type="date"
                value={newBaoTri.ngay_thuc_hien}
                onChange={(e) => setNewBaoTri({ ...newBaoTri, ngay_thuc_hien: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="noi_dung_sua_chua" className="text-right">
                Nội Dung
              </Label>
              <Textarea
                id="noi_dung_sua_chua"
                value={newBaoTri.noi_dung_sua_chua}
                onChange={(e) => setNewBaoTri({ ...newBaoTri, noi_dung_sua_chua: e.target.value })}
                className="col-span-3 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chi_phi" className="text-right">
                Chi Phí
              </Label>
              <Input
                id="chi_phi"
                type="number"
                value={newBaoTri.chi_phi}
                onChange={(e) => setNewBaoTri({ ...newBaoTri, chi_phi: Number.parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ngay_du_kien_hoan_thanh" className="text-right">
                Dự Kiến Hoàn Thành
              </Label>
              <Input
                id="ngay_du_kien_hoan_thanh"
                type="date"
                value={newBaoTri.ngay_du_kien_hoan_thanh}
                onChange={(e) => setNewBaoTri({ ...newBaoTri, ngay_du_kien_hoan_thanh: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddBaoTri}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Bảo Trì</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho bảo trì</DialogDescription>
          </DialogHeader>
          {editingBaoTri && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_bao_tri" className="text-right">
                  Mã Bảo Trì
                </Label>
                <Input
                  id="edit_ma_bao_tri"
                  value={`BT${String(editingBaoTri.ma_bao_tri).padStart(3, "0")}`}
                  disabled
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_bien_so_xe" className="text-right">
                  Biển Số Xe
                </Label>
                <Select
                  value={editingBaoTri.bien_so_xe}
                  onValueChange={(value) => setEditingBaoTri({ ...editingBaoTri, bien_so_xe: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn xe" />
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
                <Label htmlFor="edit_ma_nhan_vien_ky_thuat" className="text-right">
                  Nhân Viên KT
                </Label>
                <Input
                  id="edit_ma_nhan_vien_ky_thuat"
                  value={editingBaoTri.ma_nhan_vien_ky_thuat}
                  onChange={(e) =>
                    setEditingBaoTri({
                      ...editingBaoTri,
                      ma_nhan_vien_ky_thuat: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ngay_thuc_hien" className="text-right">
                  Ngày Thực Hiện
                </Label>
                <Input
                  id="edit_ngay_thuc_hien"
                  type="date"
                  value={editingBaoTri.ngay_thuc_hien}
                  onChange={(e) =>
                    setEditingBaoTri({
                      ...editingBaoTri,
                      ngay_thuc_hien: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_noi_dung_sua_chua" className="text-right">
                  Nội Dung
                </Label>
                <Textarea
                  id="edit_noi_dung_sua_chua"
                  value={editingBaoTri.noi_dung_sua_chua}
                  onChange={(e) =>
                    setEditingBaoTri({
                      ...editingBaoTri,
                      noi_dung_sua_chua: e.target.value,
                    })
                  }
                  className="col-span-3 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_chi_phi" className="text-right">
                  Chi Phí
                </Label>
                <Input
                  id="edit_chi_phi"
                  type="number"
                  value={editingBaoTri.chi_phi}
                  onChange={(e) =>
                    setEditingBaoTri({
                      ...editingBaoTri,
                      chi_phi: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ngay_du_kien_hoan_thanh" className="text-right">
                  Dự Kiến Hoàn Thành
                </Label>
                <Input
                  id="edit_ngay_du_kien_hoan_thanh"
                  type="date"
                  value={editingBaoTri.ngay_du_kien_hoan_thanh}
                  onChange={(e) =>
                    setEditingBaoTri({
                      ...editingBaoTri,
                      ngay_du_kien_hoan_thanh: e.target.value,
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
            <Button onClick={handleEditBaoTri}>Lưu Thay Đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bảo trì này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteBaoTri}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
