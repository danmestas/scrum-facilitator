import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface NameListProps {
  members: { name: string; layer: string }[]
  layer: string
  currentSpeaker: string | null
  setCurrentSpeaker: (name: string) => void
  copyNames: (layer: string) => void
  shuffleNames: (layer: string) => void
  onNameClick: (name: string) => void
}

export function NameList({
  members,
  layer,
  currentSpeaker,
  setCurrentSpeaker,
  copyNames,
  shuffleNames,
  onNameClick,
}: NameListProps) {
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{layer.toUpperCase()} Team</span>
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
        <ul className="space-y-2">
          {members.map((member) => (
            <li
              key={member.name}
              className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                currentSpeaker === member.name
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => {
                setCurrentSpeaker(member.name)
                onNameClick(member.name)
              }}
            >
              <ChevronRight
                className={`mr-2 h-4 w-4 ${currentSpeaker === member.name ? "opacity-100" : "opacity-0"}`}
              />
              {member.name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

