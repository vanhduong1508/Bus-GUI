import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LichChay, TuyenXe } from "@/lib/csv-utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Bus, Calendar, Clock, MapPin } from "lucide-react"

interface XeBuytStatusDetailProps {
  bienSoXe: string
  trangThai: string
  maLichChay?: string | null
  lichChayList: LichChay[]
  tuyenXeList: TuyenXe[]
}

export function XeBuytStatusDetail({
  bienSoXe,
  trangThai,
  maLichChay,
  lichChayList,
  tuyenXeList,
}: XeBuytStatusDetailProps) {
  // Nếu không có mã lịch chạy hoặc không phải đang chạy, không hiển thị chi tiết
  if (!maLichChay || trangThai !== "dang_chay") {
    return null
  }

  // Tìm thông tin lịch chạy
  const lichChay = lichChayList.find((lc) => lc.ma_lich_chay === maLichChay)
  if (!lichChay) return null

  // Tìm thông tin tuyến xe
  const tuyenXe = tuyenXeList.find((tx) => tx.ma_tuyen === lichChay.ma_tuyen)

  // Format ngày và giờ
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi })
    } catch (error) {
      return dateString
    }
  }

  return (
    <Card className="mt-2 bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Bus className="mr-2 h-4 w-4" />
          Thông tin lịch chạy hiện tại: {bienSoXe}
        </CardTitle>
        <CardDescription>Xe đang thực hiện lịch chạy {maLichChay}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Ngày: {formatDate(lichChay.ngay_chay)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              Giờ: {lichChay.gio_xuat_phat} - {lichChay.gio_ket_thuc}
            </span>
          </div>
          <div className="flex items-center md:col-span-2">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Tuyến: {tuyenXe ? tuyenXe.ten_tuyen : lichChay.ma_tuyen}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
