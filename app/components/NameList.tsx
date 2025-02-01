"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type StackLayer = "database" | "api" | "ui"

interface TeamMember {
  name: string
  layer: StackLayer
}

interface NameListProps {
  members: TeamMember[]
  layer: StackLayer
  currentSpeaker: string | null
  setCurrentSpeaker: (name: string | null) => void
  copyNames: (layer: StackLayer) => void
  shuffleNames: (layer: StackLayer) => void
  onNameClick: (name: string) => void
  onDelete: (name: string, layer: StackLayer) => void
}

export function NameList({
  members,
  layer,
  currentSpeaker,
  setCurrentSpeaker,
  copyNames,
  shuffleNames,
  onNameClick,
  onDelete,
}: NameListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{layer.toUpperCase()}</span>
          <div>
            <Button onClick={() => copyNames(layer)} variant="outline" className="mr-2">
              Copy Names
            </Button>
            <Button onClick={() => shuffleNames(layer)} variant="outline">
              Shuffle
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-2 gap-2">
          {members && members.map((member) => (
            <li
              key={member.name}
              className="flex items-center justify-between p-2 rounded cursor-pointer transition-colors group hover:bg-accent hover:text-accent-foreground"
            >
              <div
                className="flex items-center flex-1"
                onClick={() => {
                  setCurrentSpeaker(member.name)
                  onNameClick(member.name)
                }}
              >
                <ChevronRight
                  className={`mr-2 h-4 w-4 ${currentSpeaker === member.name ? "opacity-100" : "opacity-0"}`}
                />
                <span className="truncate">{member.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(member.name, layer)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
