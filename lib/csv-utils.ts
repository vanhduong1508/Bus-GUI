import Papa from "papaparse"

// Type definitions for our data models
export interface TuyenXe {
  ma_tuyen: string
  ten_tuyen: string
  mo_ta_hanh_trinh: string
}

export interface DiemDung {
  ma_diem_dung: string
  ten_diem_dung: string
  vi_tri: string
}

export interface TuyenXe_DiemDung {
  ma_tuyen: string
  ma_diem_dung: string
  thu_tu_diem_dung: number
}

export interface XeBuyt {
  bien_so_xe: string
  loai_xe: string
  suc_chua: number
}

export interface TaiXe {
  ma_tai_xe: string
  ho_ten: string
  email: string
  cccd: string
  so_dien_thoai: string
  so_nam_kinh_nghiem: number
  ma_bang_lai: string
  ngay_cap_bang_lai: string
}

export interface LichChay {
  ma_lich_chay: string
  ngay_chay: string
  gio_xuat_phat: string
  gio_ket_thuc: string
  ma_tai_xe: string
  bien_so_xe: string
  ma_tuyen: string
}

export interface HanhKhach {
  ma_hanh_khach: string
  ho_ten: string
  so_dien_thoai: string
  email: string
}

export interface VeXe {
  ma_ve: string
  so_ghe: string
  gia_tien: number
  ma_hanh_khach: string
  ma_lich_chay: string
  thoi_gian_dat: string
}

export interface PhanHoi {
  ma_phan_hoi: number
  ma_hanh_khach: string
  ngay_gui: string
  noi_dung: string
  ma_lich_chay: string | null
  ma_tuyen: string | null
}

export interface BaoTriXe {
  ma_bao_tri: number
  bien_so_xe: string
  ma_nhan_vien_ky_thuat: string
  ngay_thuc_hien: string
  noi_dung_sua_chua: string
  chi_phi: number
  ngay_du_kien_hoan_thanh: string
}

export interface TrangThaiHoatDongXe {
  ma_trang_thai_hd: number
  bien_so_xe: string
  trang_thai: string
  thoi_gian_cap_nhat: string
  ghi_chu: string
  ma_lich_chay: string | null
}

// Function to read CSV data from a file
export async function readCSVData<T>(filePath: string): Promise<T[]> {
  try {
    // In a browser environment, we need to fetch the file
    const response = await fetch(filePath)
    const csvText = await response.text()

    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically convert numeric values
    })

    return result.data as T[]
  } catch (error) {
    console.error(`Error reading CSV file ${filePath}:`, error)
    return []
  }
}

// Function to write data to a CSV file
export function writeCSVData<T>(data: T[], fileName: string): void {
  try {
    const csvString = Papa.unparse(data)

    // In a browser environment, we can trigger a download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error(`Error writing CSV file ${fileName}:`, error)
  }
}

// Function to save data to localStorage (as a fallback when file system is not available)
export function saveToLocalStorage<T>(key: string, data: T[]): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data))
    }
  } catch (error) {
    console.error(`Error saving data to localStorage with key ${key}:`, error)
  }
}

// Function to load data from localStorage
export function loadFromLocalStorage<T>(key: string): T[] {
  try {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    }
    return []
  } catch (error) {
    console.error(`Error loading data from localStorage with key ${key}:`, error)
    return []
  }
}
