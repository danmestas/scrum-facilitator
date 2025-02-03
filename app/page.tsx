"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Copy, Plane, Settings, Shuffle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Configuration } from "./components/Configuration"
import { ModeToggle } from "./components/mode-toggle"
import { NameList } from "./components/NameList"
import { PostStandupItems } from "./components/PostStandupItems"
import { ThemeProvider } from "./components/theme-provider"
import { Timer } from "./components/Timer"
import { motion } from "framer-motion"
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
  const [timeIsUp, setTimeIsUp] = useState(false)

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
    const nextSpeaker = getNextSpeaker(currentSpeaker!);
    setCurrentSpeaker(nextSpeaker);
    setIsTimerOpen(false);
    setTimeIsUp(false);
  }

  // Add cleanup when timer opens
  useEffect(() => {
    if (isTimerOpen) {
      setTimeIsUp(false);
    }
  }, [isTimerOpen]);

  const copyAllNames = () => {
    const groupedNames = [
      { layer: 'ui', names: teamMembers.filter(m => m.layer === 'ui').map(m => m.name) },
      { layer: 'api', names: teamMembers.filter(m => m.layer === 'api').map(m => m.name) },
      { layer: 'database', names: teamMembers.filter(m => m.layer === 'database').map(m => m.name) }
    ];

    const textToCopy = groupedNames
      .filter(group => group.names.length > 0)
      .map(group => `${group.layer.toUpperCase()}\n${group.names.join('\n')}`)
      .join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "All Developers Copied!",
      description: "Developers copied in layer order (UI → API → Database)",
    });
  };

  const shuffleAllNames = () => {
    setTeamMembers(prev => {
      const shuffled = [...prev].sort(() => Math.random() - 0.5);
      return shuffled;
    });
    toast({
      title: "All Shuffled!",
      description: "All developers have been randomized",
    });
  };

  const handleNextSpeaker = () => {
    const nextSpeaker = getNextSpeaker(currentSpeaker!);
    if (nextSpeaker) {
      setCurrentSpeaker(nextSpeaker);
      setTimeIsUp(false);
    } else {
      // Last speaker – close the timer modal.
      setIsTimerOpen(false);
      setTimeIsUp(false);
    }
  };

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
            <div className="flex items-center gap-2">
              <Button 
                onClick={copyAllNames} 
                variant="outline"
                size="icon"
                title="Copy all developers"
                className="mr-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                onClick={shuffleAllNames} 
                variant="outline"
                size="icon"
                title="Shuffle all developers"
                className="mr-2"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <ModeToggle />
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4">
          <Tabs defaultValue="speakers" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="speakers">All Developers</TabsTrigger>
              <TabsTrigger value="config">
                <Settings className="h-4 w-4 mr-2" />
                Config
              </TabsTrigger>
            </TabsList>
            <TabsContent value="speakers">
              <NameList
                members={teamMembers}
                currentSpeaker={currentSpeaker}
                setCurrentSpeaker={setCurrentSpeaker}
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
        <Dialog 
          open={isTimerOpen} 
          onOpenChange={(open) => {
            if (!open) {
              handleTimerClose();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-center">
                {timeIsUp ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-destructive"
                  >
                    {currentSpeaker} has been eliminated. 🔴
                  </motion.div>
                ) : (
                  `${currentSpeaker}'s Turn`
                )}
              </DialogTitle>
            </DialogHeader>
            <Timer 
              key={currentSpeaker} 
              defaultTime="2:00" 
              onTimeEnd={(isEliminated) => setTimeIsUp(isEliminated ?? true)}
              onNext={handleNextSpeaker}
              isLastSpeaker={getNextSpeaker(currentSpeaker!) === null}
            />
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  )
}
