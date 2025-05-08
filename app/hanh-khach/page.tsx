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
import { type HanhKhach, loadFromLocalStorage, saveToLocalStorage } from "@/lib/csv-utils"

export default function HanhKhachPage() {
  const [hanhKhachList, setHanhKhachList] = useState<HanhKhach[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newHanhKhach, setNewHanhKhach] = useState<HanhKhach>({
    ma_hanh_khach: "",
    ho_ten: "",
    so_dien_thoai: "",
    email: "",
  })
  const [editingHanhKhach, setEditingHanhKhach] = useState<HanhKhach | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [hanhKhachToDelete, setHanhKhachToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedData = loadFromLocalStorage<HanhKhach>("hanhKhach")
    if (loadedData.length > 0) {
      setHanhKhachList(loadedData)
    } else {
      // Initialize with sample data if no data exists
      const sampleData: HanhKhach[] = [
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
        {
          ma_hanh_khach: "HK003",
          ho_ten: "Nguyễn Văn E",
          so_dien_thoai: "0965432109",
          email: "nguyenvane@example.com",
        },
      ]
      setHanhKhachList(sampleData)
      saveToLocalStorage("hanhKhach", sampleData)
    }
  }, [])

  const handleAddHanhKhach = () => {
    // Generate a unique ID for the new passenger
    const newId = `HK${String(hanhKhachList.length + 1).padStart(3, "0")}`
    const hanhKhachWithId = { ...newHanhKhach, ma_hanh_khach: newId }

    const updatedList = [...hanhKhachList, hanhKhachWithId]
    setHanhKhachList(updatedList)
    saveToLocalStorage("hanhKhach", updatedList)
    setNewHanhKhach({
      ma_hanh_khach: "",
      ho_ten: "",
      so_dien_thoai: "",
      email: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditHanhKhach = () => {
    if (!editingHanhKhach) return

    const updatedList = hanhKhachList.map((item) =>
      item.ma_hanh_khach === editingHanhKhach.ma_hanh_khach ? editingHanhKhach : item,
    )

    setHanhKhachList(updatedList)
    saveToLocalStorage("hanhKhach", updatedList)
    setIsEditDialogOpen(false)
  }

  const handleDeleteHanhKhach = () => {
    if (!hanhKhachToDelete) return

    const updatedList = hanhKhachList.filter((item) => item.ma_hanh_khach !== hanhKhachToDelete)

    setHanhKhachList(updatedList)
    saveToLocalStorage("hanhKhach", updatedList)
    setIsDeleteDialogOpen(false)
    setHanhKhachToDelete(null)
  }

  const filteredHanhKhach = hanhKhachList.filter(
    (item) =>
      item.ma_hanh_khach.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.so_dien_thoai.includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Hành Khách</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm Hành Khách
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm hành khách..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Hành Khách</CardTitle>
          <CardDescription>Quản lý thông tin các hành khách trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Hành Khách</TableHead>
                <TableHead>Họ Tên</TableHead>
                <TableHead className="hidden md:table-cell">Số Điện Thoại</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHanhKhach.map((hanhKhach) => (
                <TableRow key={hanhKhach.ma_hanh_khach}>
                  <TableCell className="font-medium">{hanhKhach.ma_hanh_khach}</TableCell>
                  <TableCell>{hanhKhach.ho_ten}</TableCell>
                  <TableCell className="hidden md:table-cell">{hanhKhach.so_dien_thoai}</TableCell>
                  <TableCell className="hidden md:table-cell">{hanhKhach.email}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingHanhKhach(hanhKhach)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setHanhKhachToDelete(hanhKhach.ma_hanh_khach)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredHanhKhach.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Không tìm thấy hành khách nào
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
            <DialogTitle>Thêm Hành Khách Mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho hành khách mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ho_ten" className="text-right">
                Họ Tên
              </Label>
              <Input
                id="ho_ten"
                value={newHanhKhach.ho_ten}
                onChange={(e) => setNewHanhKhach({ ...newHanhKhach, ho_ten: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="so_dien_thoai" className="text-right">
                Số Điện Thoại
              </Label>
              <Input
                id="so_dien_thoai"
                value={newHanhKhach.so_dien_thoai}
                onChange={(e) => setNewHanhKhach({ ...newHanhKhach, so_dien_thoai: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newHanhKhach.email}
                onChange={(e) => setNewHanhKhach({ ...newHanhKhach, email: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddHanhKhach}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Hành Khách</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho hành khách</DialogDescription>
          </DialogHeader>
          {editingHanhKhach && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_hanh_khach" className="text-right">
                  Mã Hành Khách
                </Label>
                <Input id="edit_ma_hanh_khach" value={editingHanhKhach.ma_hanh_khach} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ho_ten" className="text-right">
                  Họ Tên
                </Label>
                <Input
                  id="edit_ho_ten"
                  value={editingHanhKhach.ho_ten}
                  onChange={(e) =>
                    setEditingHanhKhach({
                      ...editingHanhKhach,
                      ho_ten: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_so_dien_thoai" className="text-right">
                  Số Điện Thoại
                </Label>
                <Input
                  id="edit_so_dien_thoai"
                  value={editingHanhKhach.so_dien_thoai}
                  onChange={(e) =>
                    setEditingHanhKhach({
                      ...editingHanhKhach,
                      so_dien_thoai: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={editingHanhKhach.email}
                  onChange={(e) =>
                    setEditingHanhKhach({
                      ...editingHanhKhach,
                      email: e.target.value,
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
            <Button onClick={handleEditHanhKhach}>Lưu Thay Đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa hành khách này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteHanhKhach}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
