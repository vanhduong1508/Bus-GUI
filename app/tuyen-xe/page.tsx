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
import { type TuyenXe, loadFromLocalStorage, saveToLocalStorage } from "@/lib/csv-utils"

export default function TuyenXePage() {
  const [tuyenXeList, setTuyenXeList] = useState<TuyenXe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newTuyenXe, setNewTuyenXe] = useState<TuyenXe>({
    ma_tuyen: "",
    ten_tuyen: "",
    mo_ta_hanh_trinh: "",
  })
  const [editingTuyenXe, setEditingTuyenXe] = useState<TuyenXe | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tuyenXeToDelete, setTuyenXeToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedData = loadFromLocalStorage<TuyenXe>("tuyenXe")
    if (loadedData.length > 0) {
      setTuyenXeList(loadedData)
    } else {
      // Initialize with sample data if no data exists
      const sampleData: TuyenXe[] = [
        {
          ma_tuyen: "TX001",
          ten_tuyen: "Bến xe Mỹ Đình - Bến xe Giáp Bát",
          mo_ta_hanh_trinh: "Đi qua các tuyến đường chính: Phạm Hùng, Nguyễn Trãi, Trường Chinh, Giải Phóng",
        },
        {
          ma_tuyen: "TX002",
          ten_tuyen: "Bến xe Nước Ngầm - Bến xe Yên Nghĩa",
          mo_ta_hanh_trinh: "Đi qua các tuyến đường: Giải Phóng, Trường Chinh, Quang Trung, Hà Đông",
        },
        {
          ma_tuyen: "TX003",
          ten_tuyen: "Bến xe Mỹ Đình - Bến xe Nước Ngầm",
          mo_ta_hanh_trinh: "Đi qua các tuyến đường: Phạm Hùng, Nguyễn Trãi, Trường Chinh, Giải Phóng",
        },
      ]
      setTuyenXeList(sampleData)
      saveToLocalStorage("tuyenXe", sampleData)
    }
  }, [])

  const handleAddTuyenXe = () => {
    // Validate form
    if (!newTuyenXe.ma_tuyen || !newTuyenXe.ten_tuyen) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc (Mã tuyến và Tên tuyến)")
      return
    }

    // Check for duplicate ma_tuyen
    if (tuyenXeList.some((item) => item.ma_tuyen === newTuyenXe.ma_tuyen)) {
      alert("Mã tuyến đã tồn tại. Vui lòng chọn mã tuyến khác.")
      return
    }

    const updatedList = [...tuyenXeList, newTuyenXe]
    setTuyenXeList(updatedList)
    saveToLocalStorage("tuyenXe", updatedList)
    setNewTuyenXe({
      ma_tuyen: "",
      ten_tuyen: "",
      mo_ta_hanh_trinh: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditTuyenXe = () => {
    if (!editingTuyenXe) return

    const updatedList = tuyenXeList.map((item) => (item.ma_tuyen === editingTuyenXe.ma_tuyen ? editingTuyenXe : item))

    setTuyenXeList(updatedList)
    saveToLocalStorage("tuyenXe", updatedList)
    setIsEditDialogOpen(false)
  }

  const handleDeleteTuyenXe = () => {
    if (!tuyenXeToDelete) return

    const updatedList = tuyenXeList.filter((item) => item.ma_tuyen !== tuyenXeToDelete)

    setTuyenXeList(updatedList)
    saveToLocalStorage("tuyenXe", updatedList)
    setIsDeleteDialogOpen(false)
    setTuyenXeToDelete(null)
  }

  const filteredTuyenXe = tuyenXeList.filter(
    (item) =>
      item.ma_tuyen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ten_tuyen.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Tuyến Xe</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm Tuyến Xe
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm tuyến xe..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Tuyến Xe</CardTitle>
          <CardDescription>Quản lý thông tin các tuyến xe buýt trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Tuyến</TableHead>
                <TableHead>Tên Tuyến</TableHead>
                <TableHead className="hidden md:table-cell">Mô Tả Hành Trình</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTuyenXe.map((tuyenXe) => (
                <TableRow key={tuyenXe.ma_tuyen}>
                  <TableCell className="font-medium">{tuyenXe.ma_tuyen}</TableCell>
                  <TableCell>{tuyenXe.ten_tuyen}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tuyenXe.mo_ta_hanh_trinh.length > 100
                      ? `${tuyenXe.mo_ta_hanh_trinh.substring(0, 100)}...`
                      : tuyenXe.mo_ta_hanh_trinh}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingTuyenXe(tuyenXe)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setTuyenXeToDelete(tuyenXe.ma_tuyen)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTuyenXe.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Không tìm thấy tuyến xe nào
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
            <DialogTitle>Thêm Tuyến Xe Mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho tuyến xe mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ma_tuyen" className="text-right">
                Mã Tuyến
              </Label>
              <Input
                id="ma_tuyen"
                value={newTuyenXe.ma_tuyen}
                onChange={(e) => setNewTuyenXe({ ...newTuyenXe, ma_tuyen: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ten_tuyen" className="text-right">
                Tên Tuyến
              </Label>
              <Input
                id="ten_tuyen"
                value={newTuyenXe.ten_tuyen}
                onChange={(e) => setNewTuyenXe({ ...newTuyenXe, ten_tuyen: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mo_ta_hanh_trinh" className="text-right">
                Mô Tả Hành Trình
              </Label>
              <Textarea
                id="mo_ta_hanh_trinh"
                value={newTuyenXe.mo_ta_hanh_trinh}
                onChange={(e) =>
                  setNewTuyenXe({
                    ...newTuyenXe,
                    mo_ta_hanh_trinh: e.target.value,
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
            <Button onClick={handleAddTuyenXe}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Tuyến Xe</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho tuyến xe</DialogDescription>
          </DialogHeader>
          {editingTuyenXe && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_tuyen" className="text-right">
                  Mã Tuyến
                </Label>
                <Input id="edit_ma_tuyen" value={editingTuyenXe.ma_tuyen} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ten_tuyen" className="text-right">
                  Tên Tuyến
                </Label>
                <Input
                  id="edit_ten_tuyen"
                  value={editingTuyenXe.ten_tuyen}
                  onChange={(e) =>
                    setEditingTuyenXe({
                      ...editingTuyenXe,
                      ten_tuyen: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_mo_ta_hanh_trinh" className="text-right">
                  Mô Tả Hành Trình
                </Label>
                <Textarea
                  id="edit_mo_ta_hanh_trinh"
                  value={editingTuyenXe.mo_ta_hanh_trinh}
                  onChange={(e) =>
                    setEditingTuyenXe({
                      ...editingTuyenXe,
                      mo_ta_hanh_trinh: e.target.value,
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
            <Button onClick={handleEditTuyenXe}>Lưu Thay Đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tuyến xe này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteTuyenXe}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
