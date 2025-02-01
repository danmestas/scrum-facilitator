"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const [teamName, setTeamName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('teamName') || initialTeamName
    }
    return initialTeamName
  })
  const [teamInfo, setTeamInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('teamInfo') || initialTeamInfo
    }
    return initialTeamInfo
  })
  const [teamMembers, setTeamMembers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('teamMembers')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('teamName', teamName)
    localStorage.setItem('teamInfo', teamInfo)
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers))
    // Notify parent component of changes
    onConfigUpdate(teamName, teamInfo)
  }, [teamName, teamInfo, teamMembers, onConfigUpdate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newName.trim()) {
      onAdd(newName, selectedLayer)
      setNewName("")
    }
  }

  const handleAddMember = (name: string, layer: StackLayer) => {
    setTeamMembers((prev: { name: string; layer: StackLayer }[]) => [...prev, { name, layer }])
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

