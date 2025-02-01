"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"
import { useState } from "react"

type StackLayer = "database" | "api" | "ui"

interface ConfigurationProps {
  onAdd: (name: string, layer: StackLayer) => void
  onConfigUpdate: (teamName: string, teamInfo: string | null) => void
  initialTeamName: string
  initialTeamInfo: string | null
}

export function Configuration({ onAdd, onConfigUpdate, initialTeamName, initialTeamInfo }: ConfigurationProps) {
  const [newName, setNewName] = useState("")
  const [selectedLayer, setSelectedLayer] = useState<StackLayer>("database")
  const [teamName, setTeamName] = useState(initialTeamName)
  const [teamInfo, setTeamInfo] = useState(initialTeamInfo || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newName.trim()) {
      onAdd(newName, selectedLayer)
      setNewName("")
    }
  }

  const handleConfigUpdate = () => {
    onConfigUpdate(teamName, teamInfo || null)
  }

  const handleDeleteInfo = () => {
    setTeamInfo("")
    onConfigUpdate(teamName, null)
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="mb-2"
            />
            <div className="flex items-center space-x-2">
              <Textarea
                value={teamInfo}
                onChange={(e) => setTeamInfo(e.target.value)}
                placeholder="Enter team information or motivational message"
                className="mb-2 flex-grow"
              />
              <Button type="button" variant="destructive" onClick={handleDeleteInfo}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleConfigUpdate}
              className="bg-background hover:bg-accent"
            >
              Update Configuration
            </Button>
          </div>
          <div className="border-t pt-4">
            <CardTitle className="mb-2">Add Team Member</CardTitle>
            <Select value={selectedLayer} onValueChange={(value) => setSelectedLayer(value as StackLayer)}>
              <SelectTrigger>
                <SelectValue placeholder="Select layer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="ui">UI</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter name"
              className="my-2"
            />
            <Button 
              type="submit" 
              variant="outline"
              onClick={handleSubmit}
              className="bg-background hover:bg-accent"
            >
              Add Member
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

