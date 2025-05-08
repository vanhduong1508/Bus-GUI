"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { AlertCircle, CheckCircle2, Download, Upload, RotateCcw, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CaiDatPage() {
  const { theme, setTheme } = useTheme()
  const [companyName, setCompanyName] = useState("Công ty Vận tải Xe Buýt")
  const [companyAddress, setCompanyAddress] = useState("123 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội")
  const [companyPhone, setCompanyPhone] = useState("024 1234 5678")
  const [companyEmail, setCompanyEmail] = useState("info@buscompany.com")
  const [companyWebsite, setCompanyWebsite] = useState("www.buscompany.com")
  const [taxCode, setTaxCode] = useState("0123456789")

  const [enableNotifications, setEnableNotifications] = useState(true)
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true)
  const [enableSmsNotifications, setEnableSmsNotifications] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")

  const [defaultCurrency, setDefaultCurrency] = useState("VND")
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY")
  const [timeFormat, setTimeFormat] = useState("24h")
  const [language, setLanguage] = useState("vi")

  const [isResetting, setIsResetting] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleSaveGeneral = () => {
    // Validate email
    if (companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) {
      toast({
        title: "Lỗi",
        description: "Email không hợp lệ. Vui lòng kiểm tra lại.",
        variant: "destructive",
      })
      return
    }

    // Validate phone
    if (companyPhone && !/^[0-9\s-+()]*$/.test(companyPhone)) {
      toast({
        title: "Lỗi",
        description: "Số điện thoại không hợp lệ. Vui lòng chỉ nhập số và các ký tự +, -, (), khoảng trắng.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Cài đặt đã được lưu",
      description: "Thông tin công ty đã được cập nhật thành công.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Cài đặt thông báo đã được lưu",
      description: "Cài đặt thông báo đã được cập nhật thành công.",
    })
  }

  const handleSavePreferences = () => {
    toast({
      title: "Tùy chọn đã được lưu",
      description: "Tùy chọn hiển thị đã được cập nhật thành công.",
    })
  }

  const handleExportData = () => {
    setIsExporting(true)

    toast({
      title: "Xuất dữ liệu",
      description: "Đang chuẩn bị xuất dữ liệu. Vui lòng đợi trong giây lát.",
    })

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Xuất dữ liệu thành công",
        description: "Dữ liệu đã được xuất thành công.",
      })
    }, 2000)
  }

  const handleImportData = () => {
    setIsImporting(true)

    // Create a file input element
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = ".csv,.json"

    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        const file = target.files[0]

        toast({
          title: "Nhập dữ liệu",
          description: `Đang xử lý file ${file.name}. Vui lòng đợi trong giây lát.`,
        })

        // Simulate import process
        setTimeout(() => {
          setIsImporting(false)
          toast({
            title: "Nhập dữ liệu thành công",
            description: `File ${file.name} đã được nhập thành công.`,
          })
        }, 2000)
      } else {
        setIsImporting(false)
      }
    }

    fileInput.click()
  }

  const handleBackupNow = () => {
    setIsBackingUp(true)

    toast({
      title: "Sao lưu dữ liệu",
      description: "Đang tiến hành sao lưu dữ liệu. Vui lòng đợi trong giây lát.",
    })

    // Simulate backup process
    setTimeout(() => {
      setIsBackingUp(false)
      toast({
        title: "Sao lưu thành công",
        description: "Dữ liệu đã được sao lưu thành công.",
      })
    }, 2000)
  }

  const handleResetSystem = () => {
    setShowResetConfirm(true)
  }

  const confirmReset = () => {
    setIsResetting(true)
    setShowResetConfirm(false)

    toast({
      title: "Đặt lại hệ thống",
      description: "Đang tiến hành đặt lại hệ thống. Vui lòng đợi trong giây lát.",
      variant: "destructive",
    })

    // Simulate reset process
    setTimeout(() => {
      setIsResetting(false)
      toast({
        title: "Đặt lại thành công",
        description: "Hệ thống đã được đặt lại về trạng thái ban đầu.",
      })

      // Reset all states to default
      setCompanyName("Công ty Vận tải Xe Buýt")
      setCompanyAddress("123 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội")
      setCompanyPhone("024 1234 5678")
      setCompanyEmail("info@buscompany.com")
      setCompanyWebsite("www.buscompany.com")
      setTaxCode("0123456789")
      setEnableNotifications(true)
      setEnableEmailNotifications(true)
      setEnableSmsNotifications(false)
      setAutoBackup(true)
      setBackupFrequency("daily")
      setDefaultCurrency("VND")
      setDateFormat("DD/MM/YYYY")
      setTimeFormat("24h")
      setLanguage("vi")
      setTheme("light")
    }, 3000)
  }

  const cancelReset = () => {
    setShowResetConfirm(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài Đặt Hệ Thống</h1>
        <p className="text-muted-foreground">Quản lý cài đặt và tùy chọn cho hệ thống quản lý xe buýt</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Thông Tin Chung</TabsTrigger>
          <TabsTrigger value="notifications">Thông Báo</TabsTrigger>
          <TabsTrigger value="preferences">Tùy Chọn Hiển Thị</TabsTrigger>
          <TabsTrigger value="data">Dữ Liệu & Sao Lưu</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Công Ty</CardTitle>
              <CardDescription>Cập nhật thông tin công ty vận tải của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Tên Công Ty</Label>
                  <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-code">Mã Số Thuế</Label>
                  <Input id="tax-code" value={taxCode} onChange={(e) => setTaxCode(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Địa Chỉ</Label>
                <Textarea
                  id="company-address"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Số Điện Thoại</Label>
                  <Input id="company-phone" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input
                    id="company-website"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>
                <Save className="mr-2 h-4 w-4" /> Lưu Thay Đổi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài Đặt Thông Báo</CardTitle>
              <CardDescription>Quản lý cách bạn nhận thông báo từ hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enable-notifications" className="flex flex-col space-y-1">
                  <span>Bật thông báo</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Nhận thông báo về các sự kiện quan trọng trong hệ thống
                  </span>
                </Label>
                <Switch
                  id="enable-notifications"
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enable-email-notifications" className="flex flex-col space-y-1">
                  <span>Thông báo qua email</span>
                  <span className="font-normal text-sm text-muted-foreground">Nhận thông báo qua email</span>
                </Label>
                <Switch
                  id="enable-email-notifications"
                  checked={enableEmailNotifications}
                  onCheckedChange={setEnableEmailNotifications}
                  disabled={!enableNotifications}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enable-sms-notifications" className="flex flex-col space-y-1">
                  <span>Thông báo qua SMS</span>
                  <span className="font-normal text-sm text-muted-foreground">Nhận thông báo qua tin nhắn SMS</span>
                </Label>
                <Switch
                  id="enable-sms-notifications"
                  checked={enableSmsNotifications}
                  onCheckedChange={setEnableSmsNotifications}
                  disabled={!enableNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-backup" className="flex flex-col space-y-1">
                  <span>Tự động sao lưu</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Tự động sao lưu dữ liệu theo lịch trình
                  </span>
                </Label>
                <Switch id="auto-backup" checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Tần suất sao lưu</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency} disabled={!autoBackup}>
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Chọn tần suất sao lưu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Hàng ngày</SelectItem>
                    <SelectItem value="weekly">Hàng tuần</SelectItem>
                    <SelectItem value="monthly">Hàng tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>
                <Save className="mr-2 h-4 w-4" /> Lưu Thay Đổi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tùy Chọn Hiển Thị</CardTitle>
              <CardDescription>Tùy chỉnh giao diện và định dạng hiển thị</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Giao Diện</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Chọn giao diện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Sáng</SelectItem>
                    <SelectItem value="dark">Tối</SelectItem>
                    <SelectItem value="system">Theo hệ thống</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Ngôn Ngữ</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Chọn ngôn ngữ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">Tiếng Anh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date-format">Định Dạng Ngày</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Chọn định dạng ngày" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-format">Định Dạng Giờ</Label>
                  <Select value={timeFormat} onValueChange={setTimeFormat}>
                    <SelectTrigger id="time-format">
                      <SelectValue placeholder="Chọn định dạng giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 giờ (AM/PM)</SelectItem>
                      <SelectItem value="24h">24 giờ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Đơn Vị Tiền Tệ</Label>
                  <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Chọn đơn vị tiền tệ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND (₫)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>
                <Save className="mr-2 h-4 w-4" /> Lưu Thay Đổi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quản Lý Dữ Liệu</CardTitle>
              <CardDescription>Xuất, nhập và sao lưu dữ liệu hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Xuất Dữ Liệu</h3>
                  <p className="text-sm text-muted-foreground">
                    Xuất toàn bộ dữ liệu hệ thống ra file CSV để lưu trữ hoặc xử lý bên ngoài
                  </p>
                  <Button onClick={handleExportData} className="w-full" disabled={isExporting}>
                    {isExporting ? (
                      "Đang xuất..."
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" /> Xuất Dữ Liệu
                      </>
                    )}
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Nhập Dữ Liệu</h3>
                  <p className="text-sm text-muted-foreground">Nhập dữ liệu từ file CSV vào hệ thống</p>
                  <Button onClick={handleImportData} className="w-full" disabled={isImporting}>
                    {isImporting ? (
                      "Đang nhập..."
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> Nhập Dữ Liệu
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Sao Lưu Dữ Liệu</h3>
                  <p className="text-sm text-muted-foreground">Tạo bản sao lưu dữ liệu hệ thống ngay lập tức</p>
                  <Button onClick={handleBackupNow} className="w-full" disabled={isBackingUp}>
                    {isBackingUp ? (
                      "Đang sao lưu..."
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Sao Lưu Ngay
                      </>
                    )}
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Đặt Lại Hệ Thống</h3>
                  <p className="text-sm text-muted-foreground">
                    Xóa toàn bộ dữ liệu và đặt lại hệ thống về trạng thái ban đầu
                  </p>
                  <Button variant="destructive" onClick={handleResetSystem} className="w-full" disabled={isResetting}>
                    {isResetting ? (
                      "Đang đặt lại..."
                    ) : (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" /> Đặt Lại Hệ Thống
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {showResetConfirm && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Xác nhận đặt lại hệ thống</AlertTitle>
                  <AlertDescription>
                    <p className="mb-4">
                      Bạn có chắc chắn muốn đặt lại hệ thống? Tất cả dữ liệu sẽ bị xóa và không thể khôi phục.
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="destructive" onClick={confirmReset}>
                        Xác nhận đặt lại
                      </Button>
                      <Button variant="outline" onClick={cancelReset}>
                        Hủy
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
