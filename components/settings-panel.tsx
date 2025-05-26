"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, RotateCcw } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    showFractions: true,
    showDecimals: true,
    precision: 3,
    animationSpeed: 1000,
    autoPlay: false,
    highlightPivot: true,
    showStepExplanations: true,
    darkMode: false,
    language: "vi",
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "gauss-jordan-settings.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const resetSettings = () => {
    setSettings({
      showFractions: true,
      showDecimals: true,
      precision: 3,
      animationSpeed: 1000,
      autoPlay: false,
      highlightPivot: true,
      showStepExplanations: true,
      darkMode: false,
      language: "vi",
    })
  }

  return (
    <div className="space-y-6">
      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt hiển thị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Hiển thị phân số</Label>
              <p className="text-sm text-gray-500">Hiển thị kết quả dưới dạng phân số khi có thể</p>
            </div>
            <Switch
              checked={settings.showFractions}
              onCheckedChange={(value) => updateSetting("showFractions", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Hiển thị số thập phân</Label>
              <p className="text-sm text-gray-500">Hiển thị kết quả dưới dạng số thập phân</p>
            </div>
            <Switch checked={settings.showDecimals} onCheckedChange={(value) => updateSetting("showDecimals", value)} />
          </div>

          <div className="space-y-3">
            <Label>Độ chính xác ({settings.precision} chữ số)</Label>
            <Slider
              value={[settings.precision]}
              onValueChange={(value) => updateSetting("precision", value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Ngôn ngữ</Label>
            <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Animation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt animation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Tốc độ animation ({settings.animationSpeed}ms)</Label>
            <Slider
              value={[settings.animationSpeed]}
              onValueChange={(value) => updateSetting("animationSpeed", value[0])}
              max={3000}
              min={250}
              step={250}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Nhanh (250ms)</span>
              <span>Chậm (3000ms)</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Tự động phát</Label>
              <p className="text-sm text-gray-500">Tự động chuyển sang bước tiếp theo</p>
            </div>
            <Switch checked={settings.autoPlay} onCheckedChange={(value) => updateSetting("autoPlay", value)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Làm nổi bật pivot</Label>
              <p className="text-sm text-gray-500">Tô màu phần tử pivot và các hàng/cột liên quan</p>
            </div>
            <Switch
              checked={settings.highlightPivot}
              onCheckedChange={(value) => updateSetting("highlightPivot", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Learning Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt học tập</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Hiển thị giải thích từng bước</Label>
              <p className="text-sm text-gray-500">Hiển thị mô tả chi tiết cho mỗi phép biến đổi</p>
            </div>
            <Switch
              checked={settings.showStepExplanations}
              onCheckedChange={(value) => updateSetting("showStepExplanations", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Export/Import Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lý cài đặt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={exportSettings} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Xuất cài đặt
            </Button>
            <Button onClick={resetSettings} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt lại mặc định
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Cài đặt hiện tại</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Phân số: {settings.showFractions ? "Bật" : "Tắt"}</Badge>
              <Badge variant="secondary">Độ chính xác: {settings.precision}</Badge>
              <Badge variant="secondary">Tốc độ: {settings.animationSpeed}ms</Badge>
              <Badge variant="secondary">Ngôn ngữ: {settings.language === "vi" ? "Tiếng Việt" : "English"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin hiệu suất</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="font-semibold text-green-700 dark:text-green-300">Tốc độ tính toán</div>
              <div className="text-green-600 dark:text-green-400">Tối ưu</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="font-semibold text-blue-700 dark:text-blue-300">Bộ nhớ sử dụng</div>
              <div className="text-blue-600 dark:text-blue-400">Thấp</div>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Ứng dụng được tối ưu hóa để chạy mượt mà trên mọi thiết bị. Giảm tốc độ animation nếu gặp vấn đề về hiệu
            suất.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
