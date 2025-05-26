"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Video, FileText, Calculator } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function LearningResources() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="theory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="theory">Lý thuyết</TabsTrigger>
          <TabsTrigger value="examples">Ví dụ</TabsTrigger>
          <TabsTrigger value="tips">Mẹo hay</TabsTrigger>
          <TabsTrigger value="glossary">Thuật ngữ</TabsTrigger>
        </TabsList>

        <TabsContent value="theory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Phương pháp Gauss-Jordan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="introduction">
                  <AccordionTrigger>Giới thiệu về phương pháp Gauss-Jordan</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p>
                      Phương pháp Gauss-Jordan là một thuật toán để giải hệ phương trình tuyến tính bằng cách biến đổi
                      ma trận hệ số thành dạng bậc thang rút gọn (Reduced Row Echelon Form - RREF).
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Mục tiêu:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Biến đổi ma trận về dạng bậc thang rút gọn</li>
                        <li>Tìm nghiệm của hệ phương trình tuyến tính</li>
                        <li>Xác định tính tương thích của hệ phương trình</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="steps">
                  <AccordionTrigger>Các bước thực hiện</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold">Bước 1: Tìm pivot</h4>
                        <p>Tìm phần tử khác 0 đầu tiên trong cột hiện tại (từ trên xuống dưới)</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold">Bước 2: Hoán đổi hàng (nếu cần)</h4>
                        <p>Đưa hàng chứa pivot lên vị trí thích hợp</p>
                      </div>
                      <div className="border-l-4 border-yellow-500 pl-4">
                        <h4 className="font-semibold">Bước 3: Chuẩn hóa pivot</h4>
                        <p>Chia hàng pivot cho giá trị pivot để pivot = 1</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold">Bước 4: Khử cột</h4>
                        <p>Làm cho tất cả phần tử khác trong cột pivot bằng 0</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="properties">
                  <AccordionTrigger>Tính chất của dạng bậc thang rút gọn</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      <li>• Tất cả hàng không (toàn số 0) ở dưới cùng</li>
                      <li>• Phần tử đầu tiên khác 0 của mỗi hàng (pivot) bằng 1</li>
                      <li>• Pivot của hàng dưới nằm bên phải pivot của hàng trên</li>
                      <li>• Tất cả phần tử khác trong cột chứa pivot đều bằng 0</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Ví dụ minh họa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-3">Ví dụ 1: Hệ có nghiệm duy nhất</h4>
                  <div className="space-y-2">
                    <p>Hệ phương trình:</p>
                    <div className="font-mono bg-white dark:bg-gray-900 p-3 rounded border">
                      2x + y - z = 8<br />
                      -3x - y + 2z = -11
                      <br />
                      -2x + y + 2z = -3
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ma trận mở rộng: [2 1 -1 | 8; -3 -1 2 | -11; -2 1 2 | -3]
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-3">Ví dụ 2: Hệ vô nghiệm</h4>
                  <div className="space-y-2">
                    <p>Hệ phương trình:</p>
                    <div className="font-mono bg-white dark:bg-gray-900 p-3 rounded border">
                      x + y = 1<br />x + y = 2
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sau khi khử sẽ có hàng [0 0 | 1] → vô nghiệm
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Mẹo và thủ thuật
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">💡 Chọn pivot tốt</h4>
                  <p>Luôn chọn phần tử có giá trị tuyệt đối lớn nhất làm pivot để giảm sai số tính toán.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">🔢 Làm việc với phân số</h4>
                  <p>Khi có thể, hãy làm việc với phân số thay vì số thập phân để tránh sai số làm tròn.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">⚡ Kiểm tra kết quả</h4>
                  <p>Luôn thay nghiệm vào phương trình gốc để kiểm tra tính đúng đắn.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                    🎯 Nhận biết trường hợp đặc biệt
                  </h4>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Hàng toàn 0 → có thể có vô số nghiệm</li>
                    <li>Hàng dạng [0 0 ... 0 | c] với c ≠ 0 → vô nghiệm</li>
                    <li>Số pivot = số ẩn → nghiệm duy nhất</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="glossary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Từ điển thuật ngữ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    term: "Pivot",
                    definition:
                      "Phần tử được chọn làm cơ sở cho các phép biến đổi hàng, thường là phần tử đầu tiên khác 0 trong hàng.",
                  },
                  {
                    term: "Ma trận mở rộng",
                    definition: "Ma trận được tạo bằng cách ghép ma trận hệ số với vector hằng số của hệ phương trình.",
                  },
                  {
                    term: "Dạng bậc thang (REF)",
                    definition:
                      "Dạng ma trận có các pivot tạo thành hình bậc thang, với các phần tử dưới pivot đều bằng 0.",
                  },
                  {
                    term: "Dạng bậc thang rút gọn (RREF)",
                    definition: "Dạng REF với các pivot đều bằng 1 và các phần tử khác trong cột pivot đều bằng 0.",
                  },
                  {
                    term: "Phép biến đổi hàng cơ bản",
                    definition:
                      "Ba loại phép biến đổi: hoán đổi hàng, nhân hàng với số khác 0, cộng bội số của hàng này vào hàng khác.",
                  },
                  {
                    term: "Hạng của ma trận",
                    definition: "Số lượng hàng khác 0 trong dạng bậc thang của ma trận.",
                  },
                ].map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">{item.term}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{item.definition}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
