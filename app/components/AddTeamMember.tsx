"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type StackLayer = "database" | "api" | "ui"

interface AddTeamMemberProps {
  onAdd: (name: string, layer: StackLayer) => void
  onConfigUpdate: (teamName: string, teamInfo: string) => void
  initialTeamName: string
  initialTeamInfo: string
}

export function AddTeamMember({ onAdd, onConfigUpdate, initialTeamName, initialTeamInfo }: AddTeamMemberProps) {
  const [newName, setNewName] = useState("")
  const [selectedLayer, setSelectedLayer] = useState<StackLayer>("database")
  const [teamName, setTeamName] = useState(initialTeamName)
  const [teamInfo, setTeamInfo] = useState(initialTeamInfo)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newName.trim()) {
      onAdd(newName, selectedLayer)
      setNewName("")
    }
  }

  const handleConfigUpdate = () => {
    onConfigUpdate(teamName, teamInfo)
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Team Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="mb-2"
            />
            <Textarea
              value={teamInfo}
              onChange={(e) => setTeamInfo(e.target.value)}
              placeholder="Enter team information or motivational message"
              className="mb-2"
            />
            <Button type="button" onClick={handleConfigUpdate}>
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
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

