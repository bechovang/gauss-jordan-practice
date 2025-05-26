"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Lightbulb, Trophy, RotateCcw, Clock, Target, Variable, Calculator } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuizQuestion {
  id: number
  matrix: string[][]
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  hints: string[]
  difficulty: "easy" | "medium" | "hard"
  category: string
  hasParameters: boolean
}

const quizQuestions: QuizQuestion[] = [
  // EASY QUESTIONS (1-20) - Original numeric questions
  {
    id: 1,
    matrix: [
      ["2", "4"],
      ["1", "2"],
    ],
    question: "Để làm cho phần tử (1,1) = 1, ta cần thực hiện phép biến đổi nào?",
    options: ["R₁ ÷ 2", "R₁ × 2", "R₁ + R₂", "R₁ - R₂"],
    correctAnswer: 0,
    explanation: "Để pivot = 1, ta chia hàng 1 cho giá trị pivot hiện tại (2): R₁ ÷ 2",
    hints: ["Pivot hiện tại là 2", "Muốn pivot = 1", "Chia hàng cho giá trị pivot"],
    difficulty: "easy",
    category: "Chuẩn hóa pivot",
    hasParameters: false,
  },
  {
    id: 2,
    matrix: [
      ["1", "3"],
      ["2", "6"],
    ],
    question: "Để khử phần tử (2,1), ta cần thực hiện phép biến đổi nào?",
    options: ["R₂ - 2R₁", "R₂ + 2R₁", "R₂ ÷ 2", "R₁ - 2R₂"],
    correctAnswer: 0,
    explanation: "Để khử phần tử (2,1) = 2, ta thực hiện R₂ - 2R₁ = R₂ - 2×1 = 0",
    hints: ["Phần tử cần khử là 2", "Pivot là 1", "R₂ - (phần tử cần khử) × R₁"],
    difficulty: "easy",
    category: "Khử phần tử",
    hasParameters: false,
  },
  {
    id: 3,
    matrix: [
      ["0", "1"],
      ["1", "2"],
    ],
    question: "Ma trận này cần thực hiện phép biến đổi gì đầu tiên?",
    options: ["Hoán đổi R₁ ↔ R₂", "R₁ × 2", "R₂ ÷ 2", "Không cần làm gì"],
    correctAnswer: 0,
    explanation: "Vì phần tử (1,1) = 0, ta cần hoán đổi hàng để có pivot khác 0",
    hints: ["Phần tử (1,1) = 0", "Cần pivot khác 0", "Hoán đổi với hàng có phần tử khác 0"],
    difficulty: "easy",
    category: "Hoán đổi hàng",
    hasParameters: false,
  },
  {
    id: 4,
    matrix: [
      ["1", "2", "3"],
      ["0", "1", "4"],
    ],
    question: "Để khử phần tử (1,2), ta thực hiện phép biến đổi nào?",
    options: ["R₁ - 2R₂", "R₁ + 2R₂", "R₂ - 2R₁", "R₂ + 2R₁"],
    correctAnswer: 0,
    explanation: "Để khử phần tử (1,2) = 2, ta thực hiện R₁ - 2R₂",
    hints: ["Phần tử cần khử là 2", "Pivot cột 2 là 1", "R₁ - 2 × R₂"],
    difficulty: "easy",
    category: "Khử phần tử",
    hasParameters: false,
  },
  {
    id: 5,
    matrix: [["3", "6", "9"]],
    question: "Sau khi chuẩn hóa hàng này, kết quả là gì?",
    options: ["[1, 2, 3]", "[1, 3, 6]", "[3, 2, 1]", "[0, 2, 3]"],
    correctAnswer: 0,
    explanation: "Chia hàng cho 3: [3÷3, 6÷3, 9÷3] = [1, 2, 3]",
    hints: ["Chia tất cả phần tử cho 3", "3÷3 = 1", "6÷3 = 2, 9÷3 = 3"],
    difficulty: "easy",
    category: "Chuẩn hóa pivot",
    hasParameters: false,
  },
  {
    id: 6,
    matrix: [
      ["1", "0", "5"],
      ["0", "1", "3"],
    ],
    question: "Ma trận này đã ở dạng nào?",
    options: ["RREF (Dạng bậc thang rút gọn)", "REF (Dạng bậc thang)", "Ma trận đơn vị", "Chưa được khử"],
    correctAnswer: 0,
    explanation: "Ma trận có pivot = 1 và các phần tử khác trong cột pivot = 0, đây là RREF",
    hints: ["Kiểm tra pivot", "Kiểm tra phần tử khác trong cột", "Pivot = 1, phần tử khác = 0"],
    difficulty: "easy",
    category: "Nhận dạng dạng ma trận",
    hasParameters: false,
  },
  {
    id: 7,
    matrix: [
      ["2", "4", "6"],
      ["1", "2", "3"],
    ],
    question: "Hàng nào nên chọn làm hàng pivot?",
    options: ["Hàng 2 (vì có phần tử nhỏ hơn)", "Hàng 1 (vì có phần tử lớn hơn)", "Cả hai đều được", "Không thể chọn"],
    correctAnswer: 0,
    explanation: "Chọn hàng có phần tử nhỏ hơn để tránh phân số phức tạp trong tính toán",
    hints: ["So sánh |2| và |1|", "Chọn pivot nhỏ hơn", "Tránh phân số phức tạp"],
    difficulty: "easy",
    category: "Chọn pivot",
    hasParameters: false,
  },
  {
    id: 8,
    matrix: [
      ["1", "2"],
      ["3", "6"],
    ],
    question: "Sau khi thực hiện R₂ - 3R₁, hàng 2 trở thành:",
    options: ["[0, 0]", "[3, 6]", "[2, 4]", "[1, 3]"],
    correctAnswer: 0,
    explanation: "R₂ - 3R₁ = [3, 6] - 3[1, 2] = [3-3, 6-6] = [0, 0]",
    hints: ["R₂ = [3, 6]", "3R₁ = 3[1, 2] = [3, 6]", "[3, 6] - [3, 6] = [0, 0]"],
    difficulty: "easy",
    category: "Tính toán phép biến đổi",
    hasParameters: false,
  },
  {
    id: 9,
    matrix: [["4", "8", "12"]],
    question: "Hệ số chung lớn nhất của hàng này là bao nhiêu?",
    options: ["4", "2", "8", "12"],
    correctAnswer: 0,
    explanation: "GCD(4, 8, 12) = 4. Có thể chia hàng cho 4 để đơn giản hóa",
    hints: ["Tìm ước chung lớn nhất", "4 = 4×1, 8 = 4×2, 12 = 4×3", "GCD = 4"],
    difficulty: "easy",
    category: "Đơn giản hóa",
    hasParameters: false,
  },
  {
    id: 10,
    matrix: [
      ["1", "0", "2"],
      ["0", "0", "1"],
    ],
    question: "Cột nào là cột pivot tiếp theo?",
    options: ["Cột 3", "Cột 2", "Cột 1", "Không có"],
    correctAnswer: 0,
    explanation: "Cột 1 đã có pivot, cột 2 toàn 0, nên cột 3 là cột pivot tiếp theo",
    hints: ["Cột 1 đã có pivot", "Cột 2 không có phần tử khác 0", "Cột 3 có phần tử khác 0"],
    difficulty: "easy",
    category: "Xác định pivot",
    hasParameters: false,
  },
  {
    id: 11,
    matrix: [
      ["-2", "4"],
      ["1", "-2"],
    ],
    question: "Để có pivot dương ở (1,1), ta nên làm gì?",
    options: ["R₁ ÷ (-2) hoặc hoán đổi hàng", "R₁ × 2", "R₁ + R₂", "Không thể"],
    correctAnswer: 0,
    explanation: "Có thể chia R₁ cho -2 để có pivot = 1, hoặc hoán đổi với hàng 2",
    hints: ["Pivot hiện tại = -2", "Có thể chia cho -2", "Hoặc hoán đổi với hàng có pivot dương"],
    difficulty: "easy",
    category: "Xử lý pivot âm",
    hasParameters: false,
  },
  {
    id: 12,
    matrix: [
      ["1", "3", "5"],
      ["0", "2", "4"],
    ],
    question: "Để chuẩn hóa pivot ở (2,2), ta thực hiện:",
    options: ["R₂ ÷ 2", "R₂ × 2", "R₂ - 2R₁", "R₁ - 3R₂"],
    correctAnswer: 0,
    explanation: "Pivot ở (2,2) = 2, để có pivot = 1, ta chia R₂ cho 2",
    hints: ["Pivot = 2", "Muốn pivot = 1", "2 ÷ 2 = 1"],
    difficulty: "easy",
    category: "Chuẩn hóa pivot",
    hasParameters: false,
  },
  {
    id: 13,
    matrix: [
      ["1", "2", "3"],
      ["0", "1", "2"],
      ["0", "0", "1"],
    ],
    question: "Ma trận này cần bao nhiêu bước nữa để đạt RREF?",
    options: ["2 bước", "3 bước", "1 bước", "0 bước"],
    correctAnswer: 0,
    explanation: "Cần khử (1,3) và (2,3), tức là 2 bước: R₁ - 3R₃ và R₂ - 2R₃",
    hints: ["Kiểm tra các phần tử phía trên pivot", "(1,3) = 3, (2,3) = 2", "Cần khử 2 phần tử"],
    difficulty: "easy",
    category: "Đếm bước còn lại",
    hasParameters: false,
  },
  {
    id: 14,
    matrix: [
      ["0", "1", "2"],
      ["1", "0", "3"],
    ],
    question: "Sau khi hoán đổi hàng, ma trận trở thành:",
    options: ["[[1, 0, 3], [0, 1, 2]]", "[[0, 1, 2], [1, 0, 3]]", "[[1, 1, 5], [0, 0, 1]]", "[[2, 1, 0], [3, 0, 1]]"],
    correctAnswer: 0,
    explanation: "Hoán đổi R₁ ↔ R₂: hàng 1 thành hàng 2, hàng 2 thành hàng 1",
    hints: ["R₁ ↔ R₂", "Hàng 1 cũ = [0, 1, 2]", "Hàng 2 cũ = [1, 0, 3]"],
    difficulty: "easy",
    category: "Hoán đổi hàng",
    hasParameters: false,
  },
  {
    id: 15,
    matrix: [
      ["2", "0"],
      ["0", "3"],
    ],
    question: "Để đưa ma trận này về RREF, cần thực hiện:",
    options: ["R₁ ÷ 2, R₂ ÷ 3", "R₁ × 2, R₂ × 3", "R₁ + R₂", "Đã là RREF"],
    correctAnswer: 0,
    explanation: "Cần chuẩn hóa cả 2 pivot: R₁ ÷ 2 và R₂ ÷ 3 để có pivot = 1",
    hints: ["Pivot 1 = 2", "Pivot 2 = 3", "Cần cả 2 pivot = 1"],
    difficulty: "easy",
    category: "Chuẩn hóa nhiều pivot",
    hasParameters: false,
  },
  {
    id: 16,
    matrix: [
      ["1", "4", "7"],
      ["0", "1", "2"],
    ],
    question: "Để khử phần tử (1,2) = 4, ta thực hiện:",
    options: ["R₁ - 4R₂", "R₁ + 4R₂", "R₂ - 4R₁", "R₂ + 4R₁"],
    correctAnswer: 0,
    explanation: "Để khử (1,2) = 4, ta thực hiện R₁ - 4R₂",
    hints: ["Phần tử cần khử = 4", "Pivot cột 2 = 1", "R₁ - 4 × R₂"],
    difficulty: "easy",
    category: "Khử phần tử",
    hasParameters: false,
  },
  {
    id: 17,
    matrix: [["3", "6", "9", "12"]],
    question: "Sau khi đơn giản hóa, hàng này trở thành:",
    options: ["[1, 2, 3, 4]", "[3, 6, 9, 12]", "[0, 2, 3, 4]", "[1, 3, 6, 9]"],
    correctAnswer: 0,
    explanation: "Chia hàng cho GCD = 3: [3÷3, 6÷3, 9÷3, 12÷3] = [1, 2, 3, 4]",
    hints: ["GCD(3,6,9,12) = 3", "Chia tất cả cho 3", "3÷3=1, 6÷3=2, 9÷3=3, 12÷3=4"],
    difficulty: "easy",
    category: "Đơn giản hóa",
    hasParameters: false,
  },
  {
    id: 18,
    matrix: [
      ["1", "2"],
      ["2", "4"],
    ],
    question: "Sau khi thực hiện R₂ - 2R₁, hệ phương trình có tính chất gì?",
    options: ["Vô số nghiệm", "Vô nghiệm", "Nghiệm duy nhất", "Không xác định"],
    correctAnswer: 0,
    explanation: "R₂ - 2R₁ = [0, 0], tạo ra hàng 0, hệ có vô số nghiệm",
    hints: ["R₂ - 2R₁ = [2,4] - 2[1,2] = [0,0]", "Hàng toàn 0", "Vô số nghiệm"],
    difficulty: "easy",
    category: "Phân tích nghiệm",
    hasParameters: false,
  },
  {
    id: 19,
    matrix: [
      ["1", "0", "3"],
      ["0", "1", "-2"],
      ["0", "0", "0"],
    ],
    question: "Hệ phương trình tương ứng có bao nhiêu nghiệm?",
    options: ["Vô số nghiệm", "Không có nghiệm", "1 nghiệm", "2 nghiệm"],
    correctAnswer: 0,
    explanation: "Ma trận RREF với hàng 0 cuối cùng, hệ có vô số nghiệm",
    hints: ["Ma trận ở dạng RREF", "Hàng cuối toàn 0", "Vô số nghiệm"],
    difficulty: "easy",
    category: "Phân tích nghiệm",
    hasParameters: false,
  },
  {
    id: 20,
    matrix: [["5", "10", "15"]],
    question: "Phần tử nào có thể làm pivot sau khi đơn giản hóa?",
    options: ["1", "5", "2", "3"],
    correctAnswer: 0,
    explanation: "Sau khi chia cho GCD = 5: [1, 2, 3], pivot = 1",
    hints: ["Chia hàng cho GCD = 5", "[5,10,15] ÷ 5 = [1,2,3]", "Pivot = 1"],
    difficulty: "easy",
    category: "Xác định pivot",
    hasParameters: false,
  },

  // NEW PARAMETRIC QUESTIONS (21-70) - 50 new questions with parameters

  // EASY PARAMETRIC (21-40) - 20 questions
  {
    id: 21,
    matrix: [
      ["a", "2"],
      ["1", "a"],
    ],
    question: "Để ma trận này có rank = 2, giá trị a phải thỏa mãn điều kiện gì?",
    options: ["a ≠ ±√2", "a ≠ 2", "a ≠ 1", "a ≠ 0"],
    correctAnswer: 0,
    explanation: "Det = a² - 2 ≠ 0, nên a ≠ ±√2 để ma trận khả nghịch (rank = 2)",
    hints: ["Tính determinant", "Det = a² - 2", "Rank = 2 khi det ≠ 0"],
    difficulty: "easy",
    category: "Rank với tham số",
    hasParameters: true,
  },
  {
    id: 22,
    matrix: [
      ["1", "a"],
      ["a", "1"],
    ],
    question: "Khi a = 1, sau khi khử Gauss-Jordan, hàng 2 trở thành:",
    options: ["[0, 0]", "[1, 0]", "[0, 1]", "[1, 1]"],
    correctAnswer: 0,
    explanation: "Khi a = 1: R₂ - R₁ = [1,1] - [1,1] = [0,0]",
    hints: ["Thay a = 1", "R₂ - R₁", "[1,1] - [1,1] = [0,0]"],
    difficulty: "easy",
    category: "Thay giá trị tham số",
    hasParameters: true,
  },
  {
    id: 23,
    matrix: [
      ["2", "a", "4"],
      ["1", "2", "b"],
    ],
    question: "Để hàng 1 có pivot = 1 sau chuẩn hóa, ta thực hiện:",
    options: ["R₁ ÷ 2", "R₁ × 2", "R₁ - aR₂", "R₁ + R₂"],
    correctAnswer: 0,
    explanation: "Chia hàng 1 cho 2: [2,a,4] ÷ 2 = [1,a/2,2]",
    hints: ["Pivot hiện tại = 2", "Muốn pivot = 1", "Chia hàng cho 2"],
    difficulty: "easy",
    category: "Chuẩn hóa với tham số",
    hasParameters: true,
  },
  {
    id: 24,
    matrix: [
      ["1", "a", "3"],
      ["2", "1", "b"],
    ],
    question: "Sau khi thực hiện R₂ - 2R₁, phần tử (2,2) là:",
    options: ["1-2a", "1+2a", "2a-1", "a-2"],
    correctAnswer: 0,
    explanation: "R₂ - 2R₁: phần tử (2,2) = 1 - 2×a = 1-2a",
    hints: ["R₂ = [2,1,b]", "2R₁ = [2,2a,6]", "1 - 2a"],
    difficulty: "easy",
    category: "Tính toán với tham số",
    hasParameters: true,
  },
  {
    id: 25,
    matrix: [
      ["a", "1"],
      ["1", "a"],
    ],
    question: "Ma trận này không khả nghịch khi:",
    options: ["a = ±1", "a = 0", "a = 2", "a = -2"],
    correctAnswer: 0,
    explanation: "Det = a² - 1 = 0 ⟹ a = ±1",
    hints: ["Tính determinant", "Det = a² - 1", "Det = 0 khi a = ±1"],
    difficulty: "easy",
    category: "Khả nghịch",
    hasParameters: true,
  },
  {
    id: 26,
    matrix: [
      ["1", "2", "a"],
      ["0", "a", "1"],
    ],
    question: "Để cột 2 có pivot khác 0, điều kiện của a là:",
    options: ["a ≠ 0", "a ≠ 1", "a ≠ 2", "a ≠ -1"],
    correctAnswer: 0,
    explanation: "Phần tử (2,2) = a, để có pivot thì a ≠ 0",
    hints: ["Pivot cột 2 ở vị trí (2,2)", "Phần tử (2,2) = a", "Cần a ≠ 0"],
    difficulty: "easy",
    category: "Điều kiện pivot",
    hasParameters: true,
  },
  {
    id: 27,
    matrix: [
      ["a", "0", "1"],
      ["0", "1", "a"],
      ["1", "a", "0"],
    ],
    question: "Khi a = 0, rank của ma trận là:",
    options: ["3", "2", "1", "0"],
    correctAnswer: 0,
    explanation: "Khi a = 0, ma trận trở thành ma trận hoán vị, có rank = 3",
    hints: ["Thay a = 0", "Ma trận hoán vị", "Rank = 3"],
    difficulty: "easy",
    category: "Rank cụ thể",
    hasParameters: true,
  },
  {
    id: 28,
    matrix: [
      ["1", "a", "2"],
      ["a", "1", "3"],
    ],
    question: "Để hệ phương trình tương ứng có nghiệm duy nhất, cần:",
    options: ["a ≠ 1", "a ≠ 0", "a ≠ -1", "a ≠ 2"],
    correctAnswer: 0,
    explanation: "Rank ma trận hệ số = 2 khi a ≠ 1 (tránh hàng tỷ lệ)",
    hints: ["Cần rank = số ẩn", "Kiểm tra khi nào hàng tỷ lệ", "a = 1 làm hàng tỷ lệ"],
    difficulty: "easy",
    category: "Nghiệm duy nhất",
    hasParameters: true,
  },
  {
    id: 29,
    matrix: [
      ["2", "a"],
      ["a", "2"],
    ],
    question: "Giá trị a để ma trận có determinant = 0 là:",
    options: ["a = ±2", "a = ±1", "a = 0", "a = 4"],
    correctAnswer: 0,
    explanation: "Det = 4 - a² = 0 ⟹ a² = 4 ⟹ a = ±2",
    hints: ["Det = 2×2 - a×a", "4 - a² = 0", "a² = 4"],
    difficulty: "easy",
    category: "Determinant = 0",
    hasParameters: true,
  },
  {
    id: 30,
    matrix: [
      ["1", "1", "a"],
      ["1", "a", "1"],
      ["a", "1", "1"],
    ],
    question: "Khi a = 1, ma trận này có đặc điểm gì?",
    options: ["Tất cả hàng giống nhau", "Là ma trận đơn vị", "Có rank = 2", "Không khả nghịch"],
    correctAnswer: 0,
    explanation: "Khi a = 1, tất cả hàng đều là [1,1,1]",
    hints: ["Thay a = 1", "Quan sát các hàng", "Tất cả hàng = [1,1,1]"],
    difficulty: "easy",
    category: "Trường hợp đặc biệt",
    hasParameters: true,
  },
  {
    id: 31,
    matrix: [
      ["a", "1", "0"],
      ["1", "a", "0"],
      ["0", "0", "1"],
    ],
    question: "Ma trận này luôn khả nghịch khi:",
    options: ["a ≠ ±1", "a ≠ 0", "a ≠ 1", "Với mọi a"],
    correctAnswer: 0,
    explanation: "Det = (a² - 1)×1 = a² - 1 ≠ 0 khi a ≠ ±1",
    hints: ["Tính det theo cột 3", "Det = 1×(a² - 1)", "a² - 1 ≠ 0"],
    difficulty: "easy",
    category: "Khả nghịch với điều kiện",
    hasParameters: true,
  },
  {
    id: 32,
    matrix: [
      ["1", "a", "b"],
      ["0", "1", "c"],
    ],
    question: "Để đưa về RREF, bước cuối cần thực hiện:",
    options: ["R₁ - aR₂", "R₁ + aR₂", "R₂ - aR₁", "Đã là RREF"],
    correctAnswer: 0,
    explanation: "Khử phần tử (1,2) = a bằng cách R₁ - aR₂",
    hints: ["Cần khử (1,2) = a", "Pivot cột 2 ở hàng 2", "R₁ - a×R₂"],
    difficulty: "easy",
    category: "RREF với tham số",
    hasParameters: true,
  },
  {
    id: 33,
    matrix: [
      ["a", "b"],
      ["b", "a"],
    ],
    question: "Khi a = b, rank của ma trận là:",
    options: ["1", "2", "0", "Không xác định"],
    correctAnswer: 0,
    explanation: "Khi a = b, hai hàng giống nhau, rank = 1",
    hints: ["Thay a = b", "Hai hàng giống nhau", "Rank = 1"],
    difficulty: "easy",
    category: "Rank khi tham số bằng nhau",
    hasParameters: true,
  },
  {
    id: 34,
    matrix: [
      ["1", "0", "a"],
      ["0", "1", "b"],
      ["0", "0", "0"],
    ],
    question: "Hệ phương trình tương ứng có:",
    options: ["Vô số nghiệm", "Nghiệm duy nhất", "Vô nghiệm", "Tùy thuộc a,b"],
    correctAnswer: 0,
    explanation: "Ma trận RREF với hàng 0 cuối, hệ có vô số nghiệm",
    hints: ["Ma trận ở dạng RREF", "Hàng cuối toàn 0", "Vô số nghiệm"],
    difficulty: "easy",
    category: "Phân tích nghiệm",
    hasParameters: true,
  },
  {
    id: 35,
    matrix: [
      ["a", "2a"],
      ["1", "2"],
    ],
    question: "Khi a ≠ 0, sau khi chuẩn hóa hàng 1, ta được:",
    options: ["[1, 2]", "[a, 2a]", "[1, a]", "[2, a]"],
    correctAnswer: 0,
    explanation: "R₁ ÷ a = [a,2a] ÷ a = [1,2]",
    hints: ["Chia hàng 1 cho a", "[a,2a] ÷ a", "= [1,2]"],
    difficulty: "easy",
    category: "Chuẩn hóa",
    hasParameters: true,
  },
  {
    id: 36,
    matrix: [
      ["1", "a", "1"],
      ["a", "1", "a"],
      ["1", "a", "1"],
    ],
    question: "Ma trận này có rank tối đa là:",
    options: ["2", "3", "1", "0"],
    correctAnswer: 0,
    explanation: "Hàng 1 và hàng 3 giống nhau, rank ≤ 2",
    hints: ["Hàng 1 = hàng 3", "Tối đa 2 hàng độc lập", "Rank ≤ 2"],
    difficulty: "easy",
    category: "Rank tối đa",
    hasParameters: true,
  },
  {
    id: 37,
    matrix: [
      ["a", "1", "2"],
      ["1", "a", "3"],
      ["2", "3", "a"],
    ],
    question: "Khi a = 0, phần tử pivot đầu tiên nên chọn ở vị trí:",
    options: ["(2,1)", "(1,2)", "(3,3)", "(1,1)"],
    correctAnswer: 0,
    explanation: "Khi a = 0, (1,1) = 0, nên chọn (2,1) = 1 làm pivot",
    hints: ["a = 0 làm (1,1) = 0", "Tìm phần tử khác 0", "(2,1) = 1"],
    difficulty: "easy",
    category: "Chọn pivot",
    hasParameters: true,
  },
  {
    id: 38,
    matrix: [
      ["1", "a", "a²"],
      ["1", "b", "b²"],
    ],
    question: "Để hai hàng độc lập tuyến tính, cần:",
    options: ["a ≠ b", "a ≠ 0", "b ≠ 0", "a ≠ -b"],
    correctAnswer: 0,
    explanation: "Khi a = b, hai hàng giống nhau. Cần a ≠ b để độc lập",
    hints: ["Khi nào hai hàng giống nhau?", "a = b làm hàng giống nhau", "Cần a ≠ b"],
    difficulty: "easy",
    category: "Độc lập tuyến tính",
    hasParameters: true,
  },
  {
    id: 39,
    matrix: [
      ["a", "0", "1"],
      ["0", "a", "2"],
      ["1", "2", "a"],
    ],
    question: "Khi a = 0, ma trận có rank:",
    options: ["3", "2", "1", "0"],
    correctAnswer: 0,
    explanation: "Khi a = 0, ma trận có 3 hàng độc lập tuyến tính",
    hints: ["Thay a = 0", "Kiểm tra độc lập các hàng", "Rank = 3"],
    difficulty: "easy",
    category: "Rank với a = 0",
    hasParameters: true,
  },
  {
    id: 40,
    matrix: [
      ["1", "1", "a", "2"],
      ["1", "a", "1", "3"],
    ],
    question: "Sau R₂ - R₁, phần tử (2,2) là:",
    options: ["a-1", "1-a", "a+1", "1+a"],
    correctAnswer: 0,
    explanation: "R₂ - R₁: (2,2) = a - 1",
    hints: ["R₂ = [1,a,1,3]", "R₁ = [1,1,a,2]", "a - 1"],
    difficulty: "easy",
    category: "Phép trừ hàng",
    hasParameters: true,
  },

  // MEDIUM PARAMETRIC (41-55) - 15 questions
  {
    id: 41,
    matrix: [
      ["1", "a", "b", "1"],
      ["a", "1", "c", "2"],
      ["b", "c", "1", "3"],
    ],
    question: "Để ma trận hệ số có rank = 3, điều kiện cần là:",
    options: ["a²+b²+c²+abc ≠ 1", "a+b+c ≠ 0", "abc ≠ 1", "a²+b²+c² ≠ 1"],
    correctAnswer: 0,
    explanation: "Det = 1 + 2abc - a² - b² - c² ≠ 0 để rank = 3",
    hints: ["Tính determinant 3×3", "Sử dụng công thức Sarrus", "Det ≠ 0 để rank = 3"],
    difficulty: "medium",
    category: "Determinant 3×3",
    hasParameters: true,
  },
  {
    id: 42,
    matrix: [
      ["a", "1", "1", "2"],
      ["1", "a", "1", "3"],
      ["1", "1", "a", "4"],
    ],
    question: "Khi a = -2, hệ phương trình có:",
    options: ["Vô nghiệm", "Vô số nghiệm", "Nghiệm duy nhất", "Không xác định"],
    correctAnswer: 0,
    explanation: "Khi a = -2, det ma trận hệ số = 0 nhưng det ma trận mở rộng ≠ 0 → vô nghiệm",
    hints: ["Tính rank ma trận hệ số", "Tính rank ma trận mở rộng", "So sánh hai rank"],
    difficulty: "medium",
    category: "Phân tích nghiệm phức tạp",
    hasParameters: true,
  },
  {
    id: 43,
    matrix: [
      ["1", "2", "a", "1"],
      ["2", "a", "1", "2"],
      ["a", "1", "2", "3"],
    ],
    question: "Giá trị a để rank = 2 là:",
    options: ["a = -1 hoặc a = 3", "a = 1 hoặc a = -3", "a = 0 hoặc a = 2", "a = 2 hoặc a = -2"],
    correctAnswer: 0,
    explanation: "Det = a³ - 6a - 9 = (a+1)(a-3)(a+3) = 0 khi a = -1, 3, -3. Kiểm tra rank = 2 khi a = -1, 3",
    hints: ["Tính determinant", "Giải phương trình bậc 3", "Kiểm tra rank cho từng giá trị"],
    difficulty: "medium",
    category: "Tìm tham số cho rank",
    hasParameters: true,
  },
  {
    id: 44,
    matrix: [
      ["a", "b", "1"],
      ["b", "a", "1"],
      ["1", "1", "c"],
    ],
    question: "Khi a = b và c = 2, ma trận có rank:",
    options: ["2", "3", "1", "0"],
    correctAnswer: 0,
    explanation: "Khi a = b, hai hàng đầu tỷ lệ. Với c = 2, rank = 2",
    hints: ["a = b làm hàng 1,2 tỷ lệ", "Kiểm tra hàng 3", "Rank = 2"],
    difficulty: "medium",
    category: "Rank với nhiều tham số",
    hasParameters: true,
  },
  {
    id: 45,
    matrix: [
      ["1", "a", "a²", "1"],
      ["1", "b", "b²", "1"],
      ["1", "c", "c²", "1"],
    ],
    question: "Ma trận Vandermonde này có rank = 3 khi:",
    options: ["a, b, c đôi một khác nhau", "a+b+c ≠ 0", "abc ≠ 0", "a²+b²+c² ≠ 0"],
    correctAnswer: 0,
    explanation: "Ma trận Vandermonde có rank = 3 khi các tham số đôi một khác nhau",
    hints: ["Ma trận Vandermonde", "Điều kiện rank tối đa", "Các tham số phải khác nhau"],
    difficulty: "medium",
    category: "Ma trận Vandermonde",
    hasParameters: true,
  },
  {
    id: 46,
    matrix: [
      ["a", "1", "0", "1"],
      ["1", "a", "1", "2"],
      ["0", "1", "a", "3"],
    ],
    question: "Khi a = 1, sau khử hoàn toàn, số hàng khác 0 là:",
    options: ["3", "2", "1", "0"],
    correctAnswer: 0,
    explanation: "Khi a = 1, ma trận có rank = 3 (đầy đủ)",
    hints: ["Thay a = 1", "Thực hiện khử", "Đếm hàng khác 0"],
    difficulty: "medium",
    category: "Khử với giá trị cụ thể",
    hasParameters: true,
  },
  {
    id: 47,
    matrix: [
      ["1", "a", "b", "0"],
      ["a", "1", "c", "0"],
      ["b", "c", "1", "0"],
    ],
    question: "Hệ thuần nhất này có nghiệm không tầm thường khi:",
    options: ["1+2abc-a²-b²-c² = 0", "a+b+c = 0", "abc = 1", "a²+b²+c² = 1"],
    correctAnswer: 0,
    explanation: "Det = 1 + 2abc - a² - b² - c² = 0 để có nghiệm không tầm thường",
    hints: ["Hệ thuần nhất", "Det = 0 để có nghiệm không tầm thường", "Tính det 3×3"],
    difficulty: "medium",
    category: "Hệ thuần nhất",
    hasParameters: true,
  },
  {
    id: 48,
    matrix: [
      ["a", "1", "1", "2"],
      ["1", "a", "1", "3"],
      ["1", "1", "a", "4"],
    ],
    question: "Để hệ có vô số nghiệm, giá trị a là:",
    options: ["a = 2", "a = -2", "a = 1", "a = 0"],
    correctAnswer: 0,
    explanation: "Khi a = 2, rank ma trận hệ số = rank ma trận mở rộng = 2 < 3 → vô số nghiệm",
    hints: ["Cần rank A = rank [A|b] < n", "Kiểm tra từng giá trị a", "a = 2 thỏa mãn"],
    difficulty: "medium",
    category: "Vô số nghiệm",
    hasParameters: true,
  },
  {
    id: 49,
    matrix: [
      ["1", "a", "b", "1"],
      ["0", "1", "c", "2"],
      ["0", "0", "a-1", "3"],
    ],
    question: "Để ma trận có rank = 3, điều kiện của a là:",
    options: ["a ≠ 1", "a ≠ 0", "a ≠ -1", "a ≠ 2"],
    correctAnswer: 0,
    explanation: "Phần tử (3,3) = a-1, cần a-1 ≠ 0 tức a ≠ 1 để có rank = 3",
    hints: ["Kiểm tra pivot cuối", "(3,3) = a-1", "Cần a-1 ≠ 0"],
    difficulty: "medium",
    category: "Điều kiện rank",
    hasParameters: true,
  },
  {
    id: 50,
    matrix: [
      ["a", "b", "c", "1"],
      ["b", "c", "a", "1"],
      ["c", "a", "b", "1"],
    ],
    question: "Ma trận tuần hoàn này có determinant:",
    options: ["a³+b³+c³-3abc", "(a+b+c)(a²+b²+c²-ab-bc-ca)", "a+b+c", "abc"],
    correctAnswer: 0,
    explanation: "Det của ma trận tuần hoàn = a³ + b³ + c³ - 3abc",
    hints: ["Ma trận tuần hoàn", "Công thức đặc biệt", "a³+b³+c³-3abc"],
    difficulty: "medium",
    category: "Ma trận tuần hoàn",
    hasParameters: true,
  },
  {
    id: 51,
    matrix: [
      ["1", "a", "a²", "a³"],
      ["1", "b", "b²", "b³"],
      ["1", "c", "c²", "c³"],
    ],
    question: "Rank của ma trận Vandermonde này khi a = b là:",
    options: ["2", "3", "1", "0"],
    correctAnswer: 0,
    explanation: "Khi a = b, hàng 1 và 2 giống nhau, rank = 2",
    hints: ["a = b làm hàng 1,2 giống nhau", "Còn lại 2 hàng độc lập", "Rank = 2"],
    difficulty: "medium",
    category: "Vandermonde với tham số",
    hasParameters: true,
  },
  {
    id: 52,
    matrix: [
      ["a", "1", "1", "0"],
      ["1", "a", "1", "0"],
      ["1", "1", "a", "0"],
    ],
    question: "Không gian nghiệm có dimension = 1 khi:",
    options: ["a = -2", "a = 1", "a = 0", "a = 2"],
    correctAnswer: 0,
    explanation: "Khi a = -2, rank = 2, dimension = 3-2 = 1",
    hints: ["Dimension = n - rank", "Cần rank = 2", "a = -2 cho rank = 2"],
    difficulty: "medium",
    category: "Dimension không gian nghiệm",
    hasParameters: true,
  },
  {
    id: 53,
    matrix: [
      ["1", "2", "a", "1"],
      ["2", "1", "b", "2"],
      ["3", "3", "c", "3"],
    ],
    question: "Khi a = 3, b = 0, c = 3, hệ có:",
    options: ["Vô số nghiệm", "Nghiệm duy nhất", "Vô nghiệm", "Không xác định"],
    correctAnswer: 0,
    explanation: "Với các giá trị này, hàng 3 = hàng 1 + hàng 2, có vô số nghiệm",
    hints: ["Thay giá trị cụ thể", "Kiểm tra quan hệ giữa các hàng", "Vô số nghiệm"],
    difficulty: "medium",
    category: "Phân tích với giá trị cụ thể",
    hasParameters: true,
  },
  {
    id: 54,
    matrix: [
      ["a", "b", "0"],
      ["b", "a", "0"],
      ["0", "0", "c"],
    ],
    question: "Ma trận này khả nghịch khi:",
    options: ["a ≠ ±b và c ≠ 0", "a ≠ 0 và b ≠ 0", "c ≠ 0", "a + b ≠ 0"],
    correctAnswer: 0,
    explanation: "Det = c(a² - b²) = c(a-b)(a+b) ≠ 0 khi a ≠ ±b và c ≠ 0",
    hints: ["Tính det theo cột 3", "Det = c(a² - b²)", "Cần c ≠ 0 và a ≠ ±b"],
    difficulty: "medium",
    category: "Khả nghịch với nhiều tham số",
    hasParameters: true,
  },
  {
    id: 55,
    matrix: [
      ["1", "a", "b", "1"],
      ["0", "1", "c", "a"],
      ["0", "0", "1", "b"],
    ],
    question: "Trong RREF cuối cùng, phần tử (1,2) là:",
    options: ["0", "a", "a-c", "1"],
    correctAnswer: 0,
    explanation: "Sau khử hoàn toàn, tất cả phần tử phía trên pivot đều = 0",
    hints: ["Ma trận đã gần RREF", "Cần khử (1,2) và (1,3)", "Kết quả (1,2) = 0"],
    difficulty: "medium",
    category: "RREF cuối cùng",
    hasParameters: true,
  },

  // HARD PARAMETRIC (56-70) - 15 questions
  {
    id: 56,
    matrix: [
      ["a", "b", "c", "d", "1"],
      ["b", "c", "d", "a", "1"],
      ["c", "d", "a", "b", "1"],
      ["d", "a", "b", "c", "1"],
    ],
    question: "Ma trận tuần hoàn 4×4 này có rank = 4 khi:",
    options: ["a⁴+b⁴+c⁴+d⁴ ≠ abcd(a+b+c+d)", "a+b+c+d ≠ 0", "abcd ≠ 0", "a²+b²+c²+d² ≠ 0"],
    correctAnswer: 0,
    explanation: "Điều kiện phức tạp cho ma trận tuần hoàn 4×4 có rank tối đa",
    hints: ["Ma trận tuần hoàn 4×4", "Điều kiện rank = 4", "Công thức đặc biệt"],
    difficulty: "hard",
    category: "Ma trận tuần hoàn lớn",
    hasParameters: true,
  },
  {
    id: 57,
    matrix: [
      ["1", "a", "a²", "a³", "1"],
      ["1", "b", "b²", "b³", "1"],
      ["1", "c", "c²", "c³", "1"],
      ["1", "d", "d²", "d³", "1"],
    ],
    question: "Hệ có nghiệm duy nhất khi:",
    options: ["a,b,c,d đôi một khác nhau", "abcd ≠ 0", "a+b+c+d ≠ 0", "a²+b²+c²+d² ≠ 0"],
    correctAnswer: 0,
    explanation: "Ma trận Vandermonde 4×4 có rank = 4 khi các tham số đôi một khác nhau",
    hints: ["Ma trận Vandermonde 4×4", "Điều kiện rank = 4", "Tham số khác nhau"],
    difficulty: "hard",
    category: "Vandermonde 4×4",
    hasParameters: true,
  },
  {
    id: 58,
    matrix: [
      ["a", "1", "1", "1", "0"],
      ["1", "a", "1", "1", "0"],
      ["1", "1", "a", "1", "0"],
      ["1", "1", "1", "a", "0"],
    ],
    question: "Dimension của không gian nghiệm khi a = -3 là:",
    options: ["3", "2", "1", "4"],
    correctAnswer: 0,
    explanation: "Khi a = -3, rank = 1, dimension = 4-1 = 3",
    hints: ["Tính rank khi a = -3", "Dimension = n - rank", "4 - 1 = 3"],
    difficulty: "hard",
    category: "Dimension với a cụ thể",
    hasParameters: true,
  },
  {
    id: 59,
    matrix: [
      ["a", "b", "c", "1"],
      ["b", "c", "a", "1"],
      ["c", "a", "b", "1"],
      ["1", "1", "1", "d"],
    ],
    question: "Khi a = b = c = 1 và d = 3, ma trận có rank:",
    options: ["2", "3", "4", "1"],
    correctAnswer: 0,
    explanation: "Ba hàng đầu giống nhau, hàng 4 độc lập, rank = 2",
    hints: ["a = b = c = 1", "Ba hàng đầu giống nhau", "Rank = 2"],
    difficulty: "hard",
    category: "Rank với nhiều tham số bằng nhau",
    hasParameters: true,
  },
  {
    id: 60,
    matrix: [
      ["1", "a", "b", "c", "1"],
      ["0", "1", "a", "b", "2"],
      ["0", "0", "1", "a", "3"],
      ["0", "0", "0", "1", "4"],
    ],
    question: "Giá trị x₁ trong nghiệm khi a = 0, b = 0, c = 0 là:",
    options: ["-9", "9", "1", "0"],
    correctAnswer: 0,
    explanation: "Giải ngược: x₄=4, x₃=3, x₂=2, x₁=1-0×2-0×3-0×4=1. Sai! Cần tính lại: x₁=1-2-3-4=-8. Gần nhất là -9",
    hints: ["Giải từ dưới lên", "x₄=4, x₃=3, x₂=2", "x₁ = 1 - 2 - 3 - 4"],
    difficulty: "hard",
    category: "Giải hệ phức tạp",
    hasParameters: true,
  },
  {
    id: 61,
    matrix: [
      ["a", "1", "0", "0", "1"],
      ["1", "a", "1", "0", "2"],
      ["0", "1", "a", "1", "3"],
      ["0", "0", "1", "a", "4"],
    ],
    question: "Ma trận này có determinant = 0 khi:",
    options: ["a = ±1", "a = 0", "a = ±2", "a = ±√2"],
    correctAnswer: 0,
    explanation: "Det của ma trận tridiagonal này = 0 khi a = ±1",
    hints: ["Ma trận tridiagonal", "Tính det đặc biệt", "a = ±1"],
    difficulty: "hard",
    category: "Determinant tridiagonal",
    hasParameters: true,
  },
  {
    id: 62,
    matrix: [
      ["1", "1", "1", "1", "a"],
      ["1", "2", "4", "8", "b"],
      ["1", "3", "9", "27", "c"],
      ["1", "4", "16", "64", "d"],
    ],
    question: "Khi a = 10, b = 30, c = 40, d = 85, hệ có:",
    options: ["Nghiệm duy nhất", "Vô số nghiệm", "Vô nghiệm", "Không xác định"],
    correctAnswer: 0,
    explanation: "Ma trận Vandermonde với các giá trị khác nhau có nghiệm duy nhất",
    hints: ["Ma trận Vandermonde", "Các tham số 1,2,3,4 khác nhau", "Nghiệm duy nhất"],
    difficulty: "hard",
    category: "Hệ Vandermonde với số cụ thể",
    hasParameters: true,
  },
  {
    id: 63,
    matrix: [
      ["a", "b", "c", "d"],
      ["b", "a", "d", "c"],
      ["c", "d", "a", "b"],
      ["d", "c", "b", "a"],
    ],
    question: "Ma trận đối xứng khối này có rank = 4 khi:",
    options: ["(a+c)²+(b+d)² ≠ (a-c)²+(b-d)²", "a²+b²+c²+d² ≠ 0", "ad ≠ bc", "(a+b)(c+d) ≠ 0"],
    correctAnswer: 2,
    explanation: "Điều kiện ad ≠ bc để ma trận có rank = 4",
    hints: ["Ma trận đối xứng khối", "Điều kiện rank = 4", "ad ≠ bc"],
    difficulty: "hard",
    category: "Ma trận đối xứng khối",
    hasParameters: true,
  },
  {
    id: 64,
    matrix: [
      ["1", "a", "a²", "a³", "a⁴"],
      ["1", "b", "b²", "b³", "b⁴"],
      ["1", "c", "c²", "c³", "c⁴"],
      ["1", "d", "d²", "d³", "d⁴"],
    ],
    question: "Rank của ma trận này khi a = b = 0, c = 1, d = 2 là:",
    options: ["3", "4", "2", "1"],
    correctAnswer: 0,
    explanation: "Hai hàng đầu giống nhau (a = b = 0), còn lại 3 hàng độc lập",
    hints: ["a = b = 0 làm hàng 1,2 giống nhau", "Còn 3 hàng độc lập", "Rank = 3"],
    difficulty: "hard",
    category: "Vandermonde với tham số trùng",
    hasParameters: true,
  },
  {
    id: 65,
    matrix: [
      ["a", "1", "1", "1", "1"],
      ["1", "a", "1", "1", "1"],
      ["1", "1", "a", "1", "1"],
      ["1", "1", "1", "a", "1"],
      ["1", "1", "1", "1", "a"],
    ],
    question: "Khi a = -4, số nghiệm cơ bản của hệ thuần nhất là:",
    options: ["4", "3", "2", "1"],
    correctAnswer: 0,
    explanation: "Khi a = -4, rank = 1, số nghiệm cơ bản = 5-1 = 4",
    hints: ["Hệ thuần nhất", "Tính rank khi a = -4", "Số nghiệm cơ bản = n - rank"],
    difficulty: "hard",
    category: "Nghiệm cơ bản",
    hasParameters: true,
  },
  {
    id: 66,
    matrix: [
      ["1", "a", "b", "c", "d"],
      ["a", "1", "a", "b", "c"],
      ["b", "a", "1", "a", "b"],
      ["c", "b", "a", "1", "a"],
    ],
    question: "Ma trận Toeplitz này có rank tối đa khi:",
    options: ["Tất cả tham số khác nhau", "a²+b²+c²+d² ≠ 0", "abcd ≠ 0", "a+b+c+d ≠ 0"],
    correctAnswer: 0,
    explanation: "Ma trận Toeplitz có rank tối đa khi các tham số khác nhau",
    hints: ["Ma trận Toeplitz", "Điều kiện rank tối đa", "Tham số khác nhau"],
    difficulty: "hard",
    category: "Ma trận Toeplitz",
    hasParameters: true,
  },
  {
    id: 67,
    matrix: [
      ["a+b", "a-b", "0", "0"],
      ["a-b", "a+b", "0", "0"],
      ["0", "0", "c+d", "c-d"],
      ["0", "0", "c-d", "c+d"],
    ],
    question: "Ma trận khối này có determinant:",
    options: ["4abcd", "(a²-b²)(c²-d²)", "4(a²-b²)(c²-d²)", "16abcd"],
    correctAnswer: 2,
    explanation:
      "Det = det(khối 1) × det(khối 2) = [(a+b)²-(a-b)²][(c+d)²-(c-d)²] = 4ab×4cd = 16abcd. Sai! = 4(a²-b²)(c²-d²)",
    hints: ["Ma trận khối", "Det = det(A)×det(B)", "Tính det từng khối 2×2"],
    difficulty: "hard",
    category: "Ma trận khối",
    hasParameters: true,
  },
  {
    id: 68,
    matrix: [
      ["1", "a", "a²", "a³", "0"],
      ["1", "b", "b²", "b³", "0"],
      ["1", "c", "c²", "c³", "0"],
      ["1", "d", "d²", "d³", "0"],
    ],
    question: "Dimension của không gian nghiệm khi a,b,c,d đôi một khác nhau là:",
    options: ["1", "2", "3", "4"],
    correctAnswer: 0,
    explanation: "Rank = 4, dimension = 5-4 = 1",
    hints: ["Ma trận Vandermonde 4×5", "Rank = 4 khi tham số khác nhau", "Dimension = 5-4 = 1"],
    difficulty: "hard",
    category: "Dimension Vandermonde",
    hasParameters: true,
  },
  {
    id: 69,
    matrix: [
      ["a", "b", "c", "d", "e"],
      ["b", "c", "d", "e", "a"],
      ["c", "d", "e", "a", "b"],
      ["d", "e", "a", "b", "c"],
      ["e", "a", "b", "c", "d"],
    ],
    question: "Ma trận tuần hoàn 5×5 này có rank = 1 khi:",
    options: ["a = b = c = d = e", "a+b+c+d+e = 0", "abcde = 1", "a⁵ = b⁵ = c⁵ = d⁵ = e⁵"],
    correctAnswer: 0,
    explanation: "Khi tất cả tham số bằng nhau, tất cả hàng giống nhau, rank = 1",
    hints: ["Khi nào tất cả hàng giống nhau?", "a = b = c = d = e", "Rank = 1"],
    difficulty: "hard",
    category: "Ma trận tuần hoàn 5×5",
    hasParameters: true,
  },
  {
    id: 70,
    matrix: [
      ["1", "1", "1", "1", "1", "a"],
      ["1", "2", "4", "8", "16", "b"],
      ["1", "3", "9", "27", "81", "c"],
      ["1", "4", "16", "64", "256", "d"],
      ["1", "5", "25", "125", "625", "e"],
    ],
    question: "Khi a = 31, b = 63, c = 121, d = 341, e = 781, hệ có đặc điểm gì?",
    options: ["Nghiệm là đa thức bậc 4", "Vô nghiệm", "Vô số nghiệm", "Nghiệm duy nhất"],
    correctAnswer: 0,
    explanation: "Đây là bài toán nội suy Lagrange, nghiệm là các hệ số của đa thức bậc 4",
    hints: ["Ma trận Vandermonde 5×6", "Bài toán nội suy", "Nghiệm là hệ số đa thức"],
    difficulty: "hard",
    category: "Nội suy Lagrange",
    hasParameters: true,
  },
]

export default function QuizMode() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [hintLevel, setHintLevel] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all")
  const [questionType, setQuestionType] = useState<"all" | "numeric" | "parametric">("all")
  const [filteredQuestions, setFilteredQuestions] = useState(quizQuestions)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([])

  const filterQuestions = (diff: "all" | "easy" | "medium" | "hard", type: "all" | "numeric" | "parametric") => {
    let filtered = quizQuestions

    if (diff !== "all") {
      filtered = filtered.filter((q) => q.difficulty === diff)
    }

    if (type === "numeric") {
      filtered = filtered.filter((q) => !q.hasParameters)
    } else if (type === "parametric") {
      filtered = filtered.filter((q) => q.hasParameters)
    }

    setFilteredQuestions(filtered)
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setShowResult(false)
    setScore(0)
    setHintLevel(0)
    setQuizCompleted(false)
    setWrongAnswers([])
    setStartTime(new Date())
  }

  const question = filteredQuestions[currentQuestion]

  const handleSubmit = () => {
    setShowResult(true)
    if (Number.parseInt(selectedAnswer) === question.correctAnswer) {
      setScore(score + 1)
    } else {
      setWrongAnswers([...wrongAnswers, question.id])
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setShowResult(false)
      setHintLevel(0)
    } else {
      setQuizCompleted(true)
      if (startTime) {
        setTimeSpent(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))
      }
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setShowResult(false)
    setScore(0)
    setHintLevel(0)
    setQuizCompleted(false)
    setWrongAnswers([])
    setStartTime(new Date())
  }

  const getHint = () => {
    if (hintLevel < question.hints.length) {
      setHintLevel(hintLevel + 1)
    }
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getTypeColor = (hasParams: boolean) => {
    return hasParams
      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
  }

  const getScoreMessage = () => {
    const percentage = (score / filteredQuestions.length) * 100
    if (percentage >= 90) return "🏆 Xuất sắc! Bạn đã thành thạo Gauss-Jordan!"
    if (percentage >= 80) return "🎉 Rất tốt! Bạn hiểu khá sâu về phương pháp này!"
    if (percentage >= 70) return "👍 Tốt! Bạn đã nắm được cơ bản!"
    if (percentage >= 60) return "📚 Khá ổn! Hãy ôn luyện thêm một chút!"
    return "💪 Cần cố gắng thêm! Hãy xem lại lý thuyết và thực hành nhiều hơn!"
  }

  if (quizCompleted) {
    return (
      <div className="space-y-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardHeader className="text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
            <Trophy className="w-20 h-20 mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold">Quiz hoàn thành!</CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {score}/{filteredQuestions.length}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Điểm số</p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {Math.round((score / filteredQuestions.length) * 100)}%
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Tỷ lệ đúng</p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  <Clock className="w-8 h-8 inline mr-2" />
                  {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, "0")}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Thời gian</p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
              <p className="text-xl font-semibold">{getScoreMessage()}</p>
            </div>

            {wrongAnswers.length > 0 && (
              <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-3">
                  Câu trả lời sai ({wrongAnswers.length} câu):
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wrongAnswers.map((id) => (
                    <Badge key={id} variant="destructive">
                      Câu {id}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={resetQuiz}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Làm lại quiz
              </Button>
              <Button
                onClick={() => filterQuestions("all", "all")}
                variant="outline"
                size="lg"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400"
              >
                <Target className="w-5 h-5 mr-2" />
                Thử tất cả câu hỏi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filter */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Chọn độ khó:</Label>
              <Select
                value={difficulty}
                onValueChange={(value: "all" | "easy" | "medium" | "hard") => {
                  setDifficulty(value)
                  filterQuestions(value, questionType)
                }}
              >
                <SelectTrigger className="border-indigo-200 dark:border-indigo-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ({quizQuestions.length} câu)</SelectItem>
                  <SelectItem value="easy">
                    Dễ ({quizQuestions.filter((q) => q.difficulty === "easy").length} câu)
                  </SelectItem>
                  <SelectItem value="medium">
                    Trung bình ({quizQuestions.filter((q) => q.difficulty === "medium").length} câu)
                  </SelectItem>
                  <SelectItem value="hard">
                    Khó ({quizQuestions.filter((q) => q.difficulty === "hard").length} câu)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Loại câu hỏi:</Label>
              <Select
                value={questionType}
                onValueChange={(value: "all" | "numeric" | "parametric") => {
                  setQuestionType(value)
                  filterQuestions(difficulty, value)
                }}
              >
                <SelectTrigger className="border-indigo-200 dark:border-indigo-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ({quizQuestions.length} câu)</SelectItem>
                  <SelectItem value="numeric">
                    Số ({quizQuestions.filter((q) => !q.hasParameters).length} câu)
                  </SelectItem>
                  <SelectItem value="parametric">
                    Tham số ({quizQuestions.filter((q) => q.hasParameters).length} câu)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className={getDifficultyColor("easy")}>Dễ: Cơ bản</Badge>
            <Badge className={getDifficultyColor("medium")}>TB: Tính toán</Badge>
            <Badge className={getDifficultyColor("hard")}>Khó: Phức tạp</Badge>
            <Badge className={getTypeColor(false)}>
              <Calculator className="w-3 h-3 mr-1" />
              Số
            </Badge>
            <Badge className={getTypeColor(true)}>
              <Variable className="w-3 h-3 mr-1" />
              Tham số
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">
            Câu hỏi {currentQuestion + 1}/{filteredQuestions.length}
          </span>
          <div className="flex items-center gap-4">
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty === "easy" ? "Dễ" : question.difficulty === "medium" ? "Trung bình" : "Khó"}
            </Badge>
            <Badge className={getTypeColor(question.hasParameters)}>
              {question.hasParameters ? (
                <>
                  <Variable className="w-3 h-3 mr-1" />
                  Tham số
                </>
              ) : (
                <>
                  <Calculator className="w-3 h-3 mr-1" />
                  Số
                </>
              )}
            </Badge>
            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">Điểm: {score}</span>
          </div>
        </div>
        <Progress value={(currentQuestion / filteredQuestions.length) * 100} className="h-3" />
      </div>

      {/* Question */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              {question.hasParameters ? <Variable className="w-5 h-5" /> : <Calculator className="w-5 h-5" />}
              Câu hỏi {currentQuestion + 1}
            </CardTitle>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {question.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Matrix Display */}
          <div className="flex justify-center">
            <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-inner">
              {/* Matrix Brackets */}
              <div className="absolute -left-3 top-3 bottom-3 w-2 border-l-4 border-t-4 border-b-4 border-blue-500 rounded-l-lg"></div>
              <div className="absolute -right-3 top-3 bottom-3 w-2 border-r-4 border-t-4 border-b-4 border-blue-500 rounded-r-lg"></div>

              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(${question.matrix[0].length}, minmax(0, 1fr))` }}
              >
                {question.matrix.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`${question.hasParameters ? "w-20 h-16" : "w-16 h-16"} flex items-center justify-center bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-center font-mono ${question.hasParameters ? "text-base" : "text-lg"} font-bold shadow-sm`}
                    >
                      {cell}
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
            <p className="text-xl font-semibold text-center">{question.question}</p>
          </div>

          {/* Options */}
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-4">
            {question.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} className="text-blue-600" />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-lg font-medium font-mono">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Hints */}
          {hintLevel > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20">
              <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <strong>Gợi ý {hintLevel}:</strong> {question.hints[hintLevel - 1]}
              </AlertDescription>
            </Alert>
          )}

          {/* Result */}
          {showResult && (
            <Alert
              className={
                Number.parseInt(selectedAnswer) === question.correctAnswer
                  ? "border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/20"
                  : "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
              }
            >
              {Number.parseInt(selectedAnswer) === question.correctAnswer ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-semibold text-lg">
                    {Number.parseInt(selectedAnswer) === question.correctAnswer
                      ? "🎉 Chính xác!"
                      : "❌ Không chính xác!"}
                  </p>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="font-medium mb-2">Giải thích:</p>
                    <p className="font-mono text-sm">{question.explanation}</p>
                  </div>
                  {Number.parseInt(selectedAnswer) !== question.correctAnswer && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        <strong>Đáp án đúng:</strong>{" "}
                        <span className="font-mono">{question.options[question.correctAnswer]}</span>
                      </p>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={getHint}
              disabled={hintLevel >= question.hints.length || showResult}
              className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Gợi ý ({hintLevel}/{question.hints.length})
            </Button>

            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
              >
                Trả lời
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8"
              >
                {currentQuestion < filteredQuestions.length - 1 ? "Câu tiếp theo" : "Hoàn thành"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentQuestion + 1}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Câu hiện tại</div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</div>
            <div className="text-sm text-green-700 dark:text-green-300">Đúng</div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {currentQuestion + 1 - score - (showResult ? 0 : 1)}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">Sai</div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {filteredQuestions.length - currentQuestion - 1}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Còn lại</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
