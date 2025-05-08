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
import { type XeBuyt, loadFromLocalStorage, saveToLocalStorage } from "@/lib/csv-utils"
import { Badge } from "@/components/ui/badge"

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

  // Simulated bus statuses
  const busStatuses: Record<string, string> = {
    "29A-12345": "dang_chay",
    "29B-67890": "san_sang",
    "29C-54321": "bao_tri",
  }

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadedData = loadFromLocalStorage<XeBuyt>("xeBuyt")
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
  }, [])

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

  const getStatusBadge = (status: string) => {
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
                <TableRow key={xeBuyt.bien_so_xe}>
                  <TableCell className="font-medium">{xeBuyt.bien_so_xe}</TableCell>
                  <TableCell>{xeBuyt.loai_xe}</TableCell>
                  <TableCell>{xeBuyt.suc_chua} chỗ</TableCell>
                  <TableCell>{getStatusBadge(busStatuses[xeBuyt.bien_so_xe] || "san_sang")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingXeBuyt(xeBuyt)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setXeBuytToDelete(xeBuyt.bien_so_xe)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
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
