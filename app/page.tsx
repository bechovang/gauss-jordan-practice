"use client"

import { useState, useEffect } from "react"
import { Calculator, BookOpen, Trophy, Settings, Moon, Sun } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import MatrixCalculator from "@/components/matrix-calculator"
import QuizMode from "@/components/quiz-mode"
import LearningResources from "@/components/learning-resources"
import SettingsPanel from "@/components/settings-panel"

export default function GaussJordanApp() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("calculator")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-all duration-500">
      {/* Header */}
      <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Image src="/bechovang.webp" alt="Logo" width={28} height={28} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gauss-Jordan Calculator
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Công cụ học tập tương tác cho phép khử Gauss-Jordan
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full h-12 w-12 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-blue-600" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border shadow-lg">
            <TabsTrigger
              value="calculator"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Máy tính</span>
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger
              value="learning"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Học tập</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Cài đặt</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardTitle className="text-2xl">Máy tính Gauss-Jordan</CardTitle>
                <CardDescription className="text-base">
                  Nhập ma trận và xem quá trình khử Gauss-Jordan từng bước một cách trực quan
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <MatrixCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <CardTitle className="text-2xl">Chế độ Quiz</CardTitle>
                <CardDescription className="text-base">
                  Thử thách bản thân với các bài tập tương tác và kiểm tra hiểu biết
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <QuizMode />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardTitle className="text-2xl">Tài liệu học tập</CardTitle>
                <CardDescription className="text-base">
                  Tìm hiểu về phương pháp Gauss-Jordan và các khái niệm liên quan
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <LearningResources />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                <CardTitle className="text-2xl">Cài đặt</CardTitle>
                <CardDescription className="text-base">
                  Tùy chỉnh trải nghiệm sử dụng theo sở thích của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <SettingsPanel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/90 dark:bg-gray-900/90 backdrop-blur-md mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              © 2024 Gauss-Jordan Calculator. Công cụ học tập tương tác cho toán học.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
              Được phát triển với ❤️ để hỗ trợ việc học toán
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
