
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
import { useQuery } from "@tanstack/react-query";

// Import our type-safe queries
import { getVideoAnalysisByUrl, saveVideoAnalysis } from "@/lib/supabase";

const Index = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<VideoAnalysisData | null>(null);
  const { toast } = useToast();

  // Use React Query for data fetching
  const { 
    data, 
    isLoading: loading, 
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['videoAnalysis', videoUrl],
    queryFn: async () => {
      if (!videoUrl) return null;
      
      // First check if we already have analysis for this URL
      const existingAnalysis = await getVideoAnalysisByUrl(videoUrl);
      if (existingAnalysis) {
        return existingAnalysis;
      }
      
      // For now, use mock data
      // In a real application, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysisData: VideoAnalysisData = {
        videoInfo: mockVideoInfo,
        transcript: mockTranscript,
        chapters: mockChapters,
        analysis: mockAnalysis,
        isLoading: false
      };
      
      // Save the analysis to the database for future use
      await saveVideoAnalysis(mockAnalysisData, videoUrl);
      
      return mockAnalysisData;
    },
    enabled: !!videoUrl,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // Update analysis data when query data changes
  React.useEffect(() => {
    if (data) {
      setAnalysisData(data);
      
      toast({
        title: "Analysis Complete",
        description: "Video transcript and analysis have been generated",
      });
    }
  }, [data, toast]);

  const handleSubmit = async (url: string) => {
    setVideoUrl(url);
    setAnalysisData(null);
    refetch();
  };

  const error = queryError ? (queryError as Error).message : null;

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
