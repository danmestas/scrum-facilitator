import React, { useState } from 'react';
import { ThemeProvider } from '@/components/ui/use-theme';
import { Button } from '@/components/ui/button';
import { Copy, Shuffle, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog } from '@/components/ui/dialog';
import { NameList } from '@/components/NameList';
import { Card, CardContent } from '@/components/ui/card';
import { PostStandupItems } from '@/components/PostStandupItems';
import { Plane } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';

const ScrumFacilitator: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState('');
  const [teamInfo, setTeamInfo] = useState('');
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  const handleNameClick = (name: string) => {
    // Implementation of handleNameClick
  };

  const deleteTeamMember = (name: string, layer: string) => {
    // Implementation of deleteTeamMember
  };

  const copyAllNames = () => {
    // Implementation of copyAllNames
  };

  const shuffleAllNames = () => {
    // Implementation of shuffleAllNames
  };

  const handleTimerClose = () => {
    // Implementation of handleTimerClose
  };

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
                title="Copy all team members"
                className="mr-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                onClick={shuffleAllNames} 
                variant="outline"
                size="icon"
                title="Shuffle all team members"
                className="mr-2"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Link to="/config">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <ModeToggle />
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4">
          <div className="space-y-8">
            <NameList
              members={teamMembers}
              currentSpeaker={currentSpeaker}
              setCurrentSpeaker={setCurrentSpeaker}
              onNameClick={handleNameClick}
              onDelete={deleteTeamMember}
            />
            
            {teamInfo && (
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <p className="text-center text-lg">{teamInfo}</p>
                </CardContent>
              </Card>
            )}
            
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
          {/* Keep existing Dialog content */}
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default ScrumFacilitator; 