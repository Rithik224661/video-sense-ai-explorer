
// We're moving to using Vercel AI SDK instead of Supabase
// This file now re-exports functions from our Vercel AI implementation
import { 
  getVideoAnalysisByUrl, 
  saveVideoAnalysis 
} from '@/lib/vercel-ai/video-analysis-api';
import { VideoAnalysisData } from '@/lib/types';

/**
 * Get a video analysis by URL (proxy to our Vercel AI implementation)
 * @param videoUrl - The YouTube URL to search for
 * @returns Promise with the video analysis data or null
 */
export { getVideoAnalysisByUrl };

/**
 * Save video analysis (proxy to our Vercel AI implementation)
 * @param analysisData - The video analysis data to save
 * @param videoUrl - The YouTube URL
 * @param userId - Optional user ID for authentication contexts (ignored in Vercel AI implementation)
 * @returns Promise with the saved record ID or null
 */
export async function saveVideoAnalysis(
  analysisData: VideoAnalysisData,
  videoUrl: string,
  userId?: string
): Promise<string | null> {
  const success = await saveVideoAnalysis(analysisData, videoUrl);
  return success ? videoUrl : null;
}

/**
 * Get a video analysis by ID (compatibility function, not fully implemented)
 * @param id - The video analysis ID to fetch
 * @returns Promise with the video analysis data or null
 */
export async function getVideoAnalysis(id: string): Promise<VideoAnalysisData | null> {
  // This is just a stub for compatibility
  // In our new implementation, we use URLs as IDs
  return getVideoAnalysisByUrl(id);
}
