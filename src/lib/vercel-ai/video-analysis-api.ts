
import { useState } from 'react';
import { VideoAnalysisData } from '@/lib/types';

// Mock data store for demo purposes until we fully integrate with Vercel AI
const videoAnalysesStore: Record<string, VideoAnalysisData> = {};

/**
 * Custom hook for fetching video analysis using Vercel AI
 * @param videoUrl YouTube video URL
 * @returns Video analysis data and loading state
 */
export function useVideoAnalysis(videoUrl: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<VideoAnalysisData | null>(null);

  const fetchAnalysis = async (url: string) => {
    if (!url) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if we already have this analysis cached
      if (videoAnalysesStore[url]) {
        setAnalysisData(videoAnalysesStore[url]);
        setIsLoading(false);
        return;
      }
      
      // In a real implementation, we would call the Vercel AI API here
      // For now, we'll use our mock data and add a delay to simulate API call
      const { mockVideoInfo, mockTranscript, mockAnalysis, mockChapters } = await import('@/lib/mockData');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysisResult: VideoAnalysisData = {
        videoInfo: mockVideoInfo,
        transcript: mockTranscript, 
        chapters: mockChapters,
        analysis: mockAnalysis,
        isLoading: false
      };
      
      // Store for future use
      videoAnalysesStore[url] = analysisResult;
      
      setAnalysisData(analysisResult);
    } catch (err) {
      console.error('Error analyzing video:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze video');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analysisData,
    isLoading,
    error,
    fetchAnalysis
  };
}

/**
 * Get a video analysis by URL
 * @param videoUrl - The YouTube URL to search for
 * @returns Promise with the video analysis data or null
 */
export async function getVideoAnalysisByUrl(videoUrl: string): Promise<VideoAnalysisData | null> {
  // Check our in-memory store first
  if (videoAnalysesStore[videoUrl]) {
    return videoAnalysesStore[videoUrl];
  }
  
  // In real implementation, we would call Vercel AI API here
  return null;
}

/**
 * Save video analysis to our storage
 * @param analysisData - The video analysis data to save
 * @param videoUrl - The YouTube URL
 * @returns Promise with success status
 */
export async function saveVideoAnalysis(
  analysisData: VideoAnalysisData,
  videoUrl: string,
): Promise<boolean> {
  try {
    // Store in our mock database
    videoAnalysesStore[videoUrl] = {
      ...analysisData,
      isLoading: false
    };
    
    return true;
  } catch (err) {
    console.error('Error saving video analysis:', err);
    return false;
  }
}
