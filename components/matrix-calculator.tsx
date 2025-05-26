"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Zap, Calculator, Variable } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MatrixStep {
  matrix: string[][]
  operation: string
  pivotRow?: number
  pivotCol?: number
  targetRow?: number
  isSymbolicStep: boolean
}

export default function MatrixCalculator() {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(4)
  const [matrix, setMatrix] = useState<string[][]>([])
  const [steps, setSteps] = useState<MatrixStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState([1000])
  const [showFractions, setShowFractions] = useState(true)
  const [precision, setPrecision] = useState(3)
  const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set())
  const [symbolicMode, setSymbolicMode] = useState(false)

  // Helper function to calculate Greatest Common Divisor (GCD) - Iterative
  const gcd = (a: number, b: number): number => {
    // Ensure inputs are rounded to handle potential floating point dust
    // and take absolute values as GCD is typically for positive integers.
    let numA = Math.abs(Math.round(a));
    let numB = Math.abs(Math.round(b));

    if (isNaN(numA) || isNaN(numB)) return 1; // Fallback for NaN inputs
    if (numB === 0) return numA; // GCD(a,0) = a

    while (numB !== 0) {
      const temp = numB;
      numB = numA % numB;
      numA = temp;
    }
    return numA;
  };

  // Initialize matrix
  useEffect(() => {
    const newMatrix = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("0"))
    setMatrix(newMatrix)
    setSteps([])
    setCurrentStep(0)
  }, [rows, cols])

  // Auto-play functionality with animation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          // Trigger animation
          setAnimatingCells(new Set([`${prev + 1}`]))
          setTimeout(() => setAnimatingCells(new Set()), 600)
          return prev + 1
        })
      }, speed[0])
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, steps.length, speed])

  const updateMatrixValue = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix]
    newMatrix[row][col] = value || "0"
    setMatrix(newMatrix)
  }

  const isValidInput = (input: string): boolean => {
    // Allow numbers, parameters (a-z, A-Z), basic operations (+, -, *, /, ^), parentheses
    const validPattern = /^[a-zA-Z0-9+\-*/^().\s]*$/
    return validPattern.test(input)
  }

  const formatExpression = (expr: string): string => {
    if (!expr || expr === "0") return "0"

    // Clean up the expression
    const cleaned = expr.replace(/\s+/g, "")

    // Handle simple cases
    if (cleaned === "") return "0"
    if (cleaned === "-") return "0"
    if (cleaned === "+") return "0"

    return cleaned
  }

  const isNumeric = (str: string): boolean => {
    return !isNaN(Number(str)) && !isNaN(Number.parseFloat(str))
  }

  const simplifyExpression = (expr: string): string => {
    if (!expr || expr === "0" || expr === "") return "0"

    try {
      // Handle simple arithmetic with numbers
      if (/^[\d+\-*/().\s]+$/.test(expr)) {
        const result = Function(`"use strict"; return (${expr})`)()
        return result.toString()
      }

      // Simplify common patterns
      let simplified = expr
        .replace(/\s+/g, "")
        .replace(/\+-/g, "-")
        .replace(/-\+/g, "-")
        .replace(/\+\+/g, "+")
        .replace(/--/g, "+")

      // Handle patterns like (a)-(2)*(2) => a-4
      simplified = simplified.replace(/$$(\w+)$$-$$(\d+)$$\*$$(\d+)$$/g, (match, var1, num1, num2) => {
        const result = Number(num1) * Number(num2)
        return `${var1}-${result}`
      })

      // Handle patterns like (a)+(2)*(3) => a+6
      simplified = simplified.replace(/$$(\w+)$$\+$$(\d+)$$\*$$(\d+)$$/g, (match, var1, num1, num2) => {
        const result = Number(num1) * Number(num2)
        return `${var1}+${result}`
      })

      // Handle patterns like (2)*(a) => 2a
      simplified = simplified.replace(/$$(\d+)$$\*$$(\w+)$$/g, "$1$2")

      // Handle patterns like (a)/(2) => a/2
      simplified = simplified.replace(/$$(\w+)$$\/$$(\d+)$$/g, "$1/$2")

      // Remove unnecessary parentheses around single variables or numbers
      simplified = simplified.replace(/$$(\w+)$$/g, "$1")
      simplified = simplified.replace(/$$(\d+)$$/g, "$1")

      // Handle multiplication of numbers
      simplified = simplified.replace(/(\d+)\*(\d+)/g, (match, num1, num2) => {
        return (Number(num1) * Number(num2)).toString()
      })

      return simplified || "0"
    } catch (error) {
      return expr
    }
  }

  const symbolicGaussJordan = () => {
    const newSteps: MatrixStep[] = []
    const currentMatrix = matrix.map((row) => [...row])

    newSteps.push({
      matrix: currentMatrix.map((row) => [...row]),
      operation: "🎯 Ma trận ban đầu với tham số - Bắt đầu quá trình khử Gauss-Jordan",
      isSymbolicStep: true,
    })

    const numRows = currentMatrix.length
    const numCols = currentMatrix[0].length

    for (let col = 0; col < Math.min(numRows, numCols - 1); col++) {
      // Find a suitable pivot (prefer non-zero constants or simple parameters)
      let pivotRow = col
      for (let row = col; row < numRows; row++) {
        const currentPivot = currentMatrix[row][col]
        if (currentPivot !== "0" && currentPivot !== "") {
          // Prefer numeric values or simple parameters
          if (isNumeric(currentPivot) || /^[a-zA-Z]$/.test(currentPivot)) {
            pivotRow = row
            break
          }
        }
      }

      // Skip if pivot is zero
      if (currentMatrix[pivotRow][col] === "0" || currentMatrix[pivotRow][col] === "") continue

      // Swap rows if needed
      if (pivotRow !== col) {
        ;[currentMatrix[col], currentMatrix[pivotRow]] = [currentMatrix[pivotRow], currentMatrix[col]]
        newSteps.push({
          matrix: currentMatrix.map((row) => [...row]),
          operation: `🔄 Hoán đổi hàng ${col + 1} ↔ hàng ${pivotRow + 1} để đưa pivot phù hợp lên trên`,
          pivotRow: col,
          targetRow: pivotRow,
          isSymbolicStep: true,
        })
      }

      const pivot = currentMatrix[col][col]

      // Make pivot 1 (if it's not already 1 or a simple parameter)
      if (pivot !== "1" && isNumeric(pivot) && Number(pivot) !== 1) {
        for (let j = 0; j < numCols; j++) {
          if (currentMatrix[col][j] !== "0") {
            if (isNumeric(currentMatrix[col][j])) {
              const value = Number(currentMatrix[col][j]) / Number(pivot)
              currentMatrix[col][j] = value.toString()
            } else {
              currentMatrix[col][j] = `(${currentMatrix[col][j]})/${pivot}`
            }
          }
        }
        newSteps.push({
          matrix: currentMatrix.map((row) => [...row]),
          operation: `➗ Chia hàng ${col + 1} cho ${pivot} để pivot = 1`,
          pivotRow: col,
          pivotCol: col,
          isSymbolicStep: true,
        })
      }

      // Eliminate column
      for (let row = 0; row < numRows; row++) {
        if (row !== col && currentMatrix[row][col] !== "0" && currentMatrix[row][col] !== "") {
          const factor = currentMatrix[row][col]
          const newRow = [...currentMatrix[row]]

          for (let j = 0; j < numCols; j++) {
            if (currentMatrix[col][j] !== "0") {
              if (newRow[j] === "0") {
                if (isNumeric(factor) && isNumeric(currentMatrix[col][j])) {
                  newRow[j] = (-Number(factor) * Number(currentMatrix[col][j])).toString()
                } else {
                  const expr = `-(${factor})*(${currentMatrix[col][j]})`
                  newRow[j] = simplifyExpression(expr)
                }
              } else {
                if (isNumeric(newRow[j]) && isNumeric(factor) && isNumeric(currentMatrix[col][j])) {
                  const result = Number(newRow[j]) - Number(factor) * Number(currentMatrix[col][j])
                  newRow[j] = result.toString()
                } else {
                  const expr = `(${newRow[j]})-(${factor})*(${currentMatrix[col][j]})`
                  newRow[j] = simplifyExpression(expr)
                }
              }
            }
          }

          currentMatrix[row] = newRow
          newSteps.push({
            matrix: currentMatrix.map((row) => [...row]),
            operation: `🎯 R${row + 1} = R${row + 1} - (${factor}) × R${col + 1} để khử phần tử tại (${row + 1}, ${col + 1})`,
            pivotRow: col,
            targetRow: row,
            pivotCol: col,
            isSymbolicStep: true,
          })
        }
      }
    }

    newSteps.push({
      matrix: currentMatrix.map((row) => [...row]),
      operation: "✅ Hoàn thành! Ma trận đã được khử với các tham số",
      isSymbolicStep: true,
    })

    setSteps(newSteps)
    setCurrentStep(0)
  }

  const numericGaussJordan = () => {
    const newSteps: MatrixStep[] = []
    const currentMatrix = matrix.map((row) =>
      row.map((cell) => {
        const num = Number.parseFloat(cell)
        return isNaN(num) ? 0 : num
      }),
    )

    newSteps.push({
      matrix: currentMatrix.map((row) => row.map((cell) => cell.toString())),
      operation: "🎯 Ma trận ban đầu - Bắt đầu quá trình khử Gauss-Jordan",
      isSymbolicStep: false,
    })

    const numRows = currentMatrix.length
    const numCols = currentMatrix[0].length

    for (let col = 0; col < Math.min(numRows, numCols - 1); col++) {
      // Find pivot
      let pivotRow = col
      for (let row = col + 1; row < numRows; row++) {
        if (Math.abs(currentMatrix[row][col]) > Math.abs(currentMatrix[pivotRow][col])) {
          pivotRow = row
        }
      }

      // Skip if pivot is zero
      if (Math.abs(currentMatrix[pivotRow][col]) < 1e-10) continue

      // Swap rows if needed
      if (pivotRow !== col) {
        ;[currentMatrix[col], currentMatrix[pivotRow]] = [currentMatrix[pivotRow], currentMatrix[col]]
        newSteps.push({
          matrix: currentMatrix.map((row) => row.map((cell) => cell.toString())),
          operation: `🔄 Hoán đổi hàng ${col + 1} ↔ hàng ${pivotRow + 1} để đưa pivot lớn nhất lên trên`,
          pivotRow: col,
          targetRow: pivotRow,
          isSymbolicStep: false,
        })
      }

      // Make pivot 1
      const pivot = currentMatrix[col][col]
      if (Math.abs(pivot) > 1e-10 && Math.abs(pivot - 1) > 1e-10) {
        const originalPivotForDesc = pivot;
        for (let j = 0; j < numCols; j++) {
          currentMatrix[col][j] /= pivot
        }
        newSteps.push({
          matrix: currentMatrix.map((row) => row.map((cell) => cell.toString())),
          operation: `➗ Chia hàng ${col + 1} cho ${formatNumber(originalPivotForDesc)} để pivot = 1`,
          pivotRow: col,
          pivotCol: col,
          isSymbolicStep: false,
        })
      }

      // Eliminate column
      for (let row = 0; row < numRows; row++) {
        if (row !== col && Math.abs(currentMatrix[row][col]) > 1e-10) {
          const factor = currentMatrix[row][col]
          for (let j = 0; j < numCols; j++) {
            currentMatrix[row][j] -= factor * currentMatrix[col][j]
          }
          newSteps.push({
            matrix: currentMatrix.map((row) => row.map((cell) => cell.toString())),
            operation: `🎯 R${row + 1} = R${row + 1} - (${formatNumber(factor)}) × R${col + 1} để khử phần tử tại (${row + 1}, ${col + 1})`,
            pivotRow: col,
            targetRow: row,
            pivotCol: col,
            isSymbolicStep: false,
          })
        }
      }
    }

    newSteps.push({
      matrix: currentMatrix.map((row) => row.map((cell) => cell.toString())),
      operation: "✅ Hoàn thành! Ma trận đã ở dạng bậc thang rút gọn (RREF)",
      isSymbolicStep: false,
    })

    setSteps(newSteps)
    setCurrentStep(0)
  }

  const formatNumber = (num: number): string => {
    if (num === 0) return "0";

    if (showFractions && !Number.isInteger(num)) {
      const sign = num < 0 ? -1 : 1;
      const absNum = Math.abs(num);

      const tolerance = 1.0e-9; // Tolerance for floating point comparisons
      let h1 = 1, h2 = 0, k1 = 0, k2 = 1; // Numerators and denominators for continued fraction
      let currentVal = absNum;
      const MAX_ITERATIONS = 15; // Limit iterations to prevent overly complex fractions or infinite loops
      let iterations = 0;

      for (iterations = 0; iterations < MAX_ITERATIONS; iterations++) {
        const integerPart = Math.floor(currentVal);
        
        // Standard algorithm for continued fractions
        let tempH = h1; h1 = integerPart * h1 + h2; h2 = tempH;
        let tempK = k1; k1 = integerPart * k1 + k2; k2 = tempK;

        if (k1 === 0) { // Should ideally not happen if k2 starts at 1
            iterations = MAX_ITERATIONS; // Force fallback
            break;
        }
        
        // Check for convergence: if the current fraction is close enough to the original number
        if (Math.abs(absNum - h1 / k1) <= tolerance) {
          break;
        }
        
        currentVal = 1 / (currentVal - integerPart); // Calculate the next term
        
        // Check for invalid state or overly large denominator
        if (isNaN(currentVal) || !isFinite(currentVal) || k1 > 1000000) { 
          iterations = MAX_ITERATIONS; // Force fallback
          break;
        }
      }
      
      if (iterations >= MAX_ITERATIONS || k1 === 0 || h1 / k1 === Infinity) {
        // Fallback to decimal representation if fraction conversion fails or is too complex
        const factor = Math.pow(10, precision);
        return (Math.round(num * factor) / factor).toString();
      }

      const commonDivisor = gcd(h1, k1);
      
      let numerator = h1 / commonDivisor;
      let denominator = k1 / commonDivisor;

      numerator *= sign; // Reapply the original sign

      if (denominator === 1) {
        return numerator.toString();
      }
      // Ensure denominator is positive for conventional representation (e.g., -1/2 instead of 1/-2)
      if (denominator < 0) {
          numerator = -numerator;
          denominator = -denominator;
      }
      return `${numerator}/${denominator}`;
    }

    // For integers or when not showing fractions, format to the specified precision
    const factor = Math.pow(10, precision);
    return (Math.round(num * factor) / factor).toString();
  };

  const gaussJordanElimination = () => {
    if (symbolicMode) {
      symbolicGaussJordan()
    } else {
      numericGaussJordan()
    }
  }

  const loadParametricExample = () => {
    const exampleMatrix = [
      ["1", "2", "a", "3"],
      ["2", "a", "1", "5"],
      ["a", "1", "2", "4"],
    ]
    setRows(3)
    setCols(4)
    setMatrix(exampleMatrix)
    setSymbolicMode(true)
  }

  const loadNumericExample = () => {
    const exampleMatrix = [
      ["2", "1", "-1", "8"],
      ["-3", "-1", "2", "-11"],
      ["-2", "1", "2", "-3"],
    ]
    setRows(3)
    setCols(4)
    setMatrix(exampleMatrix)
    setSymbolicMode(false)
  }

  const getCurrentMatrix = () => {
    return steps.length > 0 ? steps[currentStep]?.matrix || matrix : matrix
  }

  const getCellClass = (row: number, col: number) => {
    if (steps.length === 0)
      return "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"

    const step = steps[currentStep]
    let classes = "transition-all duration-500 transform "

    if (step.pivotRow === row && step.pivotCol === col) {
      classes +=
        "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 border-blue-400 dark:border-blue-500 ring-2 ring-blue-400 dark:ring-blue-500 scale-105 shadow-lg "
    } else if (step.pivotRow === row) {
      classes +=
        "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-300 dark:border-green-600 "
    } else if (step.targetRow === row) {
      classes +=
        "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/50 border-yellow-300 dark:border-yellow-600 "
    } else if (step.pivotCol === col) {
      classes +=
        "bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 border-purple-300 dark:border-purple-600 "
    } else {
      classes += "border-gray-200 dark:border-gray-700 "
    }

    if (animatingCells.has(`${currentStep}`)) {
      classes += "animate-pulse "
    }

    return classes
  }

  const getMatrixCellSize = () => {
    if (symbolicMode) {
      // Dynamic sizing based on content length
      const maxLength = Math.max(
        ...getCurrentMatrix()
          .flat()
          .map((cell) => cell.length),
      )
      if (maxLength <= 3) return "w-20 h-16"
      if (maxLength <= 6) return "w-28 h-16"
      if (maxLength <= 10) return "w-36 h-16"
      return "w-44 h-20"
    }
    return "w-16 h-16"
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <Label className="text-blue-700 dark:text-blue-300 font-semibold">Số hàng</Label>
          <Select value={rows.toString()} onValueChange={(value) => setRows(Number.parseInt(value))}>
            <SelectTrigger className="mt-2 border-blue-200 dark:border-blue-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} hàng
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <Label className="text-green-700 dark:text-green-300 font-semibold">Số cột</Label>
          <Select value={cols.toString()} onValueChange={(value) => setCols(Number.parseInt(value))}>
            <SelectTrigger className="mt-2 border-green-200 dark:border-green-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} cột
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <Label className="text-purple-700 dark:text-purple-300 font-semibold">Tốc độ</Label>
          <Slider value={speed} onValueChange={setSpeed} max={3000} min={500} step={250} className="mt-3" />
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">{speed[0]}ms</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <Label className="text-orange-700 dark:text-orange-300 font-semibold">Độ chính xác</Label>
          <Slider
            value={[precision]}
            onValueChange={(value) => setPrecision(value[0])}
            max={6}
            min={1}
            step={1}
            className="mt-3"
          />
          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">{precision} chữ số</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200 dark:border-pink-700">
          <Label className="text-pink-700 dark:text-pink-300 font-semibold">Chế độ</Label>
          <div className="flex items-center gap-2 mt-3">
            <Calculator className="w-4 h-4" />
            <Switch checked={symbolicMode} onCheckedChange={setSymbolicMode} />
            <Variable className="w-4 h-4" />
          </div>
          <div className="text-xs text-pink-600 dark:text-pink-400 mt-1">{symbolicMode ? "Tham số" : "Số"}</div>
        </Card>
      </div>

      {/* Mode Info */}
      {symbolicMode && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20">
          <Variable className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Chế độ tham số:</strong> Bạn có thể nhập các tham số như a, b, k, m, x, y... và các biểu thức như
            2a, a+1, a-b, etc.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={gaussJordanElimination}
          disabled={steps.length > 0}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Zap className="w-4 h-4 mr-2" />
          Bắt đầu tính toán
        </Button>
        <Button
          onClick={loadParametricExample}
          variant="outline"
          className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20"
        >
          <Variable className="w-4 h-4 mr-2" />
          Ví dụ có tham số
        </Button>
        <Button
          onClick={loadNumericExample}
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Ví dụ số
        </Button>
        <Button
          onClick={() => {
            setSteps([])
            setCurrentStep(0)
            setIsPlaying(false)
          }}
          variant="outline"
          className="border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <div className="flex items-center gap-3 ml-auto">
          <Switch checked={showFractions} onCheckedChange={setShowFractions} />
          <Label className="font-medium">Hiển thị phân số</Label>
        </div>
      </div>

      {/* Enhanced Matrix Display */}
      <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              {symbolicMode ? <Variable className="w-6 h-6" /> : <Calculator className="w-6 h-6" />}
              Ma trận {symbolicMode ? "có tham số" : "số"}
            </CardTitle>
            {steps.length > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                Bước {currentStep + 1}/{steps.length}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Matrix Grid */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Matrix Brackets */}
                <div className="absolute -left-4 top-0 bottom-0 w-3 border-l-4 border-t-4 border-b-4 border-gray-400 dark:border-gray-500 rounded-l-lg"></div>
                <div className="absolute -right-4 top-0 bottom-0 w-3 border-r-4 border-t-4 border-b-4 border-gray-400 dark:border-gray-500 rounded-r-lg"></div>

                <div className="grid gap-2 p-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                  {getCurrentMatrix().map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      let displayValue = cell;
                      if (steps.length > 0 && currentStep < steps.length) {
                        const currentStepObject = steps[currentStep];
                        const cellFromStep = currentStepObject.matrix[rowIndex]?.[colIndex] ?? cell;

                        if (currentStepObject.isSymbolicStep) {
                          displayValue = simplifyExpression(cellFromStep);
                        } else {
                          const num = parseFloat(cellFromStep);
                          if (!isNaN(num)) {
                            displayValue = formatNumber(num);
                          } else {
                            displayValue = cellFromStep;
                          }
                        }
                      }

                      return (
                        <div key={`${rowIndex}-${colIndex}`} className="relative group">
                          <Input
                            type="text"
                            value={displayValue}
                            onChange={(e) => {
                              if (steps.length === 0 && isValidInput(e.target.value)) {
                                updateMatrixValue(rowIndex, colIndex, e.target.value)
                              }
                            }}
                            disabled={steps.length > 0}
                            placeholder={symbolicMode ? "a, 2b, x+1..." : "0"}
                            className={`
                              ${getMatrixCellSize()} 
                              text-center font-mono font-semibold
                              ${getCellClass(rowIndex, colIndex)}
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              disabled:opacity-100 disabled:cursor-default
                              ${(steps[currentStep]?.isSymbolicStep ?? symbolicMode) ? "text-xs leading-tight px-1 break-all" : "text-lg"}
                              resize-none overflow-hidden
                            `}
                            style={{
                              wordBreak: "break-all",
                              overflowWrap: "break-word",
                              whiteSpace: "normal",
                              lineHeight: (steps[currentStep]?.isSymbolicStep ?? symbolicMode) ? "1.2" : "1.5",
                            }}
                          />
                          {/* Tooltip for long expressions */}
                          {(steps[currentStep]?.isSymbolicStep ?? symbolicMode) && displayValue.length > 8 && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              {displayValue}
                            </div>
                          )}
                          {/* Separator line before last column */}
                          {colIndex === cols - 2 && (
                            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-0.5 h-8 bg-gray-400 dark:bg-gray-500"></div>
                          )}
                        </div>
                      );
                    }),
                  )}
                </div>
              </div>
            </div>

            {steps.length > 0 && (
              <div className="space-y-6">
                <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />

                {/* Enhanced Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="h-12 px-6"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={currentStep >= steps.length - 1}
                    className="h-12 px-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {isPlaying ? "Tạm dừng" : "Phát"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    disabled={currentStep >= steps.length - 1}
                    className="h-12 px-6"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Step Explanation */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
                  <CardContent className="p-6">
                    <p className="text-lg font-medium text-center text-gray-800 dark:text-gray-200 step-explanation">
                      {steps[currentStep]?.operation}
                    </p>
                  </CardContent>
                </Card>

                {/* Legend */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 border-2 border-blue-400 rounded"></div>
                    <span className="font-medium">Pivot</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-2 border-green-300 rounded"></div>
                    <span className="font-medium">Hàng pivot</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/50 border-2 border-yellow-300 rounded"></div>
                    <span className="font-medium">Hàng đích</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 border-2 border-purple-300 rounded"></div>
                    <span className="font-medium">Cột pivot</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
