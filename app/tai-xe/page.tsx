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
import { type TaiXe, loadFromLocalStorage, saveToLocalStorage } from "@/lib/csv-utils"
import { Badge } from "@/components/ui/badge"

export default function TaiXePage() {
  const [taiXeList, setTaiXeList] = useState<TaiXe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newTaiXe, setNewTaiXe] = useState<TaiXe>({
    ma_tai_xe: "",
    ho_ten: "",
    email: "",
    cccd: "",
    so_dien_thoai: "",
    so_nam_kinh_nghiem: 0,
    ma_bang_lai: "",
    ngay_cap_bang_lai: "",
  })
  const [editingTaiXe, setEditingTaiXe] = useState<TaiXe | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [taiXeToDelete, setTaiXeToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedData = loadFromLocalStorage<TaiXe>("taiXe")
    if (loadedData.length > 0) {
      setTaiXeList(loadedData)
    } else {
      // Initialize with sample data if no data exists
      const sampleData: TaiXe[] = [
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
        {
          ma_tai_xe: "TX003",
          ho_ten: "Lê Văn C",
          email: "levanc@example.com",
          cccd: "001201098765",
          so_dien_thoai: "0923456789",
          so_nam_kinh_nghiem: 7,
          ma_bang_lai: "B2-98765",
          ngay_cap_bang_lai: "2016-08-20",
        },
      ]
      setTaiXeList(sampleData)
      saveToLocalStorage("taiXe", sampleData)
    }
  }, [])

  const handleAddTaiXe = () => {
    // Validate form
    if (!newTaiXe.ho_ten || !newTaiXe.cccd || !newTaiXe.so_dien_thoai) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc (Họ tên, CCCD, Số điện thoại)")
      return
    }

    // Generate a unique ID for the new driver
    const newId = `TX${String(taiXeList.length + 1).padStart(3, "0")}`
    const taiXeWithId = { ...newTaiXe, ma_tai_xe: newId }

    const updatedList = [...taiXeList, taiXeWithId]
    setTaiXeList(updatedList)
    saveToLocalStorage("taiXe", updatedList)
    setNewTaiXe({
      ma_tai_xe: "",
      ho_ten: "",
      email: "",
      cccd: "",
      so_dien_thoai: "",
      so_nam_kinh_nghiem: 0,
      ma_bang_lai: "",
      ngay_cap_bang_lai: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditTaiXe = () => {
    if (!editingTaiXe) return

    const updatedList = taiXeList.map((item) => (item.ma_tai_xe === editingTaiXe.ma_tai_xe ? editingTaiXe : item))

    setTaiXeList(updatedList)
    saveToLocalStorage("taiXe", updatedList)
    setIsEditDialogOpen(false)
  }

  const handleDeleteTaiXe = () => {
    if (!taiXeToDelete) return

    const updatedList = taiXeList.filter((item) => item.ma_tai_xe !== taiXeToDelete)

    setTaiXeList(updatedList)
    saveToLocalStorage("taiXe", updatedList)
    setIsDeleteDialogOpen(false)
    setTaiXeToDelete(null)
  }

  const filteredTaiXe = taiXeList.filter(
    (item) =>
      item.ma_tai_xe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.so_dien_thoai.includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Tài Xế</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm Tài Xế
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm tài xế..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Tài Xế</CardTitle>
          <CardDescription>Quản lý thông tin các tài xế trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Tài Xế</TableHead>
                <TableHead>Họ Tên</TableHead>
                <TableHead className="hidden md:table-cell">Số Điện Thoại</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Kinh Nghiệm</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTaiXe.map((taiXe) => (
                <TableRow key={taiXe.ma_tai_xe}>
                  <TableCell className="font-medium">{taiXe.ma_tai_xe}</TableCell>
                  <TableCell>{taiXe.ho_ten}</TableCell>
                  <TableCell className="hidden md:table-cell">{taiXe.so_dien_thoai}</TableCell>
                  <TableCell className="hidden md:table-cell">{taiXe.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {taiXe.so_nam_kinh_nghiem > 0 ? (
                      <Badge variant="outline">{taiXe.so_nam_kinh_nghiem} năm</Badge>
                    ) : (
                      "Chưa có"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingTaiXe(taiXe)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setTaiXeToDelete(taiXe.ma_tai_xe)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTaiXe.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Không tìm thấy tài xế nào
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
            <DialogTitle>Thêm Tài Xế Mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho tài xế mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ho_ten" className="text-right">
                Họ Tên
              </Label>
              <Input
                id="ho_ten"
                value={newTaiXe.ho_ten}
                onChange={(e) => setNewTaiXe({ ...newTaiXe, ho_ten: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cccd" className="text-right">
                CCCD
              </Label>
              <Input
                id="cccd"
                value={newTaiXe.cccd}
                onChange={(e) => setNewTaiXe({ ...newTaiXe, cccd: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="so_dien_thoai" className="text-right">
                Số Điện Thoại
              </Label>
              <Input
                id="so_dien_thoai"
                value={newTaiXe.so_dien_thoai}
                onChange={(e) => setNewTaiXe({ ...newTaiXe, so_dien_thoai: e.target.value })}
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
                value={newTaiXe.email}
                onChange={(e) => setNewTaiXe({ ...newTaiXe, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="so_nam_kinh_nghiem" className="text-right">
                Kinh Nghiệm (năm)
              </Label>
              <Input
                id="so_nam_kinh_nghiem"
                type="number"
                value={newTaiXe.so_nam_kinh_nghiem}
                onChange={(e) =>
                  setNewTaiXe({
                    ...newTaiXe,
                    so_nam_kinh_nghiem: Number.parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ma_bang_lai" className="text-right">
                Mã Bằng Lái
              </Label>
              <Input
                id="ma_bang_lai"
                value={newTaiXe.ma_bang_lai}
                onChange={(e) => setNewTaiXe({ ...newTaiXe, ma_bang_lai: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ngay_cap_bang_lai" className="text-right">
                Ngày Cấp
              </Label>
              <Input
                id="ngay_cap_bang_lai"
                type="date"
                value={newTaiXe.ngay_cap_bang_lai}
                onChange={(e) => setNewTaiXe({ ...newTaiXe, ngay_cap_bang_lai: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddTaiXe}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Tài Xế</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho tài xế</DialogDescription>
          </DialogHeader>
          {editingTaiXe && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_tai_xe" className="text-right">
                  Mã Tài Xế
                </Label>
                <Input id="edit_ma_tai_xe" value={editingTaiXe.ma_tai_xe} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ho_ten" className="text-right">
                  Họ Tên
                </Label>
                <Input
                  id="edit_ho_ten"
                  value={editingTaiXe.ho_ten}
                  onChange={(e) =>
                    setEditingTaiXe({
                      ...editingTaiXe,
                      ho_ten: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_cccd" className="text-right">
                  CCCD
                </Label>
                <Input
                  id="edit_cccd"
                  value={editingTaiXe.cccd}
                  onChange={(e) =>
                    setEditingTaiXe({
                      ...editingTaiXe,
                      cccd: e.target.value,
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
                  value={editingTaiXe.so_dien_thoai}
                  onChange={(e) =>
                    setEditingTaiXe({
                      ...editingTaiXe,
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
                  value={editingTaiXe.email}
                  onChange={(e) =>
                    setEditingTaiXe({
                      ...editingTaiXe,
                      email: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_so_nam_kinh_nghiem" className="text-right">
                  Kinh Nghiệm (năm)
                </Label>
                <Input
                  id="edit_so_nam_kinh_nghiem"
                  type="number"
                  value={editingTaiXe.so_nam_kinh_nghiem}
                  onChange={(e) =>
                    setEditingTaiXe({
                      ...editingTaiXe,
                      so_nam_kinh_nghiem: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ma_bang_lai" className="text-right">
                  Mã Bằng Lái
                </Label>
                <Input
                  id="edit_ma_bang_lai"
                  value={editingTaiXe.ma_bang_lai}
                  onChange={(e) =>
                    setEditingTaiXe({
                      ...editingTaiXe,
                      ma_bang_lai: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_ngay_cap_bang_lai" className="text-right">
                  Ngày Cấp
                </Label>
                <Input
                  id="edit_ngay_cap_bang_lai"
                  type="date"
                  value={editingTaiXe.ngay_cap_bang_lai}
                  onChange={(e) =>
                    setEditingTaiXe({
                      ...editingTaiXe,
                      ngay_cap_bang_lai: e.target.value,
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
            <Button onClick={handleEditTaiXe}>Lưu Thay Đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tài xế này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteTaiXe}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
