
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranscriptSegment, TranscriptChapter } from "@/lib/types";
import { MessageSquareText, Layers, Clock } from "lucide-react";

interface TranscriptDisplayProps {
  transcript: TranscriptSegment[];
  chapters?: TranscriptChapter[];
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, chapters }) => {
  const [activeTab, setActiveTab] = useState("transcript");

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full shadow-md border-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <MessageSquareText className="mr-2 h-5 w-5 text-primary" />
          Transcript
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transcript" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="transcript" className="flex items-center">
              <MessageSquareText className="mr-2 h-4 w-4" />
              Full Transcript
            </TabsTrigger>
            {chapters && chapters.length > 0 && (
              <TabsTrigger value="chapters" className="flex items-center">
                <Layers className="mr-2 h-4 w-4" />
                Chapters
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="transcript" className="mt-0">
            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
              {transcript.map((segment) => (
                <div key={segment.id} className="group flex hover:bg-muted/50 p-2 rounded-md -mx-2">
                  <div className="mr-3 flex-shrink-0">
                    <div className="timestamp-pill">
                      {formatTime(segment.startTime)}
                    </div>
                  </div>
                  <div className="flex-1">
                    {segment.speaker && (
                      <div className="font-medium text-sm text-primary mb-1">
                        {segment.speaker}
                      </div>
                    )}
                    <p className="text-sm text-foreground">{segment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {chapters && (
            <TabsContent value="chapters" className="mt-0">
              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-6">
                {chapters.map((chapter, index) => (
                  <div key={index} className="border-l-2 border-primary/30 pl-4 -ml-4">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium text-primary">{chapter.title}</h3>
                      <div className="ml-2 flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {chapter.segments.map((segment) => (
                        <p key={segment.id} className="text-sm">
                          {segment.text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TranscriptDisplay;
