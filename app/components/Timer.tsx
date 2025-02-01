"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface TimerProps {
  defaultTime: string
}

interface PostStandupItem {
  id: number
  text: string
  discussed: boolean
}

export function Timer({ defaultTime }: TimerProps) {
  const [time, setTime] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("defaultTimer") || defaultTime
    }
    return defaultTime
  })
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(() => {
    const [minutes, seconds] = time.split(":").map(Number)
    return minutes * 60 + seconds
  })
  const [newItem, setNewItem] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  useEffect(() => {
    const [minutes, seconds] = time.split(":").map(Number)
    if (!isNaN(minutes) && !isNaN(seconds)) {
      setTimeLeft(minutes * 60 + seconds)
    }
  }, [time])

  // Save to localStorage when time changes
  useEffect(() => {
    if (time.match(/^\d{1,2}:\d{2}$/)) {
      localStorage.setItem("defaultTimer", time)
    }
  }, [time])

  const [updateTrigger, setUpdateTrigger] = useState(0)

  const startTimer = () => {
    const [minutes, seconds] = time.split(":").map(Number)
    setTimeLeft(minutes * 60 + seconds)
    setIsRunning(true)
  }

  const stopTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    const [minutes, seconds] = time.split(":").map(Number)
    setTimeLeft(minutes * 60 + seconds)
  }

  const addItem = () => {
    if (newItem.trim()) {
      const savedItems = localStorage.getItem("postStandupItems")
      const currentItems: PostStandupItem[] = savedItems ? JSON.parse(savedItems) : []
      const newItems = [...currentItems, { id: Date.now(), text: newItem.trim(), discussed: false }]
      localStorage.setItem("postStandupItems", JSON.stringify(newItems))
      
      // Dispatch custom event to notify PostStandupItems
      window.dispatchEvent(new Event('postStandupItemsUpdated'))
      
      setNewItem("")
      toast({
        title: "Item Added",
        description: "Post-standup item has been added.",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addItem()
    }
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <Input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="MM:SS"
          className="w-24 text-center"
        />
        <div className="text-6xl font-mono">{formatTime(timeLeft)}</div>
        <div className="space-x-2">
          {!isRunning ? (
            <Button onClick={startTimer}>Start</Button>
          ) : (
            <Button onClick={stopTimer} variant="destructive">Stop</Button>
          )}
          <Button onClick={resetTimer} variant="outline">Reset</Button>
        </div>
      </div>
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Add Post-Standup Item</h3>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a post-standup item"
            className="flex-grow"
          />
          <Button onClick={addItem} variant="outline">Add</Button>
        </div>
      </div>
    </div>
  )
}

