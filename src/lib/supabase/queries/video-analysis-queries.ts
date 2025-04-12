
import { VideoAnalysisRecord, VideoAnalysisCreate } from '../custom-types';
import { toVideoAnalysisData } from '../adapters/video-analysis-adapter';
// This file now re-exports functions from our Vercel AI implementation
import { 
  getVideoAnalysisByUrl, 
  saveVideoAnalysis as saveVideoAnalysisToStore 
} from '@/lib/vercel-ai/video-analysis-api';
import { VideoAnalysisData } from '@/lib/types';

/**
 * Get video analysis by URL
 * @param videoUrl - The URL to search for
 * @returns Promise with the video analysis data
 */
export { getVideoAnalysisByUrl };

/**
 * Save video analysis
 * @param analysisData - The video analysis data to save
 * @param videoUrl - The URL
 * @param userId - Optional user ID
 * @returns Promise with the ID of the saved record or null on failure
 */
export async function saveVideoAnalysis(
  analysisData: VideoAnalysisData,
  videoUrl: string,
  userId?: string
): Promise<string | null> {
  const success = await saveVideoAnalysisToStore(analysisData, videoUrl);
  return success ? videoUrl : null;
}
