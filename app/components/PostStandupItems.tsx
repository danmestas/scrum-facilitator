"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface PostStandupItem {
  id: number
  text: string
  discussed: boolean
  markedForDeletion?: boolean
}

export function PostStandupItems() {
  const [items, setItems] = useState<PostStandupItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem("postStandupItems")
      const allItems = savedItems ? JSON.parse(savedItems) : []
      // Only show non-discussed items on initial load
      return allItems.filter((item: PostStandupItem) => !item.discussed)
    }
    return []
  })
  const [newItem, setNewItem] = useState("")
  const { toast } = useToast()

  // Save to localStorage whenever items change
  useEffect(() => {
    const savedItems = localStorage.getItem("postStandupItems")
    const currentItems = savedItems ? JSON.parse(savedItems) : []
    
    // Update existing items while preserving non-displayed items
    const updatedItems = currentItems.map((savedItem: PostStandupItem) => {
      const matchingItem = items.find(item => item.id === savedItem.id)
      return matchingItem || savedItem
    })

    localStorage.setItem("postStandupItems", JSON.stringify(updatedItems))
  }, [items])

  // Add this new useEffect
  useEffect(() => {
    const loadItems = () => {
      const savedItems = localStorage.getItem("postStandupItems")
      const allItems = savedItems ? JSON.parse(savedItems) : []
      setItems(allItems.filter((item: PostStandupItem) => !item.discussed))
    }

    window.addEventListener('storage', loadItems)
    // Also listen for a custom event
    window.addEventListener('postStandupItemsUpdated', loadItems)
    
    return () => {
      window.removeEventListener('storage', loadItems)
      window.removeEventListener('postStandupItemsUpdated', loadItems)
    }
  }, [])

  const addItem = () => {
    if (newItem.trim()) {
      const newItems = [...items, { id: Date.now(), text: newItem.trim(), discussed: false }]
      setItems(newItems)
      localStorage.setItem("postStandupItems", JSON.stringify(newItems))
      setNewItem("")
      toast({
        title: "Item Added",
        description: "Post-standup item has been added.",
      })
    }
  }

  const toggleItemDiscussed = (id: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, discussed: !item.discussed }
        : item
    ))
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
          {items
            .filter(item => !item.markedForDeletion || item.discussed)
            .map((item) => (
              <li key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`item-${item.id}`}
                  checked={item.discussed}
                  onCheckedChange={() => toggleItemDiscussed(item.id)}
                />
                <label
                  htmlFor={`item-${item.id}`}
                  className={`flex-grow ${
                    item.discussed 
                      ? "line-through text-muted-foreground opacity-50" 
                      : ""
                  }`}
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

