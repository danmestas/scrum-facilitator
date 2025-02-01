"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TimerProps {
  defaultTime: string
}

export function Timer({ defaultTime }: TimerProps) {
  const [time, setTime] = useState(parseTimeString(defaultTime))
  const [isRunning, setIsRunning] = useState(false)
  const [inputTime, setInputTime] = useState("")

  useEffect(() => {
    const savedTime = localStorage.getItem("lastSelectedTime")
    if (savedTime) {
      setTime(parseTimeString(savedTime))
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsRunning(false)
    }

    return () => clearInterval(interval)
  }, [isRunning, time])

  const startTimer = () => {
    if (inputTime) {
      const newTime = parseTimeString(inputTime)
      setTime(newTime)
      localStorage.setItem("lastSelectedTime", formatTime(newTime))
      setInputTime("")
    } else if (time === 0) {
      setTime(parseTimeString(defaultTime))
    }
    setIsRunning(true)
  }

  const stopTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    const savedTime = localStorage.getItem("lastSelectedTime") || defaultTime
    setTime(parseTimeString(savedTime))
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  function parseTimeString(timeString: string): number {
    const [minutes, seconds] = timeString.split(":").map(Number)
    return minutes * 60 + (seconds || 0)
  }

  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-4 text-primary">{formatTime(time)}</div>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={inputTime}
          onChange={(e) => setInputTime(e.target.value)}
          placeholder="Enter a time, i.e. 2:25"
          className="w-48"
        />
        <Button onClick={startTimer} disabled={isRunning} variant="outline">
          Start
        </Button>
        <Button onClick={stopTimer} disabled={!isRunning} variant="destructive">
          Stop
        </Button>
        <Button onClick={resetTimer} variant="secondary">
          Reset
        </Button>
      </div>
    </div>
  )
}

