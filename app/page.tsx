"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plane, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

import { Configuration } from "./components/Configuration"
import { ModeToggle } from "./components/mode-toggle"
import { NameList } from "./components/NameList"
import { PostStandupItems } from "./components/PostStandupItems"
import { ThemeProvider } from "./components/theme-provider"
import { Timer } from "./components/Timer"
import { useToast } from "@/hooks/use-toast"

type StackLayer = "database" | "api" | "ui"

interface TeamMember {
  name: string
  layer: StackLayer
}

export default function ScrumFacilitator() {
  const [mounted, setMounted] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null)
  const [isTimerOpen, setIsTimerOpen] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [teamInfo, setTeamInfo] = useState<string | null>(null)
  const { toast } = useToast()

  // Handle localStorage after mount
  useEffect(() => {
    const savedMembers = localStorage.getItem('teamMembers')
    const savedTeamName = localStorage.getItem('teamName')
    const savedTeamInfo = localStorage.getItem('teamInfo')
    
    if (savedMembers) setTeamMembers(JSON.parse(savedMembers))
    if (savedTeamName) setTeamName(savedTeamName)
    if (savedTeamInfo) setTeamInfo(savedTeamInfo)
    setMounted(true)
  }, [])

  // Save to localStorage when values change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('teamMembers', JSON.stringify(teamMembers))
    }
  }, [teamMembers, mounted])

  const addTeamMember = (name: string, layer: StackLayer) => {
    if (name.trim()) {
      const newMember = { name: name.trim(), layer }
      setTeamMembers((prevMembers) => {
        const newMembers = [...prevMembers, newMember]
        localStorage.setItem('teamMembers', JSON.stringify(newMembers))
        return newMembers
      })
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

  const deleteTeamMember = (name: string, layer: StackLayer) => {
    setTeamMembers((prevMembers) => {
      const newMembers = prevMembers.filter(member => member.name !== name)
      localStorage.setItem('teamMembers', JSON.stringify(newMembers))
      return newMembers
    })
    toast({
      title: "Team Member Removed",
      description: `${name} has been removed from the ${layer} layer.`,
    })
  }

  const getNextSpeaker = (currentName: string): string | null => {
    const allMembers = [...teamMembers]
    const currentIndex = allMembers.findIndex(member => member.name === currentName)
    if (currentIndex === -1 || currentIndex === allMembers.length - 1) return null
    return allMembers[currentIndex + 1].name
  }

  const handleTimerClose = () => {
    const nextSpeaker = getNextSpeaker(currentSpeaker!)
    setCurrentSpeaker(nextSpeaker)
    setIsTimerOpen(false)
  }

  if (!mounted) {
    return null // or a loading spinner
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground font-lato">
        <header className="bg-background text-foreground border-b p-4 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Plane className="h-6 w-6" />
              <h1 className="text-2xl font-bold">{teamName}</h1>
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
                onDelete={deleteTeamMember}
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
                onDelete={deleteTeamMember}
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
                onDelete={deleteTeamMember}
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
        <Dialog open={isTimerOpen} onOpenChange={handleTimerClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-center">
                {currentSpeaker}'s Turn
              </DialogTitle>
            </DialogHeader>
            <Timer defaultTime="2:00" />
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  )
}
