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
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react"
import { type PhanHoi, type HanhKhach, loadFromLocalStorage, saveToLocalStorage } from "@/lib/csv-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function PhanHoiPage() {
  const [phanHoiList, setPhanHoiList] = useState<PhanHoi[]>([])
  const [hanhKhachList, setHanhKhachList] = useState<HanhKhach[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newPhanHoi, setNewPhanHoi] = useState<PhanHoi>({
    ma_phan_hoi: 0,
    ma_hanh_khach: "",
    ngay_gui: new Date().toISOString(),
    noi_dung: "",
    ma_lich_chay: null,
    ma_tuyen: null,
  })
  const [viewingPhanHoi, setViewingPhanHoi] = useState<PhanHoi | null>(null)
  const [editingPhanHoi, setEditingPhanHoi] = useState<PhanHoi | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [phanHoiToDelete, setPhanHoiToDelete] = useState<number | null>(null)

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedPhanHoi = loadFromLocalStorage<PhanHoi>("phanHoi")

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

    if (loadedPhanHoi.length > 0) {
      setPhanHoiList(loadedPhanHoi)
    } else {
      // Initialize with sample data if no data exists
      const sampleData: PhanHoi[] = [
        {
          ma_phan_hoi: 1,
          ma_hanh_khach: "HK001",
          ngay_gui: "2023-05-10T08:30:00",
          noi_dung: "Tài xế rất thân thiện và lịch sự. Xe sạch sẽ và đúng giờ.",
          ma_lich_chay: "LC001",
          ma_tuyen: "TX001",
        },
        {
          ma_phan_hoi: 2,
          ma_hanh_khach: "HK002",
          ngay_gui: "2023-05-12T14:15:00",
          noi_dung: "Xe đến trễ 15 phút so với lịch trình. Mong công ty cải thiện vấn đề này.",
          ma_lich_chay: "LC002",
          ma_tuyen: "TX002",
        },
        {
          ma_phan_hoi: 3,
          ma_hanh_khach: "HK001",
          ngay_gui: "2023-05-14T10:45:00",
          noi_dung: "Điều hòa trên xe không hoạt động tốt. Rất nóng trong suốt hành trình.",
          ma_lich_chay: null,
          ma_tuyen: "TX001",
        },
      ]
      setPhanHoiList(sampleData)
      saveToLocalStorage("phanHoi", sampleData)
    }
  }, [])

  const handleAddPhanHoi = () => {
    // Validate form
    if (!newPhanHoi.ma_hanh_khach || !newPhanHoi.noi_dung) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc (Hành khách và Nội dung)")
      return
    }

    // Generate a unique ID for the new feedback
    const newId = phanHoiList.length > 0 ? Math.max(...phanHoiList.map((item) => item.ma_phan_hoi)) + 1 : 1
    const phanHoiWithId = { ...newPhanHoi, ma_phan_hoi: newId }

    const updatedList = [...phanHoiList, phanHoiWithId]
    setPhanHoiList(updatedList)
    saveToLocalStorage("phanHoi", updatedList)
    setNewPhanHoi({
      ma_phan_hoi: 0,
      ma_hanh_khach: "",
      ngay_gui: new Date().toISOString(),
      noi_dung: "",
      ma_lich_chay: null,
      ma_tuyen: null,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditPhanHoi = () => {
    if (!editingPhanHoi) return

    const updatedList = phanHoiList.map((item) =>
      item.ma_phan_hoi === editingPhanHoi.ma_phan_hoi ? editingPhanHoi : item,
    )

    setPhanHoiList(updatedList)
    saveToLocalStorage("phanHoi", updatedList)
    setIsEditDialogOpen(false)
  }

  const handleDeletePhanHoi = () => {
    if (phanHoiToDelete === null) return

    const updatedList = phanHoiList.filter((item) => item.ma_phan_hoi !== phanHoiToDelete)

    setPhanHoiList(updatedList)
    saveToLocalStorage("phanHoi", updatedList)
    setIsDeleteDialogOpen(false)
    setPhanHoiToDelete(null)
  }

  const filteredPhanHoi = phanHoiList.filter(
    (item) =>
      item.noi_dung.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ma_lich_chay && item.ma_lich_chay.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.ma_tuyen && item.ma_tuyen.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Phản Hồi</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm Phản Hồi
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm phản hồi..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Phản Hồi</CardTitle>
          <CardDescription>Quản lý thông tin phản hồi từ hành khách</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Phản Hồi</TableHead>
                <TableHead>Hành Khách</TableHead>
                <TableHead>Ngày Gửi</TableHead>
                <TableHead className="hidden md:table-cell">Nội Dung</TableHead>
                <TableHead className="hidden md:table-cell">Liên Quan</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPhanHoi.map((phanHoi) => (
                <TableRow key={phanHoi.ma_phan_hoi}>
                  <TableCell className="font-medium">PH{String(phanHoi.ma_phan_hoi).padStart(3, "0")}</TableCell>
                  <TableCell>{getHanhKhachName(phanHoi.ma_hanh_khach)}</TableCell>
                  <TableCell>{formatDate(phanHoi.ngay_gui)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {phanHoi.noi_dung.length > 50 ? `${phanHoi.noi_dung.substring(0, 50)}...` : phanHoi.noi_dung}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {phanHoi.ma_lich_chay && (
                      <Badge variant="outline" className="mr-1">
                        Lịch: {phanHoi.ma_lich_chay}
                      </Badge>
                    )}
                    {phanHoi.ma_tuyen && <Badge variant="outline">Tuyến: {phanHoi.ma_tuyen}</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setViewingPhanHoi(phanHoi)
                        setIsViewDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingPhanHoi(phanHoi)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setPhanHoiToDelete(phanHoi.ma_phan_hoi)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPhanHoi.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Không tìm thấy phản hồi nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi Tiết Phản Hồi</DialogTitle>
          </DialogHeader>
          {viewingPhanHoi && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Mã Phản Hồi</h3>
                <p>PH{String(viewingPhanHoi.ma_phan_hoi).padStart(3, "0")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Hành Khách</h3>
                <p>{getHanhKhachName(viewingPhanHoi.ma_hanh_khach)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Ngày Gửi</h3>
                <p>{formatDate(viewingPhanHoi.ngay_gui)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Nội Dung</h3>
                <p className="whitespace-pre-wrap">{viewingPhanHoi.noi_dung}</p>
              </div>
              {(viewingPhanHoi.ma_lich_chay || viewingPhanHoi.ma_tuyen) && (
                <div>
                  <h3 className="text-sm font-medium">Liên Quan</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {viewingPhanHoi.ma_lich_chay && (
                      <Badge variant="outline">Lịch: {viewingPhanHoi.ma_lich_chay}</Badge>
                    )}
                    {viewingPhanHoi.ma_tuyen && <Badge variant="outline">Tuyến: {viewingPhanHoi.ma_tuyen}</Badge>}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm Phản Hồi Mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho phản hồi mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ma_hanh_khach" className="text-right">
                Hành Khách
              </Label>
              <Select
                value={newPhanHoi.ma_hanh_khach}
                onValueChange={(value) => setNewPhanHoi({ ...newPhanHoi, ma_hanh_khach: value })}
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
              <Label htmlFor="noi_dung" className="text-right">
                Nội Dung
              </Label>
              <Textarea
                id="noi_dung"
                value={newPhanHoi.noi_dung}
                onChange={(e) => setNewPhanHoi({ ...newPhanHoi, noi_dung: e.target.value })}
                className="col-span-3 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ma_lich_chay" className="text-right">
                Mã Lịch Chạy
              </Label>
              <Input
                id="ma_lich_chay"
                value={newPhanHoi.ma_lich_chay || ""}
                onChange={(e) => setNewPhanHoi({ ...newPhanHoi, ma_lich_chay: e.target.value || null })}
                className="col-span-3"
                placeholder="Không bắt buộc"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ma_tuyen" className="text-right">
                Mã Tuyến
              </Label>
              <Input
                id="ma_tuyen"
                value={newPhanHoi.ma_tuyen || ""}
                onChange={(e) => setNewPhanHoi({ ...newPhanHoi, ma_tuyen: e.target.value || null })}
                className="col-span-3"
                placeholder="Không bắt buộc"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddPhanHoi}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Phản Hồi</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho phản hồi</DialogDescription>
          </DialogHeader>
          {editingPhanHoi && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_phan_hoi" className="text-right">
                  Mã Phản Hồi
                </Label>
                <Input
                  id="edit_ma_phan_hoi"
                  value={`PH${String(editingPhanHoi.ma_phan_hoi).padStart(3, "0")}`}
                  disabled
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_hanh_khach" className="text-right">
                  Hành Khách
                </Label>
                <Select
                  value={editingPhanHoi.ma_hanh_khach}
                  onValueChange={(value) => setEditingPhanHoi({ ...editingPhanHoi, ma_hanh_khach: value })}
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
                <Label htmlFor="edit_noi_dung" className="text-right">
                  Nội Dung
                </Label>
                <Textarea
                  id="edit_noi_dung"
                  value={editingPhanHoi.noi_dung}
                  onChange={(e) =>
                    setEditingPhanHoi({
                      ...editingPhanHoi,
                      noi_dung: e.target.value,
                    })
                  }
                  className="col-span-3 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_lich_chay" className="text-right">
                  Mã Lịch Chạy
                </Label>
                <Input
                  id="edit_ma_lich_chay"
                  value={editingPhanHoi.ma_lich_chay || ""}
                  onChange={(e) =>
                    setEditingPhanHoi({
                      ...editingPhanHoi,
                      ma_lich_chay: e.target.value || null,
                    })
                  }
                  className="col-span-3"
                  placeholder="Không bắt buộc"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_tuyen" className="text-right">
                  Mã Tuyến
                </Label>
                <Input
                  id="edit_ma_tuyen"
                  value={editingPhanHoi.ma_tuyen || ""}
                  onChange={(e) =>
                    setEditingPhanHoi({
                      ...editingPhanHoi,
                      ma_tuyen: e.target.value || null,
                    })
                  }
                  className="col-span-3"
                  placeholder="Không bắt buộc"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditPhanHoi}>Lưu Thay Đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phản hồi này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeletePhanHoi}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
