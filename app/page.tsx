'use client'

import { useState, useEffect } from 'react'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event
      if (key >= '0' && key <= '9') {
        inputNumber(parseInt(key))
      } else if (key === '.') {
        inputDot()
      } else if (['+', '-', '*', '/'].includes(key)) {
        performOperation(key === '*' ? '×' : key === '/' ? '÷' : key)
      } else if (key === 'Enter' || key === '=') {
        performOperation('=')
      } else if (key === 'Escape') {
        clear()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [display, previousValue, operation, waitingForOperand])

  const inputNumber = (num: number) => {
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const result = calculate(currentValue, inputValue, operation)

      if (nextOperation === '=') {
        setHistory(prev => [...prev, `${currentValue} ${operation} ${inputValue} = ${result}`].slice(-5))
      }

      setDisplay(String(result))
      setPreviousValue(result)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation === '=' ? null : nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+': return firstValue + secondValue
      case '-': return firstValue - secondValue
      case '×': return firstValue * secondValue
      case '÷': return firstValue / secondValue
      default: return secondValue
    }
  }

  const Button = ({ onClick, className, children }: { onClick: () => void, className: string, children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`h-16 text-xl font-semibold rounded-lg transition-all duration-150 active:scale-95 ${className}`}
    >
      {children}
    </button>
  )

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Calculator</h1>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-4">
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-right text-3xl font-mono text-gray-800 dark:text-white break-all">
                  {display}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <Button onClick={clear} className="col-span-2 bg-red-500 hover:bg-red-600 text-white">
                  Clear
                </Button>
                <Button onClick={() => performOperation('÷')} className="bg-blue-500 hover:bg-blue-600 text-white">
                  ÷
                </Button>
                <Button onClick={() => performOperation('×')} className="bg-blue-500 hover:bg-blue-600 text-white">
                  ×
                </Button>

                {[7, 8, 9].map(num => (
                  <Button key={num} onClick={() => inputNumber(num)} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white">
                    {num}
                  </Button>
                ))}
                <Button onClick={() => performOperation('-')} className="bg-blue-500 hover:bg-blue-600 text-white">
                  -
                </Button>

                {[4, 5, 6].map(num => (
                  <Button key={num} onClick={() => inputNumber(num)} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white">
                    {num}
                  </Button>
                ))}
                <Button onClick={() => performOperation('+')} className="bg-blue-500 hover:bg-blue-600 text-white">
                  +
                </Button>

                {[1, 2, 3].map(num => (
                  <Button key={num} onClick={() => inputNumber(num)} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white">
                    {num}
                  </Button>
                ))}
                <Button onClick={() => performOperation('=')} className="row-span-2 bg-green-500 hover:bg-green-600 text-white">
                  =
                </Button>

                <Button onClick={() => inputNumber(0)} className="col-span-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white">
                  0
                </Button>
                <Button onClick={inputDot} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white">
                  .
                </Button>
              </div>
            </div>

            {history.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">History</h2>
                <div className="space-y-2">
                  {history.slice().reverse().map((calc, index) => (
                    <div key={index} className="text-sm font-mono text-gray-600 dark:text-gray-400 animate-fade-in">
                      {calc}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}