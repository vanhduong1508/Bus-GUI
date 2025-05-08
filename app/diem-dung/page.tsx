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
import { type DiemDung, type TuyenXe, loadFromLocalStorage, saveToLocalStorage } from "@/lib/csv-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DiemDungPage() {
  const [diemDungList, setDiemDungList] = useState<DiemDung[]>([])
  const [tuyenXeList, setTuyenXeList] = useState<TuyenXe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newDiemDung, setNewDiemDung] = useState<DiemDung>({
    ma_diem_dung: "",
    ten_diem_dung: "",
    vi_tri: "",
  })
  const [selectedTuyen, setSelectedTuyen] = useState<string>("")
  const [editingDiemDung, setEditingDiemDung] = useState<DiemDung | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [diemDungToDelete, setDiemDungToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedDiemDung = loadFromLocalStorage<DiemDung>("diemDung")
    const loadedTuyenXe = loadFromLocalStorage<TuyenXe>("tuyenXe")

    if (loadedTuyenXe.length > 0) {
      setTuyenXeList(loadedTuyenXe)
    }

    if (loadedDiemDung.length > 0) {
      setDiemDungList(loadedDiemDung)
    } else {
      // Initialize with sample data if no data exists
      const sampleData: DiemDung[] = [
        {
          ma_diem_dung: "DD001",
          ten_diem_dung: "Bến xe Mỹ Đình",
          vi_tri: "Số 20 Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội",
        },
        {
          ma_diem_dung: "DD002",
          ten_diem_dung: "Bến xe Giáp Bát",
          vi_tri: "Số 5 Giải Phóng, Hoàng Mai, Hà Nội",
        },
        {
          ma_diem_dung: "DD003",
          ten_diem_dung: "Bến xe Nước Ngầm",
          vi_tri: "Số 1 Ngọc Hồi, Hoàng Mai, Hà Nội",
        },
        {
          ma_diem_dung: "DD004",
          ten_diem_dung: "Bến xe Yên Nghĩa",
          vi_tri: "Quốc lộ 6, Hà Đông, Hà Nội",
        },
      ]
      setDiemDungList(sampleData)
      saveToLocalStorage("diemDung", sampleData)
    }
  }, [])

  const handleAddDiemDung = () => {
    // Validate form
    if (!newDiemDung.ma_diem_dung || !newDiemDung.ten_diem_dung) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc (Mã điểm dừng và Tên điểm dừng)")
      return
    }

    // Check for duplicate ma_diem_dung
    if (diemDungList.some((item) => item.ma_diem_dung === newDiemDung.ma_diem_dung)) {
      alert("Mã điểm dừng đã tồn tại. Vui lòng chọn mã khác.")
      return
    }

    const updatedList = [...diemDungList, newDiemDung]
    setDiemDungList(updatedList)
    saveToLocalStorage("diemDung", updatedList)
    setNewDiemDung({
      ma_diem_dung: "",
      ten_diem_dung: "",
      vi_tri: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditDiemDung = () => {
    if (!editingDiemDung) return

    const updatedList = diemDungList.map((item) =>
      item.ma_diem_dung === editingDiemDung.ma_diem_dung ? editingDiemDung : item,
    )

    setDiemDungList(updatedList)
    saveToLocalStorage("diemDung", updatedList)
    setIsEditDialogOpen(false)
  }

  const handleDeleteDiemDung = () => {
    if (!diemDungToDelete) return

    const updatedList = diemDungList.filter((item) => item.ma_diem_dung !== diemDungToDelete)

    setDiemDungList(updatedList)
    saveToLocalStorage("diemDung", updatedList)
    setIsDeleteDialogOpen(false)
    setDiemDungToDelete(null)
  }

  const filteredDiemDung = diemDungList.filter(
    (item) =>
      (selectedTuyen === "" || true) && // Placeholder for tuyen filter - would need tuyen-diemdung relationship data
      (item.ma_diem_dung.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ten_diem_dung.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vi_tri.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Điểm Dừng</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm Điểm Dừng
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm điểm dừng..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={selectedTuyen} onValueChange={setSelectedTuyen}>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo tuyến xe" />
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Điểm Dừng</CardTitle>
          <CardDescription>Quản lý thông tin các điểm dừng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Điểm Dừng</TableHead>
                <TableHead>Tên Điểm Dừng</TableHead>
                <TableHead className="hidden md:table-cell">Vị Trí</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiemDung.map((diemDung) => (
                <TableRow key={diemDung.ma_diem_dung}>
                  <TableCell className="font-medium">{diemDung.ma_diem_dung}</TableCell>
                  <TableCell>{diemDung.ten_diem_dung}</TableCell>
                  <TableCell className="hidden md:table-cell">{diemDung.vi_tri}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingDiemDung(diemDung)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDiemDungToDelete(diemDung.ma_diem_dung)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDiemDung.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Không tìm thấy điểm dừng nào
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
            <DialogTitle>Thêm Điểm Dừng Mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho điểm dừng mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ma_diem_dung" className="text-right">
                Mã Điểm Dừng
              </Label>
              <Input
                id="ma_diem_dung"
                value={newDiemDung.ma_diem_dung}
                onChange={(e) => setNewDiemDung({ ...newDiemDung, ma_diem_dung: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ten_diem_dung" className="text-right">
                Tên Điểm Dừng
              </Label>
              <Input
                id="ten_diem_dung"
                value={newDiemDung.ten_diem_dung}
                onChange={(e) => setNewDiemDung({ ...newDiemDung, ten_diem_dung: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vi_tri" className="text-right">
                Vị Trí
              </Label>
              <Input
                id="vi_tri"
                value={newDiemDung.vi_tri}
                onChange={(e) => setNewDiemDung({ ...newDiemDung, vi_tri: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddDiemDung}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Điểm Dừng</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho điểm dừng</DialogDescription>
          </DialogHeader>
          {editingDiemDung && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_diem_dung" className="text-right">
                  Mã Điểm Dừng
                </Label>
                <Input id="edit_ma_diem_dung" value={editingDiemDung.ma_diem_dung} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ten_diem_dung" className="text-right">
                  Tên Điểm Dừng
                </Label>
                <Input
                  id="edit_ten_diem_dung"
                  value={editingDiemDung.ten_diem_dung}
                  onChange={(e) =>
                    setEditingDiemDung({
                      ...editingDiemDung,
                      ten_diem_dung: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_vi_tri" className="text-right">
                  Vị Trí
                </Label>
                <Input
                  id="edit_vi_tri"
                  value={editingDiemDung.vi_tri}
                  onChange={(e) =>
                    setEditingDiemDung({
                      ...editingDiemDung,
                      vi_tri: e.target.value,
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
            <Button onClick={handleEditDiemDung}>Lưu Thay Đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa điểm dừng này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteDiemDung}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
