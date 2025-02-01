"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

interface PostStandupItem {
  id: number
  text: string
  discussed: boolean
}

export function PostStandupItems() {
  const [items, setItems] = useState<PostStandupItem[]>([])
  const [newItem, setNewItem] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const savedItems = localStorage.getItem("postStandupItems")
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("postStandupItems", JSON.stringify(items))
  }, [items])

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { id: Date.now(), text: newItem.trim(), discussed: false }])
      setNewItem("")
    }
  }

  const toggleItemDiscussed = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, discussed: !item.discussed } : item)))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addItem()
    }
  }

  const copyItems = () => {
    const itemsToCopy = items.map((item) => `- ${item.text} ${item.discussed ? "(Discussed)" : ""}`).join("\n")
    navigator.clipboard.writeText(itemsToCopy)
    toast({
      title: "Copied!",
      description: "Post-standup items copied to clipboard.",
    })
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Post-Standup Items</span>
          <Button onClick={copyItems} variant="outline">
            Copy Items
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a post-standup item"
            className="flex-grow"
          />
          <Button onClick={addItem} variant="outline">
            Add
          </Button>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`item-${item.id}`}
                checked={item.discussed}
                onCheckedChange={() => toggleItemDiscussed(item.id)}
              />
              <label
                htmlFor={`item-${item.id}`}
                className={`flex-grow ${item.discussed ? "line-through text-muted-foreground" : ""}`}
              >
                {item.text}
              </label>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

