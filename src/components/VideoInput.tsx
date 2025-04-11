
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Youtube, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VideoInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const VideoInput: React.FC<VideoInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    // Very basic validation to check if it's a YouTube URL
    if (!url.includes("youtube.com/") && !url.includes("youtu.be/")) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      });
      return;
    }

    onSubmit(url);
  };

  return (
    <Card className="w-full shadow-lg border-none bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Youtube className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Video Sense AI</h2>
          </div>
          
          <p className="text-muted-foreground">
            Enter a YouTube URL to generate an AI-powered transcript, summary, and insights.
          </p>
          
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Paste YouTube URL here..."
                className="pl-10"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? "Processing..." : "Analyze"}
            </Button>
          </form>

          <div className="flex items-center pt-2">
            <Info className="h-4 w-4 text-muted-foreground mr-2" />
            <p className="text-xs text-muted-foreground">
              Try with: https://www.youtube.com/watch?v=dQw4w9WgXcQ
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoInput;
