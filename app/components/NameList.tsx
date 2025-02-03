"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

type StackLayer = "database" | "api" | "ui"

interface TeamMember {
  name: string
  layer: StackLayer
}

interface NameListProps {
  members: TeamMember[]
  currentSpeaker: string | null
  setCurrentSpeaker: (name: string | null) => void
  onNameClick: (name: string) => void
  onDelete: (name: string, layer: StackLayer) => void
}

export function NameList({
  members,
  currentSpeaker,
  setCurrentSpeaker,
  onNameClick,
  onDelete,
}: NameListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          TEAM ROSTER
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(['ui', 'api', 'database'] as StackLayer[]).map((layer) => {
          const layerMembers = members.filter(m => m.layer === layer);
          return layerMembers.length > 0 && (
            <div key={layer} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {layer.toUpperCase()} DIVISION
                </h3>
              </div>
              <ul className="grid grid-cols-2 gap-2">
                {layerMembers.map((member) => (
                  <motion.li
                    key={member.name}
                    className="flex items-center justify-between p-2 rounded cursor-pointer bg-slate-900/50 hover:bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div
                      className="flex items-center flex-1"
                      onClick={() => {
                        setCurrentSpeaker(member.name)
                        onNameClick(member.name)
                      }}
                    >
                      <ChevronRight
                        className={`mr-2 h-4 w-4 ${currentSpeaker === member.name ? "text-blue-500 opacity-100" : "opacity-0"}`}
                      />
                      <span className="truncate font-mono">{member.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-blue-900/50"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(member.name, layer)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-blue-500" />
                    </Button>
                  </motion.li>
                ))}
              </ul>
            </div>
          );
        })}
      </CardContent>
    </Card>
  )
}
