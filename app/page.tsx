"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Timer } from "./components/Timer"
import { NameList } from "./components/NameList"
import { Configuration } from "./components/Configuration"
import { PostStandupItems } from "./components/PostStandupItems"
import { ThemeProvider } from "./components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Plane } from "lucide-react"

type StackLayer = "database" | "api" | "ui"

interface TeamMember {
  name: string
  layer: StackLayer
}

export default function ScrumFacilitator() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null)
  const [isTimerOpen, setIsTimerOpen] = useState(false)
  const [teamName, setTeamName] = useState("Concourse")
  const [teamInfo, setTeamInfo] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const savedMembers = localStorage.getItem("teamMembers")
    const savedTeamName = localStorage.getItem("teamName")
    const savedTeamInfo = localStorage.getItem("teamInfo")
    if (savedMembers) {
      setTeamMembers(JSON.parse(savedMembers))
    }
    if (savedTeamName) {
      setTeamName(savedTeamName)
    }
    if (savedTeamInfo) {
      setTeamInfo(savedTeamInfo)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers))
  }, [teamMembers])

  const addTeamMember = (name: string, layer: StackLayer) => {
    if (name.trim()) {
      const newMember = { name: name.trim(), layer }
      setTeamMembers((prevMembers) => [...prevMembers, newMember])
      toast({
        title: "Team Member Added",
        description: `${name} has been added to the ${layer} layer.`,
      })
    }
  }

  const updateTeamConfig = (newTeamName: string, newTeamInfo: string | null) => {
    setTeamName(newTeamName)
    setTeamInfo(newTeamInfo)
    localStorage.setItem("teamName", newTeamName)
    if (newTeamInfo) {
      localStorage.setItem("teamInfo", newTeamInfo)
    } else {
      localStorage.removeItem("teamInfo")
    }
    toast({
      title: "Configuration Updated",
      description: "Team name and information have been updated.",
    })
  }

  const copyNames = (layer: StackLayer) => {
    const names = teamMembers
      .filter((member) => member.layer === layer)
      .map((member) => member.name)
      .join(", ")
    navigator.clipboard.writeText(names)
    toast({
      title: "Copied!",
      description: `${layer.toUpperCase()} names copied to clipboard.`,
    })
  }

  const shuffleNames = (layer: StackLayer) => {
    const layerMembers = teamMembers.filter((member) => member.layer === layer)
    const otherMembers = teamMembers.filter((member) => member.layer !== layer)
    const shuffled = [...layerMembers].sort(() => Math.random() - 0.5)
    setTeamMembers([...shuffled, ...otherMembers])
    toast({
      title: "Shuffled!",
      description: `${layer.toUpperCase()} order has been randomized.`,
    })
  }

  const handleNameClick = (name: string) => {
    setCurrentSpeaker(name)
    setIsTimerOpen(true)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground font-lato">
        <header className="bg-background text-foreground border-b p-4 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Plane className="h-6 w-6" />
              <h1 className="text-2xl font-bold">{teamName} Scrum</h1>
            </div>
            <ModeToggle />
          </div>
        </header>
        <main className="container mx-auto p-4">
          <Tabs defaultValue="database" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="ui">UI</TabsTrigger>
              <TabsTrigger value="config">
                <Settings className="h-4 w-4 mr-2" />
                Config
              </TabsTrigger>
            </TabsList>
            <TabsContent value="database">
              <NameList
                members={teamMembers.filter((m) => m.layer === "database")}
                layer="database"
                currentSpeaker={currentSpeaker}
                setCurrentSpeaker={setCurrentSpeaker}
                copyNames={copyNames}
                shuffleNames={shuffleNames}
                onNameClick={handleNameClick}
              />
            </TabsContent>
            <TabsContent value="api">
              <NameList
                members={teamMembers.filter((m) => m.layer === "api")}
                layer="api"
                currentSpeaker={currentSpeaker}
                setCurrentSpeaker={setCurrentSpeaker}
                copyNames={copyNames}
                shuffleNames={shuffleNames}
                onNameClick={handleNameClick}
              />
            </TabsContent>
            <TabsContent value="ui">
              <NameList
                members={teamMembers.filter((m) => m.layer === "ui")}
                layer="ui"
                currentSpeaker={currentSpeaker}
                setCurrentSpeaker={setCurrentSpeaker}
                copyNames={copyNames}
                shuffleNames={shuffleNames}
                onNameClick={handleNameClick}
              />
            </TabsContent>
            <TabsContent value="config">
              <Configuration
                onAdd={addTeamMember}
                onConfigUpdate={updateTeamConfig}
                initialTeamName={teamName}
                initialTeamInfo={teamInfo}
              />
            </TabsContent>
          </Tabs>
          {teamInfo && (
            <Card className="mt-8 mb-4">
              <CardContent className="pt-6">
                <p className="text-center text-lg">{teamInfo}</p>
              </CardContent>
            </Card>
          )}
          <div className="mt-8">
            <PostStandupItems />
          </div>
        </main>
        <Dialog open={isTimerOpen} onOpenChange={setIsTimerOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentSpeaker}'s Turn</DialogTitle>
            </DialogHeader>
            <Timer defaultTime="2:00" />
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  )
}
