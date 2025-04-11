
import React, { useState } from "react";
import VideoInput from "@/components/VideoInput";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import AIAnalysis from "@/components/AIAnalysis";
import VideoInfoCard from "@/components/VideoInfoCard";
import LoadingState from "@/components/LoadingState";
import { VideoAnalysisData } from "@/lib/types";
import { mockVideoInfo, mockTranscript, mockAnalysis, mockChapters } from "@/lib/mockData";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [analysisData, setAnalysisData] = useState<VideoAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (url: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real application, this would be an API call to your backend
      // For now, we'll simulate a delay and use mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For development, we're using mock data
      setAnalysisData({
        videoInfo: mockVideoInfo,
        transcript: mockTranscript,
        chapters: mockChapters,
        analysis: mockAnalysis,
        isLoading: false
      });
      
      toast({
        title: "Analysis Complete",
        description: "Video transcript and analysis have been generated",
      });
    } catch (err) {
      console.error("Error processing video:", err);
      setError("Failed to process video. Please try again or try a different URL.");
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: "Failed to analyze the video. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="hero-gradient py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              YouTube Video <span className="text-primary">Sense</span> AI
            </h1>
            <p className="mb-8 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Extract transcripts, generate summaries, and gain insights from YouTube videos using advanced AI.
            </p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <VideoInput onSubmit={handleSubmit} isLoading={loading} />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && <LoadingState />}

          {analysisData && !loading && (
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <div className="space-y-6 sticky top-6">
                  <VideoInfoCard videoInfo={analysisData.videoInfo} />
                  {analysisData.analysis && (
                    <AIAnalysis analysis={analysisData.analysis} />
                  )}
                </div>
              </div>
              <div className="md:col-span-8">
                <TranscriptDisplay 
                  transcript={analysisData.transcript} 
                  chapters={analysisData.chapters}
                />
              </div>
            </div>
          )}

          {!analysisData && !loading && !error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Enter a YouTube URL above to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
