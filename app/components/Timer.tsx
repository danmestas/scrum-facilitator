"use client"

import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, useAnimation, useAnimationControls } from "framer-motion"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface TimerProps {
  defaultTime: string
  onTimeEnd?: (isEliminated?: boolean) => void
}

interface PostStandupItem {
  id: number
  text: string
  discussed: boolean
}

// Add these animation variants at the top of the file
const timerVariants = {
  normal: { scale: 1, color: "#ffffff" },
  warning: { 
    scale: [1, 1.05, 1],
    color: "#f59e0b",
    transition: { 
      duration: 1,
      repeat: Infinity
    }
  },
  urgent: {
    scale: [1, 1.1, 1],
    color: "#ef4444",
    transition: {
      duration: 0.5,
      repeat: Infinity
    }
  },
  critical: {
    scale: [1, 1.2, 1],
    color: "#dc2626",
    rotate: [0, -2, 2, 0],
    transition: {
      duration: 0.3,
      repeat: Infinity
    }
  }
};

const shakeVariants = {
  shake: {
    x: [-2, 2, -2, 2, 0],
    transition: { duration: 0.5, repeat: Infinity }
  }
};

const explosionVariants = {
  hidden: { 
    scale: 0,
    opacity: 0 
  },
  visible: (i: number) => ({
    scale: [1, 0],
    opacity: [1, 0],
    x: Math.random() * 500 - 250,
    y: Math.random() * 500 - 250,
    transition: { 
      duration: 0.8,
      delay: i * 0.02,
      ease: "easeOut"
    }
  })
};

export function Timer({ defaultTime, onTimeEnd }: TimerProps) {
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
  const [timeIsUp, setTimeIsUp] = useState(false)
  const [timerFinished, setTimerFinished] = useState(false)

  const controls = useAnimationControls();

  // Create explosion particles array
  const explosionParticles = Array.from({ length: 50 }, (_, i) => i);

  // Separate useEffect for cleanup
  useEffect(() => {
    return () => {
      setTimeIsUp(false);
      setIsRunning(false);
    };
  }, []);

  // Update the timer effect to handle explosion
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            setTimeIsUp(true);
            onTimeEnd?.(); // Notify parent
            return 0;
          }
          
          const newTime = prev - 1;
          if (newTime <= 30) {
            if (newTime > 20) {
              controls.start("warning");
            } else if (newTime > 10) {
              controls.start("urgent");
            } else {
              controls.start("critical");
            }
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, timeLeft, controls, onTimeEnd]);

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
    setTimeIsUp(false)
    const [minutes, seconds] = time.split(":").map(Number)
    setTimeLeft(minutes * 60 + seconds)
    setIsRunning(true)
    
    // Reset animation state
    controls.start("normal")
  }

  const stopTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false);
    setTimeIsUp(false);
    const [minutes, seconds] = time.split(":").map(Number);
    setTimeLeft(minutes * 60 + seconds);
    
    // Stop all animations and reset to normal state
    controls.stop(); // Stop any ongoing animations
    controls.set({ // Immediately set to initial state
      scale: 1,
      color: "#ffffff",
      rotate: 0,
      x: 0,
      y: 0
    });
    controls.start("normal");
    
    onTimeEnd?.(false);
  };

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
    <div className="space-y-4 relative">
      <div className="flex flex-col items-center space-y-4">
        <Input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="MM:SS"
          className="w-24 text-center"
        />
        <motion.div 
          className="text-6xl font-mono"
          animate={controls}
          variants={timerVariants}
        >
          {formatTime(timeLeft)}
        </motion.div>
        
        {/* Explosion effect */}
        {timeIsUp && (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial="hidden"
            animate="visible"
          >
            {explosionParticles.map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={explosionVariants}
                className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#ef4444' : '#f59e0b'
                }}
              />
            ))}
          </motion.div>
        )}

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

